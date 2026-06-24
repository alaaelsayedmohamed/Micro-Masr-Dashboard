import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import TripsTable from './TripsTable';
import DriversManagement from './DriversManagement';
import StationsMap from './StationsMap';
import PaymentsDashboard from './PaymentsDashboard';
import RealCharts from './RealCharts';
import OffersManagement from './OffersManagement';
import AdminProfile from './AdminProfile';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  React.useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) setUser(userData);

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'لوحة التحكم' },
    { path: '/dashboard/trips', icon: 'fas fa-bus', label: 'الرحلات' },
    { path: '/dashboard/stations', icon: 'fas fa-map-marker-alt', label: 'المحطات' },
    { path: '/dashboard/payments', icon: 'fas fa-credit-card', label: 'المدفوعات' },
    { path: '/dashboard/charts', icon: 'fas fa-chart-pie', label: 'التقارير' },
    { path: '/dashboard/offers', icon: 'fas fa-gift', label: 'المكافآت' },
    { path: '/dashboard/profile', icon: 'fas fa-user-cog', label: 'الملف الشخصي' },
  ];

  return (
    <div className="dashboard-container">
      
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <i className={`fas ${isSidebarOpen ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </button>

        <div className="sidebar-logo">
          <i className="fas fa-bus"></i>
          {isSidebarOpen && <h2>ميكرو مصر</h2>}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
              end={item.path === '/dashboard'}
            >
              <i className={item.icon}></i>
              {isSidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-divider"></div>

        <NavLink to="/login" className="menu-item logout" onClick={() => localStorage.removeItem('user')}>
          <i className="fas fa-sign-out-alt"></i>
          {isSidebarOpen && <span>تسجيل الخروج</span>}
        </NavLink>
      </aside>

    
      <motion.main
        className={`dashboard-main ${!isSidebarOpen ? 'sidebar-closed' : ''}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
       
        <header className="dashboard-header">
          <div className="welcome-section">
            <h2>مرحباً {user?.name || 'المدير'} 👋</h2>
            <p>
              <i className="fas fa-calendar-alt"></i>
              {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="header-controls">
            <div className="datetime">
              <i className="fas fa-clock"></i>
              {currentTime}
            </div>

            <div className="user-profile">
              <div className="user-avatar">
                {user?.name?.charAt(0) || 'أ'}
              </div>
              <div className="user-info">
                <h4>{user?.name || 'المدير'}</h4>
                <p>{user?.role || 'مدير النظام'}</p>
              </div>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<DriversManagement />} />
          <Route path="/trips" element={<TripsTable />} />
          <Route path="/stations" element={<StationsMap />} />
          <Route path="/payments" element={<PaymentsDashboard />} />
          <Route path="/charts" element={<RealCharts />} />
          <Route path="/offers" element={<OffersManagement />} />
          <Route path="/profile" element={<AdminProfile />} />
        </Routes>
      </motion.main>
    </div>
  );
};

export default Dashboard;