import React, { useEffect, useState } from 'react';
// Import Head from the single-page subpath, not the package root: the root
// entry statically imports react-router-dom (an optional peer we don't install),
// which fails the build. The single-page entry is router-free.
import { Head } from 'vite-react-ssg/single-page';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';

// Static imports (not React.lazy): vite-react-ssg renders on the server with
// renderToString, which serializes a suspended lazy boundary as its null
// fallback — so lazy sections would be missing from the SSG HTML. Full-page
// hydration needs the whole tree loaded anyway.
import HorseRidingSection from '@/components/HorseRidingSection';
import ReelSection from '@/components/ReelSection';
import ServicesSection from '@/components/ServicesSection';
import HorseGallery from '@/components/HorseGallery';
import LocationSection from '@/components/LocationSection';
import MeetTheOwners from '@/components/MeetTheOwners';
import AvailableUnitsSection from '@/components/AvailableUnitsSection';
import GoogleReview from '@/components/GoogleReview';
import Footer from '@/components/Footer';
import ContactChoiceModal from '@/components/ContactChoiceModal';
import { WA_MESSAGES } from '@/lib/contact';

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "What A Rush Riding Stables",
    "alternateName": "What A Rush",
    "url": "https://whatarush.org"
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://whatarush.org/#riding-stables",
    "name": "What A Rush Riding Stables",
    "description": "Beachfront horseback riding, guided trail rides, horsemanship lessons, and horse therapy sessions in La Libertad, El Salvador. Operated by Shawn and D'Arcy Burke with 30+ years of horsemanship experience.",
    "url": "https://whatarush.org",
    "telephone": "+50369866030",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Playa Cangrejera",
      "addressLocality": "La Libertad",
      "addressRegion": "La Libertad",
      "addressCountry": "SV"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 13.4353125,
      "longitude": -89.1872656
    },
    "image": [
      "https://whatarush.org/images/hero-background.jpg",
      "https://whatarush.org/images/horses/paco.jpeg",
      "https://whatarush.org/images/horses/congrejeto.jpeg"
    ],
    "priceRange": "$$",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Cash, Bitcoin",
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 13.4353125,
        "longitude": -89.1872656
      },
      "geoRadius": "50000"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    "founder": {
      "@type": "Person",
      "name": "Shawn Burke"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Horseback Riding Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Guided Trail Rides",
            "description": "1.5-2 hour guided trail rides through scenic sugar cane fields, estuaries, and wooded trails. Tack and equipment provided."
          },
          "price": "60.00",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Horse/Human Therapy Sessions",
            "description": "Therapeutic sessions connecting horses and humans for healing and growth. Customized packages."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Horsemanship Training Lessons",
            "description": "Learn the art of horsemanship from experienced trainers with 30+ years of experience."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Riding Lessons",
            "description": "Structured riding lessons for all skill levels from beginner to advanced."
          }
        }
      ]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "@id": "https://whatarush.org/#tourist-attraction",
    "name": "What A Rush Beachfront Horseback Riding",
    "description": "Beachfront horseback riding experience in Playa Cangrejera, La Libertad, El Salvador. Ride through sugar cane fields, estuaries, and wooded trails on beautiful horses.",
    "url": "https://whatarush.org",
    "touristType": ["Horseback Riding", "Adventure Tourism", "Ecotourism", "Beach Activities"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 13.4353125,
      "longitude": -89.1872656
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Playa Cangrejera",
      "addressLocality": "La Libertad",
      "addressCountry": "SV"
    },
    "image": "https://whatarush.org/images/hero-background.jpg"
  },
  {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": "https://whatarush.org/#cowboy-casita",
    "name": "The Cowboy Casita - Beachfront Casita Rental",
    "description": "Beachfront casita rental in La Libertad, El Salvador. Fully furnished and American standard, sleeping up to 5 guests, with private parking, internet, AC, pool, and direct beach access. $180/night or $1,000/month on a 1-year lease.",
    "url": "https://whatarush.org/#available-units",
    "telephone": "+50369866030",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "La Libertad",
      "addressRegion": "La Libertad",
      "addressCountry": "SV"
    },
    "image": "https://whatarush.org/images/property/casita-main.jpeg",
    "priceRange": "$180-$1000 USD",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Cash, Bitcoin",
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Beachfront", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Direct Beach Access", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Pool", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Internet", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Private Parking", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Fully Furnished", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "American Standard Fixtures", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Sleeps up to 5", "value": true }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What types of horseback riding experiences does What A Rush offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "What A Rush offers guided trail rides through sugar cane fields, estuaries, and wooded trails ($60 USD for a 1.5-2 hour session), horse/human therapy sessions, horsemanship training lessons, and structured riding lessons for all skill levels."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need riding experience to ride at What A Rush?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No prior experience is needed. We have horses suited for all levels. Sir Dante (Black Beauty gelding), Paco (Peruvian Horse) and Congrejeto (Friesian) are gentle and well mannered for beginners and advanced riders alike, while Tequilla (Spanish gaited) is best for experienced riders. All necessary tack and equipment is provided."
        }
      },
      {
        "@type": "Question",
        "name": "Where is What A Rush located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "What A Rush Riding Stables is located at Playa Cangrejera, La Libertad, El Salvador. Look for the yellow sign. GPS coordinates: 13.4353125, -89.1872656."
        }
      },
      {
        "@type": "Question",
        "name": "How do I book a ride or the casita rental?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Contact Shawn Burke via WhatsApp at +503 6986 6030. You can also message directly through the website's WhatsApp booking link."
        }
      },
      {
        "@type": "Question",
        "name": "What is The Cowboy Casita?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Cowboy Casita is a fully furnished, American standard beachfront casita in La Libertad, El Salvador that sleeps up to 5 guests. It includes private parking, internet, AC, pool access, and direct access to the beach. Rates: $180/night, or $1,000/month on a 1-year lease. We accept cash and Bitcoin."
        }
      },
      {
        "@type": "Question",
        "name": "Does What A Rush accept Bitcoin?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, What A Rush accepts both cash and Bitcoin as payment for horseback riding services and The Cowboy Casita."
        }
      }
    ]
  }
];

const BookingCta = () => {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="py-8 text-center bg-gradient-to-b from-amber-50 to-amber-100">
      <Button
        onClick={() => setContactOpen(true)}
        className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
      >
        Contact for Booking
      </Button>
      <ContactChoiceModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        whatsappMessage={WA_MESSAGES.general}
      />
    </div>
  );
};

function App() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  return (
    <>
      <Head>
        <title>What A Rush - Beachfront Horseback Riding, Trail Rides & The Cowboy Casita | La Libertad, El Salvador</title>
        <meta
          name="description"
          content="Experience beachfront horseback riding, guided trail rides, horsemanship lessons, and the beachfront Cowboy Casita rental at What A Rush in La Libertad, El Salvador."
        />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Head>

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:p-4 focus:text-teal-700 focus:font-bold focus:rounded-md focus:shadow-lg">
        Skip to main content
      </a>

      <div id="home" className="scroll-smooth">
        <Navigation />
        <HeroSection />
        <div id="main-content"><HorseRidingSection /></div>
        <ReelSection />
        <ServicesSection />
        <HorseGallery />
        <LocationSection
          title="What A Rush Riding Stables is located in Playa Cangrejera El Salvador. Look for the yellow sign!"
          mapUrl="https://maps.app.goo.gl/8DDUbCdor8oBKjEm7"
          image="/images/location/sign.jpeg"
          imageAlt="What A Rush Riding Stables sign at Playa Cangrejera, El Salvador"
        />
        <MeetTheOwners />
        <BookingCta />
        <AvailableUnitsSection />
        <LocationSection
          title="House of Grace is a living community in El Salvador."
          mapUrl="https://maps.app.goo.gl/hLYVpeWB1gF2EEqm9"
        />
        <GoogleReview />
        <Footer />
        <Toaster />
      </div>
    </>
  );
}

export default App;
