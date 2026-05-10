import { Upload, Flame, Mountain, PiggyBank, Baby, Utensils, SlidersHorizontal, Star, Heart, Bookmark, BadgeCheck } from "lucide-react";

export function Community() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
        <div className="max-w-[1280px] mx-auto w-full">
          {/* Share Your Trip Hero Section */}
          <section className="mb-8 rounded-xl overflow-hidden relative min-h-[300px] flex items-center shadow-sm">
            <img alt="Travel hero" className="absolute inset-0 w-full h-full object-cover z-0" src="https://images.unsplash.com/photo-1518599427670-6da42296d9da?q=80&w=2000&auto=format&fit=crop" />
            <div className="absolute inset-0 bg-gradient-to-r from-on-background/80 to-transparent z-10"></div>
            <div className="relative z-20 p-6 md:p-8 text-surface-canvas max-w-2xl">
              <h2 className="font-display text-5xl font-bold mb-3">Share Your Journey</h2>
              <p className="font-body text-base text-surface-variant mb-6 opacity-90">Inspire the Traveloop community. Upload your detailed itineraries, hidden gems, and travel tips to help others plan their perfect trip.</p>
              <button className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label text-sm font-semibold hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-3">
                <Upload className="w-5 h-5" />
                Share Itinerary
              </button>
            </div>
          </section>

          {/* Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-6 hide-scrollbar">
            <button className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container font-label text-xs whitespace-nowrap border border-primary-container">
              <Flame className="w-4 h-4 fill-current" /> Trending
            </button>
            <button className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-surface-canvas text-on-surface-variant border border-border-subtle hover:bg-surface-container-low font-label text-xs whitespace-nowrap transition-colors">
              <Mountain className="w-4 h-4" /> Adventure
            </button>
            <button className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-surface-canvas text-on-surface-variant border border-border-subtle hover:bg-surface-container-low font-label text-xs whitespace-nowrap transition-colors">
              <PiggyBank className="w-4 h-4" /> Budget
            </button>
            <button className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-surface-canvas text-on-surface-variant border border-border-subtle hover:bg-surface-container-low font-label text-xs whitespace-nowrap transition-colors">
              <Baby className="w-4 h-4" /> Family
            </button>
            <button className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-surface-canvas text-on-surface-variant border border-border-subtle hover:bg-surface-container-low font-label text-xs whitespace-nowrap transition-colors">
              <Utensils className="w-4 h-4" /> Culinary
            </button>
            <button className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-surface-canvas text-on-surface-variant border border-border-subtle hover:bg-surface-container-low font-label text-xs whitespace-nowrap transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> More Filters
            </button>
          </div>

          <h3 className="font-title text-xl font-medium text-on-surface mb-4">Community Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
            <div className="col-span-1 md:col-span-2 row-span-2 bg-surface-canvas rounded-xl border border-border-subtle overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-[400px]">
              <div className="relative h-2/3 overflow-hidden">
                <img alt="Japan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000" />
                <div className="absolute top-3 right-3 bg-surface-background/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-itinerary-activity fill-current" />
                  <span className="font-label text-[11px] font-medium text-on-surface">4.9</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-headline text-2xl font-bold text-on-surface mb-1 line-clamp-1">14 Days in Japan: From Tokyo Neon to Kyoto</h4>
                  <p className="font-body text-sm text-on-surface-variant line-clamp-2">A comprehensive guide balancing fast-paced city exploration with serene cultural experiences. Includes JR Pass tips.</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <img alt="user" className="w-6 h-6 rounded-full" src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150" />
                    <span className="font-label text-[11px] text-text-secondary">Alex Chen</span>
                  </div>
                  <div className="flex items-center gap-4 text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" /> <span className="font-label text-[11px]">1.2k</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bookmark className="w-4 h-4" /> <span className="font-label text-[11px]">842</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smaller cards */}
            <div className="col-span-1 bg-surface-canvas rounded-xl border border-border-subtle overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="relative h-32 overflow-hidden border-l-4 border-itinerary-stay">
                <img alt="Cabin" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=400" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] text-text-secondary mb-2 inline-block">Staycation</span>
                  <h4 className="font-title text-xl font-medium text-on-surface mb-1 leading-tight">Coastal Retreat</h4>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1">
                    <BadgeCheck className="w-4 h-4 text-primary" />
                    <span className="font-label text-[11px] text-text-secondary">Sarah J.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 bg-surface-canvas rounded-xl border border-border-subtle overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="relative h-32 overflow-hidden border-l-4 border-itinerary-transit">
                <img alt="Flight" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=400" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] text-text-secondary mb-2 inline-block">Transit Tips</span>
                  <h4 className="font-title text-xl font-medium text-on-surface mb-1 leading-tight">Mastering European Rail</h4>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1">
                    <span className="font-label text-[11px] text-text-secondary">Marcus T.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
export default Community;
