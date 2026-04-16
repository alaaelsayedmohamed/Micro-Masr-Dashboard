import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import TripsTable from './TripsTable';
import DriversManagement from './DriversManagement';
import StationsMap from './StationsMap';
import PaymentsDashboard from './PaymentsDashboard';
import RealCharts from './RealCharts';
import DashboardHome from './DashboardHome';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <motion.main
        className="dashboard-main"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
        
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/trips" element={<TripsTable />} />
          <Route path="/drivers" element={<DriversManagement />} />
          <Route path="/stations" element={<StationsMap />} />
          <Route path="/payments" element={<PaymentsDashboard />} />
          <Route path="/charts" element={<RealCharts />} />
        </Routes>
      </motion.main>
    </div>
  );
};

export default Dashboard;