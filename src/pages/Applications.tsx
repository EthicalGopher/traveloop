import { useState, useEffect } from "react";
import { Check, X, User as UserIcon, Loader2 } from "lucide-react";
import { api } from "../utils/api";

interface PendingUser {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

const Applications = () => {
  const [applications, setApplications] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchApplications = async () => {
    try {
      const data = await api("/admin/applications");
      setApplications(data);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAction = async (id: number, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      await api(`/admin/applications/${id}/${action}`, { method: "POST" });
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch {
      alert(`Failed to ${action} application`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-black text-on-surface tracking-tight uppercase italic font-display">
          Pending Access Requests
        </h3>
        <p className="text-on-surface-variant font-medium">
          Review and manage access requests for organization users.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-12 text-center ambient-shadow border border-white/20">
          <p className="text-on-surface-variant font-bold">No pending applications at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow border border-white/20 hover:border-primary/20 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <UserIcon size={24} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">
                    {app.role}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1 mb-6">
                <h4 className="text-lg font-bold text-on-surface">{app.full_name}</h4>
                <p className="text-sm text-on-surface-variant font-medium">{app.email}</p>
                <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-wider">
                  Applied: {new Date(app.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  disabled={actionLoading !== null}
                  onClick={() => handleAction(app.id, "approve")}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === app.id ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                  <span>Approve</span>
                </button>
                <button
                  disabled={actionLoading !== null}
                  onClick={() => handleAction(app.id, "reject")}
                  className="flex-1 bg-surface-container-high hover:bg-red-50 text-on-surface-variant hover:text-red-600 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <X size={18} />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
