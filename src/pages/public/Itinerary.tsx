import { useState, useEffect, useCallback } from "react";
import { 
  Map, Wallet, Plus, Share2, PlusCircle, MapPin,
  Plane, Home, PlaneTakeoff, Clock, CheckCircle2,
  Calendar, FileText, Loader2, Trash2, Edit2, Info, Globe, GlobeLock, X, Star, ChevronDown, ChevronRight
} from "lucide-react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import { motion } from "framer-motion";

interface ItineraryItem {
  id: number;
  day: number;
  time: string;
  activity: string;
  location: string;
  type: string;
  notes: string;
}

interface BudgetEntry {
  id: number;
  category: string;
  amount: number;
  currency: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  updated_at: string;
}

interface Trip {
  id: number;
  title: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  image: string;
  category: string;
  status: string;
  is_public: boolean;
  map_url?: string;
  rating: number;
  itineraries: ItineraryItem[];
  budgets: BudgetEntry[];
  notes: Note[];
}

export function Itinerary() {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [isAddingItinerary, setIsAddingItinerary] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [isEditingTrip, setIsEditingTrip] = useState(false);

  // Sidebar grouping state
  const [expandedSections, setExpandedSections] = useState({
    ongoing: true,
    upcoming: true,
    completed: false
  });

  const [itineraryForm, setItineraryForm] = useState({
    day: 1,
    time: "09:00 AM",
    activity: "",
    location: "",
    type: "activity",
    notes: ""
  });

  const [tripForm, setTripForm] = useState({
    title: "",
    destination: "",
    start_date: "",
    end_date: "",
    image: "",
    category: ""
  });

  const fetchTripDetails = useCallback(async (id: number) => {
    setDetailsLoading(true);
    try {
      const data = await api(`/trips/${id}`);
      setSelectedTrip(data);
      setTripForm({
        title: data.title,
        destination: data.destination,
        start_date: data.start_date ? data.start_date.split('T')[0] : "",
        end_date: data.end_date ? data.end_date.split('T')[0] : "",
        image: data.image,
        category: data.category
      });
    } catch {
      console.error("Failed to fetch trip details");
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await api("/trips");
        setTrips(data);
        if (data.length > 0 && !selectedTrip) {
          fetchTripDetails(data[0].id);
        }
      } catch {
        console.error("Failed to fetch trips");
      }

    };
    if (isAuthenticated) fetchTrips();
  }, [isAuthenticated, selectedTrip, fetchTripDetails]);

  const handleSaveItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !itineraryForm.activity) return;

    try {
      if (editingItem) {
        await api(`/trips/itinerary/${editingItem.id}`, {
          method: "PUT",
          body: JSON.stringify({
            ...itineraryForm,
            day: Number(itineraryForm.day)
          })
        });
      } else {
        await api(`/trips/${selectedTrip.id}/itinerary`, {
          method: "POST",
          body: JSON.stringify({
            ...itineraryForm,
            day: Number(itineraryForm.day)
          })
        });
      }
      setIsAddingItinerary(false);
      setEditingItem(null);
      setItineraryForm({ day: 1, time: "09:00 AM", activity: "", location: "", type: "activity", notes: "" });
      fetchTripDetails(selectedTrip.id);
    } catch {
      alert("Failed to save itinerary item");
    }
  };

  const handleDeleteItinerary = async (itemId: number) => {
    if (!confirm("Delete this activity?")) return;
    try {
      await api(`/trips/itinerary/${itemId}`, { method: "DELETE" });
      if (selectedTrip) fetchTripDetails(selectedTrip.id);
    } catch {
      alert("Failed to delete item");
    }
  };

  const handleUpdateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip) return;

    try {
      await api(`/trips/${selectedTrip.id}`, {
        method: "PUT",
        body: JSON.stringify(tripForm)
      });
      setIsEditingTrip(false);
      fetchTripDetails(selectedTrip.id);
      const data = await api("/trips");
      setTrips(data);
    } catch {
      alert("Failed to update trip");
    }
  };

  const handleDeleteTrip = async (id: number) => {
    if (!confirm("Are you sure you want to delete this trip? All data including budget and itineraries will be lost.")) return;
    
    try {
      await api(`/trips/${id}`, { method: "DELETE" });
      setTrips(prev => prev.filter(t => t.id !== id));
      if (selectedTrip?.id === id) setSelectedTrip(null);
    } catch {
      alert("Failed to delete trip");
    }
  };

  const handleToggleShare = async () => {
    if (!selectedTrip) return;
    setIsSharing(true);
    try {
      const res = await api(`/trips/${selectedTrip.id}/share`, { method: "PUT" });
      setSelectedTrip({ ...selectedTrip, is_public: res.is_public });
      setTrips(prev => prev.map(t => t.id === selectedTrip.id ? { ...t, is_public: res.is_public } : t));
    } catch {
      alert("Failed to update share status");
    } finally {
      setIsSharing(false);
    }
  };

  const handleUpdateRating = async (val: number) => {
    if (!selectedTrip) return;
    try {
      await api(`/trips/${selectedTrip.id}`, {
        method: "PUT",
        body: JSON.stringify({ rating: val })
      });
      setSelectedTrip({ ...selectedTrip, rating: val });
    } catch {
      alert("Failed to update rating");
    }
  };

  const startEditing = (item: ItineraryItem) => {
    setEditingItem(item);
    setItineraryForm({
      day: item.day,
      time: item.time,
      activity: item.activity,
      location: item.location,
      type: item.type,
      notes: item.notes
    });
    setIsAddingItinerary(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-green-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const ongoingTrips = trips.filter(t => t.status === 'ongoing');
  const upcomingTrips = trips.filter(t => t.status === 'upcoming');
  const completedTrips = trips.filter(t => t.status === 'completed');

  if (!isAuthenticated) return null;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface-background">
      <div className="max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 w-full h-full overflow-hidden">
        
        {/* Left Column: Trip List Grouped by Status */}
        <div className="w-full lg:w-80 flex flex-col gap-8 shrink-0 h-full overflow-y-auto custom-scrollbar pr-2 pb-24 md:pb-0">
          <div className="flex items-center justify-between">
            <h1 className="font-headline text-2xl font-black text-on-surface uppercase italic tracking-tighter">My Journey</h1>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openCreateTrip'))}
              className="p-2.5 bg-primary text-on-primary rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-8">
            {/* Ongoing Section */}
            <div className="space-y-4">
               <button 
                 onClick={() => setExpandedSections({...expandedSections, ongoing: !expandedSections.ongoing})}
                 className="flex items-center gap-2 w-full text-[10px] font-black uppercase text-green-600 tracking-[0.2em] border-b border-green-100 pb-2"
               >
                 {expandedSections.ongoing ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                 Ongoing Trips ({ongoingTrips.length})
               </button>
               {expandedSections.ongoing && (
                 <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {ongoingTrips.map(trip => (
                      <div 
                        key={trip.id} 
                        onClick={() => fetchTripDetails(trip.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer group relative ${
                          selectedTrip?.id === trip.id 
                            ? 'border-green-500 bg-green-50 shadow-md' 
                            : 'border-border-subtle bg-surface-canvas hover:border-green-300'
                        }`}
                      >
                        <h3 className={`font-headline text-sm font-bold truncate pr-6 ${
                          selectedTrip?.id === trip.id ? 'text-green-800' : 'text-text-primary'
                        }`}>
                          {trip.title}
                        </h3>
                        <p className="font-body text-[10px] text-text-secondary mt-1 font-bold uppercase tracking-wider">{trip.destination}</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip.id); }}
                          className="absolute top-4 right-4 text-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {ongoingTrips.length === 0 && <p className="text-[10px] text-text-secondary italic opacity-50 px-2">No active journeys right now.</p>}
                 </div>
               )}
            </div>

            {/* Upcoming Section */}
            <div className="space-y-4">
               <button 
                 onClick={() => setExpandedSections({...expandedSections, upcoming: !expandedSections.upcoming})}
                 className="flex items-center gap-2 w-full text-[10px] font-black uppercase text-blue-600 tracking-[0.2em] border-b border-blue-100 pb-2"
               >
                 {expandedSections.upcoming ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                 Upcoming Trips ({upcomingTrips.length})
               </button>
               {expandedSections.upcoming && (
                 <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {upcomingTrips.map(trip => (
                      <div 
                        key={trip.id} 
                        onClick={() => fetchTripDetails(trip.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer group relative ${
                          selectedTrip?.id === trip.id 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-border-subtle bg-surface-canvas hover:border-blue-300'
                        }`}
                      >
                        <h3 className={`font-headline text-sm font-bold truncate pr-6 ${
                          selectedTrip?.id === trip.id ? 'text-blue-800' : 'text-text-primary'
                        }`}>
                          {trip.title}
                        </h3>
                        <p className="font-body text-[10px] text-text-secondary mt-1 font-bold uppercase tracking-wider">{trip.destination}</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip.id); }}
                          className="absolute top-4 right-4 text-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {upcomingTrips.length === 0 && <p className="text-[10px] text-text-secondary italic opacity-50 px-2">Your next adventure is waiting to be planned.</p>}
                 </div>
               )}
            </div>

            {/* Completed Section */}
            <div className="space-y-4">
               <button 
                 onClick={() => setExpandedSections({...expandedSections, completed: !expandedSections.completed})}
                 className="flex items-center gap-2 w-full text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] border-b border-gray-100 pb-2"
               >
                 {expandedSections.completed ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                 Memories ({completedTrips.length})
               </button>
               {expandedSections.completed && (
                 <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {completedTrips.map(trip => (
                      <div 
                        key={trip.id} 
                        onClick={() => fetchTripDetails(trip.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer group relative opacity-70 hover:opacity-100 ${
                          selectedTrip?.id === trip.id 
                            ? 'border-gray-500 bg-gray-50 shadow-md' 
                            : 'border-border-subtle bg-surface-canvas'
                        }`}
                      >
                        <h3 className="font-headline text-sm font-bold truncate pr-6 text-text-primary">
                          {trip.title}
                        </h3>
                        <p className="font-body text-[10px] text-text-secondary mt-1 font-bold uppercase tracking-wider">{trip.destination}</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip.id); }}
                          className="absolute top-4 right-4 text-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {completedTrips.length === 0 && <p className="text-[10px] text-text-secondary italic opacity-50 px-2">Finish a trip to see it here!</p>}
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Right Column: Trip Details */}
        <div className="flex-1 flex flex-col gap-6 min-w-0 h-full overflow-y-auto custom-scrollbar pr-2 pb-24 md:pb-0">
          {detailsLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : selectedTrip ? (
            <>
              {/* Trip Header Card */}
              <div className="relative w-full h-64 md:h-72 rounded-[3rem] overflow-hidden shadow-xl shrink-0 border border-border-subtle group">
                <img 
                  src={selectedTrip.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt="" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-10 md:p-14 flex flex-col justify-end">
                  <div className="flex items-end justify-between gap-8">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic tracking-widest shadow-lg">
                          {selectedTrip.category || "Adventure"}
                        </span>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/20 ${getStatusColor(selectedTrip.status)}`}>
                          {selectedTrip.status}
                        </span>
                      </div>
                      <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight uppercase italic truncate">{selectedTrip.title}</h2>
                      
                      {/* Rating Selector */}
                      <div className="flex items-center gap-2 mt-4 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star}
                            onClick={() => handleUpdateRating(star)}
                            className="transition-all hover:scale-125 active:scale-95"
                          >
                            <Star 
                              size={22} 
                              className={star <= selectedTrip.rating ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" : "text-white/20"} 
                            />
                          </button>
                        ))}
                        <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] ml-4">Journey Quality</span>
                      </div>

                      <div className="flex items-center gap-6 text-white/90 mt-4 border-t border-white/10 pt-4 w-max">
                         <div className="flex items-center gap-2">
                           <MapPin size={18} className="text-primary" />
                           <span className="font-label text-sm font-black uppercase tracking-wider">{selectedTrip.destination}</span>
                           {selectedTrip.map_url && (
                             <a 
                               href={selectedTrip.map_url} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="ml-2 p-1.5 bg-white/10 hover:bg-white/30 rounded-lg transition-all border border-white/10"
                               title="View on Google Maps"
                             >
                               <Map size={14} className="text-white" />
                             </a>
                           )}
                         </div>
                         <div className="flex items-center gap-2 border-l border-white/20 pl-6">
                           <Calendar size={18} className="text-primary" />
                           <span className="font-label text-sm font-black uppercase tracking-wider">
                             {selectedTrip.start_date ? new Date(selectedTrip.start_date).toLocaleDateString() : 'TBD'}
                           </span>
                         </div>
                      </div>
                    </div>
                    <div className="flex gap-3 shrink-0 mb-2">
                       <button 
                         onClick={handleToggleShare}
                         disabled={isSharing}
                         className={`backdrop-blur-md text-white p-4 rounded-2xl transition-all border border-white/20 flex items-center gap-3 shadow-xl ${
                           selectedTrip.is_public ? 'bg-green-500/40 hover:bg-green-500/60 border-green-400/40' : 'bg-white/10 hover:bg-white/20'
                         }`}
                         title={selectedTrip.is_public ? "Public on Community" : "Private (Tap to share)"}
                       >
                         {isSharing ? <Loader2 size={20} className="animate-spin" /> : 
                          selectedTrip.is_public ? <Globe size={20} /> : <GlobeLock size={20} />}
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden xl:inline">
                           {selectedTrip.is_public ? "Shared" : "Share"}
                         </span>
                       </button>
                       <button 
                         onClick={() => setIsEditingTrip(true)}
                         className="bg-white/10 backdrop-blur-md text-white p-4 rounded-2xl hover:bg-white/20 transition-all border border-white/10 shadow-xl"
                       >
                         <Edit2 size={20} />
                       </button>
                       <button className="bg-white/10 backdrop-blur-md text-white p-4 rounded-2xl hover:bg-white/20 transition-all border border-white/10 shadow-xl">
                         <Share2 size={20} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-8 border-b border-border-subtle shrink-0 mt-4 px-4">
                {[
                  { id: 'itinerary', label: 'Itinerary', icon: Clock },
                  { id: 'budget', label: 'Budget', icon: Wallet },
                  { id: 'notes', label: 'Notes', icon: FileText },
                  { id: 'map', label: 'Map', icon: Map }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-5 px-1 flex items-center gap-3 font-label text-xs font-black uppercase tracking-[0.2em] transition-all border-b-[6px] rounded-t-sm ${
                      activeTab === tab.id 
                        ? 'border-primary text-primary opacity-100' 
                        : 'border-transparent text-text-secondary hover:text-text-primary opacity-40'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 min-h-0 pt-6">
                {activeTab === 'itinerary' && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between px-4">
                       <h3 className="font-headline text-2xl font-black text-on-surface uppercase italic tracking-tighter">Timeline</h3>
                       <button 
                         onClick={() => {
                            setEditingItem(null);
                            setItineraryForm({ day: 1, time: "09:00 AM", activity: "", location: "", type: "activity", notes: "" });
                            setIsAddingItinerary(true);
                         }}
                         className="flex items-center gap-3 bg-primary text-on-primary px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
                       >
                         <Plus size={18} /> Add Entry
                       </button>
                    </div>

                    {isAddingItinerary && (
                      <form onSubmit={handleSaveItinerary} className="mx-4 bg-surface-canvas border border-primary/20 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 space-y-6">
                         <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                            <h4 className="font-headline text-lg font-black text-primary uppercase italic tracking-widest">{editingItem ? "Edit Entry" : "New Entry"}</h4>
                            <button type="button" onClick={() => {setIsAddingItinerary(false); setEditingItem(null);}}><X size={20} className="text-text-secondary hover:text-red-500" /></button>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col gap-2">
                               <label className="text-[10px] font-black uppercase text-text-secondary tracking-[0.2em]">When</label>
                               <div className="flex gap-3">
                                  <div className="flex flex-col flex-1">
                                     <span className="text-[9px] text-primary font-black uppercase mb-1">Day</span>
                                     <input type="number" min="1" value={itineraryForm.day} onChange={e => setItineraryForm({...itineraryForm, day: Number(e.target.value)})} className="w-full bg-surface-background border border-border-subtle rounded-xl px-4 py-3 text-sm font-bold text-center outline-none focus:border-primary" />
                                  </div>
                                  <div className="flex flex-col flex-[2]">
                                     <span className="text-[9px] text-primary font-black uppercase mb-1">Time</span>
                                     <input type="text" value={itineraryForm.time} onChange={e => setItineraryForm({...itineraryForm, time: e.target.value})} className="w-full bg-surface-background border border-border-subtle rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary" placeholder="9:00 AM" />
                                  </div>
                               </div>
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                               <label className="text-[10px] font-black uppercase text-text-secondary tracking-[0.2em]">Activity / Experience</label>
                               <input required type="text" value={itineraryForm.activity} onChange={e => setItineraryForm({...itineraryForm, activity: e.target.value})} className="w-full bg-surface-background border border-border-subtle rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary" placeholder="E.g., Sunrise over Taj Mahal" />
                            </div>
                            <div className="flex flex-col gap-2">
                               <label className="text-[10px] font-black uppercase text-text-secondary tracking-[0.2em]">Location</label>
                               <input type="text" value={itineraryForm.location} onChange={e => setItineraryForm({...itineraryForm, location: e.target.value})} className="w-full bg-surface-background border border-border-subtle rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary" placeholder="Specific spot or landmark" />
                            </div>
                            <div className="flex flex-col gap-2">
                               <label className="text-[10px] font-black uppercase text-text-secondary tracking-[0.2em]">Entry Type</label>
                               <select value={itineraryForm.type} onChange={e => setItineraryForm({...itineraryForm, type: e.target.value})} className="w-full bg-surface-background border border-border-subtle rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary appearance-none">
                                  <option value="activity">Activity</option>
                                  <option value="transit">Transit</option>
                                  <option value="stay">Stay</option>
                               </select>
                            </div>
                            <div className="flex flex-col gap-2">
                               <label className="text-[10px] font-black uppercase text-text-secondary tracking-[0.2em]">Additional Notes</label>
                               <input type="text" value={itineraryForm.notes} onChange={e => setItineraryForm({...itineraryForm, notes: e.target.value})} className="w-full bg-surface-background border border-border-subtle rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-primary" placeholder="Confirmation #, tips, etc." />
                            </div>
                         </div>
                         <div className="flex justify-end pt-4">
                            <button type="submit" className="bg-primary text-on-primary px-12 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 active:scale-95 transition-all">
                               {editingItem ? "Update Entry" : "Save Experience"}
                            </button>
                         </div>
                      </form>
                    )}

                    <div className="space-y-8 px-4">
                      {selectedTrip.itineraries && selectedTrip.itineraries.length > 0 ? (
                        selectedTrip.itineraries.map((item: ItineraryItem) => (
                          <div key={item.id} className="flex gap-8 relative group">
                            <div className="absolute left-[21px] top-10 bottom-0 w-1 bg-border-subtle/20 group-last:hidden"></div>
                            
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-surface-background shadow-xl transition-all group-hover:scale-125 ${
                              item.type === 'transit' ? 'bg-blue-100 text-blue-600' : 
                              item.type === 'stay' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                            }`}>
                              {item.type === 'transit' ? <PlaneTakeoff size={20} /> : 
                               item.type === 'stay' ? <Home size={20} /> : <CheckCircle2 size={20} />}
                            </div>
                            
                            <div className="flex-1 pb-12">
                              <motion.div 
                                whileHover={{ x: 10 }}
                                className="bg-surface-canvas p-6 md:p-8 rounded-[2.5rem] border border-border-subtle shadow-sm group-hover:shadow-2xl transition-all group-hover:border-primary/40 relative"
                              >
                                <div className="absolute top-6 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                   <button onClick={() => startEditing(item)} className="p-2.5 bg-surface-background hover:bg-primary/10 text-text-secondary hover:text-primary rounded-xl transition-all border border-border-subtle">
                                      <Edit2 size={16} />
                                   </button>
                                   <button onClick={() => handleDeleteItinerary(item.id)} className="p-2.5 bg-surface-background hover:bg-red-50 text-text-secondary hover:text-red-500 rounded-xl transition-all border border-border-subtle">
                                      <Trash2 size={16} />
                                   </button>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                  <h4 className="font-headline text-xl font-black text-on-surface uppercase tracking-tight pr-24 leading-tight">{item.activity}</h4>
                                  <div className="flex items-center gap-3 shrink-0">
                                     <span className="font-label text-[10px] font-black uppercase text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/20 shadow-sm">
                                       Day {item.day}
                                     </span>
                                     <span className="font-display text-[10px] font-black text-text-secondary bg-surface-background px-4 py-2 rounded-full border border-border-subtle shadow-sm italic">
                                       {item.time}
                                     </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 text-text-secondary border-t border-border-subtle/50 pt-6">
                                  <MapPin size={18} className="text-primary/80" />
                                  <span className="font-label text-sm font-black uppercase tracking-widest">{item.location}</span>
                                  {item.location && (
                                    <a 
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-2 p-1.5 hover:bg-primary/10 rounded-lg text-primary/40 hover:text-primary transition-all"
                                      title="Open in Maps"
                                    >
                                      <Map size={16} />
                                    </a>
                                  )}
                                </div>
                                {item.notes && (
                                  <div className="mt-6 p-6 bg-surface-background/50 rounded-2xl border-l-[6px] border-primary/40 shadow-inner">
                                    <p className="font-body text-sm text-text-secondary italic leading-relaxed">
                                      "{item.notes}"
                                    </p>
                                  </div>
                                )}
                              </motion.div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-24 bg-surface-canvas rounded-[4rem] border-2 border-dashed border-border-subtle text-center flex flex-col items-center justify-center p-12 opacity-60">
                          <div className="w-20 h-20 rounded-full bg-surface-background flex items-center justify-center mb-6 shadow-inner border border-border-subtle">
                             <PlusCircle className="text-text-secondary w-10 h-10 opacity-20" />
                          </div>
                          <h4 className="font-headline text-xl font-bold text-on-surface uppercase italic">Adventure Blueprint Empty</h4>
                          <p className="font-body text-sm text-text-secondary mt-3 max-w-xs leading-relaxed">Your story is waiting to be written. Use the button above to map your path.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'budget' && (
                  <div className="space-y-6 px-4">
                     <div className="flex items-center justify-between mb-4">
                        <h3 className="font-headline text-2xl font-black text-on-surface uppercase italic tracking-tighter">Finance Hub</h3>
                        <button 
                          onClick={() => setActiveTab('budget')}
                          className="text-primary font-label text-[10px] font-black uppercase tracking-[0.2em] hover:underline bg-primary/5 px-4 py-2 rounded-full border border-primary/10"
                        >
                          Budget Planner
                        </button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="bg-surface-canvas p-10 rounded-[3rem] border border-border-subtle shadow-xl flex flex-col justify-between min-h-[220px] relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
                         <div>
                            <span className="font-label text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2 block">Accumulated Investment</span>
                            <h3 className="font-display text-5xl font-black text-primary mt-2">
                              ${selectedTrip.budgets?.reduce((s:number, b:BudgetEntry) => s + b.amount, 0).toFixed(2)}
                            </h3>
                         </div>
                         <div className="mt-10">
                            <div className="flex justify-between text-[10px] font-black uppercase text-text-secondary mb-3 tracking-widest">
                               <span>Experience Coverage</span>
                               <span className="text-primary">82%</span>
                            </div>
                            <div className="h-3 bg-surface-background rounded-full overflow-hidden shadow-inner border border-border-subtle/30">
                               <div className="h-full bg-primary w-[82%] rounded-full shadow-lg transition-all duration-1000"></div>
                            </div>
                         </div>
                       </div>
                       
                       <div className="flex flex-col gap-4">
                          {selectedTrip.budgets?.slice(0, 4).map((b:BudgetEntry) => (
                             <motion.div 
                               whileHover={{ x: 10 }}
                               key={b.id} 
                               className="bg-surface-canvas p-5 rounded-2xl border border-border-subtle flex items-center justify-between shadow-sm hover:shadow-lg transition-all"
                             >
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner"><Wallet size={18} /></div>
                                   <span className="font-headline text-base font-black text-on-surface uppercase tracking-tight">{b.category}</span>
                                </div>
                                <span className="font-display text-lg font-black text-primary">${b.amount.toFixed(2)}</span>
                             </motion.div>
                          ))}
                          {(!selectedTrip.budgets || selectedTrip.budgets.length === 0) && (
                            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-[2.5rem] p-8 opacity-40">
                               <Wallet size={32} className="mb-3" />
                               <p className="font-label text-[10px] font-black uppercase">No expenses logged</p>
                            </div>
                          )}
                       </div>
                     </div>
                  </div>
                )}
                
                {activeTab === 'notes' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4">
                    {selectedTrip.notes && selectedTrip.notes.length > 0 ? (
                      selectedTrip.notes.map((note: Note) => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={note.id} 
                          className="bg-yellow-50/30 p-8 rounded-[2.5rem] border border-yellow-200/40 shadow-sm hover:shadow-2xl transition-all relative flex flex-col group min-h-[240px]"
                        >
                          <h4 className="font-headline text-xl font-black text-on-surface mb-4 italic uppercase tracking-tighter pr-10">{note.title}</h4>
                          <p className="font-body text-sm text-text-secondary flex-1 line-clamp-6 leading-relaxed opacity-80 whitespace-pre-wrap italic">"{note.content}"</p>
                          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                             <button className="p-2 bg-white/80 rounded-xl shadow-md text-yellow-600 hover:bg-white"><Edit2 size={16} /></button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full py-24 text-center bg-surface-canvas rounded-[4rem] border-2 border-dashed border-border-subtle opacity-40 flex flex-col items-center">
                        <FileText className="w-16 h-16 text-text-secondary mb-6 opacity-10" />
                        <p className="font-headline text-lg font-bold uppercase tracking-widest italic">Travel Journal Empty</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'map' && (
                  <div className="mx-4 w-auto h-[600px] bg-surface-canvas rounded-[4rem] border border-border-subtle overflow-hidden relative shadow-2xl group">
                     <div className="absolute inset-0 bg-[#f0f0f0] flex flex-col items-center justify-center p-12 text-center transition-all group-hover:bg-[#e8e8e8]">
                        <div className="flex flex-col items-center gap-8 max-w-sm">
                           <div className="p-8 bg-white rounded-full shadow-2xl animate-bounce border-4 border-primary/20">
                              <MapPin size={64} className="text-primary" />
                           </div>
                           <div>
                              <h4 className="font-headline text-3xl font-black text-on-surface uppercase italic tracking-tighter mb-4">Discover {selectedTrip.destination}</h4>
                              <p className="font-body text-sm text-text-secondary leading-relaxed mb-10 opacity-70">Experience precise navigation and explore hidden local treasures with our integrated mapping system.</p>
                              
                              <a 
                                href={selectedTrip.map_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedTrip.destination)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-4 bg-[#1a73e8] text-white px-10 py-5 rounded-[2rem] font-label text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-400/30 hover:bg-[#1557b0] transition-all active:scale-95 group/map"
                              >
                                 <Map size={24} className="group-hover/map:rotate-12 transition-transform" />
                                 Launch Google Maps
                              </a>
                           </div>
                        </div>
                     </div>

                     <div className="absolute bottom-10 left-10 right-10 bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] border border-white/40 shadow-2xl transition-all translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="flex items-center gap-6">
                           <div className="p-4 bg-primary rounded-2xl text-white shadow-xl rotate-3"><Info size={32} /></div>
                           <div>
                              <h4 className="font-headline text-lg font-black text-on-surface uppercase italic tracking-tight">Geo-Navigation Active</h4>
                              <p className="font-body text-xs text-text-secondary opacity-70">Direct integration with Google Maps allows you to visualize your timeline across {selectedTrip.destination} with real-time GPS accuracy.</p>
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
               <h2 className="font-headline text-2xl font-black text-on-surface opacity-30 italic uppercase tracking-widest">Select an Adventure</h2>
               <p className="font-body text-sm text-text-secondary mt-4 max-w-xs opacity-50 italic">Your travel story starts with a single click. Select a trip from the sidebar to continue.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Trip Modal */}
      {isEditingTrip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface-canvas w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl border border-border-subtle flex flex-col"
          >
            <div className="flex items-center justify-between px-10 py-8 border-b border-border-subtle bg-surface-container-lowest">
               <h2 className="font-display text-3xl font-black text-on-surface uppercase italic tracking-tighter">Refine Adventure</h2>
               <button onClick={() => setIsEditingTrip(false)} className="w-12 h-12 flex items-center justify-center hover:bg-surface-container rounded-full transition-colors">
                  <X size={28} className="text-text-secondary" />
               </button>
            </div>
            <form onSubmit={handleUpdateTrip} className="p-10 space-y-8">
               <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em] ml-2">Trip Title</label>
                    <input required type="text" value={tripForm.title} onChange={e => setTripForm({...tripForm, title: e.target.value})} className="w-full bg-surface-background border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em] ml-2">Destination</label>
                    <input required type="text" value={tripForm.destination} onChange={e => setTripForm({...tripForm, destination: e.target.value})} className="w-full bg-surface-background border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em] ml-2">Start Date</label>
                      <input type="date" value={tripForm.start_date} onChange={e => setTripForm({...tripForm, start_date: e.target.value})} className="w-full bg-surface-background border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase text-primary tracking-[0.3em] ml-2">End Date</label>
                      <input type="date" value={tripForm.end_date} onChange={e => setTripForm({...tripForm, end_date: e.target.value})} className="w-full bg-surface-background border border-border-subtle rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" />
                    </div>
                  </div>
               </div>
               <div className="flex justify-end gap-4 pt-6">
                  <button type="button" onClick={() => setIsEditingTrip(false)} className="px-10 py-4 text-xs font-black text-text-secondary hover:bg-surface-background rounded-2xl transition-all uppercase tracking-[0.2em]">Discard</button>
                  <button type="submit" className="bg-primary text-on-primary px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:opacity-90 active:scale-95 transition-all">Update Journey</button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Itinerary;
