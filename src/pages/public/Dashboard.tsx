import { useState, useEffect } from "react";
import { 
  Search, ArrowRight, 
  SlidersHorizontal, Star, Heart, 
  PlaneTakeoff, Plus 
} from "lucide-react";
import { useAuth } from "../../utils/auth";
import { api } from "../../utils/api";
import { featuredDestinations, categories } from "../../data/travelData";
import { motion } from "framer-motion";
import CreateTripModal from "./components/CreateTripModal";

export function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await api("/trips");
        setTrips(data);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
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

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="max-w-[1280px] mx-auto p-4 md:p-6 flex flex-col gap-6 w-full">
        {/* Greeting & Search (Mobile only) */}
        <div className="md:hidden flex flex-col gap-4">
          <h1 className="font-headline text-2xl font-bold text-text-primary">Welcome back, {displayName}!</h1>
          <div className="flex items-center bg-surface-canvas rounded-xl px-4 py-3 border border-border-subtle focus-within:border-primary focus-within:border-2 transition-all shadow-sm">
            <Search className="text-text-secondary w-5 h-5 mr-2" />
            <input className="bg-transparent border-none outline-none text-body text-sm w-full placeholder-text-secondary text-text-primary focus:ring-0 p-0" placeholder="Where to next?" type="text" />
          </div>
        </div>

        {/* Greeting (Desktop) */}
        <div className="hidden md:block">
          <h1 className="font-headline text-3xl font-bold text-text-primary">Welcome back, {displayName}!</h1>
          <p className="font-body text-sm text-text-secondary mt-1">Ready to plan your next adventure?</p>
        </div>

        {/* Hero Banner: Featured Trip */}
        <section className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-sm flex flex-col justify-end p-6 md:p-10 group" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="relative z-10 text-white max-w-2xl">
            <span className="inline-block px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full font-label text-xs font-medium mb-3 text-on-primary">Featured Destination</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">Santorini, Greece</h2>
            <p className="font-body text-base text-white/90 mb-6 max-w-md line-clamp-2 md:line-clamp-none">Experience the breathtaking sunsets and iconic white architecture overlooking the Aegean Sea.</p>
            <button 
              onClick={() => openCreateModal("Santorini, Greece")}
              className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label text-sm font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2 w-max cursor-pointer"
            >
              <span>Plan this trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* My Trips Quick View - Only show if trips exist */}
        {(loading || trips.length > 0) && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-xl font-bold text-text-primary">My Trips</h2>
              <button className="text-primary font-label text-sm font-bold hover:underline cursor-pointer">View All</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-surface-container-low animate-pulse rounded-xl border border-border-subtle"></div>
                ))
              ) : (
                trips.map(trip => (
                  <div key={trip.id} className="bg-surface-canvas p-4 rounded-xl border border-border-subtle shadow-sm flex items-center gap-4 hover:border-primary transition-all cursor-pointer group">
                    <div className="w-16 h-16 rounded-lg bg-surface-container-high flex items-center justify-center overflow-hidden shrink-0">
                      {trip.image ? (
                        <img src={trip.image} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <PlaneTakeoff className="text-primary w-8 h-8" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-headline text-base font-bold text-text-primary truncate">{trip.title}</h3>
                      <p className="font-body text-xs text-text-secondary truncate">{trip.destination}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                          trip.status === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
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
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-2xl font-bold text-text-primary">Explore Destinations</h2>
            <div className="hidden md:flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-surface-container-high transition-colors">
                <SlidersHorizontal className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-label text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  category === 'All' 
                    ? 'bg-primary text-on-primary shadow-md' 
                    : 'bg-surface-canvas text-text-primary border border-border-subtle hover:border-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((dest) => (
              <motion.div
                key={dest.id}
                whileHover={{ y: -8 }}
                className="bg-surface-canvas rounded-2xl overflow-hidden border border-border-subtle shadow-sm group hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                <div className="relative h-64 overflow-hidden shrink-0">
                  <img 
                    src={dest.image} 
                    alt={dest.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-[10px] font-black text-primary uppercase italic">
                      {dest.category}
                    </span>
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="p-6 flex flex-col flex-1 gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline text-xl font-bold text-text-primary">{dest.title}</h3>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-sm text-text-primary">{dest.rating}</span>
                    </div>
                  </div>
                  <p className="font-body text-sm text-text-secondary line-clamp-2">
                    {dest.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-border-subtle/50">
                    <div>
                      <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Starting from</span>
                      <p className="text-xl font-bold text-primary">{dest.price}</p>
                    </div>
                    <button 
                      onClick={() => openCreateModal(dest.title)}
                      className="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary p-2 md:px-4 md:py-2 rounded-lg font-label text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <Plus size={16} />
                      <span className="hidden sm:inline">Add Trip</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
