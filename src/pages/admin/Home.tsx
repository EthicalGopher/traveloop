import { useState, useEffect } from "react";
import { 
  Users, 
  Map as MapIcon, 
  UserPlus, 
  Globe, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Activity,
  ChevronRight,
  Calendar
} from "lucide-react";
import { api } from "../../utils/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface RecentUser {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
}

interface RecentTrip {
  id: number;
  title: string;
  destination: string;
  created_at: string;
  user: {
    full_name: string;
  };
}

interface SummaryData {
  total_users: number;
  total_trips: number;
  pending_requests: number;
  shared_journeys: number;
  recent_users: RecentUser[];
  recent_trips: RecentTrip[];
}

export default function Home() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api("/admin/summary");
        setData(res);
      } catch (error) {
        console.error("Failed to fetch summary", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = [
    { label: "Total Explorers", value: data.total_users, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Planned Trips", value: data.total_trips, icon: MapIcon, color: "text-primary", bg: "bg-primary/10" },
    { label: "Access Requests", value: data.pending_requests, icon: UserPlus, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Shared Journeys", value: data.shared_journeys, icon: Globe, color: "text-green-500", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface uppercase italic tracking-tighter font-display">Command Center</h1>
          <p className="text-on-surface-variant font-medium mt-1">Platform overview and operational status.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full border border-green-100 text-[10px] font-black uppercase tracking-widest">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Systems Operational
           </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between mb-4">
               <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                 <stat.icon size={24} />
               </div>
               <TrendingUp size={16} className="text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">{stat.label}</p>
              <p className="text-3xl font-black text-on-surface leading-none">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Users */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-on-surface uppercase tracking-tight">New Explorers</h3>
            </div>
            <Link to="/admin/users" className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <div className="bg-surface-container-lowest rounded-[2.5rem] border border-outline-variant overflow-hidden shadow-sm">
            <div className="divide-y divide-outline-variant/30">
              {data.recent_users.map((user) => (
                <div key={user.id} className="p-5 flex items-center justify-between hover:bg-primary/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary font-black text-xs border border-primary/5">
                      {user.full_name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{user.full_name}</p>
                      <p className="text-[10px] text-on-surface-variant font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase">
                        {new Date(user.created_at).toLocaleDateString()}
                     </span>
                     <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10 rounded-lg">
                        <ArrowRight size={16} />
                     </button>
                  </div>
                </div>
              ))}
              {data.recent_users.length === 0 && <p className="p-10 text-center text-sm italic text-on-surface-variant">No new explorers yet.</p>}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-primary p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-primary/30">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
             <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Strategic Growth</h3>
             <p className="text-white/80 text-sm mb-8 max-w-md leading-relaxed">Analyze platform trends to optimize explorer engagement and community content quality.</p>
             <div className="flex flex-wrap gap-4">
                <Link to="/admin/analytics" className="bg-white text-primary px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all active:scale-95">
                   Market Analytics
                </Link>
                <Link to="/admin/applications" className="bg-primary-container text-on-primary-container px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all active:scale-95">
                   Review Requests
                </Link>
             </div>
          </div>
        </div>

        {/* Recent Activity / Trips */}
        <div className="lg:col-span-5 space-y-6">
           <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 text-primary rounded-xl flex items-center justify-center">
                <Activity size={20} />
              </div>
              <h3 className="font-bold text-on-surface uppercase tracking-tight">Recent Adventures</h3>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant shadow-sm space-y-8">
             {data.recent_trips.map((trip, i) => (
                <div key={trip.id} className="relative flex gap-6 group">
                   {i !== data.recent_trips.length - 1 && (
                     <div className="absolute left-[19px] top-10 bottom-[-32px] w-0.5 bg-outline-variant/30"></div>
                   )}
                   <div className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center shrink-0 z-10 group-hover:border-primary/50 transition-colors">
                      <Clock size={16} className="text-on-surface-variant group-hover:text-primary" />
                   </div>
                   <div className="space-y-1 pb-4">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                         {trip.user.full_name} <span className="text-on-surface-variant lowercase font-medium mx-1">started</span>
                      </p>
                      <h4 className="text-sm font-bold text-on-surface">{trip.title}</h4>
                      <div className="flex items-center gap-4 pt-2">
                         <div className="flex items-center gap-1.5 text-[9px] font-black text-on-surface-variant uppercase tracking-tighter">
                            <MapIcon size={12} className="text-primary/50" />
                            {trip.destination}
                         </div>
                         <div className="flex items-center gap-1.5 text-[9px] font-black text-on-surface-variant uppercase tracking-tighter">
                            <Calendar size={12} className="text-primary/50" />
                            {new Date(trip.created_at).toLocaleDateString()}
                         </div>
                      </div>
                   </div>
                </div>
             ))}
             {data.recent_trips.length === 0 && <p className="text-center text-sm italic text-on-surface-variant py-10">No recent activity detected.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
