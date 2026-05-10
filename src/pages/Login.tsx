import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Loader2, Mail, ArrowLeft } from "lucide-react";
import { api } from "../utils/api";
import { saveSession } from "../utils/auth";

const Login = () => {
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
      saveSession(session);
      
      // Redirect based on role
      if (session.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background text-on-surface">
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-surface-container-lowest p-10 md:p-14 rounded-xl ambient-shadow w-full max-w-md relative z-10 mx-4">
        {view === "forgot" && (
          <button 
            onClick={() => { setView("login"); setError(""); setSuccessMessage(""); }}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-8 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Login
          </button>
        )}

        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/20">
            <LayoutGrid size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">
            {view === "login" ? "Welcome Back" : "Reset Password"}
          </h1>
          <p className="text-on-surface-variant text-sm font-medium">
            {view === "login" ? "Access your enterprise workspace" : "Enter your email to receive a reset link"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg text-sm font-bold border border-green-100">
            {successMessage}
          </div>
        )}

        {view === "login" ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-highest rounded-lg px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 border-none transition-all placeholder:text-on-surface-variant/50"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setView("forgot"); setError(""); }}
                  className="text-[11px] font-bold text-primary hover:text-primary-dim transition-colors cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-highest rounded-lg px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 border-none transition-all placeholder:text-on-surface-variant/50"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-primary to-primary-container text-white font-bold py-4 rounded-full hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 mt-2 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Signing In...</span>
                </>
              ) : (
                "Sign In to Workspace"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-highest rounded-lg pl-12 pr-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 border-none transition-all placeholder:text-on-surface-variant/50"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-primary to-primary-container text-white font-bold py-4 rounded-full hover:shadow-lg transition-all duration-300 mt-2 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-on-surface-variant font-medium">
            {view === "login" ? "New to Platform?" : "Remember your password?"}
            <button
              onClick={() => view === "login" ? navigate("/signup") : setView("login")}
              className="text-primary font-bold hover:text-primary-dim transition-colors ml-1 cursor-pointer"
            >
              {view === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
