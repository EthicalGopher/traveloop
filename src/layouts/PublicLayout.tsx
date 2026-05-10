import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../utils/auth";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function PublicLayout() {
  const { session } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 flex flex-col">
      <Header 
        onMenuClick={() => setIsSidebarOpen(true)} 
        title="Traveloop" 
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          activePath={location.pathname}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar bg-[#FFF1F2]/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
