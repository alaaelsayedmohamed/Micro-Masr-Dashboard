import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { driversData } from '../../data/mockData';
import { showSuccess, showWarning, showDriverNotification, showConfirm } from '../../utils/notifications';
import { calculateDriverBonus, isDriverEligibleForBonus, contractedCompanies } from '../../utils/bonuses';
import '../../styles/DriversManagement.css';

const DriversManagement = () => {
  const [drivers, setDrivers] = useState(driversData);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  

  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const inactiveDrivers = drivers.filter(d => d.status === 'inactive').length;
  const suspendedDrivers = drivers.filter(d => d.status === 'suspended').length;
  const totalTrips = drivers.reduce((sum, d) => sum + d.totalTrips, 0);
  const avgRating = (drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1);
  
  
  const totalBonuses = drivers.reduce((sum, d) => sum + (d.bonus || 0), 0);
  const eligibleDrivers = drivers.filter(d => isDriverEligibleForBonus(d)).length;

 
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.includes(search) || 
                         driver.id.includes(search) ||
                         driver.phone.includes(search);
    const matchesFilter = filter === 'all' || driver.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAddDriver = (newDriver) => {
    const driver = {
      ...newDriver,
      id: `DR-${Math.floor(Math.random() * 1000)}`,
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50)}.jpg`,
      totalTrips: 0,
      rating: 5.0,
      bonus: 0
    };
    setDrivers([driver, ...drivers]);
    setShowModal(false);
    showDriverNotification(driver.name, 'added');
  };

  const handleEditDriver = (updatedDriver) => {
    setDrivers(drivers.map(d => d.id === updatedDriver.id ? updatedDriver : d));
    setShowModal(false);
    showDriverNotification(updatedDriver.name, 'updated');
  };

  const handleDeleteDriver = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    showConfirm(
      `هل أنت متأكد من حذف السائق ${driver.name}؟`,
      () => {
        setDrivers(drivers.filter(d => d.id !== driverId));
        showDriverNotification(driver.name, 'deleted');
      }
    );
  };

  const handleSuspendDriver = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    const newStatus = driver.status === 'active' ? 'suspended' : 'active';
    setDrivers(drivers.map(d => 
      d.id === driverId ? {...d, status: newStatus} : d
    ));
    
    if (newStatus === 'suspended') {
      showDriverNotification(driver.name, 'suspended');
    } else {
      showDriverNotification(driver.name, 'activated');
    }
  };

  const handleCalculateBonus = (driver) => {
    const eligibility = isDriverEligibleForBonus(driver);
    if (!eligibility) {
      showWarning(`${driver.name} غير مؤهل للمكافأة (عدد الرحلات أقل من 50 أو التقييم أقل من 4)`);
      return;
    }
    
    const revenue = driver.totalTrips * 50;
    const { bonus, rate } = calculateDriverBonus(revenue, driver.company);
    
    setDrivers(drivers.map(d => 
      d.id === driver.id 
        ? { ...d, bonus, bonusRate: rate, lastBonusDate: new Date().toISOString() }
        : d
    ));
    
    showSuccess(`تم إضافة مكافأة ${bonus} ج.م للسائق ${driver.name} بنسبة ${rate}%`);
  };

  const openModal = (mode, driver = null) => {
    setModalMode(mode);
    setSelectedDriver(driver);
    setShowModal(true);
  };

  return (
    <motion.div
      className="drivers-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="drivers-header">
        <h2 className="drivers-title">
          <i className="fas fa-users"></i>
          إدارة السائقين
        </h2>

        <div className="search-section">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              className="search-input"
              placeholder="بحث بالاسم أو رقم السائق..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              الكل ({drivers.length})
            </button>
            <button
              className={`filter-button ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              <i className="fas fa-check-circle"></i>
              نشط ({activeDrivers})
            </button>
            <button
              className={`filter-button ${filter === 'inactive' ? 'active' : ''}`}
              onClick={() => setFilter('inactive')}
            >
              <i className="fas fa-clock"></i>
              غير نشط ({inactiveDrivers})
            </button>
            <button
              className={`filter-button ${filter === 'suspended' ? 'active' : ''}`}
              onClick={() => setFilter('suspended')}
            >
              <i className="fas fa-ban"></i>
              موقوف ({suspendedDrivers})
            </button>
          </div>

          <button
            className="add-button"
            onClick={() => openModal('add')}
          >
            <i className="fas fa-plus"></i>
            إضافة سائق
          </button>
        </div>
      </div>

      <div className="stats-row">
        <motion.div
          className="driver-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="driver-stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="driver-stat-value">{drivers.length}</div>
          <div className="driver-stat-label">إجمالي السائقين</div>
        </motion.div>

        <motion.div
          className="driver-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="driver-stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="driver-stat-value">{activeDrivers}</div>
          <div className="driver-stat-label">سائقين نشطين</div>
        </motion.div>

        <motion.div
          className="driver-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="driver-stat-icon">
            <i className="fas fa-road"></i>
          </div>
          <div className="driver-stat-value">{totalTrips}</div>
          <div className="driver-stat-label">إجمالي الرحلات</div>
        </motion.div>

        <motion.div
          className="driver-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="driver-stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="driver-stat-value">{avgRating}</div>
          <div className="driver-stat-label">متوسط التقييم</div>
        </motion.div>
      </div>

      
      <div className="stats-row" style={{ marginTop: '-10px' }}>
        <motion.div
          className="driver-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ background: 'linear-gradient(135deg, #E09162 0%, #E09162 100%)' }}
        >
          <div className="driver-stat-icon">
            <i className="fas fa-gift"></i>
          </div>
          <div className="driver-stat-value">{totalBonuses.toLocaleString()} ج.م</div>
          <div className="driver-stat-label">إجمالي المكافآت</div>
        </motion.div>

        <motion.div
          className="driver-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ background: 'linear-gradient(135deg, #9BBF4E 0%, #5F8A61 100%)' }}
        >
          <div className="driver-stat-icon">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="driver-stat-value">{eligibleDrivers}</div>
          <div className="driver-stat-label">المؤهلين للمكافأة</div>
        </motion.div>
      </div>

      {filteredDrivers.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-user-slash"></i>
          <h3>لا يوجد سائقين</h3>
          <p>لم يتم العثور على سائقين مطابقين لمعايير البحث</p>
          <button className="add-button" onClick={() => openModal('add')}>
            <i className="fas fa-plus"></i>
            إضافة سائق جديد
          </button>
        </div>
      ) : (
        <div className="drivers-grid">
          <AnimatePresence>
            {filteredDrivers.map((driver, index) => (
              <motion.div
                key={driver.id}
                className={`driver-card ${driver.status}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => openModal('view', driver)}
              >
                <div className="driver-header">
                  <div className="driver-info">
                    <div className={`driver-avatar ${driver.status}`}>
                      {driver.avatar ? (
                        <img src={driver.avatar} alt={driver.name} />
                      ) : (
                        driver.name.charAt(0)
                      )}
                    </div>
                    <div className="driver-details">
                      <h3>{driver.name}</h3>
                      <p><i className="fas fa-id-card"></i> {driver.id}</p>
                      <p><i className="fas fa-phone"></i> {driver.phone}</p>
                      <div className="driver-rating">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fas fa-star${i < Math.floor(driver.rating) ? '' : '-o'}`}></i>
                        ))}
                        <span>({driver.rating})</span>
                      </div>
                    </div>
                  </div>
                  <span className={`status-badge ${driver.status}`}>
                    {driver.status === 'active' && 'نشط'}
                    {driver.status === 'inactive' && 'غير نشط'}
                    {driver.status === 'suspended' && 'موقوف'}
                  </span>
                </div>

                <div className="vehicle-info">
                  <p><i className="fas fa-bus"></i> {driver.vehicle} - {driver.plateNumber}</p>
                  {driver.company && (
                    <p><i className="fas fa-building"></i> {driver.company}</p>
                  )}
                  {driver.bonus > 0 && (
                    <p><i className="fas fa-gift"></i> المكافأة: {driver.bonus} ج.م</p>
                  )}
                </div>

                <div className="driver-stats">
                  <div className="driver-stat">
                    <div className="value">{driver.totalTrips}</div>
                    <div className="label"><i className="fas fa-road"></i> رحلة</div>
                  </div>
                  <div className="driver-stat">
                    <div className="value">{driver.rating}</div>
                    <div className="label"><i className="fas fa-star"></i> التقييم</div>
                  </div>
                </div>

                
                <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="action-btn edit"
                    onClick={() => openModal('edit', driver)}
                  >
                    <i className="fas fa-edit"></i>
                    <span>تعديل</span>
                  </button>
                  <button
                    className="action-btn suspend"
                    onClick={() => handleSuspendDriver(driver.id)}
                  >
                    <i className={`fas fa-${driver.status === 'active' ? 'ban' : 'check'}`}></i>
                    <span>{driver.status === 'active' ? 'تعليق' : 'تنشيط'}</span>
                  </button>
                  <button
                    className="action-btn bonus"
                    onClick={() => handleCalculateBonus(driver)}
                  >
                    <i className="fas fa-gift"></i>
                    <span>مكافأة</span>
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteDriver(driver.id)}
                  >
                    <i className="fas fa-trash"></i>
                    <span>حذف</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      
      <AnimatePresence>
        {showModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>
                  <i className={`fas fa-${modalMode === 'add' ? 'plus' : modalMode === 'edit' ? 'edit' : 'eye'}`}></i>
                  {modalMode === 'add' && 'إضافة سائق جديد'}
                  {modalMode === 'edit' && 'تعديل بيانات السائق'}
                  {modalMode === 'view' && 'بيانات السائق'}
                </h3>
                <button onClick={() => setShowModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {modalMode === 'view' && selectedDriver && (
                <div>
                  <div className="driver-header" style={{ marginBottom: '20px' }}>
                    <div className="driver-info">
                      <div className={`driver-avatar ${selectedDriver.status}`}>
                        {selectedDriver.avatar ? (
                          <img src={selectedDriver.avatar} alt={selectedDriver.name} />
                        ) : (
                          selectedDriver.name.charAt(0)
                        )}
                      </div>
                      <div className="driver-details">
                        <h3>{selectedDriver.name}</h3>
                        <p><i className="fas fa-id-card"></i> {selectedDriver.id}</p>
                        <p><i className="fas fa-phone"></i> {selectedDriver.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <p><strong>رخصة القيادة:</strong> {selectedDriver.license}</p>
                      <p><strong>تاريخ الانتهاء:</strong> {selectedDriver.licenseExpiry}</p>
                      {selectedDriver.company && (
                        <p><strong>الشركة:</strong> {selectedDriver.company}</p>
                      )}
                    </div>
                    <div>
                      <p><strong>المركبة:</strong> {selectedDriver.vehicle}</p>
                      <p><strong>رقم اللوحة:</strong> {selectedDriver.plateNumber}</p>
                      {selectedDriver.bonus > 0 && (
                        <p><strong>المكافأة:</strong> {selectedDriver.bonus} ج.م</p>
                      )}
                    </div>
                  </div>

                  <div className="driver-stats">
                    <div className="driver-stat">
                      <div className="value">{selectedDriver.totalTrips}</div>
                      <div className="label">إجمالي الرحلات</div>
                    </div>
                    <div className="driver-stat">
                      <div className="value">{selectedDriver.rating}</div>
                      <div className="label">التقييم</div>
                    </div>
                  </div>

                  <p style={{ textAlign: 'center', color: '#5F6B6A', marginTop: '15px' }}>
                    <i className="fas fa-calendar"></i> تاريخ الانضمام: {selectedDriver.joinDate}
                  </p>
                </div>
              )}

              {(modalMode === 'add' || modalMode === 'edit') && (
                <form
                  className="driver-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const driverData = Object.fromEntries(formData);
                    
                    if (modalMode === 'add') {
                      handleAddDriver(driverData);
                    } else {
                      handleEditDriver({
                        ...selectedDriver,
                        ...driverData
                      });
                    }
                  }}
                >
                  <div className="form-row">
                    <div className="form-group">
                      <label>الاسم الكامل</label>
                      <input 
                        type="text" 
                        name="name" 
                        defaultValue={selectedDriver?.name}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>رقم الهاتف</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        defaultValue={selectedDriver?.phone}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>رقم الرخصة</label>
                      <input 
                        type="text" 
                        name="license" 
                        defaultValue={selectedDriver?.license}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>تاريخ انتهاء الرخصة</label>
                      <input 
                        type="date" 
                        name="licenseExpiry" 
                        defaultValue={selectedDriver?.licenseExpiry}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>المركبة</label>
                      <input 
                        type="text" 
                        name="vehicle" 
                        defaultValue={selectedDriver?.vehicle}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>رقم اللوحة</label>
                      <input 
                        type="text" 
                        name="plateNumber" 
                        defaultValue={selectedDriver?.plateNumber}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>الشركة</label>
                      <select name="company" defaultValue={selectedDriver?.company || ''}>
                        <option value="">اختر الشركة</option>
                        {contractedCompanies.map(company => (
                          <option key={company.id} value={company.name}>
                            {company.name} (مكافأة {company.bonusRate}%)
                          </option>
                        ))}
                      </select>
                    </div>
                    {modalMode === 'edit' && (
                      <div className="form-group">
                        <label>الحالة</label>
                        <select name="status" defaultValue={selectedDriver?.status}>
                          <option value="active">نشط</option>
                          <option value="inactive">غير نشط</option>
                          <option value="suspended">موقوف</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <button className="submit-btn" type="submit">
                    {modalMode === 'add' ? 'إضافة' : 'حفظ التغييرات'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DriversManagement;