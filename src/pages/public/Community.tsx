import { useState, useEffect, useMemo } from "react";
import { 
  Upload, Flame, 
  Star, X, MapPin, 
  Info, Plus, Loader2, Map as MapIcon, Search, ChevronDown, ListFilter
} from "lucide-react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import { categories } from "../../data/travelData";
import CreateTripModal from "./components/CreateTripModal";
import SelectTripModal from "./components/SelectTripModal";
import { motion, AnimatePresence } from "framer-motion";
import { CommunityCard } from "./components/CommunityCard";

interface ItineraryItem {
  activity: string;
  location: string;
}

interface User {
  full_name: string;
}

interface PublicTrip {
  id: string | number;
  user_id: number;
  user: User;
  title: string;
  destination: string;
  image?: string;
  category?: string;
  rating: number;
  likes_count: number;
  bookmarks_count: number;
  created_at: string;
  itineraries?: ItineraryItem[];
  map_url?: string;
  description?: string;
}

export function Community() {
  useAuth();
  const [selectedDest, setSelectedDest] = useState<PublicTrip | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [publicTrips, setPublicTrips] = useState<PublicTrip[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search, Filter and Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const fetchPublicTrips = async () => {
    try {
      const data = await api("/community/trips");
      setPublicTrips(data);
    } catch {
      console.error("Failed to fetch public trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicTrips();
  }, []);

  const handleLike = async (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    try {
      const res = await api(`/community/trips/${id}/like`, { method: "POST" });
      setPublicTrips(prev => prev.map(t => t.id === id ? { ...t, likes_count: res.likes_count } : t));
    } catch {
      alert("Failed to like trip");
    }
  };

  const handleBookmark = async (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    try {
      const res = await api(`/community/trips/${id}/bookmark`, { method: "POST" });
      setPublicTrips(prev => prev.map(t => t.id === id ? { ...t, bookmarks_count: res.bookmarks_count } : t));
    } catch {
      alert("Failed to bookmark trip");
    }
  };

  const openSelectTrip = () => {
    setIsSelectModalOpen(true);
  };

  // Filtered and Sorted Community Stories Logic
  const processedStories = useMemo(() => {
    // 1. Filter
    let result = publicTrips.filter(story => {
      const matchesCategory = selectedCategory === "All" || story.category === selectedCategory;
      const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           story.destination.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // 2. Sort
    switch (sortBy) {
      case "Popularity":
        result = [...result].sort((a, b) => b.likes_count - a.likes_count);
        break;
      case "Bookmarks":
        result = [...result].sort((a, b) => b.bookmarks_count - a.bookmarks_count);
        break;
      case "Rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Newest (Default)
        result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, publicTrips]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-surface-background">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
        <div className="max-w-[1280px] mx-auto w-full pb-20">
          {/* Share Your Trip Hero Section */}
          <section className="mb-10 rounded-[3rem] overflow-hidden relative min-h-[400px] flex items-center shadow-2xl group/hero">
            <img alt="Travel community" className="absolute inset-0 w-full h-full object-cover z-0 group-hover/hero:scale-105 transition-transform duration-[3s] ease-out" src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10"></div>
            
            {/* Animated Mesh Gradient Overlay */}
            <div className="absolute inset-0 z-10 opacity-30 mix-blend-overlay pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/40 rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-20 p-10 md:p-16 text-white max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-5xl md:text-7xl font-black mb-6 italic tracking-tighter uppercase leading-[0.9]">
                  Explore the <br />
                  <span className="text-primary-fixed">Unexplored</span>
                </h2>
                <p className="font-body text-xl text-white/70 mb-10 max-w-lg italic leading-relaxed">
                  Join a global community of travelers. Discover hidden gems, share your legendary routes, and inspire your next great adventure.
                </p>
                <button 
                  onClick={openSelectTrip}
                  className="bg-primary text-on-primary px-10 py-5 rounded-2xl font-label text-sm font-black uppercase tracking-[0.2em] hover:bg-surface-tint hover:shadow-primary/40 transition-all shadow-xl flex items-center gap-4 active:scale-95 group"
                >
                  <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  Share Your Story
                </button>
              </motion.div>
            </div>
          </section>

          {/* Search & Sort Bar - Just below banner */}
          <section className="relative group max-w-4xl mx-auto w-full -mt-12 z-20 px-4 md:px-0 mb-16">
            <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
            <div className="relative bg-surface-canvas/80 backdrop-blur-2xl rounded-[2.5rem] p-3 shadow-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-2">
              <div className="flex-1 flex items-center px-8 gap-4 w-full">
                <Search className="text-primary w-6 h-6" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where to next? Search stories..."
                  className="w-full py-5 text-xl font-headline font-bold focus:outline-none placeholder:text-text-secondary/40 text-text-primary bg-transparent"
                />
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto px-3 sm:px-0 sm:pr-5 border-t sm:border-t-0 sm:border-l border-border-subtle/30 pt-3 sm:pt-0">
                 <div className="relative flex-1 sm:flex-none min-w-[160px]">
                    <ListFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-surface-background/50 border border-border-subtle/50 rounded-2xl pl-11 pr-10 py-3.5 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/50 outline-none appearance-none cursor-pointer"
                    >
                      <option>Newest</option>
                      <option>Popularity</option>
                      <option>Bookmarks</option>
                      <option>Rating</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                 </div>
              </div>
            </div>
          </section>

          {/* Filters */}
          <div className="flex items-center gap-4 overflow-x-auto pb-6 mb-12 no-scrollbar px-2">
            <button 
              onClick={() => setSelectedCategory("All")}
              className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-label text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all shadow-md border ${
                selectedCategory === "All" 
                  ? 'bg-primary text-on-primary border-primary shadow-primary/20' 
                  : 'bg-surface-canvas text-text-primary border-border-subtle hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              <Flame className={`w-4 h-4 ${selectedCategory === "All" ? 'fill-current' : ''}`} /> Trending
            </button>
            {categories.filter(c => c !== "All").map(category => (
              <button 
                key={category} 
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-label text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all shadow-md border ${
                  selectedCategory === category 
                    ? 'bg-primary text-on-primary border-primary shadow-primary/20' 
                    : 'bg-surface-canvas text-text-primary border-border-subtle hover:border-primary/40 hover:bg-primary/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-end justify-between mb-10 px-2">
            <div className="space-y-1">
              <h3 className="font-headline text-4xl font-black text-on-surface italic uppercase tracking-tighter leading-none">Community Stories</h3>
              <p className="font-body text-sm text-text-secondary opacity-60">Verified itineraries from our global explorers</p>
            </div>
            <span className="text-[10px] font-black font-label text-primary uppercase tracking-[0.2em] bg-primary/5 px-6 py-2.5 rounded-2xl border border-primary/20">
              {processedStories.length} stories
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : processedStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
              {processedStories.map((dest) => (
                <CommunityCard 
                  key={dest.id}
                  dest={dest}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onClick={() => setSelectedDest(dest)}
                />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-surface-canvas rounded-[4rem] border-2 border-dashed border-border-subtle flex flex-col items-center">
               <Search className="w-16 h-16 text-text-secondary mb-6 opacity-10" />
               <h3 className="font-headline text-2xl font-black text-on-surface uppercase opacity-30 italic">No community stories found</h3>
               <p className="font-body text-sm text-text-secondary mt-2 opacity-50">Try different keywords or be the first to share an itinerary!</p>
               <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSortBy("Newest"); }}
                className="mt-8 text-primary font-label text-xs font-black uppercase tracking-[0.2em] hover:underline"
              >
                Reset All Filters
              </button>
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
              className="relative bg-surface-canvas w-full max-w-6xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedDest(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-all shadow-lg"
              >
                <X size={24} />
              </button>

              <div className="w-full md:w-1/2 h-80 md:h-auto overflow-hidden">
                <img src={selectedDest.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"} alt={selectedDest.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 p-10 md:p-14 flex flex-col h-full overflow-y-auto custom-scrollbar">
                <div className="mb-10">
                  <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic tracking-widest mb-4 inline-block">
                    {selectedDest.category || "Adventure"}
                  </span>
                  <h2 className="font-display text-4xl md:text-5xl font-black text-on-surface mb-3 leading-tight uppercase italic">{selectedDest.title}</h2>
                  <div className="flex items-center gap-8 mt-6">
                     <div className="flex items-center gap-2 text-yellow-500">
                       <Star size={24} fill="currentColor" />
                       <span className="font-display text-2xl font-bold">{selectedDest.rating.toFixed(1)}</span>
                     </div>
                     <div className="flex items-center gap-2 text-text-secondary">
                        <MapPin size={24} />
                        <span className="font-label text-sm font-bold uppercase tracking-wider">{selectedDest.destination}</span>
                     </div>
                  </div>
                </div>

                <div className="space-y-8 flex-1">
                  <section>
                    <h3 className="font-headline text-lg font-black text-on-surface uppercase mb-4 flex items-center gap-3 italic">
                       <Info size={20} className="text-primary" />
                       Journey Breakdown
                    </h3>
                    <div className="space-y-4">
                      {selectedDest.itineraries?.slice(0, 5).map((item, i) => (
                        <div key={i} className="flex gap-5 p-5 rounded-[1.5rem] bg-surface-background border border-border-subtle/50 shadow-sm">
                           <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm shrink-0 border border-primary/20">{i+1}</div>
                           <div className="min-w-0">
                              <p className="font-headline text-base font-bold text-text-primary uppercase truncate">{item.activity}</p>
                              <p className="font-body text-xs text-text-secondary mt-0.5 truncate">{item.location}</p>
                           </div>
                        </div>
                      ))}
                      {(!selectedDest.itineraries || selectedDest.itineraries.length === 0) && (
                        <p className="font-body text-sm text-text-secondary italic opacity-60">Full itinerary details available upon adding to your trips.</p>
                      )}
                    </div>
                  </section>

                  <section className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/10 mt-10 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20"></div>
                     <h4 className="font-headline text-xl font-black text-primary uppercase mb-3 italic">Plan This Adventure</h4>
                     <p className="font-body text-base text-text-secondary mb-8 leading-relaxed">Create a personalized trip based on this community favorite and start mapping your path today.</p>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={() => {
                              setIsCreateModalOpen(true);
                            }}
                            className="flex-1 bg-primary text-on-primary py-4 rounded-xl font-label text-sm font-black uppercase tracking-widest hover:shadow-primary/40 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 active:scale-[0.98]"
                        >
                          <Plus size={22} />
                          Add to My Trips
                        </button>
                        <a 
                            href={selectedDest.map_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedDest.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 bg-white text-[#1a73e8] border border-[#1a73e8]/30 py-4 rounded-xl font-label text-sm font-black uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-sm"
                        >
                          <MapIcon size={22} />
                          Map
                        </a>
                     </div>
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
