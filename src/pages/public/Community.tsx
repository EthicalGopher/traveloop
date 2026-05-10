import { useState, useEffect, useMemo } from "react";
import { 
  Upload, Flame, 
  Star, Heart, Bookmark, X, MapPin, 
  Info, Plus, Loader2, Map as MapIcon, Search, ChevronDown, ListFilter
} from "lucide-react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import { categories } from "../../data/travelData";
import CreateTripModal from "./components/CreateTripModal";
import SelectTripModal from "./components/SelectTripModal";
import { motion, AnimatePresence } from "framer-motion";

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
          <section className="mb-8 rounded-[2.5rem] overflow-hidden relative min-h-[350px] flex items-center shadow-md">
            <img alt="Travel hero" className="absolute inset-0 w-full h-full object-cover z-0" src="https://images.unsplash.com/photo-1518599427670-6da42296d9da?q=80&w=2000&auto=format&fit=crop" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-10"></div>
            <div className="relative z-20 p-8 md:p-12 text-white max-w-2xl">
              <h2 className="font-display text-5xl md:text-6xl font-black mb-4 italic tracking-tight uppercase">Share Your Journey</h2>
              <p className="font-body text-lg text-white/80 mb-8 max-w-lg italic leading-relaxed">Inspire the Traveloop community. Upload your detailed itineraries, hidden gems, and travel tips to help others plan their perfect trip.</p>
              <button 
                onClick={openSelectTrip}
                className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label text-sm font-black uppercase tracking-widest hover:bg-surface-tint transition-all shadow-lg flex items-center gap-3 active:scale-95"
              >
                <Upload className="w-5 h-5" />
                Share Itinerary
              </button>
            </div>
          </section>

          {/* Search & Sort Bar - Just below banner */}
          <section className="relative group max-w-4xl mx-auto w-full -mt-10 z-20 px-4 md:px-0 mb-12">
            <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-surface-canvas rounded-[2rem] p-2 shadow-2xl border border-border-subtle flex flex-col sm:flex-row items-center gap-2">
              <div className="flex-1 flex items-center px-6 gap-3 w-full">
                <Search className="text-primary w-6 h-6" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search community stories..."
                  className="w-full py-4 text-lg font-headline font-bold focus:outline-none placeholder:text-text-secondary/30 text-text-primary bg-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto px-2 sm:px-0 sm:pr-4 border-t sm:border-t-0 sm:border-l border-border-subtle/50 pt-2 sm:pt-0">
                 <div className="relative flex-1 sm:flex-none min-w-[140px]">
                    <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-surface-background border border-border-subtle rounded-xl pl-9 pr-8 py-2.5 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                    >
                      <option>Newest</option>
                      <option>Popularity</option>
                      <option>Bookmarks</option>
                      <option>Rating</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                 </div>
                 <button className="bg-primary text-on-primary px-8 py-2.5 rounded-xl font-label text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg hidden md:block">
                  Search
                 </button>
              </div>
            </div>
          </section>

          {/* Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
            <button 
              onClick={() => setSelectedCategory("All")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-label text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-sm border ${
                selectedCategory === "All" 
                  ? 'bg-primary text-on-primary border-primary' 
                  : 'bg-surface-canvas text-text-primary border-border-subtle hover:border-primary/50'
              }`}
            >
              <Flame className="w-4 h-4 fill-current" /> Trending
            </button>
            {categories.filter(c => c !== "All").map(category => (
              <button 
                key={category} 
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-label text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-sm border ${
                  selectedCategory === category 
                    ? 'bg-primary text-on-primary border-primary' 
                    : 'bg-surface-canvas text-text-primary border-border-subtle hover:border-primary/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline text-3xl font-black text-on-surface italic uppercase tracking-tighter">Community Stories</h3>
            <span className="text-xs font-black font-label text-primary uppercase tracking-widest bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
              {processedStories.length} results found
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : processedStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {processedStories.map((dest) => (
                <motion.div 
                  key={dest.id} 
                  layoutId={`dest-${dest.id}`}
                  onClick={() => setSelectedDest(dest)}
                  whileHover={{ y: -10 }}
                  className="bg-surface-canvas rounded-[2.5rem] border border-border-subtle overflow-hidden shadow-sm hover:shadow-2xl transition-all group cursor-pointer flex flex-col h-[500px]"
                >
                  <div className="relative h-2/3 overflow-hidden shrink-0">
                    <img alt={dest.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={dest.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"} />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center justify-center shadow-md gap-1.5 border border-white/20">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-black text-on-surface">{dest.rating.toFixed(1)}</span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic tracking-widest shadow-lg">
                        {dest.category || "Adventure"}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-headline text-2xl font-black text-on-surface truncate pr-4 uppercase">{dest.title}</h4>
                      </div>
                      <p className="font-body text-sm text-text-secondary line-clamp-2 leading-relaxed italic opacity-80">Explore {dest.destination}.</p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-border-subtle/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs border border-primary/20 shadow-sm shrink-0 uppercase">
                          {dest.user?.full_name ? dest.user.full_name[0] : "?"}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label text-[10px] font-black uppercase text-on-surface truncate">{dest.user?.full_name || "Traveler"}</span>
                          <span className="font-body text-[10px] text-text-secondary">{new Date(dest.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-text-secondary">
                        <button 
                          onClick={(e) => handleLike(e, dest.id)}
                          className={`flex items-center gap-1.5 transition-all group/btn hover:scale-110 ${dest.likes_count > 0 ? 'text-red-500' : ''}`}
                        >
                          <Heart className={`w-5 h-5 ${dest.likes_count > 0 ? 'fill-red-500 shadow-lg' : ''}`} />
                          <span className="text-[10px] font-bold">{dest.likes_count}</span>
                        </button>
                        <button 
                          onClick={(e) => handleBookmark(e, dest.id)}
                          className={`flex items-center gap-1.5 transition-all group/btn hover:scale-110 ${dest.bookmarks_count > 0 ? 'text-primary' : ''}`}
                        >
                          <Bookmark className={`w-5 h-5 ${dest.bookmarks_count > 0 ? 'fill-primary shadow-lg' : ''}`} />
                          <span className="text-[10px] font-bold">{dest.bookmarks_count}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
