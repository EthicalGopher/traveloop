import React from "react";
import { 
  Search, Bell, MessageSquare, ArrowRight, Globe, Layers, ChevronDown, 
  Wallet, Clock, SlidersHorizontal, X, Star, Plus, Heart, Plane, Home, 
  ChevronRight, PlaneTakeoff 
} from "lucide-react";

export function Dashboard() {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="max-w-[1280px] mx-auto p-4 md:p-6 flex flex-col gap-6 w-full">
        {/* Greeting & Search (Mobile only) */}
        <div className="md:hidden flex flex-col gap-4">
          <h1 className="font-headline text-2xl font-bold text-text-primary">Welcome back, Alex!</h1>
          <div className="flex items-center bg-surface-canvas rounded-xl px-4 py-3 border border-border-subtle focus-within:border-primary focus-within:border-2 transition-all shadow-sm">
            <Search className="text-text-secondary w-5 h-5 mr-2" />
            <input className="bg-transparent border-none outline-none text-body text-sm w-full placeholder-text-secondary text-text-primary focus:ring-0 p-0" placeholder="Where to next?" type="text" />
          </div>
        </div>

        {/* Greeting (Desktop) */}
        <div className="hidden md:block">
          <h1 className="font-headline text-3xl font-bold text-text-primary">Welcome back, Alex!</h1>
          <p className="font-body text-sm text-text-secondary mt-1">Ready to plan your next adventure?</p>
        </div>

        {/* Hero Banner: Featured Trip */}
        <section className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-sm flex flex-col justify-end p-6 md:p-10 group" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="relative z-10 text-white max-w-2xl">
            <span className="inline-block px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full font-label text-xs font-medium mb-3 text-on-primary">Featured Destination</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">Santorini, Greece</h2>
            <p className="font-body text-base text-white/90 mb-6 max-w-md line-clamp-2 md:line-clamp-none">Experience the breathtaking sunsets and iconic white architecture overlooking the Aegean Sea.</p>
            <button className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label text-sm font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2 w-max">
              <span>Plan this trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Hero Search & Filters Area */}
        <section className="bg-surface-canvas rounded-xl border border-border-subtle p-4 md:p-6 shadow-sm flex flex-col gap-4">
          <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">Where to next?</h2>
          
          {/* Prominent Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-6 h-6" />
            <input className="w-full pl-12 pr-4 py-4 bg-surface-background border border-border-subtle rounded-lg font-body text-base text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all" placeholder="Search cities, activities, or regions..." type="text" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-on-primary px-4 py-2 rounded-md font-label text-sm hover:bg-surface-tint transition-colors hidden sm:block">
              Search
            </button>
          </div>
          
          {/* Advanced Filters */}
          <div className="flex flex-wrap gap-3 items-center mt-3">
            <span className="font-label text-xs text-text-secondary mr-2 hidden sm:inline">Filters:</span>
            <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-border-subtle bg-surface-canvas hover:bg-surface-background transition-colors font-label text-xs text-text-primary">
              <Globe className="w-3.5 h-3.5" /> Region
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-primary bg-primary-container/10 transition-colors font-label text-xs text-primary">
              <Layers className="w-3.5 h-3.5" /> Category
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-border-subtle bg-surface-canvas hover:bg-surface-background transition-colors font-label text-xs text-text-primary">
              <Wallet className="w-3.5 h-3.5" /> Budget
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-border-subtle bg-surface-canvas hover:bg-surface-background transition-colors font-label text-xs text-text-primary">
              <Clock className="w-3.5 h-3.5" /> Duration
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-border-subtle bg-surface-canvas hover:bg-surface-background transition-colors font-label text-xs text-text-secondary ml-auto border-none">
              <SlidersHorizontal className="w-3.5 h-3.5" /> More Filters
            </button>
          </div>
          
          {/* Active Filter Chips */}
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="inline-flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded-full font-label text-[11px] text-on-surface-variant">
              Culture & History <X className="w-3 h-3 cursor-pointer hover:text-error" />
            </span>
            <span className="inline-flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded-full font-label text-[11px] text-on-surface-variant">
              Europe <X className="w-3 h-3 cursor-pointer hover:text-error" />
            </span>
          </div>
        </section>

        {/* Results Grid */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-title text-xl font-medium text-text-primary">Top Matches</h3>
            <span className="font-label text-xs text-text-secondary">24 results</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Result Card 1 */}
            <article className="bg-surface-canvas rounded-xl border border-border-subtle overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-itinerary-stay z-10"></div>
              <div className="h-48 relative overflow-hidden bg-surface-container">
                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=600')" }}></div>
                <div className="absolute top-3 right-3 bg-surface-canvas/90 backdrop-blur-sm px-2 py-1 rounded font-label text-[11px] text-text-primary flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-itinerary-activity fill-current" /> 4.9
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-title text-xl font-medium text-text-primary leading-tight">Rome, Italy</h4>
                </div>
                <p className="font-body text-sm text-text-secondary mb-3 line-clamp-2">Explore ancient ruins, vibrant piazzas, and world-class culinary experiences in the heart of the Mediterranean.</p>
                <div className="flex flex-wrap gap-2 mt-auto mb-4">
                  <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] text-text-secondary">Historical</span>
                  <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] text-text-secondary">Food</span>
                  <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] text-text-secondary">$$$</span>
                </div>
                <button onClick={() => window.dispatchEvent(new CustomEvent('openCreateTrip', { detail: { place: 'Rome, Italy' }}))} className="w-full py-2 border border-border-subtle rounded-lg font-label text-sm text-primary hover:bg-primary-container/10 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-[18px] h-[18px]" /> Add to Trip
                </button>
              </div>
            </article>

            {/* Result Card 2 */}
            <article className="bg-surface-canvas rounded-xl border border-border-subtle overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-itinerary-activity z-10"></div>
              <div className="h-48 relative overflow-hidden bg-surface-container">
                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1513635269975-59693e0cd8ce?q=80&w=600')" }}></div>
                <div className="absolute top-3 right-3 bg-surface-canvas/90 backdrop-blur-sm px-2 py-1 rounded font-label text-[11px] text-text-primary flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-itinerary-activity fill-current" /> 4.7
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-title text-xl font-medium text-text-primary leading-tight">London, UK</h4>
                </div>
                <p className="font-body text-sm text-text-secondary mb-3 line-clamp-2">A diverse metropolis blending centuries of history with cutting-edge art, theater, and finance.</p>
                <div className="flex flex-wrap gap-2 mt-auto mb-4">
                  <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] text-text-secondary">Culture</span>
                  <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] text-text-secondary">Museums</span>
                  <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] text-text-secondary">$$$$</span>
                </div>
                <button onClick={() => window.dispatchEvent(new CustomEvent('openCreateTrip', { detail: { place: 'London, UK' }}))} className="w-full py-2 border border-border-subtle rounded-lg font-label text-sm text-primary hover:bg-primary-container/10 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-[18px] h-[18px]" /> Add to Trip
                </button>
              </div>
            </article>

            {/* Result Card 3 */}
            <article className="bg-surface-canvas rounded-xl border border-border-subtle overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-itinerary-transit z-10"></div>
              <div className="h-48 relative overflow-hidden bg-surface-container">
                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600')" }}></div>
                <div className="absolute top-3 right-3 bg-surface-canvas/90 backdrop-blur-sm px-2 py-1 rounded font-label text-[11px] text-text-primary flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-itinerary-activity fill-current" /> 4.8
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-title text-xl font-medium text-text-primary leading-tight">Paris, France</h4>
                </div>
                <p className="font-body text-sm text-text-secondary mb-3 line-clamp-2">The City of Light offers unparalleled art collections, romantic boulevards, and exquisite café culture.</p>
                <div className="flex flex-wrap gap-2 mt-auto mb-4">
                  <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] text-text-secondary">Art</span>
                  <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] text-text-secondary">Romance</span>
                  <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] text-text-secondary">$$$</span>
                </div>
                <button onClick={() => window.dispatchEvent(new CustomEvent('openCreateTrip', { detail: { place: 'Paris, France' }}))} className="w-full py-2 border border-border-subtle rounded-lg font-label text-sm text-primary hover:bg-primary-container/10 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-[18px] h-[18px]" /> Add to Trip
                </button>
              </div>
            </article>

            {/* Result Card 4 */}
            <article className="bg-surface-canvas rounded-xl border border-border-subtle overflow-hidden flex flex-col group hover:shadow-lg transition-shadow duration-300 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary-container z-10"></div>
              <div className="h-48 relative overflow-hidden bg-surface-container">
                <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517736996303-4e64a4f87f9b?q=80&w=600')" }}></div>
                <div className="absolute top-3 right-3 bg-surface-canvas/90 backdrop-blur-sm px-2 py-1 rounded font-label text-[11px] text-text-primary flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-itinerary-activity fill-current" /> 4.6
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-title text-xl font-medium text-text-primary leading-tight">Amsterdam, NL</h4>
                </div>
                <p className="font-body text-sm text-text-secondary mb-3 line-clamp-2">Historic canals, renowned art museums, and a unique cycling culture define this relaxed European capital.</p>
                <div className="flex flex-wrap gap-2 mt-auto mb-4">
                  <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] text-text-secondary">Cycling</span>
                  <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] text-text-secondary">Museums</span>
                  <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] text-text-secondary">$$</span>
                </div>
                <button onClick={() => window.dispatchEvent(new CustomEvent('openCreateTrip', { detail: { place: 'Amsterdam, NL' }}))} className="w-full py-2 border border-border-subtle rounded-lg font-label text-sm text-primary hover:bg-primary-container/10 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-[18px] h-[18px]" /> Add to Trip
                </button>
              </div>
            </article>
          </div>
        </section>

        {/* Recommended Destinations (Horizontal Bento-style) */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <h3 className="font-title text-xl font-medium text-text-primary">Recommended Destinations</h3>
            <a className="font-label text-sm text-primary hover:underline" href="#">View all</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Paris */}
            <div className="bg-surface-canvas border border-border-subtle rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative">
              <div className="h-40 overflow-hidden">
                <img alt="Paris" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1541300613939-71366b37c92e?q=80&w=600" />
              </div>
              <div className="p-4 relative">
                <div className="absolute -top-5 right-4 bg-surface-canvas p-1 rounded-full shadow-sm">
                  <div className="bg-surface-container-low text-primary rounded-full w-8 h-8 flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <h4 className="font-title text-xl font-medium text-text-primary mb-1">Paris, France</h4>
                <div className="flex items-center gap-4 text-text-secondary font-body text-sm mt-2">
                  <div className="flex items-center gap-1">
                    <Wallet className="w-4 h-4" />
                    <span>$$$</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-itinerary-activity fill-current" />
                    <span>4.9</span>
                  </div>
                </div>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden group-hover:block"></div>
            </div>

            {/* Card 2: Tokyo */}
            <div className="bg-surface-canvas border border-border-subtle rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative">
              <div className="h-40 overflow-hidden">
                <img alt="Tokyo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600" />
              </div>
              <div className="p-4 relative">
                <div className="absolute -top-5 right-4 bg-surface-canvas p-1 rounded-full shadow-sm">
                  <div className="bg-surface-container-low text-text-secondary hover:text-primary rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-title text-xl font-medium text-text-primary mb-1">Tokyo, Japan</h4>
                <div className="flex items-center gap-4 text-text-secondary font-body text-sm mt-2">
                  <div className="flex items-center gap-1">
                    <Wallet className="w-4 h-4" />
                    <span>$$</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-itinerary-activity fill-current" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden group-hover:block"></div>
            </div>

            {/* Card 3: Bali */}
            <div className="bg-surface-canvas border border-border-subtle rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative hidden md:block">
              <div className="h-40 overflow-hidden">
                <img alt="Bali" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600" />
              </div>
              <div className="p-4 relative">
                <div className="absolute -top-5 right-4 bg-surface-canvas p-1 rounded-full shadow-sm">
                  <div className="bg-surface-container-low text-text-secondary hover:text-primary rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="font-title text-xl font-medium text-text-primary mb-1">Bali, Indonesia</h4>
                <div className="flex items-center gap-4 text-text-secondary font-body text-sm mt-2">
                  <div className="flex items-center gap-1">
                    <Wallet className="w-4 h-4" />
                    <span>$</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-itinerary-activity fill-current" />
                    <span>4.7</span>
                  </div>
                </div>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary hidden group-hover:block"></div>
            </div>
          </div>
        </section>

        {/* Recent Trips (Vertical List) */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <h3 className="font-title text-xl font-medium text-text-primary">Recent Trips</h3>
          </div>
          <div className="flex flex-col gap-3">
            {/* Trip 1: Upcoming */}
            <div className="bg-surface-canvas border border-border-subtle rounded-xl p-4 shadow-sm flex items-center justify-between hover:bg-surface-container-lowest transition-colors cursor-pointer relative overflow-hidden pl-5">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-itinerary-transit"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-title text-xl font-medium text-text-primary">Weekend in Rome</h4>
                  <p className="font-body text-sm text-text-secondary">Oct 12 - Oct 15 • 3 Days</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-2 py-1 bg-surface-container-low text-primary rounded font-label text-[11px] uppercase tracking-wider">Upcoming</span>
                <ChevronRight className="w-5 h-5 text-text-secondary" />
              </div>
            </div>

            {/* Trip 2: Ongoing */}
            <div className="bg-surface-canvas border border-border-subtle rounded-xl p-4 shadow-sm flex items-center justify-between hover:bg-surface-container-lowest transition-colors cursor-pointer relative overflow-hidden pl-5">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-itinerary-stay"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-itinerary-stay">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-title text-xl font-medium text-text-primary">Swiss Alps Retreat</h4>
                  <p className="font-body text-sm text-text-secondary">Sep 28 - Oct 5 • 7 Days</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-2 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded font-label text-[11px] uppercase tracking-wider">Ongoing</span>
                <ChevronRight className="w-5 h-5 text-text-secondary" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

