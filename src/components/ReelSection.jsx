import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const VIDEO_SRC = '/images/gallery/videos/reel.mp4';
const VIDEO_POSTER = '/images/gallery/videos/posters/reel.webp';

// The reel, in its own section under "Meet Our Horses". It starts by itself,
// muted (the only autoplay browsers allow), once half of it is on screen and
// pauses -- and re-mutes, so the next autoplay is silent too -- when it scrolls
// away. preload="none" plus play() means the ~6 MB file only downloads when the
// visitor reaches it. There is no `autoplay` attribute: the observer owns
// playback, so nothing starts off-screen or in the SSG HTML.
const ReelSection = () => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  // The sound button is client-only: without JS it would do nothing.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    setReady(true);

    // React doesn't reliably emit the `muted` attribute, so force the property
    // (the hero clips do the same) -- without it iOS/Chrome may block autoplay.
    vid.muted = true;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (reduceMotion) return;
          const p = vid.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        } else {
          vid.pause();
          vid.muted = true;
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(vid);

    // Mirror the element's real state so the native control and the big
    // button never disagree.
    const syncMuted = () => setMuted(vid.muted);
    vid.addEventListener('volumechange', syncMuted);

    return () => {
      observer.disconnect();
      vid.removeEventListener('volumechange', syncMuted);
    };
  }, []);

  const toggleMuted = () => {
    const vid = videoRef.current;
    if (vid) vid.muted = !vid.muted;
  };

  return (
    <section id="reel" className="py-16 px-4 bg-gradient-to-b from-amber-100 via-orange-50 to-amber-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 bg-clip-text text-transparent">
            Watch Our Reel
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A quick look at life at What A Rush
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          // Width = the narrower of the container and what 85% of the viewport
          // height allows at 9:16, so the player is as tall as fits on screen
          // (no letterbox bars) and still fills the width on phones.
          className="relative mx-auto w-[min(100%,calc(85svh*9/16))] overflow-hidden rounded-2xl bg-black shadow-2xl"
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster={VIDEO_POSTER}
            controls
            muted
            loop
            playsInline
            preload="none"
            aria-label="What A Rush reel"
            className="aspect-[9/16] w-full object-contain"
          />

          {/* Bottom-right, just above the native control bar. Not at the top: the
              fixed nav (z-50, ~73px) covers the top of the player whenever the
              reel is centred in a typical viewport, so a button there is unclickable. */}
          {ready && (
            <button
              type="button"
              onClick={toggleMuted}
              aria-label={muted ? 'Unmute reel' : 'Mute reel'}
              className="absolute bottom-16 right-3 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-white shadow-lg transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-20 sm:w-20"
            >
              {muted ? (
                <VolumeX className="h-8 w-8 sm:h-10 sm:w-10" />
              ) : (
                <Volume2 className="h-8 w-8 sm:h-10 sm:w-10" />
              )}
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ReelSection;
