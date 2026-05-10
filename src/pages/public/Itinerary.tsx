import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Map, Wallet, Plus, Share2, Download, GripVertical, Check, CloudSun, 
  Flag, MoreVertical, Landmark, Utensils, PlusCircle, Sun, Ticket, MapPin,
  Plane, Home, PlaneTakeoff, Clock, CheckCircle2, ArrowLeft,
  Calendar, FileText, Settings, Loader2
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
  const location = useLocation();

  const hash = location.hash.replace('#', '');
  const showAll = !hash || !['ongoing', 'upcoming', 'completed'].includes(hash);
  const showOngoing = showAll || hash === 'ongoing';
  const showUpcoming = showAll || hash === 'upcoming';
  const showCompleted = showAll || hash === 'completed';

  useEffect(() => {
    const fetchTrips = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await api("/trips");
        setTrips(data);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [isAuthenticated]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tripId = queryParams.get("id");
    if (tripId) {
      fetchTripDetails(tripId);
    } else {
      setSelectedTrip(null);
    }
  }, [location.search]);

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

  const ongoingTrips = trips.filter(t => t.status === 'ongoing');
  const upcomingTrips = trips.filter(t => t.status === 'upcoming');
  const completedTrips = trips.filter(t => t.status === 'completed');

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTripDuration = (start: string, end: string) => {
    if (!start || !end) return "";
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return `${diff} Days`;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!selectedTrip) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-surface-background p-4 md:p-8 overflow-y-auto w-full max-w-full">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-headline text-3xl font-bold text-text-primary">
              {showAll ? 'My Trips' : hash === 'ongoing' ? 'Ongoing Trips' : hash === 'upcoming' ? 'Upcoming Trips' : 'Completed Trips'}
            </h1>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openCreateTrip'))}
              className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label text-sm flex items-center gap-2 hover:bg-surface-tint transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              New Trip
            </button>
          </div>

          {!isAuthenticated && (
            <div className="bg-surface-canvas p-8 rounded-xl border border-border-subtle text-center">
              <h2 className="text-xl font-bold mb-2">Please log in</h2>
              <p className="text-text-secondary">You need to be logged in to view your trips.</p>
            </div>
          )}

          {isAuthenticated && trips.length === 0 && (
            <div className="bg-surface-canvas p-12 rounded-xl border-2 border-dashed border-border-subtle text-center">
              <Plane className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No trips yet</h2>
              <p className="text-text-secondary mb-6">Start your journey by creating your first trip.</p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openCreateTrip'))}
                className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label text-sm"
              >
                Create Trip
              </button>
            </div>
          )}

          {/* Ongoing */}
          {showOngoing && ongoingTrips.length > 0 && (
            <div id="ongoing" className="mb-8 scroll-mt-24">
              <h2 className="font-title text-xl font-medium text-text-primary mb-4 flex items-center gap-2">
                <PlaneTakeoff className="w-5 h-5 text-itinerary-stay" />
                Ongoing
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ongoingTrips.map(trip => (
                  <div 
                    key={trip.id}
                    onClick={() => window.location.search = `?id=${trip.id}`}
                    className="bg-surface-canvas border border-primary/30 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary transition-all cursor-pointer relative overflow-hidden group"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          {trip.image ? <img src={trip.image} className="w-full h-full object-cover rounded-lg" alt="" /> : <MapPin className="w-6 h-6" />}
                        </div>
                        <div>
                          <h3 className="font-title text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{trip.title}</h3>
                          <p className="font-body text-sm text-text-secondary">{trip.destination} • {formatDate(trip.start_date)} - {formatDate(trip.end_date)}</p>
                        </div>
                      </div>
                      <span className="bg-primary/10 text-primary px-2.5 py-1 rounded font-label text-[11px] uppercase tracking-wider font-semibold">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {showUpcoming && upcomingTrips.length > 0 && (
            <div id="upcoming" className="mb-8 scroll-mt-24">
              <h2 className="font-title text-xl font-medium text-text-primary mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Upcoming
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingTrips.map(trip => (
                  <div 
                    key={trip.id}
                    onClick={() => window.location.search = `?id=${trip.id}`}
                    className="bg-surface-canvas border border-border-subtle rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-itinerary-transit"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-text-primary">
                          {trip.image ? <img src={trip.image} className="w-full h-full object-cover rounded-lg" alt="" /> : <Plane className="w-6 h-6" />}
                        </div>
                        <div>
                          <h3 className="font-title text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{trip.title}</h3>
                          <p className="font-body text-sm text-text-secondary">{trip.destination} • {formatDate(trip.start_date)} - {formatDate(trip.end_date)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {showCompleted && completedTrips.length > 0 && (
            <div id="completed" className="scroll-mt-24">
              <h2 className="font-title text-xl font-medium text-text-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-text-secondary" />
                Completed
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-80">
                {completedTrips.map(trip => (
                  <div 
                    key={trip.id}
                    onClick={() => window.location.search = `?id=${trip.id}`}
                    className="bg-surface-canvas border border-border-subtle rounded-xl p-5 hover:shadow-sm transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-border-subtle"></div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-text-secondary">
                          {trip.image ? <img src={trip.image} className="w-full h-full object-cover rounded-lg" alt="" /> : <Home className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-title text-base font-bold text-text-primary">{trip.title}</h3>
                          <p className="font-body text-xs text-text-secondary">{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (detailsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-surface-background h-full flex-col md:flex-row">
      {/* Detail Header Mobile */}
      <div className="md:hidden bg-surface-canvas border-b border-border-subtle p-3 flex items-center gap-3 shrink-0">
        <button onClick={() => window.location.search = ""} className="p-2 rounded-full hover:bg-surface-container active:scale-95 transition-all text-text-secondary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-title text-lg font-medium text-text-primary truncate">{selectedTrip.title}</span>
      </div>

      {/* Left Panel: Trip Overview */}
      <div className="w-full md:w-[400px] border-r border-border-subtle bg-surface-canvas flex flex-col h-full overflow-y-auto z-10 shrink-0 hidden md:flex">
        {/* Back Button Overlay */}
        <div className="absolute top-4 left-4 z-20">
          <button onClick={() => window.location.search = ""} className="flex items-center gap-2 bg-surface-canvas/90 backdrop-blur-sm border border-border-subtle text-text-primary hover:text-primary px-3 py-1.5 rounded-full shadow-sm hover:shadow transition-all font-label text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            All Trips
          </button>
        </div>
        
        {/* Hero Image Area */}
        <div className="h-48 relative w-full bg-surface-container shrink-0">
          <img 
            alt={selectedTrip.title} 
            className="w-full h-full object-cover" 
            src={selectedTrip.image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000"} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="font-headline text-3xl font-bold">{selectedTrip.title}</h2>
            <p className="font-body text-sm opacity-90">{formatDate(selectedTrip.start_date)} - {formatDate(selectedTrip.end_date)} • {getTripDuration(selectedTrip.start_date, selectedTrip.end_date)}</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6 flex-1 flex flex-col">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-surface-container-low p-4 rounded-lg border border-border-subtle">
              <Map className="w-5 h-5 text-primary mb-1" />
              <div className="font-label text-xs text-text-secondary uppercase">Destinations</div>
              <div className="font-title text-xl text-text-primary font-medium">{selectedTrip.destination}</div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-lg border border-border-subtle">
              <Wallet className="w-5 h-5 text-itinerary-activity mb-1" />
              <div className="font-label text-xs text-text-secondary uppercase">Budget Items</div>
              <div className="font-title text-xl text-text-primary font-medium">{selectedTrip.budgets?.length || 0}</div>
            </div>
          </div>
          
          {/* Notes/Description */}
          <div className="shrink-0">
            <h3 className="font-label text-xs text-text-secondary mb-3 uppercase">Trip Category</h3>
            <p className="font-body text-sm text-text-primary bg-surface-container-lowest border border-border-subtle rounded-lg p-4">
              {selectedTrip.category || "Adventure"}
            </p>
          </div>
          
          {/* Primary Actions */}
          <div className="space-y-3 mt-auto shrink-0 pt-6">
            <button className="w-full bg-primary text-white rounded-lg py-3 px-4 font-label text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-shadow hover:bg-surface-tint">
              <Share2 className="w-4 h-4" />
              Share Itinerary
            </button>
          </div>
        </div>
      </div>

      {/* Main Area: Timeline Builder / Notes / Settings */}
      <div className="flex-1 flex flex-col overflow-hidden bg-surface-background relative">
        
        {/* Navbar for Trip Details */}
        <div className="bg-surface-canvas border-b border-border-subtle shrink-0">
          <div className="max-w-4xl mx-auto flex overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('itinerary')}
              className={`flex items-center gap-2 px-6 py-4 font-label text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'itinerary' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-container-lowest'}`}
            >
              <Calendar className="w-4 h-4" />
              Itinerary
            </button>
            <button 
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-6 py-4 font-label text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-container-lowest'}`}
            >
              <FileText className="w-4 h-4" />
              Trip Notes
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-6 py-4 font-label text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-container-lowest'}`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto pb-20">
            {activeTab === 'itinerary' && (
              <>
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-title text-2xl font-medium text-text-primary">Itinerary Details</h2>
                  <div className="flex gap-2">
                    <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-label text-xs">{getTripDuration(selectedTrip.start_date, selectedTrip.end_date)}</span>
                    <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-label text-xs uppercase">{selectedTrip.status}</span>
                  </div>
                </div>
                
                {/* Timeline Container */}
                <div className="relative pb-8">
                  
                  {selectedTrip.itineraries?.length > 0 ? (
                    selectedTrip.itineraries.map((item: any, idx: number) => (
                      <div key={item.id} className="relative pl-12 md:pl-16 mb-8 group">
                        <div className="absolute left-[27px] md:left-[39px] top-12 bottom-[-32px] w-0.5 bg-border-subtle z-0"></div>
                        <div className="absolute left-3 md:left-6 top-6 w-8 h-8 rounded-full bg-surface-canvas border-4 border-primary flex items-center justify-center z-10 shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        
                        <div className="bg-surface-canvas border border-border-subtle rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-32 bg-surface-container-low p-4 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-border-subtle relative">
                              <div className="font-label text-xs text-text-secondary uppercase">Day {item.day}</div>
                              <div className="font-title text-sm font-bold text-text-primary mt-1">{item.time}</div>
                            </div>
                            <div className="flex-1 p-4">
                              <h3 className="font-headline text-lg font-bold text-text-primary">{item.activity}</h3>
                              <p className="font-body text-sm text-text-secondary flex items-center gap-1 mt-1">
                                <MapPin className="w-4 h-4" /> {item.location}
                              </p>
                              {item.notes && <p className="mt-2 text-sm text-text-secondary italic">{item.notes}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-surface-canvas rounded-xl border border-dashed border-border-subtle">
                      <p className="text-text-secondary">No itinerary items yet.</p>
                      <button className="mt-4 text-primary font-bold hover:underline">Add first item</button>
                    </div>
                  )}

                  {/* Add Stop Button */}
                  <div className="relative pl-12 md:pl-16 pt-4">
                    <button className="w-full border-2 border-dashed border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low text-text-secondary hover:text-primary transition-colors rounded-lg py-4 flex items-center justify-center gap-2 font-label text-sm">
                      <PlusCircle className="w-5 h-5" />
                      Add Itinerary Item
                    </button>
                  </div>

                </div>
              </>
            )}

            {activeTab === 'notes' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <header className="mb-6">
                  <h2 className="font-title text-2xl font-medium text-text-primary mb-2">Trip Notes</h2>
                </header>
                
                {selectedTrip.notes?.length > 0 ? (
                  selectedTrip.notes.map((note: any) => (
                    <div key={note.id} className="bg-surface-canvas border border-border-subtle rounded-xl p-6 shadow-sm mb-6">
                      <h3 className="text-xl font-title font-medium text-text-primary mb-2">{note.title}</h3>
                      <p className="text-sm text-text-secondary whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-text-secondary text-center py-8">No notes yet for this trip.</p>
                )}

                <div className="bg-surface-container-low border border-border-subtle border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-text-secondary hover:bg-surface-container cursor-pointer transition-colors h-40 group">
                  <PlusCircle className="w-8 h-8 mb-3 group-hover:text-primary transition-colors" />
                  <span className="font-body text-sm font-medium group-hover:text-primary transition-colors">Create New Note</span>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <h2 className="font-title text-2xl font-medium text-text-primary mb-6">Trip Settings</h2>
                 
                 <div className="bg-surface-canvas border border-border-subtle rounded-xl p-6 shadow-sm mb-6">
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <div>
                             <p className="font-body text-sm font-medium text-text-primary">Delete Trip</p>
                             <p className="font-label text-xs text-text-secondary mt-1">This action cannot be undone.</p>
                          </div>
                          <button 
                            onClick={async () => {
                              if (confirm("Are you sure you want to delete this trip?")) {
                                try {
                                  await api(`/trips/${selectedTrip.id}`, { method: "DELETE" });
                                  window.location.search = "";
                                } catch (err) {
                                  alert("Failed to delete trip");
                                }
                              }
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold"
                          >
                            Delete
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Itinerary;
