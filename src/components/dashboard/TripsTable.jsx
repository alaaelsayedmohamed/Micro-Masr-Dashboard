import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tripsData } from '../../data/mockData';
import { showSuccess, showTripNotification, showConfirm } from '../../utils/notifications';
import '../../styles/TripsTable.css';

const TripsTable = () => {
  const [trips, setTrips] = useState(tripsData);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.tripNumber.includes(search) || 
                         trip.driver.includes(search) ||
                         trip.from.includes(search);
    const matchesFilter = filter === 'all' || trip.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleView = (trip) => {
    showSuccess(`عرض تفاصيل الرحلة ${trip.tripNumber}`);
  };

  const handleEdit = (trip) => {
    showSuccess(`تعديل الرحلة ${trip.tripNumber}`);
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
                  <button
                    className="table-action-btn"
                    onClick={() => handleView(trip)}
                    title="عرض التفاصيل"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="table-action-btn"
                    onClick={() => handleEdit(trip)}
                    title="تعديل"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="table-action-btn"
                    onClick={() => handleDelete(trip)}
                    title="حذف"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
};

export default TripsTable;