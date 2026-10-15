import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import ResponsiveImage from '@/components/ResponsiveImage';
import { srcSet } from '@/lib/utils';

const images = [
  { src: '/images/property/casita-main.jpeg', label: 'Exterior & Patio' },
  { src: '/images/property/casita-pool-beach.jpeg', label: 'Pool & Beach' },
  { src: '/images/property/casita-pool-lawn.jpeg', label: 'Pool & Grounds' },
  { src: '/images/property/casita-beach-umbrella.jpeg', label: 'Beach' },
  { src: '/images/property/casita-exterior.jpeg', label: 'Exterior' },
  { src: '/images/property/casita-kitchen.jpeg', label: 'Kitchen & Bar' },
  { src: '/images/property/casita-bedroom.jpeg', label: 'Bedroom' },
  { src: '/images/property/casita-bedroom-vanity.jpeg', label: 'Bedroom & Vanity' },
  { src: '/images/property/casita-bedroom-ensuite.jpeg', label: 'Bedroom & Ensuite' },
  { src: '/images/property/casita-bathroom.jpeg', label: 'Bathroom' },
];

const PropertyGallery = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [fullscreen, setFullscreen] = useState(null);
  const [direction, setDirection] = useState(0);

  const goPrev = () => {
    setDirection(-1);
    setFullscreen((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setDirection(1);
    setFullscreen((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="h-full overflow-y-scroll rounded-xl border border-gray-200 bg-white shadow-inner p-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="cv-item relative overflow-hidden rounded-lg shadow-md cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setFullscreen(index)}
            >
              <div className="aspect-square overflow-hidden">
                <ResponsiveImage
                  src={image.src}
                  alt={`${image.label} at The Cowboy Casita beachfront property`}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  loading="lazy"
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    hoveredIndex === index ? 'scale-110' : 'scale-100'
                  }`}
                />
              </div>

              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 ${
                hoveredIndex === index ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm md:text-base">{image.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen overlay */}
      {fullscreen !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          onClick={() => setFullscreen(null)}
        >
          <button
            onClick={() => setFullscreen(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors text-white"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm z-10">
            {fullscreen + 1} / {images.length} — {images[fullscreen].label}
          </p>

          <div className="w-full h-full flex items-center justify-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={fullscreen}
                custom={direction}
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                src={images[fullscreen].src}
                srcSet={srcSet(images[fullscreen].src, 'webp')}
                sizes="100vw"
                alt={images[fullscreen].label}
                className="max-w-full max-h-full object-contain cursor-pointer"
                onClick={() => setFullscreen(null)}
              />
            </AnimatePresence>
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
    </>
  );
};

export default PropertyGallery;
