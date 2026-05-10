import { Building2, Cloud, Shield } from "lucide-react";

const CriticalRiskVendors = () => {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 ambient-shadow">
      <h4 className="text-xl font-extrabold tracking-tight mb-6 cursor-default">
        Critical Risk Vendors
      </h4>
      <div className="space-y-2">
        <div className="flex items-center gap-4 p-3 -mx-3 rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-105 transition-transform">
            <Building2 size={24} />
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-bold text-on-surface tracking-tight group-hover:text-red-500 transition-colors">
              DataStream Inc.
            </h5>
            <p className="text-[10px] text-red-500 font-bold font-label uppercase tracking-wider">
              Critical Leak Risk
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-on-surface leading-none">
              94
            </p>
            <p className="text-[8px] font-bold font-label text-on-surface-variant/60 uppercase">
              Score
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 -mx-3 rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-105 transition-transform">
            <Cloud size={24} />
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-bold text-on-surface tracking-tight group-hover:text-orange-500 transition-colors">
              Nebula Cloud
            </h5>
            <p className="text-[10px] text-on-surface-variant/70 font-bold font-label uppercase tracking-wider">
              Moderate Risk
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-on-surface leading-none">
              62
            </p>
            <p className="text-[8px] font-bold font-label text-on-surface-variant/60 uppercase">
              Score
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 -mx-3 rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-105 transition-transform">
            <Shield size={24} />
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-bold text-on-surface tracking-tight group-hover:text-green-500 transition-colors">
              ShieldForce Lab
            </h5>
            <p className="text-[10px] text-on-surface-variant/70 font-bold font-label uppercase tracking-wider">
              Low Risk
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-on-surface leading-none">
              28
            </p>
            <p className="text-[8px] font-bold font-label text-on-surface-variant/60 uppercase">
              Score
            </p>
          </div>
        </div>
      </div>

      <button className="w-full mt-6 py-4 rounded-xl bg-surface-container-low text-[10px] font-bold tracking-[0.2em] uppercase font-label text-on-surface-variant hover:bg-gradient-to-r hover:from-red-500 hover:via-yellow-500 hover:to-blue-500 hover:text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer">
        View Full Report
      </button>
    </div>
  );
};

export default CriticalRiskVendors;
