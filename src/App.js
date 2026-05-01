import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './components/admin/Login';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData && userData.id) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('user');
            setIsAuthenticated(false);
          }
        } catch (error) {
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">
          <i className="fas fa-bus fa-spin"></i>
          <p>جاري تحميل النظام...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster 
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName="toaster-container"
        containerStyle={{}}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            fontFamily: 'Cairo',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4A7554',
              secondary: '#FFFFFF',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#E09162',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/login" 
            element={
              <Login setIsAuthenticated={setIsAuthenticated} />
            } 
          />
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="*" 
            element={
              <div className="not-found">
                <i className="fas fa-map-marked-alt"></i>
                <h1>404</h1>
                <p>عذراً، الصفحة غير موجودة</p>
                <button onClick={() => window.location.href = '/dashboard'}>
                  العودة للرئيسية
                </button>
              </div>
            } 
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
