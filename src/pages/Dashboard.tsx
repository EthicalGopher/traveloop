import { CheckCircle } from "lucide-react";
import StatCard from "../components/StatCard";
import IncidentFrequencyChart from "../components/IncidentFrequencyChart";
import CriticalRiskVendors from "../components/CriticalRiskVendors";
import PatchingBanner from "../components/PatchingBanner";
import RiskDistributionChart from "../components/RiskDistributionChart";
import ComplianceTrendChart from "../components/ComplianceTrendChart";

const Dashboard = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Vendors"
          value="1,284"
          trend="+12.4%"
          borderColor="border-red-500"
        />
        <StatCard
          label="Average Risk Score"
          value="74.2"
          progress={74}
          borderColor="border-orange-500"
          trendColor="orange"
        />
        <StatCard
          label="Active Breaches"
          value="12"
          trend="Critical"
          trendColor="green"
          borderColor="border-green-500"
        />
        <StatCard
          label="Compliance Rate"
          value="92%"
          icon={CheckCircle}
          borderColor="border-blue-500"
          trendColor="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
        <IncidentFrequencyChart />
        <div className="lg:col-span-4 space-y-6">
          <CriticalRiskVendors />
          <PatchingBanner />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
        <RiskDistributionChart />
        <ComplianceTrendChart />
      </div>
    </>
  );
};

export default Dashboard;
