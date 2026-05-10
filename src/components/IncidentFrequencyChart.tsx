const IncidentFrequencyChart = () => {
  return (
    <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-4 sm:p-6 md:p-8 flex flex-col ambient-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-10">
        <div className="cursor-default">
          <h4 className="text-xl md:text-2xl font-extrabold tracking-tight hover:text-primary transition-colors">
            Incident Frequency
          </h4>
          <p className="text-on-surface-variant text-xs md:text-sm font-medium opacity-70">
            Monthly detection of unauthorized access attempts
          </p>
        </div>
        <div className="flex gap-2 bg-surface-container-low p-1 rounded-xl w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-3 md:px-5 py-2 rounded-lg text-[9px] md:text-[10px] font-bold tracking-[0.1em] uppercase font-label text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface transition-all cursor-pointer">
            Weekly
          </button>          <button className="flex-1 sm:flex-none bg-primary text-white px-3 md:px-5 py-2 rounded-lg text-[9px] md:text-[10px] font-bold tracking-[0.1em] uppercase font-label shadow-md shadow-primary/20 cursor-pointer hover:bg-primary-dim transition-colors">
            Monthly
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 md:gap-6 min-h-[250px] md:min-h-[300px] pt-10 pb-4">
        {[
          { month: "Jan", height: "40%", value: 42, color: "red" },
          { month: "Feb", height: "55%", value: 58, color: "orange" },
          { month: "Mar", height: "85%", value: 89, color: "yellow", featured: true },
          { month: "Apr", height: "65%", value: 64, color: "green" },
          { month: "May", height: "45%", value: 48, color: "blue" },
          { month: "Jun", height: "75%", value: 72, color: "purple" },
        ].map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 md:gap-4 group cursor-pointer">
            <div
              className={`w-full ${
                item.featured 
                  ? "bg-gradient-to-t from-yellow-500 to-yellow-300 shadow-xl shadow-yellow-500/20 group-hover:shadow-yellow-500/40" 
                  : `bg-${item.color}-500/80 group-hover:bg-${item.color}-400`
              } transition-all duration-300 rounded-t-lg md:rounded-t-xl relative ease-out group-hover:scale-y-105 origin-bottom`}
              style={{ height: item.height }}
            >
              <div className={`absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 ${item.featured ? "text-[10px] md:text-sm font-black text-yellow-500" : "text-[9px] md:text-xs font-bold text-on-surface-variant group-hover:text-" + item.color + "-500"} group-hover:-translate-y-1 transition-all ${item.featured ? "" : "opacity-0 group-hover:opacity-100"}`}>
                {item.value}
              </div>
            </div>
            <span className={`text-[8px] md:text-[9px] font-bold tracking-[0.1em] md:tracking-[0.3em] ${item.featured ? "text-on-surface" : "text-on-surface-variant/60 group-hover:text-" + item.color + "-500"} uppercase font-label transition-colors`}>
              {item.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentFrequencyChart;
