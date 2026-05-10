import { Star, Bookmark, MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";

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

interface CommunityCardProps {
  dest: PublicTrip;
  onLike: (e: React.MouseEvent, id: string | number) => void;
  onBookmark: (e: React.MouseEvent, id: string | number) => void;
  onClick: () => void;
}

export const CommunityCard = ({ dest, onLike, onBookmark, onClick }: CommunityCardProps) => {
  return (
    <motion.div 
      layoutId={`dest-${dest.id}`}
      onClick={onClick}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-surface-canvas rounded-[2.5rem] border border-border-subtle/60 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-all group cursor-pointer flex flex-col h-[500px] relative"
    >
      {/* Rating Badge - Top Left */}
      <div className="absolute top-5 left-5 z-20 bg-white/60 backdrop-blur-md rounded-2xl px-3 py-1.5 flex items-center gap-2 border border-white/40 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
        <span className="text-[10px] font-black text-on-surface uppercase tracking-tight">
          {dest.rating > 0 ? dest.rating.toFixed(1) : "New"}
        </span>
      </div>

      {/* Bookmark Button - Top Right */}
      <button 
        onClick={(e) => onBookmark(e, dest.id)}
        className={`absolute top-5 right-5 z-20 w-11 h-11 flex items-center justify-center rounded-2xl backdrop-blur-md border transition-all duration-300 shadow-sm ${
          dest.bookmarks_count > 0 
            ? 'bg-primary text-on-primary border-primary' 
            : 'bg-black/20 text-white border-white/20 hover:bg-black/40'
        }`}
      >
        <Bookmark className={`w-4.5 h-4.5 ${dest.bookmarks_count > 0 ? 'fill-current' : ''}`} />
      </button>

      {/* Image Section */}
      <div className="relative h-[60%] overflow-hidden shrink-0">
        <img 
          alt={dest.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          src={dest.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
        
        <div className="absolute bottom-5 left-6 right-6">
           <span className="bg-primary/20 backdrop-blur-xl text-primary-fixed-dim border border-primary/30 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 inline-block">
            {dest.category || "Adventure"}
          </span>
          <h4 className="font-display text-2xl font-black text-white line-clamp-2 uppercase italic tracking-tight drop-shadow-md leading-tight">
            {dest.title}
          </h4>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 pb-5 flex flex-1 flex-col justify-between bg-surface-canvas relative">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-text-secondary/80">
            <MapPin size={12} className="text-primary/70" />
            <span className="font-label text-[9px] font-black uppercase tracking-[0.15em]">{dest.destination}</span>
          </div>
          <p className="font-body text-xs text-text-secondary line-clamp-2 leading-relaxed opacity-80">
            {dest.description || `Explore the best of ${dest.destination} with this curated community itinerary.`}
          </p>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-border-subtle/30 mt-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-black text-xs border border-primary/10 shadow-inner group-hover:scale-110 transition-transform">
                {dest.user?.full_name ? dest.user.full_name[0].toUpperCase() : "?"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label text-[10px] font-black uppercase text-on-surface truncate tracking-tight">{dest.user?.full_name || "Traveler"}</span>
              <span className="font-body text-[8px] text-text-secondary opacity-50 uppercase tracking-tighter">
                {new Date(dest.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
          
          <button 
            onClick={(e) => onLike(e, dest.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 border ${
              dest.likes_count > 0 
                ? 'bg-rose-50 border-rose-100 text-rose-500 shadow-sm scale-105' 
                : 'bg-surface-background border-border-subtle/50 text-text-secondary hover:border-rose-200 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${dest.likes_count > 0 ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-black tracking-widest">{dest.likes_count}</span>
          </button>
        </div>
      </div>
      
      {/* Decorative inner glow */}
      <div className="absolute inset-0 pointer-events-none border border-white/20 rounded-[2.5rem] mix-blend-overlay"></div>
    </motion.div>
  );
};
