import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, Navigate } from "react-router-dom";
import { 
  PlaneTakeoff, 
  Compass, 
  Users, 
  Calendar, 
  Wallet, 
  HelpCircle, 
  User, 
  FileText,
  Clock,
  CheckCircle2,
  PlayCircle
} from "lucide-react";
import { CreateTripModal } from "./CreateTripModal";
import { useAuth } from "../../../utils/auth";
import { api } from "../../../utils/api";

export function Layout() {
  const { session, user } = useAuth();
  const location = useLocation();
  const path = location.pathname;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [prefilledPlace, setPrefilledPlace] = useState("");
  const [tripCounts, setTripCounts] = useState({ ongoing: 0, upcoming: 0, completed: 0 });

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setPrefilledPlace(detail?.place || "");
      setIsCreateModalOpen(true);
    };
    window.addEventListener("openCreateTrip", handleOpenModal);
    return () => window.removeEventListener("openCreateTrip", handleOpenModal);
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!session) return;
      try {
        const trips = await api("/trips");
        const counts = {
          ongoing: trips.filter((t: any) => t.status === 'ongoing').length,
          upcoming: trips.filter((t: any) => t.status === 'upcoming').length,
          completed: trips.filter((t: any) => t.status === 'completed').length,
        };
        setTripCounts(counts);
      } catch (err) {
        console.error("Failed to fetch trip counts:", err);
      }
    };
    fetchCounts();
  }, [session, location.pathname]);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const getLinkClasses = (activePaths: string[], requiredHash?: string) => {
    let isActive = activePaths.includes(path);
    if (isActive && requiredHash !== undefined) {
      isActive = location.hash === requiredHash;
    }
    if (isActive) {
      return "flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold border-l-4 border-primary bg-surface-container-high transition-colors";
    }
    return "flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors opacity-80";
  };

  const getMobileLinkClasses = (activePaths: string[], requiredHash?: string) => {
    let isActive = activePaths.includes(path);
    if (isActive && requiredHash !== undefined) {
      isActive = location.hash === requiredHash;
    }
    if (isActive) {
      return "flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-1 scale-95 duration-150";
    }
    return "flex flex-col items-center justify-center text-on-surface-variant hover:opacity-90 px-4 py-1";
  };

  return (
    <div className="bg-surface-background text-on-surface font-body min-h-screen flex w-full">
      {/* SideNavBar (Web) */}
      <nav className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 border-r border-border-subtle bg-surface-container-low py-6 px-4 z-50">
        <div className="flex items-center gap-2 mb-10 px-4">
          <PlaneTakeoff className="text-primary w-8 h-8" />
          <span className="font-headline text-2xl font-bold text-primary tracking-tight">Traveloop</span>
        </div>

        <button 
          onClick={() => {
            setPrefilledPlace("");
            setIsCreateModalOpen(true);
          }}
          className="w-full bg-primary text-on-primary py-3 rounded-lg font-label text-sm flex items-center justify-center gap-2 mb-6 hover:opacity-90 transition-opacity shadow-sm"
        >
          <span>+</span> New Trip
        </button>

        <div className="flex flex-col gap-1 flex-grow overflow-y-auto overflow-x-hidden pr-2 -mr-2">
          
          <div className="font-label text-xs uppercase text-text-secondary mt-1 mb-2 px-4">Discover</div>
          <Link to="/dashboard" className={getLinkClasses(["/dashboard"])}>
            <Compass className="w-5 h-5" />
            <span className="font-body text-sm">Explore</span>
          </Link>
          <Link to="/dashboard/community" className={getLinkClasses(["/dashboard/community"])}>
            <Users className="w-5 h-5" />
            <span className="font-body text-sm">Community</span>
          </Link>

          <div className="font-label text-xs uppercase text-text-secondary mt-6 mb-2 px-4">My Trips</div>
          <Link to="/dashboard/itinerary#ongoing" className={getLinkClasses(["/dashboard/itinerary"], "#ongoing")}>
            <PlayCircle className="w-5 h-5 text-itinerary-stay" />
            <span className="font-body text-sm">Ongoing ({tripCounts.ongoing})</span>
          </Link>
          <Link to="/dashboard/itinerary#upcoming" className={getLinkClasses(["/dashboard/itinerary"], "#upcoming")}>
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-body text-sm">Upcoming ({tripCounts.upcoming})</span>
          </Link>
          <Link to="/dashboard/itinerary#completed" className={getLinkClasses(["/dashboard/itinerary"], "#completed")}>
            <CheckCircle2 className="w-5 h-5 text-text-secondary" />
            <span className="font-body text-sm">Completed ({tripCounts.completed})</span>
          </Link>

          <div className="flex flex-col mt-6 bg-surface-container-highest/20 rounded-xl p-2 pb-3 mb-2">
            <div className="font-label text-xs uppercase text-primary mb-2 px-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              Trip Management
            </div>
            <div className="flex flex-col gap-1">
              <Link to="/dashboard/itinerary" className={getLinkClasses(["/dashboard/itinerary"], "")}>
                <Calendar className="w-5 h-5" />
                <span className="font-body text-sm">All Itineraries</span>
              </Link>
              <Link to="/dashboard/budget" className={getLinkClasses(["/dashboard/budget"])}>
                <Wallet className="w-5 h-5" />
                <span className="font-body text-sm">Budgets</span>
              </Link>
              <Link to="/dashboard/notes" className={getLinkClasses(["/dashboard/notes"])}>
                <FileText className="w-5 h-5" />
                <span className="font-body text-sm">All Notes</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border-subtle pt-4">
          <Link to="#" className={getLinkClasses(["/support"])}>
            <HelpCircle className="w-5 h-5" />
            <span className="font-body text-sm">Support</span>
          </Link>
          <Link to="/dashboard/profile" className={getLinkClasses(["/dashboard/profile"])}>
            <User className="w-5 h-5" />
            <span className="font-body text-sm">Account</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col h-screen max-h-screen relative">
        {/* Top Navbar */}
        <header className="bg-surface-canvas shadow-sm z-40 flex justify-between items-center h-16 px-4 md:px-6 w-full shrink-0 border-b border-border-subtle">
          <div className="flex items-center gap-4">
            <div className="md:hidden flex items-center gap-2">
              <PlaneTakeoff className="text-primary w-6 h-6" />
              <span className="font-headline text-xl font-bold text-primary">Traveloop</span>
            </div>
          </div>
          <div className="flex items-center gap-4 hidden md:flex">
             {/* Centered Space for Desktop if needed */}
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Link to="/dashboard/profile" className="flex items-center gap-3">
              <span className="text-sm font-medium text-text-primary hidden sm:inline">{user?.full_name}</span>
              <div className="w-8 h-8 rounded-full bg-primary-container overflow-hidden cursor-pointer flex items-center justify-center text-on-primary-container font-bold text-xs">
                {user?.full_name?.[0]}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 pb-20 md:pb-0 overflow-y-auto relative bg-surface-background">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navbar (Mobile) */}
      <nav className="md:hidden bg-surface-container-lowest shadow-lg rounded-t-xl fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-2 border-t border-border-subtle">
        <Link to="/dashboard" className={getMobileLinkClasses(["/dashboard"])}>
          <Compass className="w-6 h-6 mb-1" />
          <span className="font-label text-[10px]">Explore</span>
        </Link>
        <Link to="/dashboard/itinerary" className={getMobileLinkClasses(["/dashboard/itinerary", "/dashboard/builder"])}>
          <PlaneTakeoff className="w-6 h-6 mb-1" />
          <span className="font-label text-[10px]">Trips</span>
        </Link>
        <Link to="/dashboard/community" className={getMobileLinkClasses(["/dashboard/community"])}>
          <Users className="w-6 h-6 mb-1" />
          <span className="font-label text-[10px]">Community</span>
        </Link>
        <Link to="/dashboard/profile" className={getMobileLinkClasses(["/dashboard/profile"])}>
          <User className="w-6 h-6 mb-1" />
          <span className="font-label text-[10px]">Profile</span>
        </Link>
      </nav>
      
      <CreateTripModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} initialPlace={prefilledPlace} />
    </div>
  );
}
export default Layout;
