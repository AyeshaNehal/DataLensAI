import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { ExplorePage } from './pages/ExplorePage';
import { AIInsightsPage } from './pages/AIInsightsPage';

/**
 * Redirects authenticated users away from Login/Signup pages to the Dashboard.
 */
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-dark-900 text-slate-100 font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Only Authentication Routes */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicOnlyRoute>
                    <SignupPage />
                  </PublicOnlyRoute>
                }
              />

              {/* Protected Dashboard Route */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/datasets" element={<DatasetsPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/ai-insights" element={<AIInsightsPage />} />
              </Route>

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
