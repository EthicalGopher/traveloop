import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Calendar, Compass, MapPin, Filter, Loader2, Plus, GripVertical, Save, Trash2 } from "lucide-react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import { featuredDestinations } from "../../data/travelData";

export function Builder() {
  const { isAuthenticated } = useAuth();
  const [trip, setTrip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tripId = queryParams.get("id");

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId || !isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const data = await api(`/trips/${tripId}`);
        setTrip(data);
      } catch (err) {
        console.error("Failed to fetch trip:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [tripId, isAuthenticated]);

  const handleUpdateTrip = async () => {
    if (!trip) return;
    setSaving(true);
    try {
      await api(`/trips/${trip.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: trip.title,
          start_date: trip.start_date,
          end_date: trip.end_date,
        }),
      });
      // Optionally show success toast
    } catch (err) {
      console.error("Failed to update trip:", err);
    } finally {
      setSaving(false);
    }
  };

  const addItineraryItem = async (place: any) => {
    if (!trip) return;
    try {
      const newItem = await api(`/trips/${trip.id}/itinerary`, {
        method: "POST",
        body: JSON.stringify({
          day: 1,
          time: "10:00 AM",
          activity: place.title,
          location: place.title,
          type: "activity",
          notes: place.description || ""
        }),
      });
      setTrip({
        ...trip,
        itineraries: [...(trip.itineraries || []), newItem]
      });
    } catch (err) {
      console.error("Failed to add itinerary item:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-surface-canvas">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tripId || !trip) {
    return (
      <div className="flex h-full items-center justify-center bg-surface-canvas p-8 text-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">No Trip Selected</h2>
          <p className="text-text-secondary mb-6">Select a trip from your dashboard or itinerary to start building.</p>
          <button 
            onClick={() => window.location.href = "/dashboard"}
            className="bg-primary text-on-primary px-6 py-2 rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden bg-surface-canvas">
      {/* Left Sidebar for Builder */}
      <div className="hidden border-r border-border-subtle bg-surface-background w-80 lg:flex flex-col flex-shrink-0 z-10">
        <div className="p-6 border-b border-border-subtle">
          <div className="flex items-center justify-between mb-2">
            <input 
              className="bg-transparent font-headline text-2xl font-bold text-on-surface focus:outline-none w-full" 
              value={trip.title} 
              onChange={(e) => setTrip({ ...trip, title: e.target.value })}
              onBlur={handleUpdateTrip}
              type="text" 
            />
            {saving && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          </div>
          <p className="font-body text-sm text-text-secondary flex items-center gap-1">
            <Calendar className="w-4 h-4" /> 
            {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <h3 className="font-label text-xs font-bold text-text-secondary uppercase tracking-widest px-2">Itinerary Timeline</h3>
          {trip.itineraries?.length > 0 ? (
            trip.itineraries.map((item: any) => (
              <div key={item.id} className="bg-surface-canvas border border-border-subtle rounded-xl p-4 shadow-sm relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-xl"></div>
                <div className="flex justify-between items-start pl-2">
                  <div>
                    <span className="font-label text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">Day {item.day} • {item.time}</span>
                    <h3 className="font-title text-base font-medium text-on-surface">{item.activity}</h3>
                  </div>
                  <button className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="font-body text-xs text-text-secondary mt-1">{item.location}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-border-subtle rounded-xl mx-2">
              <p className="text-xs text-text-secondary">Your itinerary is empty.</p>
              <p className="text-[10px] text-text-secondary mt-1">Add items from recommendations.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface-canvas relative h-full">
        <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto w-full max-w-[1280px] mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-title text-2xl font-medium text-on-surface">Discover Places in {trip.destination}</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-surface-canvas border border-border-subtle rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-surface-container transition-colors shadow-sm">
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>
          
          <h3 className="font-title text-xl font-medium text-on-surface mb-4">Recommended Destinations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
            {featuredDestinations.map((dest) => (
               <div key={dest.id} className="bg-surface-canvas rounded-xl border border-border-subtle overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                  <div className="h-32 bg-surface-container relative">
                     <img src={dest.image} className="w-full h-full object-cover" alt={dest.title} />
                     <button 
                       onClick={() => addItineraryItem(dest)}
                       className="absolute bottom-2 right-2 bg-primary text-on-primary p-2 rounded-full shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all"
                     >
                       <Plus className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-body text-sm font-medium text-on-surface">{dest.title}</h4>
                      <span className="text-[10px] font-bold text-primary">{dest.rating}★</span>
                    </div>
                    <p className="font-label text-[11px] text-text-secondary mt-1 line-clamp-1">{dest.category}</p>
                  </div>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Builder;
