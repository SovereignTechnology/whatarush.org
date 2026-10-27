import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Instagram } from 'lucide-react';

const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, name: 'Instagram', url: 'https://instagram.com/whatarushhorsebackriding' }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent mb-4">
              House of Grace
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Experience the perfect blend of adventure and luxury on the beautiful beaches of La Libertad, El Salvador.
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-teal-400">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <span>La Libertad, El Salvador</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <a
                  href="tel:+50369866030"
                  className="hover:text-teal-400 transition-colors"
                >
                  +503 6986 6030
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <WhatsAppIcon className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <a
                  href="https://wa.me/50369866030?text=Hi%2C%20I%20saw%20your%20website%20and%20I%27m%20interested"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors"
                >
                  WhatsApp: Shawn Burke
                </a>
              </div>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4 text-teal-400">Follow Us</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-gray-800 pt-6 text-center"
        >
          <p className="text-gray-400">
            © {new Date().getFullYear()} House of Grace. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            La Libertad, El Salvador - Where Adventure Meets Paradise
          </p>
          <a href="https://www.sovtech.pro/" target="_blank" rel="noopener noreferrer" className="block text-gray-600 text-xs mt-3 hover:text-teal-400 transition-colors">
            Website by Cam — Sovereign Technology
          </a>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;