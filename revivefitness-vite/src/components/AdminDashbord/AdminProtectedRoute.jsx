import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AdminProtectedRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('adminAuth');
      
      if (adminAuth) {
        try {
          const authData = JSON.parse(adminAuth);
          // Check if login is still valid (e.g., within 24 hours)
          const loginTime = new Date(authData.loginTime);
          const now = new Date();
          const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
          
          if (hoursSinceLogin < 24) {
            setIsAuthenticated(true);
          } else {
            // Session expired
            localStorage.removeItem('adminAuth');
            setIsAuthenticated(false);
          }
        } catch {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/adminlogin" replace />;
}