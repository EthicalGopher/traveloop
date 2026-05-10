import React, { useState, useEffect } from "react";
import { 
  Users as UsersIcon, 
  Search, 
  MapPin, 
  Calendar, 
  Shield, 
  ChevronDown, 
  ChevronUp, 
  Map as MapIcon, 
  Clock, 
  ExternalLink 
} from "lucide-react";
import { api } from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  status: string;
  avatar: string;
  created_at: string;
}

interface Trip {
  id: number;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: string;
  user_id: number;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, tripsData] = await Promise.all([
          api("/admin/users"),
          api("/admin/trips")
        ]);
        setUsers(usersData);
        setTrips(tripsData);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserTrips = (userId: number) => {
    return trips.filter(trip => trip.user_id === userId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">User Management</h1>
          <p className="text-on-surface-variant text-sm">Manage users and oversee their travel activities.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 text-on-surface-variant text-[10px] uppercase tracking-widest font-bold border-b border-outline-variant">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Trips</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredUsers.map((user) => (
                <React.Fragment key={user.id}>
                  <tr className={`group hover:bg-primary/5 transition-colors cursor-pointer ${expandedUser === user.id ? 'bg-primary/5' : ''}`}
                      onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant">
                          <img 
                            src={user.avatar ? `http://localhost:8080${user.avatar}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                            alt={user.full_name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface leading-tight">{user.full_name}</p>
                          <p className="text-xs text-on-surface-variant leading-tight">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {user.role === 'admin' ? (
                          <Shield size={14} className="text-primary" />
                        ) : (
                          <UsersIcon size={14} className="text-on-surface-variant" />
                        )}
                        <span className={`text-[10px] font-black uppercase tracking-wider ${user.role === 'admin' ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 
                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant font-medium">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-on-surface">
                        <MapIcon size={14} className="text-primary/70" />
                        <span className="text-xs font-bold">{getUserTrips(user.id).length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors">
                        {expandedUser === user.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </td>
                  </tr>
                  
                  <AnimatePresence>
                    {expandedUser === user.id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-0 border-b border-outline-variant">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden py-6"
                          >
                            <div className="bg-surface-container-low/30 rounded-2xl p-6 border border-outline-variant/50">
                              <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary">User Trips</h3>
                                <div className="flex gap-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">Active</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">Upcoming</span>
                                  </div>
                                </div>
                              </div>
                              
                              {getUserTrips(user.id).length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {getUserTrips(user.id).map(trip => (
                                    <div key={trip.id} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-all shadow-sm group/trip relative">
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="space-y-0.5">
                                          <h4 className="text-sm font-bold text-on-surface group-hover/trip:text-primary transition-colors">{trip.title}</h4>
                                          <div className="flex items-center gap-1 text-[10px] text-on-surface-variant uppercase font-bold tracking-tight">
                                            <MapPin size={10} className="text-primary" />
                                            {trip.destination}
                                          </div>
                                        </div>
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                                          trip.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                                          trip.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                                          'bg-blue-100 text-blue-700'
                                        }`}>
                                          {trip.status}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-4 text-[10px] text-on-surface-variant">
                                        <div className="flex items-center gap-1">
                                          <Calendar size={12} className="opacity-50" />
                                          {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'TBD'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Clock size={12} className="opacity-50" />
                                          {trip.status}
                                        </div>
                                      </div>
                                      <div className="mt-4 pt-3 border-t border-outline-variant/20 flex justify-end">
                                        <button className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1">
                                          View Details <ExternalLink size={10} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-10">
                                  <p className="text-sm text-on-surface-variant italic">This user hasn't created any trips yet.</p>
                                </div>
                              )}
                              
                              <div className="mt-8 pt-6 border-t border-outline-variant/50 flex flex-wrap gap-3">
                                <button className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Deactivate User</button>
                                <button className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Reset Password</button>
                                <button className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container-high rounded-xl text-xs font-black uppercase tracking-widest transition-all">Edit Permissions</button>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
