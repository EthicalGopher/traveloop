import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  MapPin, 
  Activity as ActivityIcon, 
  Users, 
  Plane, 
  ArrowUpRight,
  Calendar,
  Globe,
  PieChart
} from "lucide-react";
import { api } from "../../utils/api";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell
} from 'recharts';

interface PopularCity {
  destination: string;
  count: number;
}

interface PopularActivity {
  activity: string;
  count: number;
}

interface Trend {
  date: string;
  count: number;
}

interface AnalyticsData {
  popular_cities: PopularCity[];
  popular_activities: PopularActivity[];
  signup_trends: Trend[];
  trip_trends: Trend[];
}

const COLORS = ['#5a2af7', '#a292ff', '#ffadbf', '#ffc2ce', '#39abf5', '#55b9ff'];

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api("/admin/analytics");
        setData(res);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface leading-tight">Trends & Analytics</h1>
          <p className="text-on-surface-variant text-sm mt-1">Real-time insights into user behaviors and platform trends.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant">
          <Calendar size={16} className="text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Last 30 Days</span>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Signups", value: (data.signup_trends ?? []).reduce((acc, curr) => acc + curr.count, 0), icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "New Trips", value: (data.trip_trends ?? []).reduce((acc, curr) => acc + curr.count, 0), icon: Plane, color: "text-primary", bg: "bg-primary/10" },
          { label: "Top City", value: (data.popular_cities ?? [])[0]?.destination || "N/A", icon: MapPin, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Hot Activity", value: (data.popular_activities ?? [])[0]?.activity || "N/A", icon: ActivityIcon, color: "text-pink-500", bg: "bg-pink-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">{stat.label}</p>
              <p className="text-2xl font-black text-on-surface">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Trend */}
        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-bold text-on-surface">User Signup Trends</h3>
            </div>
            <div className="flex items-center gap-1 text-green-600 font-bold text-xs">
              <ArrowUpRight size={14} />
              <span>+12%</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.signup_trends ?? []}>
                <defs>
                  <linearGradient id="colorSignup" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600 }}
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 800, fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSignup)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Cities */}
        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
                <Globe size={20} />
              </div>
              <h3 className="font-bold text-on-surface">Popular Cities</h3>
            </div>
            <PieChart size={18} className="text-on-surface-variant" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.popular_cities ?? []} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="destination" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, width: 100 }}
                />
                <Tooltip 
                   cursor={{ fill: 'transparent' }}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={24}>
                  {data.popular_cities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Activities */}
        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center">
                <ActivityIcon size={20} />
              </div>
              <h3 className="font-bold text-on-surface">Popular Activities</h3>
            </div>
          </div>
          <div className="space-y-4">
            {(data.popular_activities ?? []).slice(0, 5).map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-2xl border border-outline-variant/30 group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black text-primary border border-outline-variant shadow-inner">
                    {i + 1}
                  </div>
                  <span className="text-sm font-bold text-on-surface uppercase tracking-tight">{activity.activity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-on-surface-variant bg-white px-3 py-1 rounded-full border border-outline-variant">
                    {activity.count} mentions
                  </span>
                  <div className="w-20 bg-outline-variant/20 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-1000" 
                      style={{ width: `${(activity.count / ((data.popular_activities ?? [])[0]?.count || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
            {(data.popular_activities ?? []).length === 0 && (
              <p className="text-center py-10 text-on-surface-variant italic">No activity data yet.</p>
            )}
          </div>
        </div>

        {/* Trip Growth Trend */}
        <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 text-primary rounded-xl flex items-center justify-center">
                <Plane size={20} />
              </div>
              <h3 className="font-bold text-on-surface">Trip Creation Trends</h3>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trip_trends ?? []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600 }}
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 800, fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#5a2af7" radius={[10, 10, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
