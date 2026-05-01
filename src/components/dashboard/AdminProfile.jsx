import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { showSuccess } from '../../utils/notifications';
import '../../styles/AdminProfile.css';

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    setFormData(userData);
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser(formData);
    localStorage.setItem('user', JSON.stringify(formData));
    setIsEditing(false);
    showSuccess('تم تحديث الملف الشخصي بنجاح');
  };

  const stats = {
    totalTripsManaged: 2847,
    activeDrivers: 45,
    totalRevenue: 1250000,
    completionRate: 98.5
  };

  return (
    <motion.div
      className="profile-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <div className="avatar-placeholder" style={{ background: 'linear-gradient(135deg, #4A7554 0%, #9BBF4E 100%)' }}>
              {user?.name?.charAt(0) || 'أ'}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user?.name}</h1>
          <p className="profile-role">
            <i className="fas fa-user-tie"></i>
            {user?.role}
          </p>
          <p className="profile-department">
            <i className="fas fa-building"></i>
            {user?.department || 'الإدارة العليا'}
          </p>
        </div>
        <button
          className="edit-profile-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          <i className={`fas fa-${isEditing ? 'times' : 'edit'}`}></i>
          {isEditing ? 'إلغاء' : 'تعديل الملف'}
        </button>
      </div>

      <div className="profile-stats">
        <motion.div 
          className="profile-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon">
            <i className="fas fa-bus"></i>
          </div>
          <div className="stat-value">{stats.totalTripsManaged.toLocaleString()}</div>
          <div className="stat-label">إجمالي الرحلات المدارة</div>
        </motion.div>
        
        <motion.div 
          className="profile-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-value">{stats.activeDrivers}</div>
          <div className="stat-label">سائقين نشطين</div>
        </motion.div>
        
        <motion.div 
          className="profile-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-value">{stats.totalRevenue.toLocaleString()} ج.م</div>
          <div className="stat-label">إجمالي الإيرادات</div>
        </motion.div>
        
        <motion.div 
          className="profile-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-value">{stats.completionRate}%</div>
          <div className="stat-label">نسبة الإنجاز</div>
        </motion.div>
      </div>

      <div className="profile-details">
        <h3 className="details-title">
          <i className="fas fa-info-circle"></i>
          المعلومات الشخصية
        </h3>
        
        {isEditing ? (
          <form className="profile-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="form-row">
              <div className="form-group">
                <label>الاسم الكامل</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>رقم الهاتف</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>القسم</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>العنوان</label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>الصلاحية</label>
              <input
                type="text"
                value={user?.role || ''}
                disabled
                className="readonly"
              />
            </div>

            <button type="submit" className="save-btn">
              <i className="fas fa-save"></i>
              حفظ التغييرات
            </button>
          </form>
        ) : (
          <div className="profile-info-grid">
            <div className="info-item">
              <label>البريد الإلكتروني</label>
              <p>{user?.email || 'غير محدد'}</p>
            </div>
            <div className="info-item">
              <label>رقم الهاتف</label>
              <p>{user?.phone || 'غير محدد'}</p>
            </div>
            <div className="info-item">
              <label>العنوان</label>
              <p>{user?.address || 'غير محدد'}</p>
            </div>
            <div className="info-item">
              <label>تاريخ الانضمام</label>
              <p>{user?.joinDate || '2024-01-01'}</p>
            </div>
            <div className="info-item">
              <label>القسم</label>
              <p>{user?.department || 'الإدارة العليا'}</p>
            </div>
            <div className="info-item">
              <label>الصلاحية</label>
              <p>{user?.role || 'مدير النظام'}</p>
            </div>
          </div>
        )}
      </div>

      <div className="profile-actions">
        <button className="action-btn change-password" onClick={() => showSuccess('سيتم إرسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني')}>
          <i className="fas fa-key"></i>
          تغيير كلمة المرور
        </button>
        <button className="action-btn notifications" onClick={() => showSuccess('تم حفظ إعدادات الإشعارات')}>
          <i className="fas fa-bell"></i>
          إعدادات الإشعارات
        </button>
      </div>
    </motion.div>
  );
};

export default AdminProfile;