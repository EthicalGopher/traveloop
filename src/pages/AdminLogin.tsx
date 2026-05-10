import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, Mail, ArrowLeft } from "lucide-react";
import { api } from "../utils/api";
import { saveSession } from "../utils/auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"login" | "forgot">("login");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const session = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      
      if (session.user.role !== "admin") {
        throw new Error("Unauthorized: You do not have administrative privileges");
      }
      
      saveSession(session);
      navigate("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await api("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSuccessMessage(response.message);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 text-white">
      {/* Admin specific background effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-sky-900/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-orange-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-10 md:p-14 rounded-2xl shadow-2xl w-full max-w-md relative z-10 mx-4">
        {view === "forgot" && (
          <button 
            onClick={() => { setView("login"); setError(""); setSuccessMessage(""); }}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-8 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Login
          </button>
        )}

        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-sky-900/40">
            <ShieldCheck size={36} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase italic text-sky-400">
            {view === "login" ? "Admin Console" : "Reset Access"}
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
            {view === "login" ? "Traveloop Infrastructure" : "Restore admin credentials"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-lg text-sm font-bold border border-red-500/20 animate-pulse">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-bold border border-emerald-500/20">
            {successMessage}
          </div>
        )}

        {view === "login" ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:text-slate-600"
                placeholder="admin@traveloop.com"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Security Key
                </label>
                <button
                  type="button"
                  onClick={() => { setView("forgot"); setError(""); }}
                  className="text-[10px] font-black text-sky-500 hover:text-sky-400 transition-colors cursor-pointer uppercase tracking-widest"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/5 rounded-xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 rounded-xl shadow-lg shadow-sky-900/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 mt-2 cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Access Terminal</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/5 rounded-xl pl-12 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:text-slate-600"
                  placeholder="admin@traveloop.com"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 rounded-xl shadow-lg shadow-sky-900/20 transition-all duration-300 mt-2 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Request Reset"}
            </button>
          </form>
        )}

        <div className="mt-10 text-center border-t border-white/5 pt-8">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            Restricted Area
            <button
              onClick={() => navigate("/")}
              className="text-sky-500 font-black hover:text-sky-400 transition-colors ml-2 cursor-pointer"
            >
              Return to Public Site
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
