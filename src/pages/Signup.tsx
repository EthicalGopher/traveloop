import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Loader2 } from "lucide-react";
import { api } from "../utils/api";
import { saveSession } from "../utils/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await api("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          role: "public",
        }),
      });

      // If the response has a message, it's a pending application
      if (response.message && response.user?.status === "pending") {
        setSuccessMessage(response.message);
        setEmail("");
        setPassword("");
        setFullName("");
      } else {
        // Direct login for active users
        saveSession(response);
        navigate("/");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background text-on-surface">
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-tertiary/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-surface-container-lowest p-10 md:p-12 rounded-xl ambient-shadow w-full max-w-md relative z-10 mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
            <Rocket size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight mb-2">
            Join Traveloop
          </h1>
          <p className="text-on-surface-variant text-sm font-medium">
            Start your next adventure today
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
            <button 
              onClick={() => navigate("/login")}
              className="block mt-2 underline cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-surface-container-highest rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 border-none transition-all placeholder:text-on-surface-variant/50"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-highest rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 border-none transition-all placeholder:text-on-surface-variant/50"
                placeholder="jane@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-highest rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 border-none transition-all placeholder:text-on-surface-variant/50"
                placeholder="Create a strong password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-primary to-primary-container text-white font-bold py-4 rounded-full hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 mt-4 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-on-surface-variant font-medium">
            Already have an account?
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-bold hover:text-primary-dim transition-colors ml-1 cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
