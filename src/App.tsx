import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/Auth/AuthForm";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Landing from "./pages/Landing";
import MapViewer from "./pages/MapViewer";
import FullScreenMap from "./pages/FullScreenMap";
import OfficialLogin from "./pages/OfficialLogin";
import OfficialDashboard from "./pages/OfficialDashboard";
import SocialMedia from "./pages/SocialMedia";
import NotFound from "./pages/NotFound";
import TestAuth from "./pages/TestAuth";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    // Redirect to appropriate login page based on the protected route
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/official-dashboard')) {
      return <Navigate to="/official-login" replace />;
    }
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

// Official Role Route Component
const OfficialRoleRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (user?.role !== 'official') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

// Public Route Component (redirect if authenticated, except for specific routes)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const currentPath = window.location.pathname;
  
  // Allow access to landing page and auth page for non-authenticated users
  if (!isAuthenticated) return <>{children}</>;
  
  // Redirect authenticated users from public pages to appropriate dashboard
  if (currentPath === '/' || currentPath === '/auth') {
    // Redirect officials to official dashboard, citizens to regular dashboard
    const redirectPath = user?.role === 'official' ? '/official-dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }
  
  // Redirect from official login to official dashboard if already authenticated as official
  if (currentPath === '/official-login' && user?.role === 'official') {
    return <Navigate to="/official-dashboard" replace />;
  }
  
  // Redirect from auth page to dashboard if already authenticated as citizen
  if (currentPath === '/auth' && user?.role === 'citizen') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
              {/* Landing page accessible to all users */}
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Landing />} />
              
              {/* Public routes */}
              <Route path="/auth" element={
                <PublicRoute>
                  <AuthForm />
                </PublicRoute>
              } />
              
              {/* Official Login */}
              <Route path="/official-login" element={
                <PublicRoute>
                  <OfficialLogin />
                </PublicRoute>
              } />
              
              {/* Official Dashboard */}
              <Route path="/official-dashboard" element={
                <ProtectedRoute>
                  <OfficialRoleRoute>
                    <OfficialDashboard />
                  </OfficialRoleRoute>
                </ProtectedRoute>
              } />
              
              {/* Dashboard is public */}
              <Route path="/dashboard" element={
                <Layout />
              }>
                <Route index element={<Dashboard />} />
              </Route>
              
              {/* Reports is public */}
              <Route path="/reports" element={
                <Layout />
              }>
                <Route index element={<Reports />} />
              </Route>

              {/* Map Viewer is public (standalone, no Layout) */}
              <Route path="/map" element={<MapViewer />} />
              
              {/* Full Screen Map */}
              <Route path="/fullscreen-map" element={<FullScreenMap />} />
              
              {/* Test Auth Page */}
              <Route path="/test-auth" element={<TestAuth />} />
            
            <Route path="/all-reports" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Reports />} />
            </Route>
            
            <Route path="/social" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<SocialMedia />} />
            </Route>
            
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<div className="p-8 text-center text-muted-foreground">Analytics Dashboard - Coming Soon</div>} />
            </Route>
            
            <Route path="/alerts" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<div className="p-8 text-center text-muted-foreground">Alert Management - Coming Soon</div>} />
            </Route>
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<div className="p-8 text-center text-muted-foreground">Settings - Coming Soon</div>} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
