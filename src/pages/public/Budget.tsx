import { useState, useEffect } from "react";
import { Map, Edit2, Landmark, Train, Utensils, AlertTriangle, PlusCircle, MapPin, Loader2, DollarSign, Wallet, Plane, Car, ShoppingBag, Coffee } from "lucide-react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";

export function Budget() {
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

  const calculateTotal = () => {
    if (!selectedTrip?.budgets) return 0;
    return selectedTrip.budgets.reduce((sum: number, b: any) => sum + b.amount, 0);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return <Utensils className="w-5 h-5" />;
      case 'transport': return <Plane className="w-5 h-5" />;
      case 'accommodation': return <Car className="w-5 h-5" />; // Placeholder
      case 'activities': return <Landmark className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return 'bg-orange-500';
      case 'transport': return 'bg-blue-500';
      case 'accommodation': return 'bg-green-500';
      case 'activities': return 'bg-purple-500';
      default: return 'bg-gray-500';
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
        <Wallet className="w-16 h-16 text-text-secondary mb-4" />
        <h2 className="text-2xl font-bold mb-2">No trips found</h2>
        <p className="text-text-secondary mb-6">Create a trip first to manage its budget.</p>
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
    <div className="flex-1 flex flex-col min-w-0 bg-surface-background relative md:w-full h-full">
      <header className="bg-surface-canvas border-b border-border-subtle p-4 md:p-6 shrink-0">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-text-primary">Budget Planner</h1>
            <p className="text-sm text-text-secondary">Track and manage your travel expenses</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text-secondary">Select Trip:</span>
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

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {detailsLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : selectedTrip ? (
          <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
            {/* Left panel: Expenses List */}
            <div className="xl:col-span-7 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-xl font-bold text-text-primary">Expenses for {selectedTrip.title}</h2>
                <button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
                  <PlusCircle className="w-4 h-4" />
                  Add Expense
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedTrip.budgets?.length > 0 ? (
                  selectedTrip.budgets.map((item: any) => (
                    <div key={item.id} className="bg-surface-canvas border border-border-subtle rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${getCategoryColor(item.category)}/10 flex items-center justify-center text-primary`}>
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-title text-base font-bold text-text-primary truncate">{item.category}</h3>
                        <p className="text-xs text-text-secondary">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-text-primary">${item.amount.toFixed(2)}</p>
                        <p className="text-[10px] uppercase tracking-widest text-text-secondary">{item.currency}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-surface-canvas rounded-xl border border-dashed border-border-subtle">
                    <DollarSign className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                    <p className="text-text-secondary">No expenses added yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Summary */}
            <div className="xl:col-span-5 flex flex-col gap-6">
              <div className="bg-surface-canvas border border-border-subtle rounded-2xl p-6 shadow-sm">
                <h2 className="font-title text-xl font-medium text-text-primary mb-6">Budget Summary</h2>
                
                <div className="mb-8">
                  <p className="font-body text-sm text-text-secondary">Total Expenses</p>
                  <h3 className="font-display text-5xl font-bold text-text-primary mt-1">
                    ${calculateTotal().toFixed(2)}
                  </h3>
                </div>

                <div className="space-y-6">
                  <h4 className="font-body text-base font-medium text-text-primary">Breakdown</h4>
                  {selectedTrip.budgets?.length > 0 ? (
                    <div className="space-y-4">
                      {/* Group by category and show breakdown */}
                      {Object.entries(
                        selectedTrip.budgets.reduce((acc: any, b: any) => {
                          acc[b.category] = (acc[b.category] || 0) + b.amount;
                          return acc;
                        }, {})
                      ).map(([category, amount]: [any, any]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-text-primary capitalize">{category}</span>
                            <span className="text-text-secondary">${amount.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                            <div 
                              className={`${getCategoryColor(category)} h-full rounded-full`} 
                              style={{ width: `${(amount / calculateTotal()) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-text-secondary italic">No data to display</p>
                  )}
                </div>
              </div>

              {/* Tips / Alerts */}
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex gap-4">
                <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-orange-800 text-sm">Budget Tip</h4>
                  <p className="text-orange-700 text-xs mt-1">
                    Based on your travel style, consider allocating 20% more for miscellaneous activities in {selectedTrip.destination}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-secondary">Select a trip to view budget details.</p>
          </div>
        )}
      </main>
    </div>
  );
}
export default Budget;
