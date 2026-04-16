import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tripsData, driversData } from '../../data/mockData';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import '../../styles/DashboardHome.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalRevenue: 0,
    totalDrivers: 0,
    totalPassengers: 0,
    avgRating: 4.8
  });

  useEffect(() => {
    const totalTrips = tripsData.length;
    const totalRevenue = tripsData.reduce((sum, trip) => sum + trip.revenue, 0);
    const totalDrivers = driversData.length;
    const totalPassengers = tripsData.reduce((sum, trip) => sum + trip.passengers, 0);
    
    setStats({
      totalTrips,
      totalRevenue,
      totalDrivers,
      totalPassengers,
      avgRating: 4.8
    });
  }, []);

  const dailyTripsData = {
    labels: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    datasets: [
      {
        label: 'عدد الرحلات',
        data: [45, 52, 48, 61, 58, 35, 42],
        backgroundColor: 'rgba(74, 117, 84, 0.5)',
        borderColor: '#4A7554',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const monthlyRevenueData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: 'الإيرادات',
        data: [125000, 150000, 180000, 210000, 195000, 225000],
        backgroundColor: 'rgba(155, 191, 78, 0.5)',
        borderColor: '#9BBF4E',
        borderWidth: 2,
      },
    ],
  };

  const paymentMethodsData = {
    labels: ['انستا باي', 'فودافون كاش'],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ['#4A7554', '#E09162'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
      },
    ],
  };

  const driverPerformanceData = {
    labels: ['أحمد', 'محمد', 'خالد', 'سعيد', 'إبراهيم'],
    datasets: [
      {
        label: 'عدد الرحلات',
        data: [156, 142, 89, 203, 67],
        backgroundColor: '#4A7554',
      },
      {
        label: 'الإيرادات (بالآلاف)',
        data: [78, 71, 44, 101, 33],
        backgroundColor: '#9BBF4E',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        rtl: true,
        backgroundColor: '#4A7554',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5DBC8',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        rtl: true,
        labels: {
          font: {
            family: 'Cairo',
            size: 12,
          },
          color: '#2C3E2F',
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        rtl: true,
        labels: {
          font: {
            family: 'Cairo',
          },
        },
      },
      tooltip: {
        rtl: true,
        backgroundColor: '#4A7554',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5DBC8',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="dashboard-home">
      <div className="stats-grid">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-icon">
            <i className="fas fa-bus"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalTrips}</div>
            <div className="stat-label">إجمالي الرحلات</div>
            <div className="stat-change positive">
              <i className="fas fa-arrow-up"></i>
              +12% عن الأمس
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalRevenue.toLocaleString()} ج.م</div>
            <div className="stat-label">الإيرادات</div>
            <div className="stat-change positive">
              <i className="fas fa-arrow-up"></i>
              +8% عن الأمس
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalDrivers}</div>
            <div className="stat-label">السائقين</div>
            <div className="stat-change positive">
              <i className="fas fa-arrow-up"></i>
              +3 عن الأمس
            </div>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.avgRating}</div>
            <div className="stat-label">تقييم الخدمة</div>
            <div className="stat-change positive">
              <i className="fas fa-arrow-up"></i>
              +0.2 عن الأمس
            </div>
          </div>
        </motion.div>
      </div>

      <div className="charts-grid">
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="chart-title">
            <i className="fas fa-chart-line"></i>
            تحليل الرحلات اليومية
          </h3>
          <div className="chart-wrapper">
            <Line data={dailyTripsData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="chart-title">
            <i className="fas fa-chart-bar"></i>
            الإيرادات الشهرية
          </h3>
          <div className="chart-wrapper">
            <Bar data={monthlyRevenueData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="chart-title">
            <i className="fas fa-chart-pie"></i>
            طرق الدفع
          </h3>
          <div className="chart-wrapper">
            <Pie data={paymentMethodsData} options={pieOptions} />
          </div>
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="chart-title">
            <i className="fas fa-chart-bar"></i>
            أداء السائقين
          </h3>
          <div className="chart-wrapper">
            <Bar data={driverPerformanceData} options={barOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;