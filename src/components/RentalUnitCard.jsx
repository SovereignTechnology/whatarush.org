import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Car, Snowflake, Waves, Umbrella, MapPin, DollarSign, Wifi, Zap, Home, Bitcoin, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContactChoiceModal from '@/components/ContactChoiceModal';
import { WA_MESSAGES } from '@/lib/contact';

const RentalUnitCard = () => {
  const [contactOpen, setContactOpen] = useState(false);

  const features = [
    { icon: Users, text: 'Sleeps up to 5 guests', color: 'text-blue-600' },
    { icon: Home, text: 'Fully Furnished', color: 'text-amber-600' },
    { icon: DollarSign, text: 'American Standard', color: 'text-green-600' },
    { icon: Car, text: 'Private Parking', color: 'text-slate-600' },
    { icon: Wifi, text: 'Internet Included', color: 'text-indigo-600' },
    { icon: Snowflake, text: 'Air Conditioning (AC)', color: 'text-cyan-600' },
    { icon: Waves, text: 'Pool', color: 'text-teal-600' },
    { icon: Umbrella, text: 'Direct Beach Access', color: 'text-orange-600' },
  ];

  const pricing = [
    { label: 'By the night', price: '$180.00 USD' },
  ];

  const paymentMethods = [
    { icon: Banknote, text: 'Cash', color: 'text-green-600' },
    { icon: Bitcoin, text: 'Bitcoin', color: 'text-orange-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-xl shadow-lg p-8 h-full w-full"
    >
      <div className="mb-6">
        <h3 className="text-3xl font-bold text-gray-800 mb-2">
          The Cowboy Casita
        </h3>
        <p className="text-gray-600">Your perfect beachfront casita awaits</p>
      </div>

      {/* Short Term Pricing */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Short Term</p>
        <div className="space-y-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4">
          {pricing.map((tier) => (
            <div key={tier.label} className="flex justify-between items-baseline">
              <span className="text-gray-600">{tier.label}</span>
              <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {tier.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Long Term Pricing */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Long Term</p>
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4">
          <div className="flex justify-between items-baseline">
            <span className="text-gray-600">1 Year Lease</span>
            <span className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              $1,000.00 USD / month
            </span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">We accept:</p>
        <div className="flex gap-4">
          {paymentMethods.map((method) => (
            <div key={method.text} className="flex items-center gap-1.5">
              <method.icon className={`w-4 h-4 ${method.color}`} />
              <span className="text-sm font-medium text-gray-700">{method.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center gap-3 text-gray-700"
          >
            <feature.icon className={`w-5 h-5 ${feature.color}`} />
            <span>{feature.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Electricity note */}
      <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-700">Short-term stays</span> — electricity included in the nightly rate.
            <br />
            <span className="font-semibold text-gray-700">Long-term lease</span> — electricity billed separately based on usage.
          </p>
        </div>
      </div>

      <div className="border-t pt-6 mb-6">
        <p className="text-gray-600 mb-2">Contact:</p>
        <p className="text-xl font-semibold text-gray-800">Shawn Burke</p>
      </div>

      <Button
        onClick={() => setContactOpen(true)}
        className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
      >
        Contact for Details
      </Button>

      <ContactChoiceModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        whatsappMessage={WA_MESSAGES.casita}
      />
    </motion.div>
  );
};

export default RentalUnitCard;
