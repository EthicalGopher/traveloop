import { Upload, Flame, Mountain, PiggyBank, Baby, Utensils, SlidersHorizontal, Star, Heart, Bookmark, BadgeCheck } from "lucide-react";
import { featuredDestinations } from "../../data/travelData";
import { useAuth } from "../../utils/auth";

export function Community() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
        <div className="max-w-[1280px] mx-auto w-full">
          {/* Share Your Trip Hero Section */}
          <section className="mb-8 rounded-xl overflow-hidden relative min-h-[300px] flex items-center shadow-sm">
            <img alt="Travel hero" className="absolute inset-0 w-full h-full object-cover z-0" src="https://images.unsplash.com/photo-1518599427670-6da42296d9da?q=80&w=2000&auto=format&fit=crop" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
            <div className="relative z-20 p-6 md:p-8 text-white max-w-2xl">
              <h2 className="font-display text-5xl font-bold mb-3">Share Your Journey</h2>
              <p className="font-body text-base text-white/90 mb-6 opacity-90">Inspire the Traveloop community. Upload your detailed itineraries, hidden gems, and travel tips to help others plan their perfect trip.</p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openCreateTrip'))}
                className="bg-primary text-on-primary px-8 py-3 rounded-lg font-label text-sm font-semibold hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-3"
              >
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {featuredDestinations.map((dest) => (
              <div key={dest.id} className="bg-surface-canvas rounded-xl border border-border-subtle overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-[400px]">
                <div className="relative h-2/3 overflow-hidden">
                  <img alt={dest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={dest.image} />
                  <div className="absolute top-3 right-3 bg-surface-background/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                    <span className="font-label text-[11px] font-medium text-on-surface">{dest.rating}</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {dest.category}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-headline text-xl font-bold text-on-surface mb-1 line-clamp-1">{dest.title}</h4>
                    <p className="font-body text-sm text-on-surface-variant line-clamp-2">{dest.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-[10px]">
                        {dest.title[0]}
                      </div>
                      <span className="font-label text-[11px] text-text-secondary">Explore User</span>
                    </div>
                    <div className="flex items-center gap-4 text-text-secondary">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" /> <span className="font-label text-[11px]">42</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark className="w-4 h-4" /> <span className="font-label text-[11px]">12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Community;
