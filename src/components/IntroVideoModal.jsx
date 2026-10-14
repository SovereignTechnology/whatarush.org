import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';

const VIDEO_SRC = '/images/gallery/videos/sirdante-reel.mp4';
const VIDEO_POSTER = '/images/gallery/videos/posters/sirdante-reel.webp';

// Full-screen intro pop-up: the Instagram reel greets every visitor before the
// site is usable. Muted autoplay (the only autoplay browsers guarantee) with an
// unmute toggle, dismissed via a large × or the "Enter Site" button.
//
// Mounted client-side only (see the `mounted` effect): the static SSG HTML must
// never contain a modal that a no-JS visitor could not dismiss. There is no
// per-visit suppression — it shows on every load by owner request.
const IntroVideoModal = () => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);
  const closeRef = useRef(null);

  // Appear after hydration, never in the SSG output.
  useEffect(() => {
    setMounted(true);
    setOpen(true);
  }, []);

  // React doesn't reliably emit the `muted` attribute, so force the property
  // (the hero clips do the same) — without it iOS/Chrome may block autoplay.
  useEffect(() => {
    if (!open) return;
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = muted;
    const p = vid.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }, [open, muted]);

  // Lock background scroll while the intro is up; restore on close/unmount.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Move focus into the dialog so keyboard/screen-reader users land on it.
  useEffect(() => {
    if (open && closeRef.current) closeRef.current.focus();
  }, [open]);

  const close = useCallback(() => {
    const vid = videoRef.current;
    if (vid) vid.pause();
    setOpen(false);
  }, []);

  // Escape is the keyboard escape hatch; backdrop clicks deliberately do NOT
  // close it — the owner wants visitors to use the exit button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!mounted || !open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to What A Rush"
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black/95 px-4 py-6"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={close}
        aria-label="Close welcome video"
        className="absolute right-4 top-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:top-6"
      >
        <X className="h-8 w-8" strokeWidth={2.5} />
      </button>

      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={VIDEO_POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="max-h-[70vh] w-auto max-w-full rounded-xl shadow-2xl"
      />

      <div className="mt-5 flex w-full max-w-md flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-pressed={!muted}
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          {muted ? 'Tap for sound' : 'Mute'}
        </button>

        <button
          type="button"
          onClick={close}
          className="w-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:from-teal-600 hover:to-cyan-700 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Enter Site
        </button>
      </div>
    </div>
  );
};

export default IntroVideoModal;
