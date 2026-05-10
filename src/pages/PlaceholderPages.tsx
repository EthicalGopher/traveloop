import { Construction } from "lucide-react";

const UnderConstruction = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-bounce">
        <Construction size={48} />
      </div>
      <div className="space-y-2">
        <h3 className="text-3xl font-black tracking-tight text-on-surface uppercase italic font-display">
          {title} is Under Construction
        </h3>
        <p className="text-on-surface-variant font-medium max-w-md mx-auto">
          We're working hard to bring you the best {title.toLowerCase()} experience. 
          Please check back later for updates!
        </p>
      </div>
      <div className="flex gap-4">
        <div className="h-1 w-12 bg-red-500 rounded-full"></div>
        <div className="h-1 w-12 bg-yellow-500 rounded-full"></div>
        <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
      </div>
    </div>
  );
};

export const Home = () => <UnderConstruction title="Home" />;
export const RiskManagement = () => <UnderConstruction title="Risk Management" />;
export const Compliance = () => <UnderConstruction title="Compliance" />;
export const Settings = () => <UnderConstruction title="Settings" />;
