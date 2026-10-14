// Shared gallery media data and helpers.
//
// Lives in its own module (instead of inside HorseGallery) so the eagerly
// loaded HeroSection can reuse the video list without pulling the whole
// lazy-loaded gallery chunk into the initial bundle.

const galleryVideos = '/images/gallery/videos';
const v = galleryVideos;
// Poster frames extracted by tools/optimize-gallery-videos.sh (one WebP per clip).
const vp = `${galleryVideos}/posters`;

// Fisher–Yates shuffle. Returns a new array; never mutates the input.
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Filenames are normalized to lowercase .mp4 by tools/optimize-gallery-videos.sh
// (the masters mix .mp4/.MP4/.mov). `heavy: true` marks clips large enough that
// the gallery shows a poster + click-to-load instead of auto-fetching them.
export const videos = [
  { src: `${v}/sirdante-reel.mp4`, poster: `${vp}/sirdante-reel.webp`, heavy: true },
  { src: `${v}/beachride.mp4`, poster: `${vp}/beachride.webp`, heavy: true },
  { src: `${v}/video1.mp4`, poster: `${vp}/video1.webp` },
  { src: `${v}/video2.mp4`, poster: `${vp}/video2.webp`, heavy: true },
  { src: `${v}/video3.mp4`, poster: `${vp}/video3.webp` },
  { src: `${v}/ridingvideo1.mp4`, poster: `${vp}/ridingvideo1.webp` },
  { src: `${v}/ridingvideo2.mp4`, poster: `${vp}/ridingvideo2.webp` },
  { src: `${v}/ridingvideo3.mp4`, poster: `${vp}/ridingvideo3.webp` },
  { src: `${v}/ridingvideo4.mp4`, poster: `${vp}/ridingvideo4.webp` },
  { src: `${v}/ridingvideo5.mp4`, poster: `${vp}/ridingvideo5.webp` },
  { src: `${v}/ridingvideo6.mp4`, poster: `${vp}/ridingvideo6.webp` },
  { src: `${v}/ridingvideo7.mp4`, poster: `${vp}/ridingvideo7.webp` },
  { src: `${v}/shakey-video1.mp4`, poster: `${vp}/shakey-video1.webp`, heavy: true },
  { src: `${v}/shakey-video2.mp4`, poster: `${vp}/shakey-video2.webp` },
  { src: `${v}/ridingvideo8.mp4`, poster: `${vp}/ridingvideo8.webp` },
  { src: `${v}/ridingvideo9.mp4`, poster: `${vp}/ridingvideo9.webp` },
  { src: `${v}/ridingvideo10.mp4`, poster: `${vp}/ridingvideo10.webp` },
  { src: `${v}/ridingvideo11.mp4`, poster: `${vp}/ridingvideo11.webp` },
  { src: `${v}/ridingvideo12.mp4`, poster: `${vp}/ridingvideo12.webp` },
];

// Optimized variants of the small clips (audio stripped, CRF 28, faststart —
// regenerate with tools/optimize-hero-videos.sh) that rotate as the muted
// full-bleed hero background. Keep multi-megabyte files (beachride.mp4,
// video2.MP4, ...) out of this list; the gallery serves the full-quality
// originals with sound from /images/gallery/videos.
const h = '/images/hero-videos';

export const heroPreviewVideos = [
  `${h}/ridingvideo1.mp4`,
  `${h}/ridingvideo3.mp4`,
  `${h}/ridingvideo7.mp4`,
  `${h}/ridingvideo9.mp4`,
  `${h}/ridingvideo10.mp4`,
  `${h}/ridingvideo11.mp4`,
  `${h}/ridingvideo12.mp4`,
];
