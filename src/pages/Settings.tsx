import React, { useState, useRef, useEffect } from "react";
import { User as UserIcon, Mail, Lock, Camera, Loader2, CheckCircle, ShieldCheck } from "lucide-react";
import { api } from "../utils/api";
import { useAuth, saveSession } from "../utils/auth";

const Settings = () => {
  const { user, session } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state if user changes (e.g., after initial load)
  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const isSensitiveChange = (email !== user?.email) || password !== "";

    if (isSensitiveChange && !currentPassword) {
      setMessage({ type: "error", text: "Current password is required to change email or password" });
      setLoading(false);
      return;
    }

    try {
      const response = await api("/user/profile", {
        method: "PUT",
        body: JSON.stringify({
          full_name: fullName,
          email,
          password: password || undefined,
          current_password: currentPassword || undefined,
        }),
      });

      // Backend returns { message: "...", user: ... }
      if (session) {
        saveSession({ ...session, user: response.user });
      }
      
      setMessage({ type: "success", text: response.message });
      setPassword(""); 
      setCurrentPassword("");
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarLoading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch("http://localhost:8080/user/avatar", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.access_token}`,
        },
        body: formData,
      });

      const updatedUser = await response.json();
      if (!response.ok) throw new Error(updatedUser.error || "Upload failed");

      if (session) {
        saveSession({ ...session, user: updatedUser });
      }
      setMessage({ type: "success", text: "Profile picture updated!" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setAvatarLoading(false);
    }
  };

  const avatarUrl = user?.avatar 
    ? `http://localhost:8080${user.avatar}` 
    : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-black text-on-surface tracking-tight uppercase italic font-display">
          Account Settings
        </h3>
        <p className="text-on-surface-variant font-medium">
          Manage your profile information and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <div className="bg-surface-container-lowest rounded-2xl p-8 ambient-shadow border border-white/20 flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/20 transition-all">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {avatarLoading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" size={32} />
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <Camera size={18} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-on-surface">{user?.full_name}</h4>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-8">
          <div className="bg-surface-container-lowest rounded-2xl p-8 ambient-shadow border border-white/20">
            {message.text && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
                message.type === "success" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
              }`}>
                {message.type === "success" && <CheckCircle size={18} />}
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={18} />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-surface-container-highest rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 border-none transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-container-highest rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 border-none transition-all"
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>
              </div>

              {/* Password Changes */}
              <div className="space-y-6 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Security Authorization</span>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">
                    New Password (Leave blank to keep current)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-surface-container-highest rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 border-none transition-all"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <label className="block text-[10px] font-bold text-primary uppercase tracking-widest ml-1">
                    Current Password (Required for Email or Password changes)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-surface-container-lowest rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 border-none transition-all"
                      placeholder="Verify your identity"
                    />
                  </div>                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 bg-gradient-to-br from-primary to-primary-container text-white font-bold py-4 rounded-full hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
