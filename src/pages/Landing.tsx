import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  LayoutGrid,
  ShieldCheck,
  Activity,
  Bell,
  Monitor,
  Lock,
  Layers,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Landing() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Preload important images/assets
    const imagesToPreload = [
      "https://media.giphy.com/media/tq3BP6bsQ0Jwc/giphy.gif",
    ];

    const imagePromises = imagesToPreload.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });

    const docLoad = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", () => resolve());
      }
    });

    Promise.all([...imagePromises, docLoad]).then(() => {
      setIsLoaded(true);
    });
  }, []);

  return (
    <div className="min-h-screen font-sans bg-background text-on-background flex flex-col selection:bg-primary/30">
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="fixed inset-0 z-[110] bg-background flex flex-col items-center justify-center text-on-background"
          >
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-primary" />
            <h2 className="text-xl font-bold tracking-widest uppercase font-display">
              Loading
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BEGIN: SiteHeader */}
      <header className="flex flex-col md:grid md:grid-cols-12 border-b border-outline-variant/20 bg-background sticky top-0 z-50">
        <div className="flex justify-between border-b border-outline-variant/20 md:border-b-0 md:contents">
          {/* Logo Section */}
          <Link
            to="/"
            className="p-5 md:p-6 border-r border-outline-variant/20 md:col-span-4 flex items-center gap-3 hover:bg-on-background/5 transition-colors text-on-background flex-1 md:flex-none"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <LayoutGrid size={18} />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight font-display uppercase italic text-sky-600">
              Traveloop
            </span>
          </Link>
          {/* Mobile Theme Toggle */}
          <div className="md:hidden flex items-center px-4 border-r border-outline-variant/20">
            <ThemeToggle className="w-10 h-10" />
          </div>
          {/* Mobile Sign In */}
          <Link
            to="/login"
            className="md:hidden flex flex-1 items-center justify-center bg-transparent hover:bg-on-background/5 transition-colors uppercase text-xs font-bold font-label tracking-widest opacity-80 hover:opacity-100"
          >
            Sign In
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex md:contents">
          <nav className="flex-1 md:col-span-4 border-r border-outline-variant/20 flex items-center justify-center gap-6 md:gap-8 px-4 md:px-8 py-4 md:py-0">
            <a
              href="#destinations"
              className="uppercase opacity-70 hover:opacity-100 transition-opacity font-label text-xs tracking-widest font-bold"
            >
              Destinations
            </a>
            <a
              href="#how-it-works"
              className="uppercase opacity-70 hover:opacity-100 transition-opacity font-label text-xs tracking-widest font-bold"
            >
              How it Works
            </a>
            <a
              href="#pricing"
              className="uppercase opacity-70 hover:opacity-100 transition-opacity font-label text-xs tracking-widest font-bold"
            >
              Pricing
            </a>
          </nav>
          <div className="flex-1 md:col-span-2 md:border-r border-outline-variant/20 flex items-center justify-center gap-4 px-4 py-4 md:py-0">
             <ThemeToggle className="hidden md:flex w-10 h-10" />
             <Link 
              to="/login" 
              className="hidden md:flex uppercase text-xs font-bold font-label tracking-widest opacity-80 hover:opacity-100"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Desktop Live Demo */}
        <div className="hidden md:flex md:col-span-2 items-center justify-center bg-orange-600 hover:bg-orange-700 transition-colors">
          <Link
            to="/signup"
            className="uppercase text-xs font-bold font-label tracking-widest text-white w-full h-full flex items-center justify-center"
          >
            Join Now
          </Link>
        </div>
      </header>
      {/* END: SiteHeader */}

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        <HomeSection />
        <TrustStrip />
        <FeaturesSection />
        <CTASection />
      </div>
    </div>
  );
}

function HomeSection() {
  return (
    <section id="home" className="grid grid-cols-1 lg:grid-cols-12 border-b border-outline-variant/20">
      {/* Left Graphic Column */}
      <div className="col-span-1 lg:col-span-8 lg:border-r lg:border-outline-variant/20 flex flex-col">
        {/* Top Graphic Block - Travel Preview */}
        <div className="flex-grow border-b border-outline-variant/20 relative overflow-hidden bg-sky-50 min-h-[300px] md:min-h-[500px]">
          <img
            alt="Adventure Preview"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
        </div>
        {/* Bottom Title Block */}
        <div className="p-8 md:p-12 lg:p-16 bg-background relative flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-0">
          <div className="w-full text-center sm:text-left">
            <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black font-display uppercase italic tracking-tighter leading-[0.85] text-on-background">
              Discover Your
              <br />
              <span className="text-sky-600">Next Adventure</span>
            </h1>
          </div>
          {/* Interactive Explore Circle Button */}
          <div className="relative flex items-center justify-center shrink-0 my-4 sm:my-0 sm:mr-12">
            <a
              href="#features"
              className="z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-outline-variant/50 flex items-center justify-center bg-surface-container-lowest/30 backdrop-blur-sm hover:bg-surface-container-lowest/50 transition-all text-on-background"
            >
              <span className="text-xs font-bold uppercase tracking-widest font-label">Explore</span>
            </a>
            <div className="absolute w-32 sm:w-40 h-px bg-on-background/20 pointer-events-none"></div>
            <div className="absolute h-32 sm:h-40 w-px bg-on-background/20 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Right Content Column */}
      <div className="col-span-1 lg:col-span-4 flex flex-col">
        {/* Introduction Block */}
        <div className="flex-grow p-8 md:p-12 lg:p-16 flex flex-col justify-center border-b border-outline-variant/20">
          <div className="mb-8">
             <Activity size={48} className="text-sky-600" />
          </div>
          <p className="text-xl lg:text-2xl font-medium leading-relaxed text-on-surface-variant max-w-sm">
            The ultimate companion for explorers. Plan journeys, track adventures, 
            and discover hidden gems across the globe with our intelligent platform.
          </p>
        </div>
        {/* Get Started Link Block */}
        <Link
          to="/signup"
          className="p-8 md:p-12 lg:p-16 flex-grow lg:flex-grow-0 lg:h-1/3 bg-sky-600 flex items-center justify-center min-h-[150px] md:min-h-[200px] group hover:bg-sky-700 transition-colors text-white cursor-pointer"
        >
          <div className="flex items-center space-x-6">
            <span className="text-3xl md:text-4xl font-black font-display uppercase italic tracking-tighter">
              Start Journey
            </span>
            <ArrowRight
              className="w-12 h-8 transform group-hover:translate-x-2 transition-transform"
              strokeWidth={3}
            />
          </div>
        </Link>
      </div>
    </section>
  );
}

function TrustStrip() {
    return (
        <section className="py-12 border-b border-outline-variant/20 bg-surface-container-lowest overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 overflow-hidden">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/60 mb-8 font-label">
              Trusted by 10,000+ Explorers Worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="text-2xl font-black italic tracking-tighter uppercase font-display">Adventure Co</span>
              <span className="text-2xl font-black italic tracking-tighter uppercase font-display">Globetrotter</span>
              <span className="text-2xl font-black italic tracking-tighter uppercase font-display">Pathfinder</span>
              <span className="text-2xl font-black italic tracking-tighter uppercase font-display">Summit</span>
              <span className="text-2xl font-black italic tracking-tighter uppercase font-display">Voyage</span>
            </div>
          </div>
        </section>
    );
}

function FeaturesSection() {
  const features = [
    {
      icon: <Layers className="text-sky-500" size={24} />,
      title: "Smart Itineraries",
      desc: "Automatically generated travel plans based on your interests and past adventures."
    },
    {
      icon: <Lock className="text-orange-500" size={24} />,
      title: "Secure Bookings",
      desc: "End-to-end encrypted booking system for flights, hotels, and local experiences."
    },
    {
      icon: <Monitor className="text-purple-500" size={24} />,
      title: "Real-time Tracking",
      desc: "Stay updated with live flight statuses, weather alerts, and local news."
    },
    {
      icon: <ShieldCheck className="text-yellow-500" size={24} />,
      title: "Travel Safety",
      desc: "Verified emergency contacts and local safety guidelines for every destination."
    },
    {
      icon: <Activity className="text-green-500" size={24} />,
      title: "Adventure Stats",
      desc: "Visualize your travel history with interactive maps and personalized statistics."
    },
    {
      icon: <Bell className="text-red-500" size={24} />,
      title: "Smart Alerts",
      desc: "Get notified about price drops, nearby attractions, and personalized deals."
    }
  ];

  return (
    <section id="features" className="flex flex-col border-b border-outline-variant/20 bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-outline-variant/20">
        <div className="col-span-1 lg:col-span-6 p-8 md:p-12 lg:p-16 lg:border-r lg:border-outline-variant/20 flex flex-col justify-center">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black font-display uppercase italic tracking-tighter leading-none mb-8">
            Why Choose
            <br />
            <span className="text-sky-600">Traveloop</span>
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-on-surface-variant font-medium">
            We provide everything you need to make your next trip unforgettable, safe, and perfectly organized.
          </p>
        </div>
        <div className="col-span-1 lg:col-span-6 bg-sky-50 flex items-center justify-center p-8">
             <div className="grid grid-cols-2 gap-8 w-full">
                <div className="aspect-square bg-background rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-outline-variant/10">
                    <ShieldCheck size={40} className="text-sky-600 mb-4" />
                    <span className="text-sm font-bold font-label uppercase tracking-widest">Safe & Secure</span>
                </div>
                <div className="aspect-square bg-background rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-outline-variant/10">
                    <Activity size={40} className="text-sky-600 mb-4" />
                    <span className="text-sm font-bold font-label uppercase tracking-widest">Live Updates</span>
                </div>
             </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-surface-container-lowest">
        {features.map((feature, idx) => (
          <div key={idx} className={`p-8 md:p-12 flex flex-col border-b border-outline-variant/20 ${idx % 3 !== 2 ? 'lg:border-r' : ''} hover:bg-background transition-colors group`}>
            <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h4 className="text-xl font-black font-display uppercase italic mb-3">{feature.title}</h4>
            <p className="text-sm text-on-surface-variant/80 leading-relaxed font-medium">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 bg-sky-600">
      <div className="col-span-1 lg:col-span-8 p-8 md:p-12 lg:p-16 lg:border-r border-white/10 flex flex-col justify-center">
        <h2 className="text-5xl md:text-7xl lg:text-9xl font-black font-display uppercase italic tracking-tighter leading-[0.85] text-white mb-12">
          Start Your
          <br />
          Next Journey
          <br />
          <span className="text-white/40">Today.</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-6">
             <Link 
              to="/signup" 
              className="px-10 py-6 bg-white text-sky-600 font-bold font-label uppercase tracking-widest text-center hover:bg-gray-100 transition-colors"
            >
              Get Started for Free
            </Link>
            <Link 
              to="/login" 
              className="px-10 py-6 border-2 border-white text-white font-bold font-label uppercase tracking-widest text-center hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
        </div>
      </div>
      <div className="col-span-1 lg:col-span-4 p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-inverse-surface text-on-inverse-surface">
          <div>
            <p className="text-xs font-bold font-label uppercase tracking-[0.2em] opacity-40 mb-8">
                Capabilities
            </p>
            <ul className="space-y-4 text-xl md:text-2xl font-black font-display uppercase italic tracking-tighter">
                <li className="border-b border-white/10 pb-4">Smart Itineraries</li>
                <li className="border-b border-white/10 pb-4">Secure Bookings</li>
                <li className="border-b border-white/10 pb-4">Real-time Maps</li>
                <li className="pb-4">Local Guides</li>
            </ul>
          </div>
          <div className="pt-12">
             <p className="text-sm font-medium opacity-60 mb-4">© 2026 Traveloop</p>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label">All Systems Operational</span>
             </div>
          </div>
      </div>
    </section>
  );
}
