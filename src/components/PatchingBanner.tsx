const PatchingBanner = () => {
  return (
    <div className="bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 rounded-xl p-8 text-white relative overflow-hidden shadow-lg shadow-yellow-500/20 cursor-pointer group hover:-translate-y-1 transition-transform duration-300">
      <div className="relative z-10">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] font-label opacity-80 mb-3">
          Automated Patching
        </p>
        <h4 className="text-xl font-extrabold mb-6 leading-tight group-hover:scale-[1.02] transition-transform origin-left">
          Protect 12 vulnerable endpoints now
        </h4>
        <button className="bg-surface-container-lowest text-blue-600 px-6 py-3 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase font-label hover:shadow-xl hover:bg-surface-container-lowest transition-all active:scale-95 cursor-pointer">
          Activate Shield
        </button>
      </div>
      <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-surface-container-lowest/20 rounded-full blur-2xl group-hover:scale-150 group-hover:bg-surface-container-lowest/30 transition-all duration-700"></div>
    </div>
  );
};

export default PatchingBanner;
