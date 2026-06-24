import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { stationsData } from '../../data/mockData';
import { showSuccess, showInfo, showConfirm } from '../../utils/notifications';
import '../../styles/StationsMap.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const StationsMap = () => {
  const [stations, setStations] = useState(stationsData);
  const [filter, setFilter] = useState('all');
  const [selectedStation, setSelectedStation] = useState(null);
  const [mapCenter, setMapCenter] = useState([30.0444, 31.2357]);
  const [mapZoom, setMapZoom] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    city: '',
    capacity: 10,
    activeBuses: 5,
    nextTrip: '08:00',
    status: 'active'
  });

  const activeStations = stations.filter(s => s.status === 'active').length;
  const inactiveStations = stations.filter(s => s.status === 'inactive').length;
  const totalBuses = stations.reduce((sum, s) => sum + s.activeBuses, 0);
  const totalCapacity = stations.reduce((sum, s) => sum + s.capacity, 0);

  const filteredStations = stations.filter(station => {
    if (filter === 'all') return true;
    return station.status === filter;
  });

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      city: '',
      capacity: 10,
      activeBuses: 5,
      nextTrip: '08:00',
      status: 'active'
    });
  };

  const openAddModal = () => {
    setModalMode('add');
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (station) => {
    setModalMode('edit');
    setFormData({
      id: station.id,
      name: station.name,
      city: station.city,
      capacity: station.capacity,
      activeBuses: station.activeBuses,
      nextTrip: station.nextTrip,
      status: station.status
    });
    setShowModal(true);
  };

  const handleAddStation = () => {
    const randomLat = 30 + (Math.random() - 0.5) * 5;
    const randomLng = 31 + (Math.random() - 0.5) * 5;
    
    const newStation = {
      id: Date.now(),
      ...formData,
      lat: randomLat,
      lng: randomLng,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setStations([...stations, newStation]);
    setShowModal(false);
    showSuccess(`تم إضافة محطة ${formData.name} بنجاح`);
    resetForm();
  };

  const handleEditStation = () => {
    const updatedStations = stations.map(s =>
      s.id === formData.id ? { ...s, ...formData, lastUpdated: new Date().toISOString().split('T')[0] } : s
    );
    setStations(updatedStations);
    setShowModal(false);
    showSuccess(`تم تحديث محطة ${formData.name} بنجاح`);
    resetForm();
  };

  const handleDeleteStation = (station) => {
    showConfirm(
      `هل أنت متأكد من حذف محطة ${station.name}؟`,
      () => {
        setStations(stations.filter(s => s.id !== station.id));
        showSuccess(`تم حذف محطة ${station.name} بنجاح`);
        if (selectedStation?.id === station.id) {
          setSelectedStation(null);
        }
      }
    );
  };

  const handleToggleStatus = (station) => {
    const newStatus = station.status === 'active' ? 'inactive' : 'active';
    setStations(stations.map(s =>
      s.id === station.id ? { ...s, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] } : s
    ));
    showInfo(`تم ${newStatus === 'active' ? 'تفعيل' : 'إلغاء تفعيل'} محطة ${station.name}`);
    if (selectedStation?.id === station.id) {
      setSelectedStation({ ...selectedStation, status: newStatus });
    }
  };

  const handleStationClick = (station) => {
    setSelectedStation(station);
    setMapCenter([station.lat, station.lng]);
    setMapZoom(12);
    showInfo(`تم عرض محطة ${station.name}`);
  };

  const createCustomIcon = (status, isSelected) => {
    const color = status === 'active' ? '#4A7554' : '#9BBF4E';

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: ${isSelected ? '50px' : '40px'};
          height: ${isSelected ? '50px' : '40px'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 5px 15px rgba(74, 117, 84, 0.3);
          transition: all 0.3s ease;
          animation: ${isSelected ? 'pulse 1.5s infinite' : 'none'};
          cursor: pointer;
        ">
          <i class="fas fa-bus" style="color: white; font-size: ${isSelected ? '24px' : '18px'};"></i>
        </div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 5px 15px rgba(74, 117, 84, 0.3); }
            50% { transform: scale(1.1); box-shadow: 0 8px 25px rgba(74, 117, 84, 0.5); }
            100% { transform: scale(1); box-shadow: 0 5px 15px rgba(74, 117, 84, 0.3); }
          }
        </style>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  return (
    <div className="map-container">
      <div className="map-header">
        <h2 className="map-title">
          <i className="fas fa-map-marked-alt"></i>
          إدارة المحطات
        </h2>

        <div className="map-controls">
          <button className="add-station-btn" onClick={openAddModal}>
            <i className="fas fa-plus"></i>
            إضافة محطة
          </button>

          <button
            className={`map-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <i className="fas fa-globe"></i>
            الكل ({stations.length})
          </button>
          <button
            className={`map-filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            <i className="fas fa-check-circle"></i>
            نشط ({activeStations})
          </button>
          <button
            className={`map-filter-btn ${filter === 'inactive' ? 'active' : ''}`}
            onClick={() => setFilter('inactive')}
          >
            <i className="fas fa-circle" style={{ color: '#9BBF4E' }}></i>
            غير نشط ({inactiveStations})
          </button>
        </div>
      </div>

      <div className="map-stats-row">
        <motion.div className="map-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="map-stat-label"><i className="fas fa-map-pin"></i> إجمالي المحطات</div>
          <div className="map-stat-value">{stations.length}</div>
        </motion.div>
        <motion.div className="map-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="map-stat-label"><i className="fas fa-check-circle" style={{ color: '#4A7554' }}></i> محطات نشطة</div>
          <div className="map-stat-value">{activeStations}</div>
        </motion.div>
        <motion.div className="map-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="map-stat-label"><i className="fas fa-bus"></i> حافلات عاملة</div>
          <div className="map-stat-value">{totalBuses}</div>
        </motion.div>
        <motion.div className="map-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="map-stat-label"><i className="fas fa-users"></i> السعة الكلية</div>
          <div className="map-stat-value">{totalCapacity * 50}</div>
        </motion.div>
      </div>

      <div className="map-wrapper">
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {filteredStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={createCustomIcon(station.status, selectedStation?.id === station.id)}
              eventHandlers={{
                click: () => handleStationClick(station),
                dblclick: () => handleToggleStatus(station),
              }}
            >
              <Popup>
                <div style={{ padding: '10px', fontFamily: 'Cairo', textAlign: 'center', minWidth: '200px' }}>
                  <h3 style={{ color: '#4A7554', marginBottom: '8px' }}>
                    <i className="fas fa-bus" style={{ marginLeft: '5px', color: '#9BBF4E' }}></i>
                    {station.name}
                  </h3>
                  <p style={{ color: '#5F6B6A', fontSize: '13px', marginBottom: '10px' }}>
                    <i className="fas fa-map-marker-alt" style={{ marginLeft: '3px', color: '#E09162' }}></i>
                    {station.city}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <div><i className="fas fa-bus" style={{ color: '#5F8A61' }}></i> {station.activeBuses} حافلة</div>
                    <div><i className="fas fa-clock" style={{ color: '#5F8A61' }}></i> {station.nextTrip}</div>
                    <div><i className="fas fa-chair" style={{ color: '#5F8A61' }}></i> {station.capacity * 50} مقعد</div>
                    <div>
                      <i className="fas fa-circle" style={{ color: station.status === 'active' ? '#4A7554' : '#9BBF4E' }}></i>
                      {station.status === 'active' ? 'نشط' : 'غير نشط'}
                    </div>
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '5px', justifyContent: 'center' }}>
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(station); }} style={{ padding: '3px 10px', background: '#FF9800', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteStation(station); }} style={{ padding: '3px 10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                      <i className="fas fa-trash"></i>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(station); }} style={{ padding: '3px 10px', background: '#4A7554', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                      <i className="fas fa-power-off"></i>
                    </button>
                  </div>
                  <p style={{ fontSize: '10px', color: '#5F6B6A', marginTop: '8px' }}>آخر تحديث: {station.lastUpdated}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="stations-list">
        <AnimatePresence>
          {filteredStations.map((station) => (
            <motion.div
              key={station.id}
              className={`station-card ${station.status} ${selectedStation?.id === station.id ? 'selected' : ''}`}
              onClick={() => handleStationClick(station)}
              onDoubleClick={() => handleToggleStatus(station)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="station-header">
                <h3 className="station-name">
                  <i className="fas fa-map-marker-alt"></i>
                  {station.name}
                </h3>
                <span className={`station-status ${station.status}`}>
                  {station.status === 'active' ? 'نشط' : 'غير نشط'}
                </span>
              </div>

              <div className="station-details">
                <div className="detail-item"><i className="fas fa-city"></i> {station.city}</div>
                <div className="detail-item"><i className="fas fa-bus"></i> {station.activeBuses} حافلة</div>
                <div className="detail-item"><i className="fas fa-chair"></i> {station.capacity * 50} مقعد</div>
                <div className="detail-item"><i className="fas fa-clock"></i> {station.nextTrip}</div>
              </div>

              <div className="station-actions">
                <button onClick={(e) => { e.stopPropagation(); openEditModal(station); }} className="action-btn edit">
                  <i className="fas fa-edit"></i>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteStation(station); }} className="action-btn delete">
                  <i className="fas fa-trash"></i>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(station); }} className={`action-btn toggle ${station.status}`}>
                  <i className={`fas ${station.status === 'active' ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
              </div>

              <div className={`station-indicator ${station.status}`} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>
                  <i className="fas fa-map-marker-alt"></i>
                  {modalMode === 'add' ? 'إضافة محطة جديدة' : 'تعديل بيانات المحطة'}
                </h3>
                <button onClick={() => setShowModal(false)}><i className="fas fa-times"></i></button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                modalMode === 'add' ? handleAddStation() : handleEditStation();
              }}>
                <div className="form-group">
                  <label>اسم المحطة</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>

                <div className="form-group">
                  <label>المدينة</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>عدد الحافلات</label>
                    <input type="number" value={formData.activeBuses} onChange={(e) => setFormData({...formData, activeBuses: parseInt(e.target.value)})} required />
                  </div>
                  <div className="form-group">
                    <label>السعة</label>
                    <input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>موعد الرحلة القادمة</label>
                  <input type="time" value={formData.nextTrip} onChange={(e) => setFormData({...formData, nextTrip: e.target.value})} required />
                </div>

                <div className="form-group">
                  <label>الحالة</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>

                <button type="submit" className="submit-btn">
                  {modalMode === 'add' ? 'إضافة المحطة' : 'حفظ التغييرات'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StationsMap;