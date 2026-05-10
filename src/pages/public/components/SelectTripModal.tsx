import { useState, useEffect } from "react";
import { X, Loader2, Globe, PlaneTakeoff, MapPin, Check } from "lucide-react";
import { api } from "../../../utils/api";

interface SelectTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShared?: () => void;
}

export default function SelectTripModal({ isOpen, onClose, onShared }: SelectTripModalProps) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharingId, setSharingId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTrips();
    }
  }, [isOpen]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const data = await api("/trips");
      setTrips(data);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShare = async (id: number) => {
    setSharingId(id);
    try {
      await api(`/trips/${id}/share`, { method: "PUT" });
      setTrips(prev => prev.map(t => t.id === id ? { ...t, is_public: !t.is_public } : t));
      if (onShared) onShared();
    } catch (err) {
      alert("Failed to update share status");
    } finally {
      setSharingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-surface-canvas w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[80vh] overflow-hidden border border-border-subtle animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border-subtle">
          <div>
            <h2 className="font-display text-2xl font-black text-on-surface uppercase italic">Share Your Journey</h2>
            <p className="font-body text-xs text-text-secondary mt-1">Select which trip you'd like to feature in the community hub.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-surface-container rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="font-label text-xs font-bold text-text-secondary uppercase tracking-widest">Loading your adventures...</p>
            </div>
          ) : trips.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {trips.map((trip) => (
                <div 
                  key={trip.id}
                  className={`p-5 rounded-2xl border transition-all flex items-center gap-4 group ${
                    trip.is_public 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : 'border-border-subtle bg-surface-background hover:border-primary/50'
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border-subtle">
                    <img 
                      src={trip.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"} 
                      className="w-full h-full object-cover" 
                      alt="" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline text-base font-bold text-text-primary truncate">{trip.title}</h3>
                    <div className="flex items-center gap-2 text-text-secondary mt-1">
                      <MapPin size={12} />
                      <span className="font-body text-[10px] font-medium">{trip.destination}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleShare(trip.id)}
                    disabled={sharingId === trip.id}
                    className={`px-6 py-2 rounded-full font-label text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm ${
                      trip.is_public 
                        ? 'bg-green-500 text-white shadow-green-200' 
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {sharingId === trip.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : trip.is_public ? (
                      <Check size={14} />
                    ) : (
                      <Globe size={14} />
                    )}
                    {trip.is_public ? "Public" : "Private"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-surface-background flex items-center justify-center mb-6">
                <PlaneTakeoff className="w-10 h-10 text-text-secondary opacity-20" />
              </div>
              <h3 className="font-headline text-lg font-bold text-text-primary uppercase">No trips found</h3>
              <p className="font-body text-sm text-text-secondary mt-2 max-w-xs">You need to plan an adventure before you can share it with the world!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-border-subtle bg-surface-container-lowest flex justify-center">
           <button 
             onClick={onClose}
             className="px-10 py-3 rounded-xl font-label text-sm font-black uppercase tracking-widest bg-on-surface text-surface-canvas hover:opacity-90 transition-opacity shadow-lg"
           >
             Done
           </button>
        </div>
      </div>
    </div>
  );
}
