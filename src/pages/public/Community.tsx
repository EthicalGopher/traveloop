import { useState, useEffect } from "react";
import { 
  Upload, Flame, Mountain, PiggyBank, Baby, Utensils, 
  SlidersHorizontal, Star, Heart, Bookmark, X, MapPin, 
  Info, Plus, Loader2
} from "lucide-react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import CreateTripModal from "./components/CreateTripModal";
import SelectTripModal from "./components/SelectTripModal";
import { motion, AnimatePresence } from "framer-motion";

export function Community() {
  useAuth();
  const [selectedDest, setSelectedDest] = useState<any | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [publicTrips, setPublicTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicTrips = async () => {
    try {
      const data = await api("/community/trips");
      setPublicTrips(data);
    } catch (err) {
      console.error("Failed to fetch public trips:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicTrips();
  }, []);

  const openSelectTrip = () => {
    setIsSelectModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-surface-background">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
        <div className="max-w-[1280px] mx-auto w-full">
          {/* Share Your Trip Hero Section */}
          <section className="mb-8 rounded-2xl overflow-hidden relative min-h-[350px] flex items-center shadow-md">
            <img alt="Travel hero" className="absolute inset-0 w-full h-full object-cover z-0" src="https://images.unsplash.com/photo-1518599427670-6da42296d9da?q=80&w=2000&auto=format&fit=crop" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-10"></div>
            <div className="relative z-20 p-8 md:p-12 text-white max-w-2xl">
              <h2 className="font-display text-5xl md:text-6xl font-black mb-4 italic tracking-tight uppercase">Share Your Journey</h2>
              <p className="font-body text-lg text-white/80 mb-8 max-w-lg">Inspire the Traveloop community. Upload your detailed itineraries, hidden gems, and travel tips to help others plan their perfect trip.</p>
              <button 
                onClick={openSelectTrip}
                className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label text-sm font-black uppercase tracking-widest hover:bg-surface-tint transition-all shadow-lg flex items-center gap-3 active:scale-95"
              >
                <Upload className="w-5 h-5" />
                Share Itinerary
              </button>
            </div>
          </section>

          {/* Filters */}
          <div className="flex items-center gap-4 overflow-x-auto pb-4 mb-8 hide-scrollbar">
            <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-on-primary font-label text-xs font-bold whitespace-nowrap shadow-sm">
              <Flame className="w-4 h-4 fill-current" /> Trending
            </button>
            {[
              { icon: Mountain, label: "Adventure" },
              { icon: PiggyBank, label: "Budget" },
              { icon: Baby, label: "Family" },
              { icon: Utensils, label: "Culinary" }
            ].map(filter => (
              <button key={filter.label} className="flex items-center gap-2 px-6 py-2 rounded-full bg-surface-canvas text-on-surface-variant border border-border-subtle hover:border-primary font-label text-xs font-bold whitespace-nowrap transition-all shadow-xs">
                <filter.icon className="w-4 h-4" /> {filter.label}
              </button>
            ))}
            <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-surface-canvas text-on-surface-variant border border-border-subtle hover:bg-primary font-label text-xs font-bold whitespace-nowrap transition-all shadow-xs">
              <SlidersHorizontal className="w-4 h-4" /> More Filters
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline text-3xl font-black text-on-surface italic uppercase tracking-tighter">Community Stories</h3>
            <span className="text-sm font-label font-bold text-text-secondary">{publicTrips.length} results found</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : publicTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
              {publicTrips.map((dest) => (
                <motion.div 
                  key={dest.id} 
                  layoutId={`dest-${dest.id}`}
                  onClick={() => setSelectedDest(dest)}
                  whileHover={{ y: -10 }}
                  className="bg-surface-canvas rounded-[2.5rem] border border-border-subtle overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col h-[450px]"
                >
                  <div className="relative h-2/3 overflow-hidden">
                    <img alt={dest.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={dest.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"} />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-primary text-on-primary px-4 py-1 rounded-full text-[10px] font-black uppercase italic tracking-widest shadow-sm">
                        {dest.category || "Adventure"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-headline text-2xl font-black text-on-surface truncate pr-4 uppercase">{dest.title}</h4>
                        <span className="text-primary font-display font-bold">4.9</span>
                      </div>
                      <p className="font-body text-sm text-text-secondary line-clamp-2 leading-relaxed italic">Explore the hidden gems of {dest.destination}.</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border-subtle/50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-black text-xs border border-border-subtle">
                          {dest.title[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label text-[10px] font-black uppercase text-on-surface">Explore User</span>
                          <span className="font-body text-[10px] text-text-secondary">{new Date(dest.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-text-secondary">
                        <button className="p-2 hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:text-primary transition-colors">
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-surface-canvas rounded-[3rem] border-2 border-dashed border-border-subtle">
               <Upload className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-20" />
               <p className="text-text-secondary italic font-body">No community stories yet. Be the first to share!</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedDest && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDest(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              layoutId={`dest-${selectedDest.id}`}
              className="relative bg-surface-canvas w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedDest(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-all shadow-lg"
              >
                <X size={24} />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img src={selectedDest.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"} alt={selectedDest.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 p-8 md:p-12 flex flex-col h-full overflow-y-auto custom-scrollbar">
                <div className="mb-8">
                  <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase italic tracking-widest mb-4 inline-block">
                    {selectedDest.category || "Adventure"}
                  </span>
                  <h2 className="font-display text-4xl md:text-5xl font-black text-on-surface mb-2 leading-tight uppercase italic">{selectedDest.title}</h2>
                  <div className="flex items-center gap-6 mt-4">
                     <div className="flex items-center gap-2 text-yellow-500">
                       <Star size={20} fill="currentColor" />
                       <span className="font-display text-xl font-bold">4.9</span>
                     </div>
                     <div className="flex items-center gap-2 text-text-secondary">
                        <MapPin size={20} />
                        <span className="font-label text-sm font-bold uppercase tracking-wider">{selectedDest.destination}</span>
                     </div>
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  <section>
                    <h3 className="font-headline text-lg font-black text-on-surface uppercase mb-3 flex items-center gap-2 italic">
                       <Info size={18} className="text-primary" />
                       Itinerary Highlights
                    </h3>
                    <div className="space-y-4">
                      {selectedDest.itineraries?.slice(0, 3).map((item: any, i: number) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-surface-background border border-border-subtle/50">
                           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">{i+1}</div>
                           <div>
                              <p className="font-headline text-sm font-bold text-text-primary uppercase">{item.activity}</p>
                              <p className="font-body text-xs text-text-secondary">{item.location}</p>
                           </div>
                        </div>
                      ))}
                      {(!selectedDest.itineraries || selectedDest.itineraries.length === 0) && (
                        <p className="font-body text-sm text-text-secondary italic opacity-60">Full itinerary details available upon adding to your trips.</p>
                      )}
                    </div>
                  </section>

                  <section className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 mt-8 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16"></div>
                     <h4 className="font-headline text-base font-black text-primary uppercase mb-2 italic">Ready for this adventure?</h4>
                     <p className="font-body text-sm text-text-secondary mb-6">Create a personalized trip based on this community favorite and start planning today.</p>
                     <button 
                        onClick={() => {
                          setIsCreateModalOpen(true);
                        }}
                        className="w-full bg-primary text-on-primary py-4 rounded-xl font-label text-sm font-black uppercase tracking-widest hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-[0.98]"
                     >
                       <Plus size={20} />
                       Add to My Trips
                     </button>
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CreateTripModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        initialPlace={selectedDest?.destination || ""}
      />

      <SelectTripModal 
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        onShared={fetchPublicTrips}
      />
    </div>
  );
}
export default Community;
