/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ArrowRight,
  Camera,
  Globe,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const imagesToPreload = [
      "https://media.giphy.com/media/tq3BP6bsQ0Jwc/giphy.gif",
      "https://static.vecteezy.com/system/resources/thumbnails/027/843/401/small/a-cargo-truck-with-a-container-is-seen-driving-across-a-bridge-while-a-semi-truck-with-a-cargo-trailer-follows-closely-behind-photo.jpg",
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    ];

    const imagePromises = imagesToPreload.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => resolve(); // continue even if one fails
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
    <div className="min-h-screen font-sans bg-[#E6EBF9] text-[#111122] flex flex-col">
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="fixed inset-0 z-[110] bg-[#111122] flex flex-col items-center justify-center text-[#E6EBF9]"
          >
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-white" />
            <h2 className="text-xl font-bold tracking-widest uppercase">
              Loading
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BEGIN: SiteHeader */}
      <header className="flex flex-col md:grid md:grid-cols-12 border-b border-black/10 bg-[#E6EBF9] sticky top-0 z-50">
        <div className="flex justify-between border-b border-black/10 md:border-b-0 md:contents">
          {/* Logo Section */}
          <a
            href="#home"
            className="p-5 md:p-6 border-r border-black/10 md:col-span-4 flex items-center justify-center md:justify-start hover:bg-black/5 transition-colors text-black flex-1 md:flex-none"
          >
            <span className="text-2xl md:text-3xl font-bold tracking-tighter">
              B
            </span>
          </a>
          {/* Mobile Get in Touch */}
          <a
            href="#contact"
            className="md:hidden flex flex-1 items-center justify-center bg-transparent hover:bg-black/5 transition-colors nav-link uppercase text-xs font-bold opacity-80 hover:opacity-100"
          >
            Get in Touch
          </a>
        </div>

        {/* Navigation & Social */}
        <div className="flex md:contents">
          <nav className="flex-1 md:col-span-4 border-r border-black/10 flex items-center justify-center gap-6 md:gap-8 px-4 md:px-8 py-4 md:py-0">
            <a
              href="#about"
              className="nav-link uppercase opacity-70 hover:opacity-100 transition-opacity"
            >
              About
            </a>
            <a
              href="#work"
              className="nav-link uppercase opacity-70 hover:opacity-100 transition-opacity"
            >
              Work
            </a>
          </nav>
          <div className="flex-1 md:col-span-2 md:border-r border-black/10 flex items-center justify-center gap-6 px-4 py-4 md:py-0">
            <a
              className="text-lg hover:opacity-60 transition-opacity flex items-center justify-center"
              href="#"
            >
              <Camera className="w-5 h-5" />
            </a>
            <a
              className="text-lg hover:opacity-60 transition-opacity flex items-center justify-center"
              href="#"
            >
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Desktop Get in Touch */}
        <div className="hidden md:flex md:col-span-2 items-center justify-center hover:bg-black/5 transition-colors">
          <a
            href="#contact"
            className="nav-link uppercase text-xs font-bold opacity-80 hover:opacity-100 transition-opacity w-full h-full flex items-center justify-center"
          >
            Get in Touch
          </a>
        </div>
      </header>
      {/* END: SiteHeader */}

      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        <Home />
        <About />
        <Work />
        <Contact />
      </div>
    </div>
  );
}

function Home() {
  return (
    <section id="home" className="grid grid-cols-1 lg:grid-cols-12 flex-grow">
      {/* Left Graphic Column */}
      <div className="col-span-1 lg:col-span-8 lg:border-r lg:border-black/10 flex flex-col">
        {/* Top Graphic Block */}
        <div className="flex-grow border-b border-black/10 relative overflow-hidden bg-white min-h-[300px] md:min-h-[400px]">
          <img
            alt="Cargo truck anim"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://media.giphy.com/media/tq3BP6bsQ0Jwc/giphy.gif"
          />
        </div>
        {/* Bottom Title Block */}
        <div className="p-8 md:p-12 lg:p-16 bg-[#E6EBF9] relative flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-0">
          <div className="w-full text-center sm:text-left">
            <h1 className="hero-title text-6xl md:text-8xl lg:text-[9rem] xl:text-[10rem] text-[#111122]">
              Visual
              <br />
              Developer
            </h1>
          </div>
          {/* Interactive About Circle Button */}
          <div className="relative flex items-center justify-center shrink-0 my-4 sm:my-0 sm:mr-12">
            <a
              href="#about"
              className="z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-gray-400/50 flex items-center justify-center bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all text-black"
            >
              <span className="text-sm font-medium">About</span>
            </a>
            {/* Crosshair visual element */}
            <div className="absolute w-32 sm:w-40 h-px bg-black/20 pointer-events-none"></div>
            <div className="absolute h-32 sm:h-40 w-px bg-black/20 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Right Content Column */}
      <div className="col-span-1 lg:col-span-4 flex flex-col">
        {/* Introduction Block */}
        <div className="flex-grow p-8 md:p-12 lg:p-16 flex flex-col justify-center border-b border-black/10">
          {/* Waving Hand Icon */}
          <div className="mb-8">
            <svg
              className="text-gray-600"
              fill="none"
              height="48"
              viewBox="0 0 24 24"
              width="48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5 12V6.5C14.5 5.11929 13.3807 4 12 4C10.6193 4 9.5 5.11929 9.5 6.5V12M14.5 12V7.5C14.5 6.11929 15.6193 5 17 5C18.3807 5 19.5 6.11929 19.5 7.5V13.5C19.5 17.0899 16.5899 20 13 20H11C7.41015 20 4.5 17.0899 4.5 13.5V12C4.5 10.6193 5.61929 9.5 7 9.5C8.3807 9.5 9.5 10.6193 9.5 12M14.5 12V9.5C14.5 8.11929 13.3807 7 12 7C10.6193 7 9.5 8.11929 9.5 9.5V12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              ></path>
            </svg>
          </div>
          <p className="text-xl lg:text-2xl font-medium leading-relaxed text-gray-700 max-w-sm">
            Hi, I am Dylan Brouwer. A Digital Designer & Visual Developer
            creating digital experiences with an eye for design and motion.
          </p>
        </div>
        {/* Work Link Block */}
        <a
          href="#work"
          className="p-8 md:p-12 lg:p-16 flex-grow lg:flex-grow-0 lg:h-1/3 bg-[#E6EBF9] flex items-center justify-center min-h-[150px] md:min-h-[200px] group hover:bg-black/5 transition-colors text-black cursor-pointer"
        >
          <div className="flex items-center space-x-6">
            <span className="text-3xl md:text-4xl font-black uppercase tracking-widest text-[#111122]">
              Work
            </span>
            <ArrowRight
              className="w-12 h-8 transform group-hover:translate-x-2 transition-transform"
              strokeWidth={2}
            />
          </div>
        </a>
      </div>
    </section>
  );
}

function About() {
  return (
    <section
      id="about"
      className="grid grid-cols-1 lg:grid-cols-12 flex-grow bg-[#E6EBF9]"
    >
      <div className="col-span-1 lg:col-span-6 lg:border-r lg:border-black/10 border-b border-black/10 lg:border-b-0 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <div>
          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl mb-8">
            About
            <br />
            Me
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed text-gray-700 mb-8 font-medium">
            I bridge the gap between design and development. With a background
            in graphic design and a passion for coding, I build interfaces that
            are both beautiful and functional.
          </p>
          <p className="text-lg leading-relaxed text-gray-600">
            My approach is strictly grid-based, drawing inspiration from Swiss
            design principles, brutalism, and editorial layout blocks. I love
            well-structured typography, bold contrasts, and subtle motion.
          </p>
        </div>
        <div className="mt-12 md:mt-16">
          <h3 className="font-bold text-sm mb-6 uppercase tracking-[0.2em] text-gray-500">
            Capabilities
          </h3>
          <ul className="space-y-0 text-[#111122] flex flex-col text-lg md:text-xl font-bold uppercase tracking-widest">
            <li className="border-b border-black/10 pb-4">
              Interaction Design
            </li>
            <li className="border-b border-black/10 pb-4 pt-4">
              Frontend Development
            </li>
            <li className="border-b border-black/10 pb-4 pt-4">
              Creative Coding
            </li>
            <li className="pt-4">Motion & Animation</li>
          </ul>
        </div>
      </div>
      <div className="col-span-1 lg:col-span-6 flex flex-col bg-white">
        <div className="h-full min-h-[300px] md:min-h-[400px] w-full relative">
          <img
            src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2670&auto=format&fit=crop"
            alt="Workspace"
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-90"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </section>
  );
}

function Work() {
  const projects = [
    {
      id: 1,
      title: "Logistics Platform React UI",
      type: "Frontend / Design",
      img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Neo-Brutalism E-Commerce",
      type: "Design / Web",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Editorial Dashboard",
      type: "Architecture / Dev",
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    },
  ];

  return (
    <section id="work" className="flex-grow flex flex-col bg-[#E6EBF9]">
      <div className="p-8 md:p-12 lg:p-16 border-b border-black/10 text-center lg:text-left">
        <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl">
          Selected
          <br />
          Work
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 flex-grow bg-white">
        {projects.map((p, i) => (
          <div
            key={p.id}
            className={`flex flex-col group cursor-pointer ${i !== projects.length - 1 ? "lg:border-r lg:border-black/10" : ""} border-b border-black/10 lg:border-b-0 relative overflow-hidden bg-[#E6EBF9]`}
          >
            <div className="h-64 sm:h-80 lg:h-96 w-full relative overflow-hidden border-b border-black/10">
              <img
                src={p.img}
                alt={p.title}
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-8 flex-grow flex flex-col justify-between group-hover:bg-white transition-colors duration-500">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">
                  {p.type}
                </p>
                <h2 className="text-xl lg:text-2xl font-black uppercase tracking-tight leading-none">
                  {p.title}
                </h2>
              </div>
              <div className="mt-8 flex items-center justify-end">
                <div className="p-4 border border-black rounded-full text-black group-hover:bg-[#111122] group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-5 h-5 transform transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      className="grid grid-cols-1 lg:grid-cols-12 flex-grow bg-[#E6EBF9]"
    >
      <div className="col-span-1 lg:col-span-6 p-8 md:p-12 lg:p-16 lg:border-r lg:border-black/10 border-b border-black/10 lg:border-b-0 flex flex-col justify-center">
        <h1 className="hero-title text-5xl md:text-7xl lg:text-[7rem] mb-8 lg:mb-12">
          Let's
          <br />
          Build
          <br />
          Something
        </h1>
        <p className="text-lg md:text-xl font-medium text-gray-600 mb-12 lg:mb-16">
          Open for freelance opportunities, collaborations, and coffee chats.
        </p>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">
            Direct Email
          </p>
          <a
            href="mailto:hello@example.com"
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight underline decoration-2 md:decoration-4 underline-offset-4 md:underline-offset-8 decoration-black hover:decoration-black/40 transition-colors break-all"
          >
            hello@dylan.design
          </a>
        </div>
      </div>
      <div className="col-span-1 lg:col-span-6 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 border border-black/5 rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-64 h-64 border border-black/5 rounded-full pointer-events-none"></div>

        <form
          className="max-w-lg w-full mx-auto space-y-10 relative z-10"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
              Name
            </label>
            <input
              type="text"
              className="w-full bg-transparent border-b-2 border-black/20 focus:border-black py-3 outline-none transition-colors text-2xl font-medium placeholder:text-black/20"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full bg-transparent border-b-2 border-black/20 focus:border-black py-3 outline-none transition-colors text-2xl font-medium placeholder:text-black/20"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
              Message
            </label>
            <textarea
              rows={4}
              className="w-full bg-transparent border-b-2 border-black/20 focus:border-black py-3 outline-none transition-colors text-2xl font-medium resize-none placeholder:text-black/20"
              placeholder="Tell me about your project..."
            ></textarea>
          </div>
          <button className="w-full bg-[#111122] text-[#E6EBF9] font-bold uppercase tracking-widest py-6 hover:bg-black/80 transition-colors flex items-center justify-center space-x-3 group cursor-pointer">
            <span>Send Message</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </section>
  );
}

