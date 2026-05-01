import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ComposedChart, Scatter
} from 'recharts';
import { chartData } from '../../data/mockData';
import '../../styles/RealCharts.css';


const PAYMENT_COLORS = {
  visa: '#1A1F71',
  fawry: '#005A9C',
  vodafone: '#E60000',
  wallet: '#4A7554'
};

const RealCharts = () => {
  const totalTrips = chartData.weeklyStats.trips.reduce((a, b) => a + b, 0);
  const totalRevenue = chartData.weeklyStats.revenue.reduce((a, b) => a + b, 0);
  const totalPassengers = chartData.weeklyStats.passengers.reduce((a, b) => a + b, 0);
  const avgRating = 4.8;

  const currentMonthData = chartData.monthlyRevenue.labels.map((label, index) => ({
    name: label,
    value: chartData.monthlyRevenue.values[index]
  }));

  const radarData = [
    { subject: 'الالتزام', A: 120, fullMark: 150 },
    { subject: 'رضا العملاء', A: 98, fullMark: 150 },
    { subject: 'السلامة', A: 86, fullMark: 150 },
    { subject: 'الكفاءة', A: 99, fullMark: 150 },
    { subject: 'النظافة', A: 85, fullMark: 150 },
    { subject: 'السرعة', A: 65, fullMark: 150 },
  ];

  const driverPerformance = chartData.driverPerformance.labels.map((name, index) => ({
    name,
    رحلات: chartData.driverPerformance.trips[index],
    إيرادات: (chartData.driverPerformance.revenue[index] / 1000).toFixed(1)
  }));

  const comparisonData = [
    { name: 'يناير', هذا_العام: 125000, العام_الماضي: 110000 },
    { name: 'فبراير', هذا_العام: 150000, العام_الماضي: 135000 },
    { name: 'مارس', هذا_العام: 180000, العام_الماضي: 160000 },
    { name: 'أبريل', هذا_العام: 210000, العام_الماضي: 185000 },
    { name: 'مايو', هذا_العام: 195000, العام_الماضي: 175000 },
    { name: 'يونيو', هذا_العام: 225000, العام_الماضي: 200000 },
  ];

  
  const paymentMethodsData = [
    { name: 'Visa', value: 35, color: PAYMENT_COLORS.visa, icon: 'fab fa-cc-visa' },
    { name: 'فوري', value: 25, color: PAYMENT_COLORS.fawry, icon: 'fas fa-qrcode' },
    { name: 'فودافون كاش', value: 25, color: PAYMENT_COLORS.vodafone, icon: 'fas fa-mobile-alt' },
    { name: 'محفظة', value: 15, color: PAYMENT_COLORS.wallet, icon: 'fas fa-wallet' }
  ];

  const handleExport = (format) => {
    console.log(`تصدير ${format}`);
    // يتربط بالـ API 
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2 className="reports-title">
          <i className="fas fa-chart-pie"></i>
          التقارير والإحصائيات
        </h2>
        <motion.div
          className="date-range"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <i className="fas fa-calendar-alt"></i>
          ١ يناير - ٣٠ يونيو ٢٠٢٤
        </motion.div>
      </div>

      <div className="reports-stats-row">
        <motion.div
          className="reports-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="reports-stat-icon">
            <i className="fas fa-bus"></i>
          </div>
          <div className="reports-stat-value">{totalTrips.toLocaleString()}</div>
          <div className="reports-stat-label">إجمالي الرحلات</div>
        </motion.div>

        <motion.div
          className="reports-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="reports-stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="reports-stat-value">{totalRevenue.toLocaleString()} ج.م</div>
          <div className="reports-stat-label">إجمالي الإيرادات</div>
        </motion.div>

        <motion.div
          className="reports-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="reports-stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="reports-stat-value">{totalPassengers.toLocaleString()}</div>
          <div className="reports-stat-label">إجمالي الركاب</div>
        </motion.div>

        <motion.div
          className="reports-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="reports-stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="reports-stat-value">{avgRating}</div>
          <div className="reports-stat-label">متوسط التقييم</div>
        </motion.div>
      </div>

      <div className="reports-charts-grid">
        <motion.div
          className="reports-chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="reports-chart-title">
            <i className="fas fa-chart-line"></i>
            تحليل الإيرادات الشهرية
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={currentMonthData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A7554" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#9BBF4E" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DBC8" />
              <XAxis dataKey="name" stroke="#5F8A61" />
              <YAxis stroke="#5F8A61" />
              <Tooltip 
                formatter={(value) => `${value.toLocaleString()} ج.م`}
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #9BBF4E',
                  borderRadius: '10px',
                  fontFamily: 'Cairo'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#4A7554" 
                fill="url(#colorValue)" 
                strokeWidth={3}
                name="الإيرادات"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="reports-chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="reports-chart-title">
            <i className="fas fa-chart-bar"></i>
            مقارنة مع العام الماضي
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DBC8" />
              <XAxis dataKey="name" stroke="#5F8A61" />
              <YAxis stroke="#5F8A61" />
              <Tooltip 
                formatter={(value) => `${value.toLocaleString()} ج.م`}
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #9BBF4E',
                  borderRadius: '10px',
                  fontFamily: 'Cairo'
                }}
              />
              <Legend />
              <Bar dataKey="هذا_العام" fill="#4A7554" name="هذا العام" />
              <Bar dataKey="العام_الماضي" fill="#9BBF4E" name="العام الماضي" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="reports-chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="reports-chart-title">
            <i className="fas fa-chart-pie"></i>
            طرق الدفع
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethodsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #9BBF4E',
                  borderRadius: '10px',
                  fontFamily: 'Cairo'
                }}
              />
              <Legend 
                formatter={(value, entry, index) => {
                  const { color, icon } = paymentMethodsData[index];
                  return (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <i className={icon} style={{ color: color }}></i>
                      {value}
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="reports-chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="reports-chart-title">
            <i className="fas fa-chart-pie"></i>
            مؤشرات الأداء
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#E5DBC8" />
              <PolarAngleAxis dataKey="subject" stroke="#5F8A61" />
              <Radar
                name="الأداء"
                dataKey="A"
                stroke="#4A7554"
                fill="#9BBF4E"
                fillOpacity={0.6}
              />
              <Tooltip 
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #9BBF4E',
                  borderRadius: '10px',
                  fontFamily: 'Cairo'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="reports-chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="reports-chart-title">
            <i className="fas fa-trophy"></i>
            أداء السائقين
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={driverPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DBC8" />
              <XAxis type="number" stroke="#5F8A61" />
              <YAxis dataKey="name" type="category" stroke="#5F8A61" width={80} />
              <Tooltip 
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #9BBF4E',
                  borderRadius: '10px',
                  fontFamily: 'Cairo'
                }}
              />
              <Bar dataKey="رحلات" fill="#4A7554" name="عدد الرحلات" />
              <Bar dataKey="إيرادات" fill="#E09162" name="الإيرادات (آلاف)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="reports-chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0 }}
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="reports-chart-title">
            <i className="fas fa-chart-area"></i>
            التحليل الأسبوعي
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData.weeklyStats.trips.map((trip, i) => ({
              name: `أسبوع ${i + 1}`,
              رحلات: trip,
              ركاب: chartData.weeklyStats.passengers[i],
              إيرادات: (chartData.weeklyStats.revenue[i] / 1000)
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DBC8" />
              <XAxis dataKey="name" stroke="#5F8A61" />
              <YAxis stroke="#5F8A61" />
              <Tooltip 
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #9BBF4E',
                  borderRadius: '10px',
                  fontFamily: 'Cairo'
                }}
              />
              <Legend />
              <Bar dataKey="ركاب" fill="#9BBF4E" />
              <Line type="monotone" dataKey="إيرادات" stroke="#E09162" strokeWidth={2} />
              <Scatter dataKey="رحلات" fill="#4A7554" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
        
      </div>
    </div>
  );
};

export default RealCharts;