import { useState, useEffect, useCallback } from "react";
import { Landmark, Utensils, AlertTriangle, PlusCircle, Loader2, DollarSign, Wallet, Plane, Car, X, Trash2, Edit2 } from "lucide-react";
import { api } from "../../utils/api";
import { useAuth } from "../../utils/auth";
import { motion } from "framer-motion";

interface BudgetEntry {
  id: number;
  category: string;
  amount: number;
  currency: string;
  created_at: string;
}

interface Trip {
  id: string | number;
  title: string;
  destination: string;
  budgets?: BudgetEntry[];
  map_url?: string;
}

export function Budget() {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<BudgetEntry | null>(null);
  
  const [expenseForm, setExpenseForm] = useState({
    category: "Food",
    amount: "",
    currency: "USD"
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

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !expenseForm.amount) return;

    try {
      if (editingExpense) {
        await api(`/trips/budget/${editingExpense.id}`, {
          method: "PUT",
          body: JSON.stringify({
            category: expenseForm.category,
            amount: parseFloat(expenseForm.amount),
            currency: expenseForm.currency
          })
        });
      } else {
        await api(`/trips/${selectedTrip.id}/budget`, {
          method: "POST",
          body: JSON.stringify({
            category: expenseForm.category,
            amount: parseFloat(expenseForm.amount),
            currency: expenseForm.currency
          })
        });
      }
      setIsAddingExpense(false);
      setEditingExpense(null);
      setExpenseForm({ category: "Food", amount: "", currency: "USD" });
      fetchTripDetails(selectedTrip.id);
    } catch (err) {
      console.error("Failed to save expense:", err);
      alert("Failed to save expense");
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await api(`/trips/budget/${id}`, { method: "DELETE" });
      if (selectedTrip) {
        fetchTripDetails(selectedTrip.id);
      }
    } catch {
      alert("Failed to delete expense");
    }
  };

  const startEditingExpense = (expense: BudgetEntry) => {
    setEditingExpense(expense);
    setExpenseForm({
      category: expense.category,
      amount: expense.amount.toString(),
      currency: expense.currency
    });
    setIsAddingExpense(true);
  };

  const calculateTotal = () => {
    if (!selectedTrip?.budgets) return 0;
    return selectedTrip.budgets.reduce((sum: number, b: BudgetEntry) => sum + b.amount, 0);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food': return <Utensils className="w-5 h-5" />;
      case 'transport': return <Plane className="w-5 h-5" />;
      case 'accommodation': return <Car className="w-5 h-5" />;
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
          className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold"
        >
          Create Trip
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface-background relative md:w-full h-full overflow-hidden">
      <header className="bg-surface-canvas border-b border-border-subtle p-4 md:p-6 shrink-0">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-text-primary italic uppercase tracking-tighter">Budget Planner</h1>
            <p className="text-sm text-text-secondary">Manage your adventure expenses</p>
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

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar pb-32">
        {detailsLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : selectedTrip ? (
          <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 xl:grid-cols-12 gap-10">
            {/* Left panel: Expenses List */}
            <div className="xl:col-span-7 flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-xl font-bold text-text-primary italic">Expenses for {selectedTrip.title}</h2>
                <button 
                  onClick={() => { setEditingExpense(null); setExpenseForm({category:"Food", amount:"", currency:"USD"}); setIsAddingExpense(true); }}
                  className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Expense
                </button>
              </div>

              {isAddingExpense && (
                <form onSubmit={handleSaveExpense} className="bg-surface-canvas border border-primary/20 rounded-[2rem] p-6 flex flex-col gap-6 items-end animate-in zoom-in-95 duration-200 shadow-sm">
                   <div className="flex items-center justify-between w-full">
                      <h3 className="font-headline text-sm font-bold text-primary uppercase">{editingExpense ? "Edit Expense" : "New Expense"}</h3>
                      <button type="button" onClick={() => {setIsAddingExpense(false); setEditingExpense(null);}} className="text-text-secondary hover:text-red-500"><X size={18} /></button>
                   </div>
                   <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Category</label>
                        <select 
                          value={expenseForm.category}
                          onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                          className="bg-surface-background border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                        >
                          <option>Food</option>
                          <option>Transport</option>
                          <option>Accommodation</option>
                          <option>Activities</option>
                          <option>Misc</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Amount ($)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          value={expenseForm.amount}
                          onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                          className="bg-surface-background border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full"
                          placeholder="0.00"
                        />
                      </div>
                   </div>
                   <button 
                      type="submit"
                      className="w-full sm:w-auto bg-primary text-on-primary px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      {editingExpense ? "Update Expense" : "Save Expense"}
                    </button>
                </form>
              )}
              
              <div className="space-y-4">
                {selectedTrip.budgets && selectedTrip.budgets.length > 0 ? (
                  selectedTrip.budgets.map((item: BudgetEntry) => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-surface-canvas border border-border-subtle rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all flex items-center gap-4 group relative overflow-hidden"
                    >
                      <div className={`w-14 h-14 rounded-2xl ${getCategoryColor(item.category)}/10 flex items-center justify-center text-primary shrink-0`}>
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-headline text-base font-bold text-text-primary truncate capitalize">{item.category}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right mr-10">
                        <p className="font-display text-xl font-bold text-text-primary">${item.amount.toFixed(2)}</p>
                        <p className="text-[10px] uppercase tracking-widest text-text-secondary font-black">{item.currency}</p>
                      </div>
                      <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                         <button onClick={() => startEditingExpense(item)} className="p-1.5 hover:bg-primary/10 text-text-secondary hover:text-primary rounded-lg transition-colors border border-border-subtle">
                            <Edit2 size={12} />
                         </button>
                         <button onClick={() => handleDeleteExpense(item.id)} className="p-1.5 hover:bg-red-50 text-text-secondary hover:text-red-500 rounded-lg transition-colors border border-border-subtle">
                            <Trash2 size={12} />
                         </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-surface-canvas rounded-[3rem] border-2 border-dashed border-border-subtle opacity-60">
                    <DollarSign className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-10" />
                    <p className="text-text-secondary font-headline text-sm font-bold uppercase tracking-widest italic">No expenses recorded.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Summary */}
            <div className="xl:col-span-5 flex flex-col gap-10">
              <div className="bg-surface-canvas border border-border-subtle rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20"></div>
                <h2 className="font-headline text-xl font-bold text-text-primary mb-10 italic uppercase tracking-tighter">Budget Summary</h2>
                
                <div className="mb-12">
                  <p className="font-label text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2">Total Accumulated Expenses</p>
                  <h3 className="font-display text-6xl font-bold text-primary mt-2">
                    ${calculateTotal().toFixed(2)}
                  </h3>
                </div>

                <div className="space-y-8">
                  <h4 className="font-headline text-sm font-bold text-text-primary uppercase tracking-widest border-b border-border-subtle pb-4">Spending Breakdown</h4>
                  {selectedTrip.budgets && selectedTrip.budgets.length > 0 ? (
                    <div className="space-y-6">
                      {Object.entries(
                        selectedTrip.budgets.reduce((acc: Record<string, number>, b: BudgetEntry) => {
                          acc[b.category] = (acc[b.category] || 0) + b.amount;
                          return acc;
                        }, {})
                      ).map(([category, amount]: [string, number]) => (
                        <div key={category} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[10px] text-text-primary uppercase tracking-widest capitalize">{category}</span>
                            <span className="text-text-secondary font-display text-sm font-bold">${amount.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-surface-background h-2.5 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className={`${getCategoryColor(category)} h-full rounded-full shadow-md transition-all duration-1000`} 
                              style={{ width: `${(amount / calculateTotal()) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-secondary italic opacity-40">Add expenses to visualize spending analytics.</p>
                  )}
                </div>
              </div>

              {/* Tips / Alerts */}
              <div className="bg-orange-50 border border-orange-100 rounded-[2.5rem] p-8 flex gap-6 shadow-sm border-l-8 border-l-orange-400">
                <AlertTriangle className="w-10 h-10 text-orange-400 shrink-0" />
                <div>
                  <h4 className="font-black text-orange-900 text-sm uppercase tracking-widest mb-1 italic">Adventure Tip</h4>
                  <p className="text-orange-800 text-xs mt-2 leading-relaxed font-body">
                    Smart travelers typically budget an extra 15% for spontaneous activities in destinations like {selectedTrip.destination}. Keep an eye on those misc expenses!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 bg-surface-canvas rounded-[4rem] border-2 border-dashed border-border-subtle">
            <p className="text-text-secondary italic font-headline text-lg opacity-40 uppercase tracking-widest animate-pulse">Select an Adventure to Plan Budget</p>
          </div>
        )}
      </main>
    </div>
  );
}
export default Budget;
