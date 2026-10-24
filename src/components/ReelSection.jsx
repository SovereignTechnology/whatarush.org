import React from 'react';
import { motion } from 'framer-motion';

const VIDEO_SRC = '/images/gallery/videos/reel.mp4';
const VIDEO_POSTER = '/images/gallery/videos/posters/reel.webp';

// The reel, in its own section under "Meet Our Horses". Poster + native
// controls, no autoplay and preload="none": the ~6 MB file only downloads for
// visitors who press play, and sound works because that press is the gesture.
// Plain markup (no client-only state), so it renders in the SSG HTML as-is.
const ReelSection = () => (
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
        className="mx-auto w-[min(100%,calc(85svh*9/16))] overflow-hidden rounded-2xl bg-black shadow-2xl"
      >
        <video
          src={VIDEO_SRC}
          poster={VIDEO_POSTER}
          controls
          playsInline
          preload="none"
          aria-label="What A Rush reel"
          className="aspect-[9/16] w-full object-contain"
        />
      </motion.div>
    </div>
  </section>
);

export default ReelSection;
