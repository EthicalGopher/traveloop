import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { riskDistributionData } from "../data/mockData";

const RiskDistributionChart = () => {
  return (
    <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-8 flex flex-col ambient-shadow">
      <h4 className="text-xl font-extrabold tracking-tight mb-6 cursor-default">
        Risk Distribution
      </h4>
      <div className="flex-1 min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskDistributionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {riskDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ fontWeight: "bold" }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
          <span className="text-3xl font-black">1.2k</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Total
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {riskDistributionData.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-xs font-bold text-on-surface-variant">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskDistributionChart;
