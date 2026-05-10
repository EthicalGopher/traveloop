import { useState, useEffect } from "react";
import { PenTool, CheckSquare, List, Loader2, FileText, PlusCircle, Trash2 } from "lucide-react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export function Notes() {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [noteForm, setNoteForm] = useState({
    title: "",
    content: ""
  });

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

  const fetchTripDetails = async (id: string | number) => {
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

  const handleSaveNote = async () => {
    if (!selectedTrip || !noteForm.title || !noteForm.content) return;

    setIsSaving(true);
    try {
      await api(`/trips/${selectedTrip.id}/note`, {
        method: "POST",
        body: JSON.stringify(noteForm)
      });
      setNoteForm({ title: "", content: "" });
      fetchTripDetails(selectedTrip.id);
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Failed to save note");
    } finally {
      setIsSaving(false);
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
          className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold"
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

      <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-[800px] mx-auto w-full">
           {detailsLoading ? (
             <div className="flex justify-center py-12">
               <Loader2 className="w-8 h-8 animate-spin text-primary" />
             </div>
           ) : selectedTrip ? (
             <>
               <div className="bg-surface-canvas border border-border-subtle rounded-xl p-6 shadow-sm mb-6 animate-in slide-in-from-top-4 duration-300">
                  <input 
                    className="w-full text-2xl font-headline font-bold text-on-surface focus:outline-none mb-4 placeholder:text-text-secondary/50 bg-transparent border-none p-0" 
                    placeholder="Add a quick note title..." 
                    type="text" 
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                  />
                  <textarea 
                    className="w-full bg-transparent border-none focus:ring-0 text-on-surface-variant font-body text-sm resize-none p-0 min-h-[120px]"
                    placeholder="Start typing your thoughts here..."
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                  />
                  <div className="flex items-center justify-between border-t border-border-subtle pt-4 mt-4">
                     <div className="flex items-center gap-2 text-text-secondary">
                       <button className="p-2 hover:bg-surface-container rounded-lg transition-colors"><PenTool size={18} /></button>
                       <button className="p-2 hover:bg-surface-container rounded-lg transition-colors"><CheckSquare size={18} /></button>
                       <button className="p-2 hover:bg-surface-container rounded-lg transition-colors"><List size={18} /></button>
                     </div>
                     <button 
                        onClick={handleSaveNote}
                        disabled={isSaving || !noteForm.title || !noteForm.content}
                        className="bg-primary text-on-primary px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                     >
                       {isSaving && <Loader2 size={16} className="animate-spin" />}
                       Save Note
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                  {selectedTrip.notes?.length > 0 ? (
                    selectedTrip.notes.map((note: any) => (
                      <div key={note.id} className="bg-surface-canvas border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col min-h-[180px] group relative">
                         <h3 className="font-headline text-lg font-bold text-on-surface mb-3">{note.title}</h3>
                         <p className="font-body text-sm text-text-secondary flex-1 line-clamp-4 whitespace-pre-wrap leading-relaxed">
                           {note.content}
                         </p>
                         <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-subtle/50">
                           <span className="font-label text-[10px] font-black uppercase text-text-secondary tracking-widest">
                             {new Date(note.updated_at).toLocaleDateString()}
                           </span>
                           <button className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 hover:rounded-lg">
                             <Trash2 size={16} />
                           </button>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center bg-surface-container-low border-2 border-dashed border-border-subtle rounded-[2rem]">
                      <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-20" />
                      <p className="text-text-secondary text-sm italic font-body">No notes for this trip yet.</p>
                    </div>
                  )}
                  
                  <div 
                    onClick={() => {
                      document.querySelector<HTMLInputElement>('input[placeholder="Add a quick note title..."]')?.focus();
                    }}
                    className="bg-surface-container-low border-2 border-border-subtle border-dashed rounded-[2rem] p-6 flex flex-col items-center justify-center text-text-secondary hover:bg-surface-container hover:border-primary transition-all cursor-pointer min-h-[180px] group"
                  >
                     <PlusCircle size={32} className="mb-4 text-text-secondary group-hover:text-primary transition-colors opacity-30 group-hover:opacity-100" />
                     <span className="font-headline text-sm font-bold uppercase tracking-wider">Add New Note</span>
                  </div>
               </div>
             </>
           ) : (
             <div className="py-20 text-center bg-surface-canvas rounded-[3rem] border-2 border-dashed border-border-subtle">
               <p className="text-text-secondary italic font-body">Select a trip from the dropdown above to view its notes.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
export default Notes;
