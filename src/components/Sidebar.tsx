import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutGrid,
  X,
  Home,
  Briefcase,
  Shield,
  CheckCircle,
  ChevronDown,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../utils/auth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePath: string;
}

// Configuration for role-based access
const navigationConfig = [
  {
    title: "Home",
    path: "/admin/home",
    icon: Home,
    roles: ["admin"],
  },
  {
    title: "Workspace",
    path: "/admin/workspace",
    icon: Briefcase,
    roles: ["admin"],
  },
  {
    title: "Applications",
    path: "/admin/applications",
    icon: UserPlus,
    roles: ["admin"],
  },
  {
    title: "Risk Management",
    path: "/admin/risk-management",
    icon: Shield,
    hasSubmenu: true,
    roles: ["admin"],
  },
  {
    title: "Compliance",
    path: "/admin/compliance",
    icon: CheckCircle,
    hasSubmenu: true,
    roles: ["admin"],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activePath }) => {
  const { user, role } = useAuth();

  const NavItem = ({
    title,
    path,
    icon: Icon,
    hasSubmenu = false,
  }: {
    title: string;
    path: string;
    icon: any;
    hasSubmenu?: boolean;
  }) => {
    const isActive = activePath === path;

    return (
      <Link
        to={path}
        onClick={() => {
          if (window.innerWidth < 1024) onClose();
        }}
        className={`${
          isActive
            ? "bg-surface-container-lowest text-primary ambient-shadow font-bold"
            : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/50 font-semibold"
        } rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-300 text-sm tracking-wide cursor-pointer group`}
      >
        <div className="flex items-center gap-3">
          <Icon
            size={20}
            fill={isActive && title === "Workspace" ? "currentColor" : "none"}
            className={
              isActive
                ? "text-primary"
                : "group-hover:text-primary transition-colors"
            }
          />
          <span>{title}</span>
        </div>
        {hasSubmenu && <ChevronDown size={16} />}
      </Link>
    );
  };

  const filteredNavItems = navigationConfig.filter((item) =>
    item.roles.includes(role || "")
  );

  const avatarUrl = user?.avatar 
    ? `http://localhost:8080${user.avatar}` 
    : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 h-screen w-80 lg:w-96 glass-sidebar flex flex-col p-6 space-y-10 border-r border-white/20`}
      >
        <div className="flex items-center justify-between px-2">
          <Link to="/admin/workspace" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 rounded-xl flex items-center justify-center text-white group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-on-surface tracking-tighter group-hover:text-primary transition-colors">
                Platform
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold font-label">
                Enterprise Workspace
              </p>
            </div>
          </Link>
          <button
            className="lg:hidden text-on-surface-variant hover:text-on-surface"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {filteredNavItems.map((item) => (
            <NavItem
              key={item.path}
              title={item.title}
              path={item.path}
              icon={item.icon}
              hasSubmenu={item.hasSubmenu}
            />
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-200/50 space-y-4">
          <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-lowest/50 rounded-xl transition-all duration-300 cursor-pointer group">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-300 ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src={avatarUrl}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
                {user?.full_name || "User"}
              </p>
              <p className="text-[10px] text-on-surface-variant font-label tracking-widest uppercase font-bold">
                {role || "Guest"}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
