import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, Search, Bell, LogOut, Settings } from "lucide-react";
import { clearSession, useAuth } from "../utils/auth";
import { api } from "../utils/api";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (role === "admin") {
        try {
          const data = await api("/admin/applications/count");
          setNotificationCount(data.count);
        } catch (err) {
          console.error("Failed to fetch notification count:", err);
        }
      }
    };

    fetchNotificationCount();
    let interval: ReturnType<typeof setInterval> | undefined;
    if (role === "admin") {
      interval = setInterval(fetchNotificationCount, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [role]);

  const handleLogout = () => {
    const isAdmin = role === "admin";
    clearSession();
    if (isAdmin) {
      navigate("/admin/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 flex flex-row justify-between items-center gap-2 mb-6 md:mb-12 bg-background/90 backdrop-blur-md px-3 py-3 sm:px-6 md:px-8 md:py-6 lg:px-12 lg:py-8 border-b border-white/10 w-full">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          className="lg:hidden p-2 bg-surface-container-lowest rounded-xl ambient-shadow flex items-center justify-center text-on-surface-variant shrink-0"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h2 className="text-sm xs:text-base sm:text-xl md:text-3xl lg:text-5xl font-black text-on-surface tracking-tight font-display uppercase italic leading-tight hover:text-primary transition-colors duration-500 truncate">
            {title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
        <div className="relative hidden xl:flex items-center w-64 2xl:w-80 h-12 group">
          <input
            className="w-full h-full glass-search rounded-full pl-12 pr-4 text-xs font-bold tracking-wide focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all border border-transparent hover:border-white/50 placeholder:text-on-surface-variant/60 uppercase font-label cursor-text"
            placeholder="Search risks..."
            type="text"
          />
          <Search
            size={18}
            className="absolute left-4 text-on-surface-variant/70 group-hover:text-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
          <ThemeToggle className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12" variant="circle" />
          
          <Link
            to="/settings"
            className="bg-surface-container-lowest text-on-surface-variant flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full ambient-shadow hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer group"
          >
            <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
          </Link>
          
          <button className="relative bg-surface-container-lowest text-on-surface-variant flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full ambient-shadow hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer group">
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 sm:top-2 sm:right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-secondary text-white text-[8px] sm:text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-surface-container-lowest group-hover:ring-primary transition-all">
                {notificationCount}
              </span>
            )}
          </button>
          
          <button
            onClick={handleLogout}
            className="bg-surface-container-lowest text-on-surface-variant flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-full ambient-shadow hover:bg-surface-container-low hover:text-primary transition-all duration-300 cursor-pointer"
          >
            <LogOut size={16} />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.1em] uppercase font-label hidden sm:block">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
