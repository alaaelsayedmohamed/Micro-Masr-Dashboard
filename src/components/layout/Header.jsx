import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { showSuccess } from '../../utils/notifications';
import '../../styles/Header.css';

const Header = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);

    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('ar-EG', options);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    showSuccess('تم تسجيل الخروج بنجاح');
    window.location.href = '/login';window.location.href = '/login'; window.location.href = '/login';
  };

  const notifications = [
    { id: 1, type: 'success', title: 'رحلة جديدة', message: 'تم إضافة رحلة جديدة من القاهرة للإسكندرية', time: 'منذ 5 دقائق' },
    { id: 2, type: 'warning', title: 'تأخير', message: 'الرحلة رقم TR-2024-004 متأخرة 15 دقيقة', time: 'منذ 10 دقائق' },
    { id: 3, type: 'info', title: 'تحديث', message: 'تم تحديث بيانات السائق أحمد علي', time: 'منذ 15 دقيقة' },
  ];

  return (
    <motion.header
      className="header-container"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="welcome-section">
        <h2>مرحباً بك في نظام ميكرو مصر</h2>
        <p>
          <i className="fas fa-map-marker-alt"></i>
          القاهرة، جمهورية مصر العربية
        </p>
      </div>

      <div className="header-controls">
        <motion.div
          className="datetime"
          animate={{ 
            backgroundColor: ['#F2EEE3', '#E5DBC8', '#F2EEE3']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <i className="far fa-calendar-alt" style={{ marginLeft: '8px' }}></i>
          {formatDate(dateTime)}
        </motion.div>

        <div style={{ position: 'relative' }}>
          <motion.div
            className="notification-badge"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <i className="far fa-bell"></i>
            <span>3</span>
          </motion.div>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="notifications-panel"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {notifications.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    className="notification-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <i className={`fas fa-${notif.type === 'success' ? 'check-circle' : notif.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}`}></i>
                    <div className="content">
                      <h5>{notif.title}</h5>
                      <p>{notif.message}</p>
                    </div>
                    <span className="time">{notif.time}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="user-profile"
          whileHover={{ scale: 1.02 }}
          onClick={handleLogout}
          title="تسجيل الخروج"
        >
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'أ'}
          </div>
          <div className="user-info">
            <h4>{user?.name || 'أحمد محمد'}</h4>
            <p>{user?.role || 'مدير النظام'}</p>
          </div>
          <i className="fas fa-chevron-down" style={{ color: '#5F8A61' }}></i>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;