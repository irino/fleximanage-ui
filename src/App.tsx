
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from "react-router-dom";
import { getVersion } from "./api/client";
import Login from "./pages/Login";
import VerifyAccount from "./pages/VerifyAccount";
import RegisterAccount from "./pages/RegisterAccount";
import Home from "./pages/Home";
import Devices from "./pages/inventory/Devices";
import DeviceDetail from "./pages/inventory/DeviceDetail";
import DeviceRegistration from "./pages/inventory/DeviceRegistration";
import Tokens from "./pages/inventory/Tokens";
import Members from "./pages/Members";
import Organizations from "./pages/Organizations";
import OrganizationDetail from "./pages/OrganizationDetail";
import Accounts from "./pages/Accounts";
import AccountDetail from "./pages/AccountDetail";
import MemberDetail from "./pages/MemberDetail";
import NotificationSettings from "./pages/NotificationSettings";
import MainLayout from "./components/layout/MainLayout";
import { ArrowLeft } from "lucide-react";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('authToken');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Layout for centered forms
const PublicLayout = () => {
  return (
    <div className="form-page-wrapper">
      <Outlet />
    </div>
  );
};

export default function App() {
  const [version, setVersion] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get backend version
    getVersion().then(v => setVersion(v.version)).catch(err => {
      console.error('Failed to get version:', err);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAccount />} />
        <Route path="/verify" element={<VerifyAccount />} />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="dashboard" element={<Navigate to="/home" replace />} />

        {/* Inventory Routes */}
        <Route path="inventory">
          <Route path="devices" element={<Devices />} />
          <Route path="devices/:id" element={<DeviceDetail />} />
          <Route path="tokens" element={<Tokens />} />
          <Route path="register" element={
            <div className="members-container">
              <div className="members-header">
                <div className="members-title">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => window.history.back()} className="btn-secondary" style={{ padding: '0.5rem' }}>
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h1>Create Dummy Device</h1>
                      <p className="subtitle">Register a simulated FlexiEdge device via WebSocket.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="members-table-container" style={{ padding: '2rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <DeviceRegistration />
                </div>
              </div>
            </div>
          } />
        </Route>


        <Route path="members" element={<Members />} />
        <Route path="members/:id" element={<MemberDetail />} />

        <Route path="organizations" element={<Organizations />} />
        <Route path="organizations/:id" element={<OrganizationDetail />} />

        <Route path="account" element={<Accounts />} />
        <Route path="account/:id" element={<AccountDetail />} />
        <Route path="notification-settings" element={<NotificationSettings />} />


        <Route path="settings" element={
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <p className="text-slate-600 mb-6">Application and system settings.</p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-800 border-b pb-2 mb-3">System Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded">
                      <span className="block text-xs uppercase font-bold text-slate-500 mb-1">Backend Version</span>
                      <span className="text-slate-700 font-mono">{version || 'Unknown'}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded">
                      <span className="block text-xs uppercase font-bold text-slate-500 mb-1">Frontend Version</span>
                      <span className="text-slate-700 font-mono">1.0.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
