import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, useAuthActions, initializeAuth } from './store/authStore';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/customer/HomePage';
import LoginPage from './pages/customer/LoginPage';
import RegisterPage from './pages/customer/RegisterPage';

// Loading Component
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [appInitialized, setAppInitialized] = React.useState(false);

  useEffect(() => {
    const initApp = async () => {
      await initializeAuth();
      setAppInitialized(true);
    };

    initApp();
  }, []);

  // Show loading spinner while app is initializing
  if (!appInitialized) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header />
        
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <div className="container-custom py-8">
                    <h1 className="text-2xl font-display font-bold text-neutral-900">
                      Welcome to your Dashboard!
                    </h1>
                    <p className="text-neutral-600 mt-2">
                      This is a protected route that requires authentication.
                    </p>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={
              <div className="container-custom py-16 text-center">
                <h1 className="text-4xl font-display font-bold text-neutral-900 mb-4">
                  404 - Page Not Found
                </h1>
                <p className="text-neutral-600 mb-8">
                  The page you're looking for doesn't exist.
                </p>
                <a 
                  href="/" 
                  className="btn-primary"
                >
                  Go Home
                </a>
              </div>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
