import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendColor?: string;
  progress?: number;
  icon?: any;
  borderColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendColor = "red",
  progress,
  icon: Icon,
  borderColor,
}) => {
  return (
    <div
      className={`bg-surface-container-lowest px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 rounded-2xl sm:rounded-[2rem] md:rounded-full border-t-4 ${borderColor} ambient-shadow cursor-pointer hover:translate-y-1 hover:scale-[0.98] hover:shadow-inner hover:bg-surface-container-low transition-all duration-300 group flex flex-col justify-center`}
    >
      <p className={`text-on-surface-variant text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase font-label mb-1 md:mb-2 group-hover:text-${trendColor}-500 transition-colors truncate`}>
        {label}
      </p>
      <div className="flex items-baseline justify-between gap-2 overflow-hidden">
        <h3 className="text-xl sm:text-2xl md:text-4xl font-extrabold tracking-tighter truncate">
          {value}
        </h3>
        {trend && (
          <span className={`text-${trendColor}-500 font-bold text-[8px] sm:text-[9px] md:text-[10px] bg-${trendColor}-500/10 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full font-label group-hover:bg-${trendColor}-500 group-hover:text-white transition-colors shrink-0`}>
            {trend}
          </span>
        )}
        {progress !== undefined && (
          <div className="w-12 sm:w-16 md:w-20 h-1.5 md:h-2 bg-surface-container-low rounded-full overflow-hidden mb-1 shrink-0">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 group-hover:opacity-80 transition-opacity"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        {Icon && (
          <Icon
            className={`text-blue-500 group-hover:scale-110 transition-transform shrink-0`}
            size={20}
          />
        )}
      </div>
    </div>
  );
};

export default StatCard;
