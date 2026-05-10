import { useState, useEffect, useCallback } from "react";
import { PenTool, CheckSquare, List, Loader2, FileText, PlusCircle, Trash2, Edit2, X } from "lucide-react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import { motion } from "framer-motion";

interface Note {
  id: number;
  title: string;
  content: string;
  updated_at: string;
}

interface Trip {
  id: string | number;
  title: string;
  notes?: Note[];
  map_url?: string;
}

export function Notes() {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [noteForm, setNoteForm] = useState({
    title: "",
    content: ""
  });

  const fetchTripDetails = useCallback(async (id: string | number) => {
    setDetailsLoading(true);
    try {
      const data = await api(`/trips/${id}`);
      setSelectedTrip(data);
    } catch (err) {
      console.error("Failed to fetch trip details:", err);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await api("/trips");
        setTrips(data);
        if (data.length > 0 && !selectedTrip) {
          fetchTripDetails(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [isAuthenticated, selectedTrip, fetchTripDetails]);

  const handleSaveNote = async () => {
    if (!selectedTrip || !noteForm.title || !noteForm.content) return;

    setIsSaving(true);
    try {
      if (editingNote) {
        await api(`/trips/note/${editingNote.id}`, {
          method: "PUT",
          body: JSON.stringify(noteForm)
        });
      } else {
        await api(`/trips/${selectedTrip.id}/note`, {
          method: "POST",
          body: JSON.stringify(noteForm)
        });
      }
      setNoteForm({ title: "", content: "" });
      setEditingNote(null);
      fetchTripDetails(selectedTrip.id);
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!confirm("Delete this note?")) return;
    try {
      await api(`/trips/note/${id}`, { method: "DELETE" });
      if (selectedTrip) {
        fetchTripDetails(selectedTrip.id);
      }
    } catch {
      alert("Failed to delete note");
    }
  };

  const startEditingNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({ title: note.title, content: note.content });
    document.querySelector<HTMLInputElement>('input[placeholder="Add a quick note title..."]')?.focus();
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
            <h1 className="text-2xl font-bold text-text-primary italic uppercase tracking-tighter">Trip Notes</h1>
            <p className="text-sm text-text-secondary">Capture your travel inspirations</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Select Trip:</span>
            <select 
              className="bg-surface-container-low border border-border-subtle rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary"
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
               <div className={`bg-surface-canvas border rounded-[2rem] p-8 shadow-sm mb-10 transition-all duration-300 ${editingNote ? 'border-primary ring-4 ring-primary/5' : 'border-border-subtle'}`}>
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">{editingNote ? "Edit Mode" : "New Entry"}</h2>
                     {editingNote && (
                       <button onClick={() => { setEditingNote(null); setNoteForm({title:"", content:""}); }} className="text-text-secondary hover:text-red-500 transition-colors">
                          <X size={18} />
                       </button>
                     )}
                  </div>
                  <input 
                    className="w-full text-3xl font-headline font-bold text-on-surface focus:outline-none mb-6 placeholder:text-text-secondary/30 bg-transparent border-none p-0 italic" 
                    placeholder="Add a quick note title..." 
                    type="text" 
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                  />
                  <textarea 
                    className="w-full bg-transparent border-none focus:ring-0 text-text-primary font-body text-base resize-none p-0 min-h-[160px] leading-relaxed"
                    placeholder="Start typing your thoughts here..."
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                  />
                  <div className="flex items-center justify-between border-t border-border-subtle pt-6 mt-6">
                     <div className="flex items-center gap-3 text-text-secondary opacity-40">
                       <button className="p-2.5 hover:bg-surface-container rounded-xl transition-all"><PenTool size={20} /></button>
                       <button className="p-2.5 hover:bg-surface-container rounded-xl transition-all"><CheckSquare size={20} /></button>
                       <button className="p-2.5 hover:bg-surface-container rounded-xl transition-all"><List size={20} /></button>
                     </div>
                     <button 
                        onClick={handleSaveNote}
                        disabled={isSaving || !noteForm.title || !noteForm.content}
                        className="bg-primary text-on-primary px-8 py-3 rounded-xl font-label text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-3"
                     >
                       {isSaving && <Loader2 size={18} className="animate-spin" />}
                       {editingNote ? "Update Note" : "Save Journey Note"}
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-32">
                  {selectedTrip.notes && selectedTrip.notes.length > 0 ? (
                    selectedTrip.notes.map((note: Note) => (
                      <motion.div 
                        key={note.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface-canvas border border-border-subtle rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all group relative flex flex-col min-h-[220px]"
                      >
                         <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => startEditingNote(note)} className="p-2 bg-surface-background hover:bg-primary/10 text-text-secondary hover:text-primary rounded-xl transition-all border border-border-subtle">
                               <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDeleteNote(note.id)} className="p-2 bg-surface-background hover:bg-red-50 text-text-secondary hover:text-red-500 rounded-xl transition-all border border-border-subtle">
                               <Trash2 size={14} />
                            </button>
                         </div>
                         <h3 className="font-headline text-xl font-bold text-on-surface mb-4 italic pr-12">{note.title}</h3>
                         <p className="font-body text-sm text-text-secondary flex-1 line-clamp-6 whitespace-pre-wrap leading-relaxed opacity-80">
                           {note.content}
                         </p>
                         <div className="mt-8 pt-6 border-t border-border-subtle/50">
                           <span className="font-label text-[10px] font-black uppercase text-primary tracking-[0.2em] bg-primary/5 px-4 py-1.5 rounded-full">
                             {new Date(note.updated_at).toLocaleDateString()}
                           </span>
                         </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-24 text-center bg-surface-container-low border-2 border-dashed border-border-subtle rounded-[3rem]">
                      <div className="w-20 h-20 bg-surface-canvas rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-border-subtle">
                        <FileText className="w-10 h-10 text-text-secondary opacity-10" />
                      </div>
                      <p className="text-text-secondary font-headline text-base font-bold uppercase tracking-widest opacity-40 italic">Travel journal is empty.</p>
                    </div>
                  )}
                  
                  <div 
                    onClick={() => {
                      document.querySelector<HTMLInputElement>('input[placeholder="Add a quick note title..."]')?.focus();
                    }}
                    className="bg-primary/5 border-2 border-primary/20 border-dashed rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-primary hover:bg-primary/10 transition-all cursor-pointer min-h-[220px] group"
                  >
                     <PlusCircle size={40} className="mb-4 opacity-30 group-hover:scale-110 transition-transform" />
                     <span className="font-headline text-sm font-black uppercase tracking-[0.2em] italic">New Travel Thought</span>
                  </div>
               </div>
             </>
           ) : (
             <div className="py-32 text-center bg-surface-canvas rounded-[4rem] border-2 border-dashed border-border-subtle animate-pulse">
               <p className="text-text-secondary italic font-headline text-xl opacity-20 uppercase tracking-widest">Select an Adventure</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
export default Notes;
