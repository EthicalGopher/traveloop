import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Map, Wallet, Plus, Share2, Download, GripVertical, Check, CloudSun, 
  Flag, MoreVertical, Landmark, Utensils, PlusCircle, Sun, Ticket, MapPin,
  Plane, Home, PlaneTakeoff, Clock, CheckCircle2, ArrowLeft,
  Calendar, FileText, Settings
} from "lucide-react";

export function Itinerary() {
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const location = useLocation();

  const hash = location.hash.replace('#', '');
  const showAll = !hash || !['ongoing', 'upcoming', 'completed'].includes(hash);
  const showOngoing = showAll || hash === 'ongoing';
  const showUpcoming = showAll || hash === 'upcoming';
  const showCompleted = showAll || hash === 'completed';

  useEffect(() => {
    if (location.hash && !selectedTripId && showAll) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash, selectedTripId, showAll]);

  if (!selectedTripId) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-surface-background p-4 md:p-8 overflow-y-auto w-full max-w-full">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-headline text-3xl font-bold text-text-primary">
              {showAll ? 'My Trips' : hash === 'ongoing' ? 'Ongoing Trips' : hash === 'upcoming' ? 'Upcoming Trips' : 'Completed Trips'}
            </h1>
            {showAll && (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openCreateTrip'))}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label text-sm flex items-center gap-2 hover:bg-surface-tint transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
                New Trip
              </button>
            )}
          </div>

          {/* Ongoing */}
          {showOngoing && (
            <div id="ongoing" className="mb-8 scroll-mt-24">
              <h2 className="font-title text-xl font-medium text-text-primary mb-4 flex items-center gap-2">
                <PlaneTakeoff className="w-5 h-5 text-itinerary-stay" />
                Ongoing
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => setSelectedTripId('1')}
                  className="bg-surface-canvas border border-primary/30 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary transition-all cursor-pointer relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-title text-lg font-bold text-text-primary group-hover:text-primary transition-colors">European Summer</h3>
                        <p className="font-body text-sm text-text-secondary">4 Cities • Jun 15 - Jun 28</p>
                      </div>
                    </div>
                    <span className="bg-primary/10 text-primary px-2.5 py-1 rounded font-label text-[11px] uppercase tracking-wider font-semibold">Active</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-subtle">
                    <div className="flex -space-x-2">
                      <img alt="Member" className="w-8 h-8 rounded-full border-2 border-surface-canvas object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150" />
                      <img alt="Member" className="w-8 h-8 rounded-full border-2 border-surface-canvas object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150" />
                    </div>
                    <div className="font-body text-sm text-text-secondary flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Day 5 of 14
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming */}
          {showUpcoming && (
            <div id="upcoming" className="mb-8 scroll-mt-24">
              <h2 className="font-title text-xl font-medium text-text-primary mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Upcoming
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className="bg-surface-canvas border border-border-subtle rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-itinerary-transit"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-text-primary">
                        <Plane className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-title text-lg font-bold text-text-primary group-hover:text-primary transition-colors">Weekend in Rome</h3>
                        <p className="font-body text-sm text-text-secondary">Rome, Italy • Oct 12 - Oct 15</p>
                      </div>
                    </div>
                    <span className="bg-surface-container-low text-text-secondary px-2.5 py-1 rounded font-label text-[11px] uppercase tracking-wider font-semibold">12 Days Away</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-subtle">
                    <div className="flex -space-x-2">
                      <img alt="Member" className="w-8 h-8 rounded-full border-2 border-surface-canvas bg-surface-container object-cover" src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150" />
                    </div>
                    <div className="font-body text-sm text-text-secondary flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> 3 Days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Completed */}
          {showCompleted && (
            <div id="completed" className="scroll-mt-24">
              <h2 className="font-title text-xl font-medium text-text-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-text-secondary" />
                Completed
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-80">
                <div className="bg-surface-canvas border border-border-subtle rounded-xl p-5 hover:shadow-sm transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-border-subtle"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-text-secondary">
                        <Home className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-title text-base font-bold text-text-primary">Swiss Alps Retreat</h3>
                        <p className="font-body text-xs text-text-secondary">Sep 28 - Oct 5, 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-surface-background h-full flex-col md:flex-row">
      {/* Detail Header Mobile */}
      <div className="md:hidden bg-surface-canvas border-b border-border-subtle p-3 flex items-center gap-3 shrink-0">
        <button onClick={() => setSelectedTripId(null)} className="p-2 rounded-full hover:bg-surface-container active:scale-95 transition-all text-text-secondary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-title text-lg font-medium text-text-primary truncate">European Summer</span>
      </div>

      {/* Left Panel: Trip Overview */}
      <div className="w-full md:w-[400px] border-r border-border-subtle bg-surface-canvas flex flex-col h-full overflow-y-auto z-10 shrink-0 hidden md:flex">
        {/* Back Button Overlay */}
        <div className="absolute top-4 left-4 z-20">
          <button onClick={() => setSelectedTripId(null)} className="flex items-center gap-2 bg-surface-canvas/90 backdrop-blur-sm border border-border-subtle text-text-primary hover:text-primary px-3 py-1.5 rounded-full shadow-sm hover:shadow transition-all font-label text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            All Trips
          </button>
        </div>
        
        {/* Hero Image Area */}
        <div className="h-48 relative w-full bg-surface-container shrink-0">
          <img 
            alt="Paris view" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="font-headline text-3xl font-bold">European Summer</h2>
            <p className="font-body text-sm opacity-90">Jun 15 - Jun 28 • 14 Days</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6 flex-1 flex flex-col">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="bg-surface-container-low p-4 rounded-lg border border-border-subtle">
              <Map className="w-5 h-5 text-primary mb-1" />
              <div className="font-label text-xs text-text-secondary uppercase">Destinations</div>
              <div className="font-title text-xl text-text-primary font-medium">4 Cities</div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-lg border border-border-subtle">
              <Wallet className="w-5 h-5 text-itinerary-activity mb-1" />
              <div className="font-label text-xs text-text-secondary uppercase">Est. Cost</div>
              <div className="font-title text-xl text-text-primary font-medium">$3,500</div>
            </div>
          </div>
          
          {/* Collaborators */}
          <div className="shrink-0">
            <h3 className="font-label text-xs text-text-secondary mb-3 uppercase">Travelers</h3>
            <div className="flex -space-x-2">
              <img 
                alt="Traveler 1" 
                className="w-10 h-10 rounded-full border-2 border-surface-canvas object-cover" 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150" 
              />
              <img 
                alt="Traveler 2" 
                className="w-10 h-10 rounded-full border-2 border-surface-canvas object-cover" 
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150" 
              />
              <button className="w-10 h-10 rounded-full border-2 border-dashed border-border-subtle bg-surface-container flex items-center justify-center text-text-secondary hover:bg-surface-dim transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Notes/Description */}
          <div className="shrink-0">
            <h3 className="font-label text-xs text-text-secondary mb-3 uppercase">Trip Notes</h3>
            <p className="font-body text-sm text-text-primary bg-surface-container-lowest border border-border-subtle rounded-lg p-4">
              Focusing on history, food, and mostly walking. Need to book the Louvre tickets in advance.
            </p>
          </div>
          
          {/* Primary Actions */}
          <div className="space-y-3 mt-auto shrink-0 pt-6">
            <button className="w-full bg-primary text-white rounded-lg py-3 px-4 font-label text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-shadow hover:bg-surface-tint">
              <Share2 className="w-4 h-4" />
              Share Itinerary
            </button>
            <button className="w-full bg-surface-canvas text-primary border border-border-subtle rounded-lg py-3 px-4 font-label text-sm flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
              <Download className="w-4 h-4" />
              Export PDF
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
                    <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-label text-xs">14 Days</span>
                    <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-label text-xs">Public</span>
                  </div>
                </div>
                
                {/* Timeline Container */}
                <div className="relative pb-8">
                  
                  {/* Timeline Item 1: London (Completed) */}
                  <div className="relative pl-12 md:pl-16 mb-8 group">
                    <div className="absolute left-[27px] md:left-[39px] top-12 bottom-[-32px] w-0.5 bg-itinerary-stay z-0"></div>
                    
                    <div className="absolute left-0 top-6 text-border-subtle hover:text-text-secondary cursor-grab hidden md:flex items-center">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    
                    <div className="absolute left-3 md:left-6 top-6 w-8 h-8 rounded-full bg-itinerary-stay border-4 border-surface-background flex items-center justify-center z-10 text-white shadow-sm">
                      <Check className="w-4 h-4" />
                    </div>
                    
                    <div className="bg-surface-canvas border border-border-subtle rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-32 bg-surface-container-low p-4 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-border-subtle relative">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-itinerary-stay"></div>
                          <div className="font-label text-xs text-text-secondary uppercase">Jun 15-18</div>
                          <div className="font-title text-xl font-bold text-text-primary mt-1">4 Days</div>
                          <div className="mt-2 flex items-center gap-1 text-text-secondary bg-surface-canvas px-2 py-1 rounded-full border border-border-subtle">
                            <CloudSun className="w-3.5 h-3.5" />
                            <span className="font-label text-[11px]">68°F</span>
                          </div>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-headline text-2xl font-bold text-text-primary">London</h3>
                              <p className="font-body text-sm text-text-secondary flex items-center gap-1 mt-1">
                                <Flag className="w-4 h-4" /> United Kingdom
                              </p>
                            </div>
                            <button className="text-text-secondary hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-2 bg-surface-container-lowest border border-border-subtle p-2 rounded text-text-primary font-body text-sm">
                              <Landmark className="text-itinerary-activity w-4 h-4" />
                              <span className="flex-1">British Museum Tour</span>
                              <span className="text-text-secondary text-xs">10:00 AM</span>
                            </div>
                            <div className="flex items-center gap-2 bg-surface-container-lowest border border-border-subtle p-2 rounded text-text-primary font-body text-sm">
                              <Utensils className="text-secondary w-4 h-4" />
                              <span className="flex-1">Dinner at Dishoom</span>
                              <span className="text-text-secondary text-xs">8:00 PM</span>
                            </div>
                          </div>
                          
                          <button className="mt-4 w-full md:w-auto text-primary font-label text-sm flex items-center gap-1 hover:bg-surface-container-low py-2 px-4 rounded transition-colors border border-dashed border-primary">
                            <PlusCircle className="w-4 h-4" />
                            Add Activity
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 2: Paris (Active/Current) */}
                  <div className="relative pl-12 md:pl-16 mb-8 group">
                    <div className="absolute left-[27px] md:left-[39px] top-12 bottom-[-32px] w-0.5 bg-border-subtle z-0"></div>
                    
                    <div className="absolute left-0 top-6 text-border-subtle hover:text-text-secondary cursor-grab hidden md:flex items-center">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    
                    <div className="absolute left-3 md:left-6 top-6 w-8 h-8 rounded-full bg-surface-canvas border-4 border-primary flex items-center justify-center z-10 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    
                    <div className="bg-surface-canvas border-2 border-primary rounded-lg overflow-hidden shadow-md relative">
                      <div className="absolute top-0 right-0 bg-primary text-white font-label text-[11px] px-2 py-1 rounded-bl-lg tracking-wider uppercase">Current Stop</div>
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-32 bg-surface-container-low p-4 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-border-subtle relative">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                          <div className="font-label text-xs text-text-secondary uppercase">Jun 19-23</div>
                          <div className="font-title text-xl font-bold text-text-primary mt-1">5 Days</div>
                          <div className="mt-2 flex items-center gap-1 text-text-secondary bg-surface-canvas px-2 py-1 rounded-full border border-border-subtle">
                            <Sun className="w-3.5 h-3.5" />
                            <span className="font-label text-[11px]">75°F</span>
                          </div>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-headline text-2xl font-bold text-text-primary">Paris</h3>
                              <p className="font-body text-sm text-text-secondary flex items-center gap-1 mt-1">
                                <Flag className="w-4 h-4" /> France
                              </p>
                            </div>
                            <button className="text-text-secondary hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-2 bg-surface-container-lowest border border-border-subtle p-2 rounded text-text-primary font-body text-sm">
                              <Ticket className="text-itinerary-activity w-4 h-4" />
                              <span className="flex-1">Eiffel Tower Summit</span>
                              <span className="text-text-secondary text-xs">Sunset</span>
                            </div>
                          </div>
                          
                          <button className="mt-4 w-full md:w-auto text-primary font-label text-sm flex items-center gap-1 hover:bg-surface-container-low py-2 px-4 rounded transition-colors border border-dashed border-primary">
                            <PlusCircle className="w-4 h-4" />
                            Add Activity
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 3: Rome (Upcoming) */}
                  <div className="relative pl-12 md:pl-16 mb-8 group">
                    <div className="absolute left-0 top-6 text-border-subtle hover:text-text-secondary cursor-grab hidden md:flex items-center">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    
                    <div className="absolute left-3 md:left-6 top-6 w-8 h-8 rounded-full bg-surface-canvas border-4 border-border-subtle flex items-center justify-center z-10 shadow-sm">
                      <MapPin className="text-border-subtle w-4 h-4" />
                    </div>
                    
                    <div className="bg-surface-canvas border border-border-subtle rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow opacity-80">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-32 bg-surface-container-low p-4 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-border-subtle relative">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-outline-variant"></div>
                          <div className="font-label text-xs text-text-secondary uppercase">Jun 24-28</div>
                          <div className="font-title text-xl font-bold text-text-primary mt-1">5 Days</div>
                          <div className="mt-2 flex items-center gap-1 text-text-secondary bg-surface-canvas px-2 py-1 rounded-full border border-border-subtle">
                            <Sun className="w-3.5 h-3.5" />
                            <span className="font-label text-[11px]">82°F</span>
                          </div>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-headline text-2xl font-bold text-text-primary">Rome</h3>
                              <p className="font-body text-sm text-text-secondary flex items-center gap-1 mt-1">
                                <Flag className="w-4 h-4" /> Italy
                              </p>
                            </div>
                            <button className="text-text-secondary hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <div className="mt-4 py-3 px-4 bg-surface-container-lowest border border-dashed border-border-subtle rounded text-center">
                            <p className="font-body text-sm text-text-secondary">No activities planned yet.</p>
                          </div>
                          
                          <button className="mt-4 w-full md:w-auto text-primary font-label text-sm flex items-center gap-1 hover:bg-surface-container-low py-2 px-4 rounded transition-colors border border-dashed border-primary">
                            <PlusCircle className="w-4 h-4" />
                            Add Activity
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add Stop Button */}
                  <div className="relative pl-12 md:pl-16 pt-4">
                    <button className="w-full border-2 border-dashed border-border-subtle bg-surface-container-lowest hover:bg-surface-container-low text-text-secondary hover:text-primary transition-colors rounded-lg py-4 flex items-center justify-center gap-2 font-label text-sm">
                      <MapPin className="w-5 h-5" />
                      Add Next Destination
                    </button>
                  </div>

                </div>
              </>
            )}

            {activeTab === 'notes' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <header className="mb-6">
                  <h2 className="font-title text-2xl font-medium text-text-primary mb-2">Trip Notes</h2>
                  <p className="font-body text-sm text-text-secondary">Capture your thoughts, ideas, and checklists for European Summer.</p>
                </header>
                
                <div className="bg-surface-canvas border border-border-subtle rounded-xl p-6 shadow-sm mb-6">
                  <input className="w-full text-xl font-title font-medium text-text-primary focus:outline-none mb-4 placeholder-text-secondary bg-transparent" placeholder="Note Title..." type="text" defaultValue="Packing List for Paris" />
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 rounded border-border-subtle text-primary focus:ring-primary" checked readOnly/>
                      <span className="font-body text-sm text-text-primary line-through opacity-70">Passports & Visas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 rounded border-border-subtle text-primary focus:ring-primary" />
                      <span className="font-body text-sm text-text-primary">Travel Adapters</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 rounded border-border-subtle text-primary focus:ring-primary" />
                      <span className="font-body text-sm text-text-primary">Comfortable Walking Shoes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-t border-border-subtle pt-4 text-text-secondary">
                    <button className="p-2 hover:bg-surface-container rounded-lg transition-colors"><FileText className="w-5 h-5" /></button>
                  </div>
                </div>

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
                    <h3 className="font-title text-lg font-medium text-text-primary mb-6 border-b border-border-subtle pb-4">General Settings</h3>
                    
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <div>
                             <p className="font-body text-sm font-medium text-text-primary">Trip Visibility</p>
                             <p className="font-label text-xs text-text-secondary mt-1">Make your itinerary visible to anyone with the link.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                       </div>

                       <div className="border-t border-border-subtle pt-6 flex items-center justify-between">
                          <div>
                             <p className="font-body text-sm font-medium text-text-primary">Collaborators</p>
                             <p className="font-label text-xs text-text-secondary mt-1">Allow invited travelers to edit the itinerary.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                       </div>
                       
                       <div className="border-t border-border-subtle pt-6">
                          <button className="text-error font-body text-sm font-medium py-2 px-4 rounded-lg hover:bg-error-container/20 transition-colors">
                             Delete Trip
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
