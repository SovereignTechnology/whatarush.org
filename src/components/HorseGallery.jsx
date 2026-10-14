import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, X, Camera, Video } from 'lucide-react';
import ResponsiveImage from '@/components/ResponsiveImage';
import { shuffle, videos } from '@/lib/galleryMedia';

const galleryPhotos = '/images/gallery/photos';

const identity = (x) => x;

// Spread view photos evenly throughout the gallery (non-views keep their order).
// `orderViews` controls the view ordering: `identity` gives a deterministic order
// (used for SSR + the first client/hydration render so the server and client HTML
// match); `shuffle` gives the randomized order applied after mount (see HorseGallery).
function buildGallery(items, orderViews = shuffle) {
  const isView = (item) => item.src.toLowerCase().includes('view');
  const views = orderViews(items.filter(isView));
  const others = items.filter((item) => !isView(item));
  const result = [];
  const interval = Math.max(1, Math.floor(others.length / (views.length + 1)));
  let vi = 0;
  for (let i = 0; i < others.length; i++) {
    result.push(others[i]);
    if ((i + 1) % interval === 0 && vi < views.length) {
      result.push(views[vi++]);
    }
  }
  while (vi < views.length) result.push(views[vi++]);
  return result;
}

const p = galleryPhotos;
// Raw list only — no build at module scope so no Math.random runs at import.
// The gallery renders a deterministic order first, then reshuffles after mount.
const photoItems = [
  { src: `${p}/sirdante.jpeg`, alt: 'Sir Dante the black gelding at What A Rush Riding Stables' },
  { src: `${p}/Tiqandpeople.jpeg`, alt: 'Tequilla with people at What A Rush Riding Stables' },
  { src: `${p}/Carbonero.jpeg`, alt: 'Carbonero the horse at What A Rush Riding Stables' },
  { src: `${p}/Congrejeto1.jpeg`, alt: 'Congrejeto the Friesian horse' },
  { src: `${p}/Congrejeto2.jpeg`, alt: 'Congrejeto the Friesian horse posing' },
  { src: `${p}/Congrejeto3.jpeg`, alt: 'Congrejeto the Friesian horse close-up' },
  { src: `${p}/con.jpeg`, alt: 'Congrejeto the horse' },
  { src: `${p}/view.jpeg`, alt: 'Scenic beach view in La Libertad, El Salvador' },
  { src: `${p}/paco2.jpeg`, alt: 'Paco the Peruvian horse' },
  { src: `${p}/paco3.jpeg`, alt: 'Paco the Peruvian horse close-up' },
  { src: `${p}/view1.jpeg`, alt: 'Beach and ocean view from the riding trail' },
  { src: `${p}/Tequilla.jpeg`, alt: 'Tequilla the Spanish gaited horse' },
  { src: `${p}/Tequilla2.jpeg`, alt: 'Tequilla the horse with flowing mane' },
  { src: `${p}/tiq.jpeg`, alt: 'Tequilla the horse' },
  { src: `${p}/tiqwthall.jpeg`, alt: 'Tequilla with the riding group' },
  { src: `${p}/view2.jpeg`, alt: 'Scenic estuary view along the riding trail' },
  { src: `${p}/Victorioso.jpeg`, alt: 'Victorioso the horse in motion' },
  { src: `${p}/Victorioso2.jpeg`, alt: 'Victorioso the horse portrait' },
  { src: `${p}/vic.jpeg`, alt: 'Victorioso the horse' },
  { src: `${p}/all.jpeg`, alt: 'All the horses together at What A Rush stables' },
  { src: `${p}/all2.jpeg`, alt: 'Group photo of the horses at the stables' },
  { src: `${p}/riding3 view.jpeg`, alt: 'Horseback riding with a scenic view' },
  { src: `${p}/view3.jpeg`, alt: 'Sunset view from the beachfront trail' },
  { src: `${p}/riding1.jpeg`, alt: 'Beachfront horseback riding at What A Rush' },
  { src: `${p}/riding2.jpeg`, alt: 'Riders enjoying a guided trail ride' },
  { src: `${p}/riding1-b.jpeg`, alt: 'Horseback riding on the beach' },
  { src: `${p}/riding2-b.jpeg`, alt: 'Trail riding through the sugar cane fields' },
  { src: `${p}/riding6.jpeg`, alt: 'Guided horseback ride along the shore' },
  { src: `${p}/riding4 view.jpeg`, alt: 'Horseback riding with ocean view' },
  { src: `${p}/riding7.jpeg`, alt: 'Riders on a wooded trail ride' },
  { src: `${p}/riding8.jpeg`, alt: 'Horseback riding through the estuary' },
  { src: `${p}/riding11.jpeg`, alt: 'Group horseback ride on the beach' },
  { src: `${p}/view4.jpeg`, alt: 'Panoramic view of the El Salvador coastline' },
  { src: `${p}/riding14.jpeg`, alt: 'Rider and horse on the beachfront' },
  { src: `${p}/riding16.jpeg`, alt: 'Guided ride through scenic sugar cane fields' },
  { src: `${p}/riding17.jpeg`, alt: 'Horseback riding adventure in El Salvador' },
  { src: `${p}/riding5 view.jpeg`, alt: 'Riding with a view of the ocean' },
  { src: `${p}/riding18.jpeg`, alt: 'Trail ride along the beach' },
  { src: `${p}/riding19.jpeg`, alt: 'Beachfront riding at sunset' },
  { src: `${p}/riding20.jpeg`, alt: 'Horseback riding in La Libertad' },
  { src: `${p}/view5.jpeg`, alt: 'Beautiful beach view in La Libertad' },
  { src: `${p}/riding21.jpeg`, alt: 'Guided trail ride through wooded paths' },
  { src: `${p}/riding22.jpeg`, alt: 'Rider enjoying the scenic trail' },
  { src: `${p}/riding23.jpeg`, alt: 'Horseback ride along the El Salvador coast' },
  { src: `${p}/view6.jpeg`, alt: 'Coastal landscape view from the trail' },
  { src: `${p}/riding24.jpeg`, alt: 'Riding through the beachfront trail' },
  { src: `${p}/riding25.jpeg`, alt: 'Guided horseback riding experience' },
  { src: `${p}/riding26.jpeg`, alt: 'Beach horseback riding adventure' },
  { src: `${p}/view7.jpeg`, alt: 'Ocean view from the riding stables' },
  { src: `${p}/riding27.jpeg`, alt: 'Trail ride at What A Rush Riding Stables' },
  { src: `${p}/riding28.jpeg`, alt: 'Riders on horseback along the beach past a palapa at What A Rush' },
  { src: `${p}/tack.jpeg`, alt: 'Horse riding saddle and tack' },
  { src: `${p}/tack1.jpeg`, alt: 'Horse bridle and riding equipment' },
  { src: `${p}/view8.jpeg`, alt: 'Scenic view of the beach and estuary' },
  { src: `${p}/tack2.jpeg`, alt: 'Saddle and riding gear ready for the trail' },
  { src: `${p}/tack3.jpeg`, alt: 'Horse tack and equipment at the stables' },
  { src: `${p}/tack4.jpeg`, alt: 'Riding equipment display at What A Rush' },
  { src: `${p}/view9.jpeg`, alt: 'Sunset over the La Libertad beach' },
  { src: `${p}/tack5.jpeg`, alt: 'Horse riding gear and accessories' },
  { src: `${p}/tack7.jpeg`, alt: 'Saddle and tack at the riding stables' },
];

const GalleryCarousel = ({ items, type }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // Heavy clips (beachride, video2, ...) show a poster + play button and only
  // download once the user opts in, so a ~16MB file never streams on its own.
  const [videoActivated, setVideoActivated] = useState(false);
  const thumbsRef = useRef(null);
  const thumbRefs = useRef([]);
  const isFirstRender = useRef(true);
  const mainVideoRef = useRef(null);
  const touchStartX = useRef(null);
  const sectionRef = useRef(null);
  const slideDelayRef = useRef(10000);

  // Preload a small window around the current item so navigation feels
  // instant without downloading the whole set up front (the videos alone
  // total ~200MB — beachride.mp4 is 78MB).
  useEffect(() => {
    const links = [];
    [1, 2, -1].forEach((offset) => {
      const item = items[(current + offset + items.length) % items.length];
      if (!item) return;
      if (type === 'image') {
        const img = new Image();
        img.src = item.src;
      } else if (!item.heavy) {
        // Heavy clips are click-to-load; never prefetch them.
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'video';
        link.href = item.src;
        document.head.appendChild(link);
        links.push(link);
      }
    });
    return () => links.forEach((link) => link.remove());
  }, [items, type, current]);

  // Reset click-to-load state whenever the visible item changes.
  useEffect(() => {
    setVideoActivated(false);
  }, [current, type]);

  // When a heavy clip is activated, start playback — the preceding click is the
  // user gesture that allows an unmuted video to play.
  useEffect(() => {
    if (!videoActivated) return;
    const vid = mainVideoRef.current;
    if (!vid) return;
    const p = vid.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }, [videoActivated]);

  // Track visibility with IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pause video when scrolled away
  useEffect(() => {
    if (!isVisible && mainVideoRef.current && type === 'video') {
      mainVideoRef.current.pause();
    }
  }, [isVisible, type]);

  useEffect(() => {
    setCurrent(0);
    setFullscreen(false);
    isFirstRender.current = true;
  }, [type]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const thumb = thumbRefs.current[current];
    if (thumb && thumbsRef.current) {
      thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [current]);

  // Auto-slideshow for photos only, disabled in fullscreen or when not visible.
  // Default 10s interval; resets to 20s after manual navigation.
  useEffect(() => {
    if (type !== 'image' || fullscreen || !isVisible) return;
    const delay = slideDelayRef.current;
    const timer = setInterval(() => {
      slideDelayRef.current = 10000;
      setDirection(1);
      setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, delay);
    return () => clearInterval(timer);
  }, [type, fullscreen, isVisible, items.length, current]);

  const openFullscreen = useCallback(() => {
    if (mainVideoRef.current) mainVideoRef.current.pause();
    setFullscreen(true);
  }, []);

  const goTo = useCallback((index) => {
    slideDelayRef.current = 20000;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const goPrev = useCallback(() => {
    slideDelayRef.current = 20000;
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  const goNext = useCallback(() => {
    slideDelayRef.current = 20000;
    setDirection(1);
    setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  }, [goNext, goPrev]);

  const item = items[current];

  return (
    <div ref={sectionRef}>
      {/* Slideshow */}
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-black aspect-[3/4] md:aspect-video">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="w-full h-full"
            >
              {type === 'video' ? (
                item.heavy && !videoActivated ? (
                  <button
                    type="button"
                    onClick={() => setVideoActivated(true)}
                    className="group/vid relative w-full h-full"
                    aria-label="Play video"
                  >
                    <img
                      src={item.poster}
                      alt={item.alt || 'Gallery video at What A Rush Riding Stables'}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-16 h-16 rounded-full bg-black/50 group-hover/vid:bg-black/70 flex items-center justify-center transition-colors">
                        <Play className="w-8 h-8 text-white translate-x-0.5" />
                      </span>
                    </span>
                  </button>
                ) : (
                  <video
                    ref={mainVideoRef}
                    key={item.src}
                    src={item.src}
                    poster={item.poster}
                    controls
                    playsInline
                    preload="none"
                    autoPlay={isVisible}
                    onEnded={goNext}
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <ResponsiveImage
                  src={item.src}
                  alt={item.alt || 'Gallery photo at What A Rush Riding Stables'}
                  sizes="(max-width: 768px) 100vw, 1024px"
                  onClick={openFullscreen}
                  className="w-full h-full object-contain cursor-pointer"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Counter overlaid top-right */}
          <div className="absolute top-3 right-3 z-10 bg-black/50 text-white/80 text-xs px-2.5 py-1 rounded-full">
            {current + 1} / {items.length}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={goPrev}
          className="absolute left-2 md:-left-14 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-teal-100 transition-all text-teal-700 hover:text-teal-900"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-2 md:-right-14 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-teal-100 transition-all text-teal-700 hover:text-teal-900"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div ref={thumbsRef} className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin" role="tablist" aria-label="Gallery thumbnails">
        {items.map((m, i) => (
          <button
            key={m.src}
            ref={(el) => { thumbRefs.current[i] = el; }}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === current}
            aria-label={type === 'video' ? `Play video ${i + 1} of ${items.length}` : `View photo ${i + 1} of ${items.length}`}
            className={`cv-item flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
              i === current ? 'border-teal-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            {type === 'video' ? (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <Play className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
            ) : (
              <ResponsiveImage
                src={m.src}
                alt=""
                sizes="64px"
                className="w-full h-full object-cover"
              />
            )}
          </button>
        ))}
      </div>

      {/* Fullscreen overlay (images only) */}
      {fullscreen && type === 'image' && (
        <div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          onClick={() => setFullscreen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm z-10">
            {current + 1} / {items.length}
          </p>

          <div className="w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <ResponsiveImage
              src={item.src}
              alt={item.alt || 'Gallery photo at What A Rush Riding Stables'}
              sizes="100vw"
              className="max-w-full max-h-full object-contain cursor-pointer"
              onClick={() => setFullscreen(false)}
            />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white"
            aria-label="Previous"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white"
            aria-label="Next"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      )}
    </div>
  );
};

const HorseGallery = () => {
  const [tab, setTab] = useState('photos');
  // Render a deterministic order for SSR + the first hydration render (so the
  // server and client HTML match), then apply the per-visit random order after
  // mount. Without this the Math.random shuffle would differ between server and
  // client and trigger a hydration mismatch on the default photos tab.
  const [photos, setPhotos] = useState(() => buildGallery(photoItems, identity));
  const [shuffledVideos, setShuffledVideos] = useState(videos);
  useEffect(() => {
    setPhotos(buildGallery(photoItems));
    setShuffledVideos(shuffle(videos));
  }, []);

  return (
    <section id="horse-gallery" className="py-16 px-4 bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 bg-clip-text text-transparent">
            Gallery
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our horses, rides, and beautiful surroundings
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8" role="tablist" aria-label="Gallery media type">
          <button
            role="tab"
            aria-selected={tab === 'photos'}
            aria-controls="gallery-photos"
            onClick={() => setTab('photos')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 ${
              tab === 'photos'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-teal-50 shadow'
            }`}
          >
            <Camera className="w-5 h-5" />
            Photos
          </button>
          <button
            role="tab"
            aria-selected={tab === 'videos'}
            aria-controls="gallery-videos"
            onClick={() => setTab('videos')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300 ${
              tab === 'videos'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-teal-50 shadow'
            }`}
          >
            <Video className="w-5 h-5" />
            Videos
          </button>
        </div>

        {tab === 'photos' ? (
          <div id="gallery-photos" role="tabpanel" aria-label="Photo gallery">
            <GalleryCarousel items={photos} type="image" />
          </div>
        ) : (
          <div id="gallery-videos" role="tabpanel" aria-label="Video gallery">
            <GalleryCarousel items={shuffledVideos} type="video" />
          </div>
        )}
      </div>
    </section>
  );
};

export default HorseGallery;
