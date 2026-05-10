import React from "react";
import { Settings, LogOut, User, MapPin, Map, Bell, Shield, Wallet } from "lucide-react";

export function Profile() {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface-background h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-[1000px] mx-auto w-full flex flex-col md:flex-row gap-8 pb-20">
           {/* Profile Content */}
           <div className="w-full md:w-1/3 flex flex-col gap-6">
              <div className="bg-surface-canvas border border-border-subtle rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
                 <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300" alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-surface-background shadow-sm mb-4" />
                 <h2 className="font-headline text-2xl font-bold text-on-surface">Alex Chen</h2>
                 <p className="font-body text-sm text-on-surface-variant flex items-center gap-1 mt-1 justify-center">
                    <MapPin className="w-4 h-4" /> San Francisco, CA
                 </p>
                 <div className="w-full border-t border-border-subtle mt-6 pt-6 grid grid-cols-2 gap-4">
                    <div>
                       <span className="block font-display text-2xl font-bold text-primary">12</span>
                       <span className="font-label text-[11px] font-medium text-text-secondary uppercase tracking-wider">Trips</span>
                    </div>
                    <div>
                       <span className="block font-display text-2xl font-bold text-primary">84k</span>
                       <span className="font-label text-[11px] font-medium text-text-secondary uppercase tracking-wider">Miles</span>
                    </div>
                 </div>
              </div>

              <div className="bg-surface-canvas border border-border-subtle rounded-xl shadow-sm overflow-hidden hidden md:block">
                 <button className="w-full flex items-center gap-3 px-6 py-4 hover:bg-surface-container-low transition-colors text-on-surface border-b border-border-subtle text-left">
                    <User className="w-5 h-5 text-on-surface-variant" />
                    <span className="font-body text-sm font-medium">Personal Info</span>
                 </button>
                 <button className="w-full flex items-center gap-3 px-6 py-4 hover:bg-surface-container-low transition-colors text-on-surface border-b border-border-subtle text-left">
                    <Wallet className="w-5 h-5 text-on-surface-variant" />
                    <span className="font-body text-sm font-medium">Payments</span>
                 </button>
                 <button className="w-full flex items-center gap-3 px-6 py-4 hover:bg-surface-container-low transition-colors text-on-surface border-b border-border-subtle text-left">
                    <Shield className="w-5 h-5 text-on-surface-variant" />
                    <span className="font-body text-sm font-medium">Security</span>
                 </button>
              </div>
           </div>

           {/* Settings panel */}
           <div className="w-full md:w-2/3 flex flex-col gap-6">
              <div className="bg-surface-canvas border border-border-subtle rounded-xl p-6 shadow-sm">
                 <h3 className="font-title text-xl font-medium text-on-surface mb-6">Preferences</h3>
                 
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="font-body text-base font-medium text-on-surface">Currency</p>
                          <p className="font-label text-xs text-on-surface-variant mt-1">Select your preferred currency for budgets.</p>
                       </div>
                       <select className="bg-surface-container border border-border-subtle rounded-lg px-4 py-2 font-body text-sm focus:outline-none focus:border-primary">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>GBP (£)</option>
                       </select>
                    </div>

                    <div className="border-t border-border-subtle pt-6 flex items-center justify-between">
                       <div>
                          <p className="font-body text-base font-medium text-on-surface">Email Notifications</p>
                          <p className="font-label text-xs text-on-surface-variant mt-1">Receive updates about your upcoming trips.</p>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                         <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                       </label>
                    </div>

                    <div className="border-t border-border-subtle pt-6 flex items-center justify-between">
                       <div>
                          <p className="font-body text-base font-medium text-on-surface">Public Profile</p>
                          <p className="font-label text-xs text-on-surface-variant mt-1">Allow others to see your shared itineraries.</p>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                         <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                       </label>
                    </div>
                 </div>
              </div>

              <div className="mt-4">
                 <button className="flex items-center gap-2 text-error font-body text-sm font-medium hover:underline p-2 rounded-lg hover:bg-error-container/20 transition-colors cursor-pointer">
                    <LogOut className="w-5 h-5" />
                    Sign Out
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
