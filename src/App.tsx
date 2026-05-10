import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import ConfirmEmailChange from "./pages/ConfirmEmailChange";
import { Home, RiskManagement, Compliance } from "./pages/PlaceholderPages";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/confirm-email-change" element={<ConfirmEmailChange />} />
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="workspace" element={<Dashboard />} />
            <Route path="applications" element={<Applications />} />
            <Route path="risk-management" element={<RiskManagement />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Default admin redirect */}
            <Route index element={<Navigate to="workspace" replace />} />
          </Route>

          {/* Compatibility & Fallbacks */}
          <Route path="/dashboard" element={<Navigate to="/admin/workspace" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
