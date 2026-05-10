import { useState, useEffect } from "react";
import { PenTool, CheckSquare, List, Image as ImageIcon, Loader2, FileText, PlusCircle, Trash2 } from "lucide-react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export function Notes() {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await api("/trips");
        setTrips(data);
        if (data.length > 0) {
          fetchTripDetails(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [isAuthenticated]);

  const fetchTripDetails = async (id: string) => {
    setDetailsLoading(true);
    try {
      const data = await api(`/trips/${id}`);
      setSelectedTrip(data);
    } catch (err) {
      console.error("Failed to fetch trip details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-surface-background">
        <FileText className="w-16 h-16 text-text-secondary mb-4" />
        <h2 className="text-2xl font-bold mb-2">No trips found</h2>
        <p className="text-text-secondary mb-6">Create a trip first to start taking notes.</p>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('openCreateTrip'))}
          className="bg-primary text-on-primary px-6 py-2 rounded-lg"
        >
          Create Trip
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface-background h-full overflow-hidden">
      <header className="bg-surface-canvas border-b border-border-subtle p-4 md:p-6 shrink-0">
        <div className="max-w-[800px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-text-primary">Trip Notes</h1>
            <p className="text-sm text-text-secondary">Manage your thoughts and ideas</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text-secondary">Trip:</span>
            <select 
              className="bg-surface-container-low border border-border-subtle rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedTrip?.id || ""}
              onChange={(e) => fetchTripDetails(e.target.value)}
            >
              {trips.map(trip => (
                <option key={trip.id} value={trip.id}>{trip.title}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto w-full">
           {detailsLoading ? (
             <div className="flex justify-center py-12">
               <Loader2 className="w-8 h-8 animate-spin text-primary" />
             </div>
           ) : selectedTrip ? (
             <>
               <div className="bg-surface-canvas border border-border-subtle rounded-xl p-6 shadow-sm mb-6">
                  <input className="w-full text-2xl font-title font-medium text-on-surface focus:outline-none mb-4 placeholder-text-secondary bg-transparent" placeholder="Add a quick note title..." type="text" />
                  <textarea 
                    className="w-full bg-transparent border-none focus:ring-0 text-on-surface-variant font-body text-sm resize-none"
                    placeholder="Start typing your thoughts here..."
                    rows={4}
                  />
                  <div className="flex items-center justify-between border-t border-border-subtle pt-4 mt-4">
                     <div className="flex items-center gap-2 text-text-secondary">
                       <button className="p-2 hover:bg-surface-container rounded-lg transition-colors"><PenTool className="w-4 h-4" /></button>
                       <button className="p-2 hover:bg-surface-container rounded-lg transition-colors"><CheckSquare className="w-4 h-4" /></button>
                       <button className="p-2 hover:bg-surface-container rounded-lg transition-colors"><List className="w-4 h-4" /></button>
                     </div>
                     <button className="bg-primary text-on-primary px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                       Save Note
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                  {selectedTrip.notes?.length > 0 ? (
                    selectedTrip.notes.map((note: any) => (
                      <div key={note.id} className="bg-surface-canvas border border-border-subtle rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col min-h-[160px] group relative">
                         <h3 className="font-title text-xl font-medium text-on-surface mb-2">{note.title}</h3>
                         <p className="font-body text-sm text-on-surface-variant flex-1 line-clamp-4 whitespace-pre-wrap">
                           {note.content}
                         </p>
                         <div className="flex items-center justify-between mt-4">
                           <span className="font-label text-[10px] text-text-secondary">Edited {new Date(note.updated_at).toLocaleDateString()}</span>
                           <button className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-surface-container-low border-2 border-dashed border-border-subtle rounded-xl">
                      <p className="text-text-secondary text-sm">No notes for this trip yet.</p>
                    </div>
                  )}
                  
                  <div className="bg-surface-container-low border border-border-subtle border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container cursor-pointer transition-colors min-h-[160px]">
                     <PlusCircle className="w-8 h-8 mb-3 text-text-secondary" />
                     <span className="font-body text-base font-medium">Add New Note</span>
                  </div>
               </div>
             </>
           ) : (
             <p className="text-center py-12 text-text-secondary">Select a trip to view notes.</p>
           )}
        </div>
      </div>
    </div>
  );
}
export default Notes;
