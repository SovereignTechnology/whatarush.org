#!/usr/bin/env bash
# Re-encode the full-quality gallery masters (media-src/gallery-videos/) into
# web-friendly clips in public/images/gallery/videos/:
#   - height capped at 720 (never upscaled), H.264 CRF 28 (30 for the three
#     longest clips), low-bitrate AAC, faststart so playback begins after a
#     few hundred KB.
#   - a pure remux (-c copy) is also tried; whichever output is smaller wins,
#     so already-small/low-bitrate clips aren't inflated by a needless encode.
#   - a WebP poster frame (~1s in) is extracted per clip for <video poster> and
#     the gallery's click-to-load heavy clips.
# Output names are normalized to lowercase .mp4 (the masters mix .mp4/.MP4/.mov).
# Run from the repo root after adding or changing a master.
#
# NOTE: beachride is intentionally skipped here. The generic "cap height at 720"
# rule turns its 1080x1920 portrait master into a tiny 406x720 clip. Instead it
# ships a dedicated two-pass 720x1280 encode (~24 MB, single-generation from the
# 1080x1920 master). Regenerate that clip + poster with:
#   ffmpeg -y -i media-src/gallery-videos/beachride.mov -vf scale=-2:1280:flags=lanczos \
#     -c:v libx264 -b:v 1050k -preset slower -profile:v high -level 4.0 -pix_fmt yuv420p \
#     -an -pass 1 -f mp4 /dev/null && \
#   ffmpeg -y -i media-src/gallery-videos/beachride.mov -vf scale=-2:1280:flags=lanczos \
#     -c:v libx264 -b:v 1050k -preset slower -profile:v high -level 4.0 -pix_fmt yuv420p \
#     -c:a aac -b:a 128k -ac 2 -movflags +faststart -pass 2 \
#     public/images/gallery/videos/beachride.mp4 && \
#   ffmpeg -y -ss 2 -i public/images/gallery/videos/beachride.mp4 -frames:v 1 \
#     -vf scale=720:1280 -c:v libwebp -quality 82 \
#     public/images/gallery/videos/posters/beachride.webp
#
# sirdante-reel is also skipped: it is the Instagram intro/gallery reel, already
# a 720x1280 portrait source. Re-encoded to ~6 MB so it is light enough to
# autoplay in the full-screen intro on every visit. Regenerate with:
#   ffmpeg -y -i media-src/gallery-videos/sirdante-reel.mp4 -vf scale=-2:1280:flags=lanczos \
#     -c:v libx264 -b:v 1250k -preset slower -profile:v high -level 4.0 -pix_fmt yuv420p \
#     -an -pass 1 -passlogfile /tmp/sd -f mp4 /dev/null && \
#   ffmpeg -y -i media-src/gallery-videos/sirdante-reel.mp4 -vf scale=-2:1280:flags=lanczos \
#     -c:v libx264 -b:v 1250k -preset slower -profile:v high -level 4.0 -pix_fmt yuv420p \
#     -c:a aac -b:a 96k -ac 2 -movflags +faststart -pass 2 -passlogfile /tmp/sd \
#     public/images/gallery/videos/sirdante-reel.mp4 && \
#   ffmpeg -y -ss 1 -i public/images/gallery/videos/sirdante-reel.mp4 -frames:v 1 \
#     -vf scale=720:1280 -c:v libwebp -quality 78 \
#     public/images/gallery/videos/posters/sirdante-reel.webp
set -euo pipefail

SRC_DIR="media-src/gallery-videos"
OUT_DIR="public/images/gallery/videos"
POSTER_DIR="$OUT_DIR/posters"

mkdir -p "$OUT_DIR" "$POSTER_DIR"

# Long clips get a slightly higher CRF (smaller files, quality still fine).
HIGH_CRF="video2 shakey-video1"
# Clips with a bespoke encode that this generic pass must not overwrite.
# (both are 720x1280 portrait — the generic height-720 cap would halve their width)
SKIP_REENCODE="beachride sirdante-reel"
# Cloudflare (Pages and Workers Static Assets) rejects any single asset over
# 25 MiB, which would silently fail the deploy. Hard-fail here instead.
MAX_BYTES=26214400  # 25 MiB
SCALE="scale=-2:'min(720,ih)':flags=lanczos"

shopt -s nullglob
total_src=0
total_out=0
for src in "$SRC_DIR"/*; do
  [ -f "$src" ] || continue
  base="$(basename "$src")"
  name="$(echo "${base%.*}" | tr '[:upper:]' '[:lower:]')"
  out="$OUT_DIR/$name.mp4"

  case " $SKIP_REENCODE " in
    *" $name "*) echo "$name: skipped (dedicated encode — see header)"; continue ;;
  esac

  crf=28
  case " $HIGH_CRF " in *" $name "*) crf=30 ;; esac

  reenc="$(mktemp --suffix=.mp4)"
  remux="$(mktemp --suffix=.mp4)"

  ffmpeg -y -loglevel error -i "$src" \
    -vf "$SCALE" \
    -c:v libx264 -preset slow -crf "$crf" -profile:v main -pix_fmt yuv420p \
    -c:a aac -b:a 96k -ac 2 -movflags +faststart "$reenc"

  # Pure remux (keeps original video stream, just moves the moov atom up front).
  # Fails harmlessly for codecs the mp4 container can't stream-copy.
  remux_ok=1
  ffmpeg -y -loglevel error -i "$src" -c copy -movflags +faststart "$remux" 2>/dev/null || remux_ok=0

  if [ "$remux_ok" -eq 1 ] && [ "$(stat -c%s "$remux")" -lt "$(stat -c%s "$reenc")" ]; then
    mv "$remux" "$out"; rm -f "$reenc"; how="remux"
  else
    mv "$reenc" "$out"; rm -f "$remux"; how="crf$crf"
  fi

  ffmpeg -y -loglevel error -ss 1 -i "$src" -frames:v 1 \
    -vf "$SCALE" -c:v libwebp -quality 70 "$POSTER_DIR/$name.webp"

  s=$(stat -c%s "$src"); o=$(stat -c%s "$out")
  if [ "$o" -gt "$MAX_BYTES" ]; then
    echo "ERROR: $name.mp4 is $o bytes, over the 25 MiB Cloudflare per-file limit ($MAX_BYTES). Lower the bitrate or split the clip." >&2
    exit 1
  fi
  total_src=$((total_src + s)); total_out=$((total_out + o))
  printf '%-18s (%-6s): %9d -> %9d bytes\n' "$name" "$how" "$s" "$o"
done

printf '\nTOTAL: %d -> %d bytes (%d%% of original)\n' \
  "$total_src" "$total_out" $((total_out * 100 / total_src))
