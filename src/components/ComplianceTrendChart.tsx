import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { complianceTrendData } from "../data/mockData";

const ComplianceTrendChart = () => {
  return (
    <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 flex flex-col ambient-shadow">
      <div className="flex justify-between items-center mb-6">
        <div className="cursor-default">
          <h4 className="text-xl font-extrabold tracking-tight hover:text-blue-500 transition-colors">
            Compliance Trend
          </h4>
          <p className="text-on-surface-variant text-sm font-medium opacity-70">
            6-month historical compliance rate
          </p>
        </div>
      </div>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={complianceTrendData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(150,150,150,0.1)"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
              domain={["dataMin - 5", "dataMax + 5"]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
              itemStyle={{ fontWeight: "bold", color: "#3b82f6" }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRate)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComplianceTrendChart;
