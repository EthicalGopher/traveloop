import React from "react";
import { Search, Map, Calendar, Settings, Compass, MapPin, Search as SearchIcon, ArrowRight, Save, PlayCircle, Filter } from "lucide-react";

export function Builder() {
  return (
    <div className="flex h-full overflow-hidden bg-surface-canvas">
      {/* Left Sidebar for Builder */}
      <div className="hidden border-r border-border-subtle bg-surface-background w-80 lg:flex flex-col flex-shrink-0 z-10">
        <div className="p-6 border-b border-border-subtle">
          <input className="w-full bg-transparent font-headline text-3xl font-bold text-on-surface focus:outline-none mb-1" defaultValue="European Summer" type="text" />
          <p className="font-body text-sm text-text-secondary flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Aug 12 - Aug 26, 2024
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-surface-canvas border border-border-subtle rounded-xl p-4 shadow-sm relative group cursor-grab active:cursor-grabbing">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-itinerary-stay rounded-l-xl"></div>
            <div className="flex justify-between items-start pl-2">
              <div>
                <span className="font-label text-[11px] font-bold text-itinerary-stay uppercase tracking-wider block mb-1">Paris • 4 Nights</span>
                <h3 className="font-title text-xl font-medium text-on-surface">Le Marais Stay</h3>
              </div>
            </div>
            <p className="font-body text-sm text-on-surface-variant mt-2 mb-3">Checking into the boutique hotel near the Seine.</p>
            <div className="flex gap-2">
              <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] font-medium text-text-secondary">Accommodation</span>
              <span className="bg-surface-container px-2 py-1 rounded font-label text-[11px] font-medium text-text-secondary">$850</span>
            </div>
          </div>
          
          <div className="bg-surface-container-low border border-border-subtle border-dashed p-4 rounded-xl flex flex-col items-center justify-center text-on-surface-variant cursor-pointer hover:bg-surface-container transition-colors min-h-[100px]">
             <Compass className="w-6 h-6 mb-2 text-text-secondary" />
             <span className="font-body text-sm font-medium">Drop Destination Here</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface-canvas relative h-full">
        <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto w-full max-w-[1280px] mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-title text-2xl font-medium text-on-surface">Discover Places</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-surface-canvas border border-border-subtle rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-surface-container transition-colors shadow-sm">
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>
          
          {/* Explore Map/Grid view */}
          <div className="relative w-full h-[300px] bg-surface-container-low rounded-xl border border-border-subtle overflow-hidden flex items-center justify-center mb-8 shadow-inner">
             {/* Imagine Map Component here */}
             <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000')"}}></div>
             <div className="relative z-10 flex flex-col items-center bg-surface-canvas/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-border-subtle text-center max-w-sm">
                <MapPin className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-title text-xl font-medium text-on-surface mb-2">Map View Active</h3>
                <p className="font-body text-sm text-on-surface-variant">Drag items directly from the map onto your timeline.</p>
             </div>
          </div>
          
          <h3 className="font-title text-xl font-medium text-on-surface mb-4">Recommended for your route</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
            {[1, 2, 3, 4].map((i) => (
               <div key={i} className="bg-surface-canvas rounded-xl border border-border-subtle overflow-hidden flex flex-col group cursor-grab hover:shadow-md transition-shadow">
                  <div className="h-32 bg-surface-container relative">
                     <img src={`https://images.unsplash.com/photo-1541300613939-71366b37c92e?q=80&w=600&h=400&sig=${i}`} className="w-full h-full object-cover" alt="Place" />
                  </div>
                  <div className="p-3">
                    <h4 className="font-body text-sm font-medium text-on-surface">Eiffel Tower Tour</h4>
                    <p className="font-label text-[11px] text-text-secondary mt-1">2-3 Hours • Activity</p>
                  </div>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
