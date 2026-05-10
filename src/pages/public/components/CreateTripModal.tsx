import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlace?: string;
}

export function CreateTripModal({ isOpen, onClose, initialPlace }: CreateTripModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

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
                    className="w-full max-w-[280px] bg-transparent border border-border-subtle rounded-md px-3 py-1.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="font-label text-sm text-text-primary w-32 text-right">Select a Place :</label>
                <div className="flex-1">
                  <input 
                    type="text" 
                    defaultValue={initialPlace}
                    className="w-full max-w-[280px] bg-transparent border border-border-subtle rounded-md px-3 py-1.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="font-label text-sm text-text-primary w-32 text-right">Start Date:</label>
                <div className="flex-1">
                  <input 
                    type="date" 
                    className="w-full max-w-[280px] bg-transparent border border-border-subtle rounded-md px-3 py-1.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-text-primary appearance-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="font-label text-sm text-text-primary w-32 text-right">End Date:</label>
                <div className="flex-1">
                  <input 
                    type="date" 
                    className="w-full max-w-[280px] bg-transparent border border-border-subtle rounded-md px-3 py-1.5 font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-text-primary appearance-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="border-t border-border-subtle">
            <div className="px-6 py-4 border-b border-border-subtle bg-surface-container-lowest">
               <h3 className="font-label text-sm text-text-primary">Suggestion for Places to Visit/Activities to preform</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { name: "Eiffel Tower", location: "Paris, France", img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=300" },
                { name: "Colosseum", location: "Rome, Italy", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=300" },
                { name: "Swiss Alps", location: "Switzerland", img: "https://images.unsplash.com/photo-1531366936310-6cb1c83a145c?q=80&w=300" },
                { name: "Santorini", location: "Greece", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac542?q=80&w=300" },
                { name: "Barcelona", location: "Spain", img: "https://images.unsplash.com/photo-1583422409516-ec581bf84534?q=80&w=300" },
                { name: "Amsterdam", location: "Netherlands", img: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?q=80&w=300" },
              ].map((place, i) => (
                <div key={i} className="group cursor-pointer rounded-xl overflow-hidden border border-border-subtle relative aspect-square">
                  <img src={place.img} alt={place.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <h4 className="font-title font-medium text-white text-base">{place.name}</h4>
                    <p className="font-body text-xs text-white/80">{place.location}</p>
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
            className="px-6 py-2 rounded-lg font-label text-sm font-medium text-text-secondary hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onClose();
              navigate('/builder');
            }}
            className="px-6 py-2 rounded-lg font-label text-sm font-medium bg-primary text-on-primary hover:opacity-90 transition-opacity shadow-sm"
          >
            Create Trip
          </button>
        </div>
      </div>
    </div>
  );
}
export default CreateTripModal;
