import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { stationsData } from '../../data/mockData';
import { showSuccess, showInfo } from '../../utils/notifications';
import '../../styles/StationsMap.css';

// حل مشكلة الأيقونات في React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// إنشاء أيقونات مخصصة للمحطات
const createCustomIcon = (status, isSelected) => {
  const color = status === 'active' ? '#4A7554' : 
                status === 'maintenance' ? '#E09162' : '#9BBF4E';
  
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

const StationsMap = () => {
  const [stations, setStations] = useState(stationsData);
  const [filter, setFilter] = useState('all');
  const [selectedStation, setSelectedStation] = useState(null);
  const [mapCenter, setMapCenter] = useState([30.0444, 31.2357]); // القاهرة
  const [mapZoom, setMapZoom] = useState(8);

  // حساب الإحصائيات
  const activeStations = stations.filter(s => s.status === 'active').length;
  const totalBuses = stations.reduce((sum, s) => sum + s.activeBuses, 0);
  const totalCapacity = stations.reduce((sum, s) => sum + s.capacity, 0);
  const maintenanceStations = stations.filter(s => s.status === 'maintenance').length;

  // تصفية المحطات
  const filteredStations = stations.filter(station => {
    if (filter === 'all') return true;
    if (filter === 'active') return station.status === 'active';
    if (filter === 'maintenance') return station.status === 'maintenance';
    return true;
  });

  const handleStationClick = (station) => {
    setSelectedStation(station);
    setMapCenter([station.lat, station.lng]);
    setMapZoom(12);
    
    showInfo(`تم عرض محطة ${station.name}`);
  };

  return (
    <div className="map-container">
      <div className="map-header">
        <h2 className="map-title">
          <i className="fas fa-map-marked-alt"></i>
          خريطة المحطات
        </h2>

        <div className="map-controls">
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
            className={`map-filter-btn ${filter === 'maintenance' ? 'active' : ''}`}
            onClick={() => setFilter('maintenance')}
          >
            <i className="fas fa-tools"></i>
            صيانة ({maintenanceStations})
          </button>
        </div>
      </div>

      <div className="map-stats-row">
        <motion.div
          className="map-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="map-stat-label">
            <i className="fas fa-map-pin"></i>
            إجمالي المحطات
          </div>
          <div className="map-stat-value">{stations.length}</div>
        </motion.div>

        <motion.div
          className="map-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="map-stat-label">
            <i className="fas fa-check-circle" style={{ color: '#4A7554' }}></i>
            محطات نشطة
          </div>
          <div className="map-stat-value">{activeStations}</div>
        </motion.div>

        <motion.div
          className="map-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="map-stat-label">
            <i className="fas fa-bus"></i>
            حافلات عاملة
          </div>
          <div className="map-stat-value">{totalBuses}</div>
        </motion.div>

        <motion.div
          className="map-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="map-stat-label">
            <i className="fas fa-users"></i>
            السعة الكلية
          </div>
          <div className="map-stat-value">{totalCapacity * 50}</div>
          <small style={{ color: '#5F6B6A' }}>راكب</small>
        </motion.div>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={createCustomIcon(station.status, selectedStation?.id === station.id)}
              eventHandlers={{
                click: () => handleStationClick(station),
              }}
            >
              <Popup>
                <div style={{ 
                  padding: '10px',
                  fontFamily: 'Cairo',
                  textAlign: 'center',
                  minWidth: '200px'
                }}>
                  <h3 style={{ 
                    color: '#4A7554', 
                    marginBottom: '8px',
                    fontSize: '16px'
                  }}>
                    <i className="fas fa-bus" style={{ marginLeft: '5px', color: '#9BBF4E' }}></i>
                    {station.name}
                  </h3>
                  <p style={{ 
                    color: '#5F6B6A', 
                    fontSize: '13px',
                    marginBottom: '10px'
                  }}>
                    <i className="fas fa-map-marker-alt" style={{ marginLeft: '3px', color: '#E09162' }}></i>
                    {station.city}
                  </p>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    fontSize: '12px'
                  }}>
                    <div>
                      <i className="fas fa-bus" style={{ color: '#5F8A61' }}></i>
                      <span style={{ marginRight: '3px' }}>{station.activeBuses} حافلة</span>
                    </div>
                    <div>
                      <i className="fas fa-clock" style={{ color: '#5F8A61' }}></i>
                      <span style={{ marginRight: '3px' }}>{station.nextTrip}</span>
                    </div>
                    <div>
                      <i className="fas fa-chart-line" style={{ color: '#5F8A61' }}></i>
                      <span style={{ marginRight: '3px' }}>{station.capacity} مقعد</span>
                    </div>
                    <div>
                      <i className="fas fa-circle" style={{ 
                        color: station.status === 'active' ? '#4A7554' : '#E09162'
                      }}></i>
                      <span style={{ marginRight: '3px' }}>
                        {station.status === 'active' ? 'نشط' : 'صيانة'}
                      </span>
                    </div>
                  </div>
                  <p style={{ 
                    fontSize: '10px', 
                    color: '#5F6B6A',
                    marginTop: '8px'
                  }}>
                    آخر تحديث: {station.lastUpdated}
                  </p>
                </div>
              </Popup>

              <CircleMarker
                center={[station.lat, station.lng]}
                radius={15}
                pathOptions={{
                  color: station.status === 'active' ? '#4A7554' : '#E09162',
                  fillColor: station.status === 'active' ? '#9BBF4E' : '#E09162',
                  fillOpacity: 0.2,
                  weight: 2
                }}
              />
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="stations-list">
        <AnimatePresence>
          {filteredStations.map((station, index) => (
            <motion.div
              key={station.id}
              className={`station-card ${station.status} ${selectedStation?.id === station.id ? 'selected' : ''}`}
              onClick={() => handleStationClick(station)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="station-header">
                <h3 className="station-name">
                  <i className="fas fa-map-marker-alt"></i>
                  {station.name}
                </h3>
                <span className={`station-status ${station.status}`}>
                  {station.status === 'active' ? 'نشط' : 'صيانة'}
                </span>
              </div>

              <div className="station-details">
                <div className="detail-item">
                  <i className="fas fa-city"></i>
                  {station.city}
                </div>
                <div className="detail-item">
                  <i className="fas fa-bus"></i>
                  {station.activeBuses} حافلة
                </div>
                <div className="detail-item">
                  <i className="fas fa-chair"></i>
                  {station.capacity * 50} مقعد
                </div>
                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  {station.nextTrip}
                </div>
              </div>

              <div className={`station-indicator ${station.status}`} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StationsMap;