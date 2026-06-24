import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tripsData } from '../../data/mockData';
import { showSuccess, showTripNotification, showConfirm } from '../../utils/notifications';
import '../../styles/TripsTable.css';

const TripsTable = () => {
  const [trips, setTrips] = useState(tripsData);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    tripNumber: '',
    driver: '',
    from: '',
    to: '',
    departureTime: '',
    status: '',
    passengers: 0,
    revenue: 0
  });

  const tripStations = {
    1: ['محطة القاهرة', 'محطة الجيزة', 'محطة المنصورة', 'محطة الإسكندرية'],
    2: ['محطة الإسكندرية', 'محطة العلمين', 'محطة مرسى مطروح'],
    3: ['محطة القاهرة', 'محطة بني سويف', 'محطة أسيوط', 'محطة الأقصر'],
    4: ['محطة الأقصر', 'محطة إدفو', 'محطة أسوان'],
    5: ['محطة القاهرة', 'محطة الزقازيق', 'محطة المنصورة', 'محطة دمياط'],
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.tripNumber.includes(search) || 
                         trip.driver.includes(search) ||
                         trip.from.includes(search);
    const matchesFilter = filter === 'all' || trip.status === filter;
    return matchesSearch && matchesFilter;
  });

  
  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
    setShowDetails(true);
  };

  
  const handleEdit = (trip) => {
    setSelectedTrip(trip);
    setEditFormData({
      tripNumber: trip.tripNumber,
      driver: trip.driver,
      from: trip.from,
      to: trip.to,
      departureTime: trip.departureTime,
      status: trip.status,
      passengers: trip.passengers,
      revenue: trip.revenue
    });
    setShowEditModal(true);
  };


  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updatedTrips = trips.map(trip =>
      trip.id === selectedTrip.id
        ? {
            ...trip,
            tripNumber: editFormData.tripNumber,
            driver: editFormData.driver,
            from: editFormData.from,
            to: editFormData.to,
            departureTime: editFormData.departureTime,
            status: editFormData.status,
            passengers: parseInt(editFormData.passengers),
            revenue: parseInt(editFormData.revenue)
          }
        : trip
    );
    setTrips(updatedTrips);
    setShowEditModal(false);
    showSuccess(`تم تحديث الرحلة ${editFormData.tripNumber} بنجاح`);
  };

 
  const handleDelete = (trip) => {
    showConfirm(
      `هل أنت متأكد من حذف الرحلة ${trip.tripNumber}؟`,
      () => {
        setTrips(trips.filter(t => t.id !== trip.id));
        showTripNotification(trip.tripNumber, 'deleted');
      }
    );
  };

  const handleStatusChange = (trip, newStatus) => {
    setTrips(trips.map(t => 
      t.id === trip.id ? {...t, status: newStatus} : t
    ));
    
    if (newStatus === 'completed') {
      showTripNotification(trip.tripNumber, 'completed');
    } else if (newStatus === 'in-progress') {
      showTripNotification(trip.tripNumber, 'started');
    } else if (newStatus === 'delayed') {
      showTripNotification(trip.tripNumber, 'delayed');
    }
  };

  return (
    <motion.div
      className="table-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="table-header">
        <h2 className="table-title">
          <i className="fas fa-bus"></i>
          إدارة الرحلات
        </h2>

        <div className="table-search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            className="table-search-input"
            placeholder="بحث برقم الرحلة أو اسم السائق..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-filter-group">
          <button
            className={`table-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            الكل
          </button>
          <button
            className={`table-filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            <i className="fas fa-check-circle"></i>
            مكتملة
          </button>
          <button
            className={`table-filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            <i className="fas fa-spinner"></i>
            قيد التنفيذ
          </button>
          <button
            className={`table-filter-btn ${filter === 'scheduled' ? 'active' : ''}`}
            onClick={() => setFilter('scheduled')}
          >
            <i className="fas fa-clock"></i>
            مجدولة
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>رقم الرحلة</th>
              <th>السائق</th>
              <th>من</th>
              <th>إلى</th>
              <th>موعد الانطلاق</th>
              <th>الحالة</th>
              <th>الركاب</th>
              <th>الإيراد</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredTrips.map((trip, index) => (
                <motion.tr
                  key={trip.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td>{trip.tripNumber}</td>
                  <td>{trip.driver}</td>
                  <td>{trip.from}</td>
                  <td>{trip.to}</td>
                  <td>{trip.departureTime}</td>
                  <td>
                    <select
                      className="status-select"
                      value={trip.status}
                      onChange={(e) => handleStatusChange(trip, e.target.value)}
                    >
                      <option value="scheduled">مجدولة</option>
                      <option value="in-progress">قيد التنفيذ</option>
                      <option value="completed">مكتملة</option>
                      <option value="delayed">متأخرة</option>
                    </select>
                  </td>
                  <td>{trip.passengers}</td>
                  <td>{trip.revenue.toLocaleString()} ج.م</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="table-action-btn view"
                        onClick={() => handleViewDetails(trip)}
                        title="عرض التفاصيل"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="table-action-btn edit"
                        onClick={() => handleEdit(trip)}
                        title="تعديل"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="table-action-btn delete"
                        onClick={() => handleDelete(trip)}
                        title="حذف"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

    
      <AnimatePresence>
        {showDetails && selectedTrip && (
          <div className="modal-overlay" onClick={() => setShowDetails(false)}>
            <motion.div
              className="modal-content trip-details-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>
                  <i className="fas fa-bus" style={{ color: '#9BBF4E' }}></i>
                  تفاصيل الرحلة {selectedTrip.tripNumber}
                </h3>
                <button onClick={() => setShowDetails(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="trip-details-content">
                <div className="trip-info-grid">
                  <div className="info-item">
                    <label>رقم الرحلة</label>
                    <p><strong>{selectedTrip.tripNumber}</strong></p>
                  </div>
                  <div className="info-item">
                    <label>السائق</label>
                    <p>{selectedTrip.driver}</p>
                  </div>
                  <div className="info-item">
                    <label>من</label>
                    <p>{selectedTrip.from}</p>
                  </div>
                  <div className="info-item">
                    <label>إلى</label>
                    <p>{selectedTrip.to}</p>
                  </div>
                  <div className="info-item">
                    <label>موعد الانطلاق</label>
                    <p>{selectedTrip.departureTime}</p>
                  </div>
                  <div className="info-item">
                    <label>الحالة</label>
                    <p>
                      <span className={`status-badge ${selectedTrip.status}`}>
                        {selectedTrip.status === 'completed' && 'مكتملة'}
                        {selectedTrip.status === 'in-progress' && 'قيد التنفيذ'}
                        {selectedTrip.status === 'scheduled' && 'مجدولة'}
                        {selectedTrip.status === 'delayed' && 'متأخرة'}
                      </span>
                    </p>
                  </div>
                  <div className="info-item">
                    <label>عدد الركاب</label>
                    <p>{selectedTrip.passengers} راكب</p>
                  </div>
                  <div className="info-item">
                    <label>الإيراد</label>
                    <p>{selectedTrip.revenue.toLocaleString()} ج.م</p>
                  </div>
                </div>

                <div className="trip-stations">
                  <h4>
                    <i className="fas fa-map-marker-alt" style={{ color: '#E09162' }}></i>
                    المحطات التي ستتوقف فيها الرحلة
                  </h4>
                  <div className="stations-timeline">
                    {tripStations[selectedTrip.id]?.map((station, index) => (
                      <div key={index} className="station-timeline-item">
                        <div className="station-dot"></div>
                        <div className="station-content">
                          <span className="station-order">{index + 1}</span>
                          <span className="station-name">{station}</span>
                          {index === 0 && <span className="station-badge start">نقطة البداية</span>}
                          {index === tripStations[selectedTrip.id]?.length - 1 && 
                            <span className="station-badge end">نقطة النهاية</span>}
                        </div>
                        {index < tripStations[selectedTrip.id]?.length - 1 && (
                          <div className="station-line"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="trip-actions">
                  <button className="btn-edit" onClick={() => { 
                    setShowDetails(false);
                    handleEdit(selectedTrip);
                  }}>
                    <i className="fas fa-edit"></i>
                    تعديل الرحلة
                  </button>
                  <button className="btn-delete" onClick={() => {
                    setShowDetails(false);
                    handleDelete(selectedTrip);
                  }}>
                    <i className="fas fa-trash"></i>
                    حذف الرحلة
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditModal && selectedTrip && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <motion.div
              className="modal-content edit-trip-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>
                  <i className="fas fa-edit" style={{ color: '#E09162' }}></i>
                  تعديل الرحلة {selectedTrip.tripNumber}
                </h3>
                <button onClick={() => setShowEditModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleSaveEdit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>رقم الرحلة</label>
                    <input
                      type="text"
                      value={editFormData.tripNumber}
                      onChange={(e) => setEditFormData({...editFormData, tripNumber: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>السائق</label>
                    <input
                      type="text"
                      value={editFormData.driver}
                      onChange={(e) => setEditFormData({...editFormData, driver: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>من</label>
                    <input
                      type="text"
                      value={editFormData.from}
                      onChange={(e) => setEditFormData({...editFormData, from: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>إلى</label>
                    <input
                      type="text"
                      value={editFormData.to}
                      onChange={(e) => setEditFormData({...editFormData, to: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>موعد الانطلاق</label>
                    <input
                      type="text"
                      value={editFormData.departureTime}
                      onChange={(e) => setEditFormData({...editFormData, departureTime: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>الحالة</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    >
                      <option value="scheduled">مجدولة</option>
                      <option value="in-progress">قيد التنفيذ</option>
                      <option value="completed">مكتملة</option>
                      <option value="delayed">متأخرة</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>عدد الركاب</label>
                    <input
                      type="number"
                      value={editFormData.passengers}
                      onChange={(e) => setEditFormData({...editFormData, passengers: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>الإيراد</label>
                    <input
                      type="number"
                      value={editFormData.revenue}
                      onChange={(e) => setEditFormData({...editFormData, revenue: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                    إلغاء
                  </button>
                  <button type="submit" className="btn-save">
                    <i className="fas fa-save"></i>
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TripsTable;