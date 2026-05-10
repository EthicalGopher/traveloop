import { useState, useEffect, useMemo } from "react";
import { 
  Search, ArrowRight, 
  Star, Heart, 
  PlaneTakeoff, Plus, MapPin, MapIcon, ChevronDown, ListFilter
} from "lucide-react";
import { useAuth } from "../../utils/auth";
import { api } from "../../utils/api";
import { featuredDestinations, categories } from "../../data/travelData";
import { motion } from "framer-motion";
import CreateTripModal from "./components/CreateTripModal";

interface Trip {
  id: number;
  title: string;
  destination: string;
  image: string;
  status: string;
  map_url?: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState("");
  
  // Search, Filter and Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await api("/trips");
        setTrips(data);
      } catch {
        console.error("Failed to fetch trips");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const openCreateModal = (placeName: string = "") => {
    setSelectedPlace(placeName);
    setIsModalOpen(true);
  };

  const displayName = user?.full_name?.split(' ')[0] || "Traveler";

  // Helper to parse price string for sorting
  const parsePrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
  };

  // Filtered and Sorted Destinations Logic
  const processedDestinations = useMemo(() => {
    // 1. Filter
    let result = featuredDestinations.filter(dest => {
      const matchesCategory = selectedCategory === "All" || dest.category === selectedCategory;
      const matchesSearch = dest.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           dest.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // 2. Sort
    switch (sortBy) {
      case "Price: Low to High":
        result = [...result].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case "Price: High to Low":
        result = [...result].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case "Rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Recommended / Default
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="max-w-[1280px] mx-auto p-4 md:p-6 flex flex-col gap-6 w-full pb-20">
        {/* Greeting (Desktop) */}
        <div className="hidden md:block">
          <h1 className="font-headline text-3xl font-bold text-text-primary">Welcome back, {displayName}!</h1>
          <p className="font-body text-sm text-text-secondary mt-1">Ready to plan your next adventure?</p>
        </div>

        {/* Hero Banner: Featured Trip */}
        <section className="relative w-full h-[300px] md:h-[400px] rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col justify-end p-6 md:p-12 group" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="relative z-10 text-white max-w-2xl">
            <span className="inline-block px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full font-label text-[10px] font-black uppercase tracking-widest mb-4 text-on-primary">Featured Destination</span>
            <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-4 leading-tight italic uppercase">Santorini, Greece</h2>
            <p className="font-body text-base text-white/80 mb-8 max-w-md line-clamp-2 md:line-clamp-none italic">Experience the breathtaking sunsets and iconic white architecture overlooking the Aegean Sea.</p>
            <button 
              onClick={() => openCreateModal("Santorini, Greece")}
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-label text-sm font-black uppercase tracking-widest hover:bg-surface-tint transition-all shadow-lg flex items-center gap-3 w-max cursor-pointer active:scale-95"
            >
              <span>Plan this trip</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Search & Sort Feature - Just below banner */}
        <section className="relative group max-w-4xl mx-auto w-full -mt-10 z-20 px-4 md:px-0">
          <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-surface-canvas rounded-[2rem] p-2 shadow-2xl border border-border-subtle flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 flex items-center px-6 gap-3 w-full">
              <Search className="text-primary w-6 h-6" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where do you want to wander?"
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
                    <option>Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
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

        {/* My Trips Quick View - Only show if trips exist */}
        {(loading || trips.length > 0) && (
          <section className="space-y-6 mt-8">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-2xl font-black text-on-surface italic uppercase tracking-tighter">My Active Trips</h2>
              <button className="text-primary font-label text-xs font-black uppercase tracking-widest hover:underline cursor-pointer">View All</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-28 bg-surface-canvas animate-pulse rounded-2xl border border-border-subtle"></div>
                ))
              ) : (
                trips.map(trip => (
                  <div key={trip.id} className="bg-surface-canvas p-5 rounded-2xl border border-border-subtle shadow-sm flex items-center gap-5 hover:border-primary transition-all cursor-pointer group hover:shadow-md">
                    <div className="w-20 h-20 rounded-xl bg-surface-container-high flex items-center justify-center overflow-hidden shrink-0 border border-border-subtle">
                      {trip.image ? (
                        <img src={trip.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      ) : (
                        <PlaneTakeoff className="text-primary w-10 h-10" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-headline text-base font-bold text-text-primary truncate uppercase">{trip.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin size={12} className="text-text-secondary" />
                        <p className="font-body text-[10px] text-text-secondary truncate font-bold uppercase tracking-wider">{trip.destination}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.1em] shadow-sm ${
                          trip.status === 'ongoing' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Exploration Section */}
        <section className="space-y-8 mt-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="font-headline text-3xl font-black text-on-surface italic uppercase tracking-tighter">Discover Destinations</h2>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-label text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer shadow-sm border ${
                    selectedCategory === category 
                      ? 'bg-primary text-on-primary border-primary shadow-primary/20' 
                      : 'bg-surface-canvas text-text-primary border-border-subtle hover:border-primary/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {processedDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {processedDestinations.map((dest) => (
                <motion.div
                  key={dest.id}
                  whileHover={{ y: -10 }}
                  className="bg-surface-canvas rounded-[2.5rem] overflow-hidden border border-border-subtle shadow-sm group hover:shadow-2xl transition-all cursor-pointer flex flex-col h-[500px]"
                >
                  <div className="relative h-2/3 overflow-hidden shrink-0">
                    <img 
                      src={dest.image} 
                      alt={dest.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black text-primary uppercase italic tracking-widest shadow-sm">
                        {dest.category}
                      </span>
                    </div>
                    <button className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-md">
                      <Heart size={20} />
                    </button>
                  </div>
                  <div className="p-8 flex flex-col flex-1 gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-headline text-2xl font-black text-text-primary uppercase truncate pr-4">{dest.title}</h3>
                      <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-display text-xs font-black text-on-surface">{dest.rating}</span>
                      </div>
                    </div>
                    <p className="font-body text-sm text-text-secondary line-clamp-2 leading-relaxed italic opacity-80">
                      {dest.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-border-subtle/50 gap-4">
                      <div className="min-w-0">
                        <span className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] block mb-1">Starting from</span>
                        <p className="text-2xl font-display font-black text-primary truncate">{dest.price}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <a 
                          href={dest.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 h-12 bg-[#1a73e8]/10 text-[#1a73e8] rounded-xl hover:bg-[#1a73e8] hover:text-white transition-all flex items-center justify-center border border-[#1a73e8]/20 shadow-sm"
                          title="View on Google Maps"
                        >
                           <MapIcon size={20} />
                        </a>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openCreateModal(dest.title); }}
                          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95"
                        >
                          <Plus size={18} />
                          <span>Add</span>
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
              <h3 className="font-headline text-2xl font-black text-on-surface uppercase opacity-30 italic">No destinations matched your search</h3>
              <p className="font-body text-sm text-text-secondary mt-2 opacity-50">Try using different keywords or exploring another category.</p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSortBy("Recommended"); }}
                className="mt-8 text-primary font-label text-xs font-black uppercase tracking-[0.2em] hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      </div>

      <CreateTripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialPlace={selectedPlace}
      />
    </div>
  );
}

export default Dashboard;
