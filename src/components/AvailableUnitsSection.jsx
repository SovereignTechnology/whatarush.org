import React from 'react';
import { motion } from 'framer-motion';
import RentalUnitCard from './RentalUnitCard';
import PropertyGallery from './PropertyGallery';

const AvailableUnitsSection = () => {
  return (
    <section id="available-units" className="py-16 px-4 bg-gradient-to-b from-amber-100 via-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 bg-clip-text text-transparent">
            The Cowboy Casita
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your perfect beachfront casita in La Libertad, El Salvador
          </p>
        </motion.div>

        <div className="relative mb-0 lg:mb-0">
          {/* Left: Rental Details - determines container height */}
          <div className="lg:w-1/2">
            <RentalUnitCard />
          </div>

          {/* Right: Property Gallery - constrained to card height, scrolls */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-4 lg:mt-0 lg:absolute lg:top-0 lg:right-0 lg:bottom-0 lg:w-1/2"
          >
            <PropertyGallery />
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default AvailableUnitsSection;
