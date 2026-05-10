import { useState, useEffect } from "react";
import { 
  Map, Wallet, Plus, Share2, PlusCircle, MapPin,
  Plane, Home, PlaneTakeoff, Clock, CheckCircle2,
  Calendar, FileText, Loader2, Trash2, Edit2, Info, Globe, GlobeLock
} from "lucide-react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export function Itinerary() {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [isAddingItinerary, setIsAddingItinerary] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const [itineraryForm, setItineraryForm] = useState({
    day: 1,
    time: "09:00 AM",
    activity: "",
    location: "",
    type: "activity",
    notes: ""
  });

  useEffect(() => {
    const fetchTrips = async () => {
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
    if (isAuthenticated) fetchTrips();
  }, [isAuthenticated]);

  const fetchTripDetails = async (id: number) => {
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

  const handleAddItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !itineraryForm.activity) return;

    try {
      await api(`/trips/${selectedTrip.id}/itinerary`, {
        method: "POST",
        body: JSON.stringify({
          ...itineraryForm,
          day: Number(itineraryForm.day)
        })
      });
      setIsAddingItinerary(false);
      setItineraryForm({ day: 1, time: "09:00 AM", activity: "", location: "", type: "activity", notes: "" });
      fetchTripDetails(selectedTrip.id);
    } catch (err) {
      console.error("Failed to add itinerary:", err);
      alert("Failed to add itinerary item");
    }
  };

  const handleDeleteTrip = async (id: number) => {
    if (!confirm("Are you sure you want to delete this trip? All data including budget and itineraries will be lost.")) return;
    
    try {
      await api(`/trips/${id}`, { method: "DELETE" });
      setTrips(prev => prev.filter(t => t.id !== id));
      if (selectedTrip?.id === id) setSelectedTrip(null);
    } catch (err) {
      alert("Failed to delete trip");
    }
  };

  const handleToggleShare = async () => {
    if (!selectedTrip) return;
    setIsSharing(true);
    try {
      const res = await api(`/trips/${selectedTrip.id}/share`, { method: "PUT" });
      setSelectedTrip({ ...selectedTrip, is_public: res.is_public });
      // Update the trip in the list as well
      setTrips(prev => prev.map(t => t.id === selectedTrip.id ? { ...t, is_public: res.is_public } : t));
    } catch (err) {
      alert("Failed to update share status");
    } finally {
      setIsSharing(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface-background">
      <div className="max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 w-full h-full">
        
        {/* Left Column: Trip List */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 h-full overflow-y-auto custom-scrollbar pr-2">
          <div className="flex items-center justify-between">
            <h1 className="font-headline text-2xl font-bold text-text-primary">My Trips</h1>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openCreateTrip'))}
              className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-surface-canvas rounded-xl border border-border-subtle animate-pulse"></div>
              ))
            ) : trips.length > 0 ? (
              trips.map(trip => (
                <div 
                  key={trip.id} 
                  onClick={() => fetchTripDetails(trip.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group relative ${
                    selectedTrip?.id === trip.id 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-border-subtle bg-surface-canvas hover:border-primary/50'
                  }`}
                >
                  <h3 className={`font-headline text-sm font-bold truncate pr-6 ${
                    selectedTrip?.id === trip.id ? 'text-primary' : 'text-text-primary'
                  }`}>
                    {trip.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={12} className="text-text-secondary" />
                    <p className="font-body text-[10px] text-text-secondary truncate">{trip.destination}</p>
                  </div>
                  {trip.is_public && (
                    <div className="absolute bottom-4 right-4 text-primary opacity-60">
                       <Globe size={12} />
                    </div>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip.id); }}
                    className="absolute top-4 right-4 text-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <Plane className="w-8 h-8 text-text-secondary mx-auto mb-2 opacity-20" />
                <p className="font-body text-xs text-text-secondary">No trips found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Trip Details */}
        <div className="flex-1 flex flex-col gap-6 min-w-0 h-full overflow-y-auto custom-scrollbar pr-2">
          {detailsLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : selectedTrip ? (
            <>
              {/* Trip Header Card */}
              <div className="relative w-full h-56 rounded-3xl overflow-hidden shadow-md shrink-0 border border-border-subtle group">
                <img 
                  src={selectedTrip.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt="" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-8 flex flex-col justify-end">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="bg-primary/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase italic tracking-widest mb-3 inline-block">
                        {selectedTrip.category || "Adventure"}
                      </span>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight uppercase italic">{selectedTrip.title}</h2>
                      <div className="flex items-center gap-4 text-white/90 mt-2">
                         <div className="flex items-center gap-1.5">
                           <MapPin size={16} className="text-primary" />
                           <span className="font-label text-xs font-bold uppercase tracking-wide">{selectedTrip.destination}</span>
                         </div>
                         <div className="flex items-center gap-1.5 border-l border-white/20 pl-4">
                           <Calendar size={16} className="text-primary" />
                           <span className="font-label text-xs font-bold uppercase tracking-wide">
                             {selectedTrip.start_date ? new Date(selectedTrip.start_date).toLocaleDateString() : 'TBD'}
                           </span>
                         </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={handleToggleShare}
                         disabled={isSharing}
                         className={`backdrop-blur-md text-white p-3 rounded-xl transition-all border border-white/20 flex items-center gap-2 ${
                           selectedTrip.is_public ? 'bg-green-500/40 hover:bg-green-500/60' : 'bg-white/20 hover:bg-white/30'
                         }`}
                         title={selectedTrip.is_public ? "Public on Community" : "Private (Tap to share)"}
                       >
                         {isSharing ? <Loader2 size={18} className="animate-spin" /> : 
                          selectedTrip.is_public ? <Globe size={18} /> : <GlobeLock size={18} />}
                         <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">
                           {selectedTrip.is_public ? "Shared" : "Share"}
                         </span>
                       </button>
                       <button className="bg-white/20 backdrop-blur-md text-white p-3 rounded-xl hover:bg-white/30 transition-all border border-white/20">
                         <Edit2 size={18} />
                       </button>
                       <button className="bg-white/20 backdrop-blur-md text-white p-3 rounded-xl hover:bg-white/30 transition-all border border-white/20">
                         <Share2 size={18} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-border-subtle shrink-0">
                {[
                  { id: 'itinerary', label: 'Itinerary', icon: Clock },
                  { id: 'budget', label: 'Budget', icon: Wallet },
                  { id: 'notes', label: 'Notes', icon: FileText },
                  { id: 'map', label: 'Map', icon: Map }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 px-2 flex items-center gap-2 font-label text-sm font-black uppercase tracking-widest transition-all border-b-4 ${
                      activeTab === tab.id 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-text-secondary hover:text-text-primary opacity-60'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 min-h-0">
                {activeTab === 'itinerary' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="font-headline text-xl font-bold text-text-primary italic">Timeline</h3>
                       <button 
                         onClick={() => setIsAddingItinerary(true)}
                         className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-md hover:opacity-90"
                       >
                         <Plus size={14} /> Add Item
                       </button>
                    </div>

                    {isAddingItinerary && (
                      <form onSubmit={handleAddItinerary} className="bg-surface-canvas border border-primary/20 rounded-2xl p-6 shadow-sm animate-in zoom-in-95 duration-200 space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                               <label className="text-[10px] font-black uppercase text-primary tracking-widest">Day & Time</label>
                               <div className="flex gap-2">
                                  <input type="number" min="1" value={itineraryForm.day} onChange={e => setItineraryForm({...itineraryForm, day: Number(e.target.value)})} className="w-16 bg-surface-background border border-border-subtle rounded-lg px-2 py-2 text-sm text-center" />
                                  <input type="text" value={itineraryForm.time} onChange={e => setItineraryForm({...itineraryForm, time: e.target.value})} className="flex-1 bg-surface-background border border-border-subtle rounded-lg px-3 py-2 text-sm" placeholder="9:00 AM" />
                               </div>
                            </div>
                            <div className="flex flex-col gap-1.5 md:col-span-2">
                               <label className="text-[10px] font-black uppercase text-primary tracking-widest">Activity Name</label>
                               <input required type="text" value={itineraryForm.activity} onChange={e => setItineraryForm({...itineraryForm, activity: e.target.value})} className="w-full bg-surface-background border border-border-subtle rounded-lg px-3 py-2 text-sm" placeholder="Flight to Bali / Check-in at Hotel" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                               <label className="text-[10px] font-black uppercase text-primary tracking-widest">Location</label>
                               <input type="text" value={itineraryForm.location} onChange={e => setItineraryForm({...itineraryForm, location: e.target.value})} className="w-full bg-surface-background border border-border-subtle rounded-lg px-3 py-2 text-sm" placeholder="Airport / Hotel Name" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                               <label className="text-[10px] font-black uppercase text-primary tracking-widest">Type</label>
                               <select value={itineraryForm.type} onChange={e => setItineraryForm({...itineraryForm, type: e.target.value})} className="w-full bg-surface-background border border-border-subtle rounded-lg px-3 py-2 text-sm">
                                  <option value="activity">Activity</option>
                                  <option value="transit">Transit</option>
                                  <option value="stay">Stay</option>
                               </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                               <label className="text-[10px] font-black uppercase text-primary tracking-widest">Notes (Optional)</label>
                               <input type="text" value={itineraryForm.notes} onChange={e => setItineraryForm({...itineraryForm, notes: e.target.value})} className="w-full bg-surface-background border border-border-subtle rounded-lg px-3 py-2 text-sm" placeholder="Confirmation #1234" />
                            </div>
                         </div>
                         <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setIsAddingItinerary(false)} className="px-5 py-2 text-xs font-bold text-text-secondary hover:bg-surface-background rounded-lg transition-all">Cancel</button>
                            <button type="submit" className="bg-primary text-on-primary px-8 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-md">Save Activity</button>
                         </div>
                      </form>
                    )}

                    <div className="space-y-6">
                      {selectedTrip.itineraries && selectedTrip.itineraries.length > 0 ? (
                        selectedTrip.itineraries.map((item: any) => (
                          <div key={item.id} className="flex gap-6 relative group">
                            <div className="absolute left-[21px] top-8 bottom-0 w-0.5 bg-border-subtle/30 group-last:hidden"></div>
                            
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-surface-background shadow-sm transition-transform group-hover:scale-110 ${
                              item.type === 'transit' ? 'bg-blue-100 text-blue-600' : 
                              item.type === 'stay' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                            }`}>
                              {item.type === 'transit' ? <PlaneTakeoff size={18} /> : 
                               item.type === 'stay' ? <Home size={18} /> : <CheckCircle2 size={18} />}
                            </div>
                            
                            <div className="flex-1 pb-10">
                              <div className="bg-surface-canvas p-5 rounded-2xl border border-border-subtle shadow-xs group-hover:shadow-md transition-all group-hover:border-primary/30">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                  <h4 className="font-headline text-lg font-bold text-text-primary">{item.activity}</h4>
                                  <div className="flex items-center gap-2">
                                     <span className="font-label text-[10px] font-black uppercase text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                       Day {item.day}
                                     </span>
                                     <span className="font-body text-[10px] font-bold text-text-secondary bg-surface-background px-3 py-1 rounded-full border border-border-subtle">
                                       {item.time}
                                     </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-text-secondary">
                                  <MapPin size={14} className="text-primary/60" />
                                  <span className="font-label text-xs font-bold uppercase tracking-wide">{item.location}</span>
                                </div>
                                {item.notes && (
                                  <p className="mt-4 p-4 bg-surface-background/50 rounded-xl border border-border-subtle/50 font-body text-xs text-text-secondary italic leading-relaxed border-l-4 border-l-primary/30">
                                    "{item.notes}"
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-20 bg-surface-canvas rounded-[2.5rem] border-2 border-dashed border-border-subtle text-center flex flex-col items-center justify-center p-8">
                          <div className="w-16 h-16 rounded-full bg-surface-background flex items-center justify-center mb-4 shadow-inner">
                             <PlusCircle className="text-text-secondary w-8 h-8 opacity-20" />
                          </div>
                          <h4 className="font-headline text-lg font-bold text-text-primary">Empty Itinerary</h4>
                          <p className="font-body text-sm text-text-secondary mt-1 max-w-xs opacity-70">No plans yet? Tap the "Add Item" button above to start mapping out your adventure.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'budget' && (
                  <div className="space-y-6">
                     <div className="flex items-center justify-between mb-2">
                        <h3 className="font-headline text-xl font-bold text-text-primary italic">Expenses</h3>
                        <button 
                          onClick={() => setActiveTab('budget')}
                          className="text-primary font-label text-xs font-black uppercase tracking-widest hover:underline"
                        >
                          Go to Budget Planner
                        </button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-surface-canvas p-8 rounded-3xl border border-border-subtle shadow-sm flex flex-col justify-between min-h-[180px] relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
                         <div>
                            <span className="font-label text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1 block">Total Budget</span>
                            <h3 className="font-display text-4xl font-bold text-text-primary mt-2">
                              ${selectedTrip.budgets?.reduce((s:number, b:any) => s + b.amount, 0).toFixed(2)}
                            </h3>
                         </div>
                         <div className="mt-8">
                            <div className="flex justify-between text-[10px] font-black uppercase text-text-secondary mb-2">
                               <span>Spending Progress</span>
                               <span>65%</span>
                            </div>
                            <div className="h-2.5 bg-surface-background rounded-full overflow-hidden shadow-inner">
                               <div className="h-full bg-primary w-[65%] rounded-full shadow-lg"></div>
                            </div>
                         </div>
                       </div>
                       
                       <div className="space-y-4">
                          {selectedTrip.budgets?.slice(0, 3).map((b:any) => (
                             <div key={b.id} className="bg-surface-canvas p-4 rounded-xl border border-border-subtle flex items-center justify-between shadow-xs">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary"><Wallet size={16} /></div>
                                   <span className="font-headline text-sm font-bold text-text-primary capitalize">{b.category}</span>
                                </div>
                                <span className="font-display text-sm font-bold text-text-primary">${b.amount.toFixed(2)}</span>
                             </div>
                          ))}
                       </div>
                     </div>
                  </div>
                )}
                
                {activeTab === 'notes' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {selectedTrip.notes && selectedTrip.notes.length > 0 ? (
                      selectedTrip.notes.map((note: any) => (
                        <div key={note.id} className="bg-yellow-50/50 p-6 rounded-3xl border border-yellow-200/50 shadow-xs group hover:shadow-md transition-all relative">
                          <h4 className="font-headline text-base font-bold text-text-primary mb-3 italic">{note.title}</h4>
                          <p className="font-body text-xs text-text-secondary line-clamp-6 leading-relaxed opacity-80">{note.content}</p>
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Edit2 size={14} className="text-yellow-600" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-16 text-center bg-surface-canvas rounded-[2.5rem] border-2 border-dashed border-border-subtle">
                        <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-10" />
                        <p className="font-body text-sm text-text-secondary italic opacity-60">Your travel journal is empty.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'map' && (
                  <div className="w-full h-[500px] bg-surface-canvas rounded-[3rem] border border-border-subtle overflow-hidden relative shadow-inner">
                     <div className="absolute inset-0 bg-[#f0f0f0] flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4 text-text-secondary opacity-40">
                           <Map size={64} strokeWidth={1} />
                           <p className="font-headline text-xl font-bold uppercase tracking-tighter italic">Interactive Map View</p>
                        </div>
                     </div>
                     {/* Floating Map Marker UI */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative group cursor-pointer">
                           <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                           <div className="relative bg-primary text-on-primary p-3 rounded-full shadow-xl border-4 border-white">
                              <MapPin size={24} />
                           </div>
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white px-4 py-2 rounded-xl shadow-2xl border border-border-subtle whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                              <p className="font-headline text-xs font-bold text-text-primary">{selectedTrip.destination}</p>
                              <p className="font-body text-[10px] text-text-secondary">Current Stop</p>
                           </div>
                        </div>
                     </div>

                     <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white/40 shadow-2xl">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-primary rounded-2xl text-white shadow-lg"><Info size={24} /></div>
                           <div>
                              <h4 className="font-headline text-base font-black text-text-primary uppercase italic">Mapping Service Active</h4>
                              <p className="font-body text-xs text-text-secondary">Visualizing your itinerary through {selectedTrip.destination}. Interactive routing coming soon.</p>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-surface-canvas/50 rounded-[4rem] border-2 border-dashed border-border-subtle/50 animate-pulse">
               <div className="w-24 h-24 rounded-full bg-surface-background flex items-center justify-center mb-8 shadow-inner">
                 <Plane className="w-12 h-12 text-text-secondary opacity-10" />
               </div>
               <h2 className="font-headline text-2xl font-black text-text-primary opacity-30 italic uppercase tracking-widest">Adventure Selection Required</h2>
               <p className="font-body text-sm text-text-secondary mt-4 max-w-xs opacity-50 italic">Your travel story starts with a single click. Select a trip from the sidebar to continue.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Itinerary;
