import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../utils/api";
import { useAuth } from "../../../utils/auth";
import { featuredDestinations, type Destination } from "../../../data/travelData";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlace?: string;
}

export function CreateTripModal({ isOpen, onClose, initialPlace }: CreateTripModalProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    destination: initialPlace || "",
    start_date: "",
    end_date: "",
    category: "Adventure",
    image: ""
  });

  useEffect(() => {
    if (initialPlace) {
      setFormData(prev => ({ ...prev, destination: initialPlace }));
    }
  }, [initialPlace]);

  if (!isOpen) return null;

  const handleCreateTrip = async () => {
    if (!isAuthenticated) {
      setError("Please log in to create a trip");
      return;
    }

    if (!formData.title || !formData.destination) {
      setError("Title and destination are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const trip = await api("/trips", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
          end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        }),
      });

      onClose();
      navigate(`/dashboard/builder?id=${trip.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  const selectSuggestion = (place: Destination) => {
    setFormData(prev => ({
      ...prev,
      destination: place.title,
      image: place.image,
      category: place.category,
      title: `My Trip to ${place.title}`
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-canvas w-full max-w-4xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden border border-border-subtle animate-in zoom-in-95 duration-200">
        
        {/* Header - Traveloop */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-container-lowest">
          <span className="font-headline text-lg font-bold text-text-primary tracking-tight">Traveloop</span>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-border-subtle hover:bg-surface-container rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-border-subtle">
           <h2 className="font-title text-xl font-medium text-text-primary">Plan a new trip</h2>
           {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6">
            <div className="max-w-xl space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-label text-sm text-text-primary w-32 text-right">Trip Name:</label>
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Summer Vacation 2024"
                    className="w-full max-w-[280px] bg-transparent border border-border-subtle rounded-md px-3 py-1.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-text-primary"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="font-label text-sm text-text-primary w-32 text-right">Select a Place :</label>
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full max-w-[280px] bg-transparent border border-border-subtle rounded-md px-3 py-1.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-text-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="font-label text-sm text-text-primary w-32 text-right">Start Date:</label>
                <div className="flex-1">
                  <input 
                    type="date" 
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full max-w-[280px] bg-transparent border border-border-subtle rounded-md px-3 py-1.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-text-primary appearance-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="font-label text-sm text-text-primary w-32 text-right">End Date:</label>
                <div className="flex-1">
                  <input 
                    type="date" 
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full max-w-[280px] bg-transparent border border-border-subtle rounded-md px-3 py-1.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-text-primary appearance-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="border-t border-border-subtle">
            <div className="px-6 py-4 border-b border-border-subtle bg-surface-container-lowest">
               <h3 className="font-label text-sm text-text-primary">Suggestion for Places to Visit/Activities to perform</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featuredDestinations.map((place) => (
                <div 
                  key={place.id} 
                  onClick={() => selectSuggestion(place)}
                  className={`group cursor-pointer rounded-xl overflow-hidden border relative aspect-square transition-all ${
                    formData.destination === place.title ? 'border-primary ring-2 ring-primary' : 'border-border-subtle'
                  }`}
                >
                  <img src={place.image} alt={place.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <h4 className="font-title font-medium text-white text-base">{place.title}</h4>
                    <p className="font-body text-xs text-white/80">{place.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-subtle bg-surface-container-lowest flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 rounded-lg font-label text-sm font-medium text-text-secondary hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleCreateTrip}
            disabled={loading}
            className="px-6 py-2 rounded-lg font-label text-sm font-medium bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating..." : "Create Trip"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTripModal;
