import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { showSuccess } from '../../utils/notifications';
import '../../styles/Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: 'fa-chart-pie', text: 'لوحة التحكم' },
    { path: '/dashboard/trips', icon: 'fa-bus', text: 'الرحلات' },
    { path: '/dashboard/drivers', icon: 'fa-users', text: 'السائقين' },
    { path: '/dashboard/stations', icon: 'fa-map-marked-alt', text: 'المحطات' },
    { path: '/dashboard/payments', icon: 'fa-credit-card', text: 'المدفوعات' },
    { path: '/dashboard/charts', icon: 'fa-chart-line', text: 'التقارير' },
    { path: '/dashboard/offers', icon: 'fa-gift', text: 'المكافآت والعروض' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    showSuccess('تم تسجيل الخروج بنجاح');
    window.location.href = '/login';
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.aside
      className={`sidebar ${isOpen ? 'open' : 'closed'}`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <motion.button
        className="toggle-btn"
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 0 : 180 }}
      >
        <i className={`fas fa-chevron-${isOpen ? 'left' : 'right'}`}></i>
      </motion.button>

      <div className="sidebar-logo">
        <i className="fas fa-bus"></i>
        {isOpen && <h2>ميكرو مصر</h2>}
      </div>

      {menuItems.map((item, index) => (
        <motion.div
          key={index}
          className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => handleNavigation(item.path)}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <i className={`fas ${item.icon}`}></i>
          {isOpen && <span>{item.text}</span>}
        </motion.div>
      ))}

      <div className="sidebar-divider"></div>

      <motion.div
        className="menu-item"
        onClick={handleLogout}
        whileHover={{ x: 5 }}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <i className="fas fa-sign-out-alt"></i>
        {isOpen && <span>تسجيل خروج</span>}
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;