import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../../utils/notifications';
import { usersData } from '../../data/mockData';
import '../../styles/Login.css';

// استيراد صورة اللوجو
import logo from '../../assets/logo.png';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // محاكاة تأخير الشبكة
    setTimeout(() => {
      const user = usersData.find(
        u => u.username === credentials.username && u.password === credentials.password
      );

      if (user) {
        showSuccess(`مرحباً ${user.name}، تم تسجيل الدخول بنجاح`);
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthenticated(true);
        // استخدام replace بدلاً من navigate العادي
        navigate('/dashboard', { replace: true });
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
        showError('خطأ في بيانات الدخول');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="login-card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div
          className="login-logo"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <img 
            src={logo} 
            alt="شعار ميكرو مصر" 
            className="logo-image"
          />
          <h1>ميكرو مصر</h1>
          <p>نظام إدارة النقل الذكي</p>
        </motion.div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <i className="fas fa-user"></i>
            <input
              type="text"
              name="username"
              placeholder="اسم المستخدم"
              value={credentials.username}
              onChange={handleChange}
              className={error ? 'error' : ''}
              required
            />
          </div>

          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              name="password"
              placeholder="كلمة المرور"
              value={credentials.password}
              onChange={handleChange}
              className={error ? 'error' : ''}
              required
            />
          </div>

          {error && (
            <motion.p
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            className="login-button"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                جاري تسجيل الدخول...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                دخول
              </>
            )}
          </motion.button>
        </form>

        <motion.div
          className="demo-credentials"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>بيانات الدخول التجريبية</p>
          <div className="credential-item">
            <i className="fas fa-user"></i>
            <span>admin / admin123</span>
          </div>
          <div className="credential-item">
            <i className="fas fa-user"></i>
            <span>supervisor / super123</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;