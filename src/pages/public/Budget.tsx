import { Map, Edit2, Landmark, Train, Utensils, AlertTriangle, PlusCircle, MapPin } from "lucide-react";

export function Budget() {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface-background relative md:w-full h-full">
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Left panel: Timeline */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-headline text-2xl font-bold text-text-primary">Day 3: Paris</h2>
                <p className="font-body text-sm text-text-secondary mt-1">Tuesday, October 24</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded border border-border-subtle bg-surface-canvas text-on-surface-variant hover:bg-surface-container transition-colors">
                  <Map className="w-5 h-5" />
                </button>
                <button className="p-2 rounded border border-border-subtle bg-surface-canvas text-on-surface-variant hover:bg-surface-container transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="relative pl-6">
              <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-border-subtle z-0"></div>
              
              <div className="relative z-10 flex gap-4 mb-6">
                <div className="flex flex-col items-center pt-2">
                  <div className="w-6 h-6 rounded-full bg-itinerary-activity text-surface-canvas flex items-center justify-center shadow-sm">
                    <Landmark className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="font-label text-xs font-medium text-text-secondary mt-2 w-12 text-center">09:00</span>
                </div>
                <div className="flex-1 bg-surface-canvas border border-border-subtle rounded-xl p-4 shadow-sm border-l-4 border-l-itinerary-activity hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-title text-xl font-medium text-text-primary">Louvre Museum Tour</h3>
                      <p className="font-body text-sm text-text-secondary mt-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> Rue de Rivoli, 75001 Paris
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-body text-sm font-medium text-text-primary">$45.00</span>
                      <span className="block font-label text-xs font-semibold text-primary bg-primary-fixed px-2 py-0.5 rounded mt-1">Booked</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border-subtle flex gap-3">
                    <span className="font-label text-[11px] font-medium bg-surface-variant text-on-surface-variant px-2 py-1 rounded-full">Guided</span>
                    <span className="font-label text-[11px] font-medium bg-surface-variant text-on-surface-variant px-2 py-1 rounded-full">3 Hours</span>
                  </div>
                </div>
              </div>

              {/* Transit Segment */}
              <div className="relative z-10 flex gap-4 mb-6">
                <div className="flex flex-col items-center pt-2">
                  <div className="w-6 h-6 rounded-full bg-itinerary-transit text-surface-canvas flex items-center justify-center shadow-sm">
                    <Train className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="font-label text-xs font-medium text-text-secondary mt-2 w-12 text-center">12:30</span>
                </div>
                <div className="flex-1 bg-surface-canvas border border-border-subtle rounded-xl p-4 shadow-sm border-l-4 border-l-itinerary-transit hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-surface-container-low p-2 rounded-lg border border-border-subtle">
                        <span className="font-label text-xs font-semibold text-primary">Line 1</span>
                      </div>
                      <div>
                        <h3 className="font-body text-sm font-medium text-text-primary">Palais Royal to Châtelet</h3>
                        <p className="font-label text-[11px] font-medium text-text-secondary">15 min duration</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-body text-sm font-medium text-text-primary">$2.50</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dining Segment */}
              <div className="relative z-10 flex gap-4">
                <div className="flex flex-col items-center pt-2">
                  <div className="w-6 h-6 rounded-full bg-secondary text-surface-canvas flex items-center justify-center shadow-sm">
                    <Utensils className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="font-label text-xs font-medium text-text-secondary mt-2 w-12 text-center">19:00</span>
                </div>
                <div className="flex-1 bg-surface-canvas border border-border-subtle rounded-xl p-4 shadow-sm border-l-4 border-l-secondary hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-title text-xl font-medium text-text-primary">Dinner at Seine</h3>
                      <p className="font-body text-sm text-text-secondary mt-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> Le Calife, Port des Saints-Pères
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-body text-sm font-medium text-tertiary-container">$180.00</span>
                      <span className="block font-label text-[11px] font-medium text-text-secondary mt-1">Est. Cost</span>
                    </div>
                  </div>
                  <div className="mt-4 bg-error-container/30 border border-error-container rounded-lg p-3 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-secondary mt-0.5" />
                    <p className="font-label text-[11px] font-medium text-secondary">Currently exceeding daily dining budget allocation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="ml-14 mt-3 bg-surface-container-low border border-border-subtle border-dashed rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-text-secondary hover:bg-surface-container hover:text-text-primary transition-colors">
              <PlusCircle className="w-5 h-5" />
              <span className="font-body text-sm font-medium">Add Segment</span>
            </button>
          </div>

          {/* Right Panel: Budget */}
          <div className="xl:col-span-5 flex flex-col gap-6 mt-6 xl:mt-0">
            <div className="bg-surface-canvas border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col">
              <h2 className="font-title text-xl font-medium text-text-primary mb-4">Budget Overview</h2>
              <div className="flex flex-col gap-3 mb-8">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-body text-sm text-text-secondary">Total Estimated</p>
                    <h3 className="font-display text-5xl font-bold text-text-primary">$3,500<span className="font-title text-xl text-text-secondary">.00</span></h3>
                  </div>
                  <div className="text-right pb-2">
                    <p className="font-body text-sm text-text-secondary">Spent: <span className="text-text-primary font-medium">$2,145.00</span></p>
                  </div>
                </div>
                <div className="w-full bg-surface-variant h-3 rounded-full overflow-hidden flex">
                  <div className="bg-itinerary-stay h-full" style={{ width: '35%' }}></div>
                  <div className="bg-itinerary-transit h-full" style={{ width: '15%' }}></div>
                  <div className="bg-itinerary-activity h-full" style={{ width: '20%' }}></div>
                  <div className="bg-secondary h-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              
              <h4 className="font-body text-base font-medium text-text-primary mb-4">Breakdown</h4>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-itinerary-stay">
                    <Utensils className="w-5 h-5" /> {/* Just placeholder icons */}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-body text-sm font-medium text-text-primary">Accommodation</span>
                      <span className="font-body text-sm text-text-primary">$1,225.00</span>
                    </div>
                    <div className="w-full bg-surface-variant h-1.5 rounded-full">
                      <div className="bg-itinerary-stay h-1.5 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
export default Budget;
