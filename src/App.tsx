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
import DashboardLayout from "./layouts/DashboardLayout";
import PublicLayout from "./pages/public/components/Layout";
import PublicDashboard from "./pages/public/Dashboard";
import PublicBudget from "./pages/public/Budget";
import PublicBuilder from "./pages/public/Builder";
import PublicCommunity from "./pages/public/Community";
import PublicItinerary from "./pages/public/Itinerary";
import PublicNotes from "./pages/public/Notes";
import PublicProfile from "./pages/public/Profile";
import Applications from "./pages/Applications";
import AdminHome from "./pages/admin/Home";
import AdminUsers from "./pages/admin/Users";
import AdminAnalytics from "./pages/admin/Analytics";
import Settings from "./pages/Settings";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import ConfirmEmailChange from "./pages/ConfirmEmailChange";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Router>
        <Routes>
          {/* Landing & Auth */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/confirm-email-change" element={<ConfirmEmailChange />} />
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Public/User Dashboard Routes */}
          <Route path="/dashboard" element={<PublicLayout />}>
            <Route index element={<PublicDashboard />} />
            <Route path="builder" element={<PublicBuilder />} />
            <Route path="community" element={<PublicCommunity />} />
            <Route path="itinerary" element={<PublicItinerary />} />
            <Route path="budget" element={<PublicBudget />} />
            <Route path="notes" element={<PublicNotes />} />
            <Route path="profile" element={<PublicProfile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route path="home" element={<AdminHome />} />
            <Route path="applications" element={<Applications />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<Settings />} />
            
            {/* Default admin redirect */}
            <Route index element={<Navigate to="home" replace />} />
          </Route>

          {/* Fallbacks */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
