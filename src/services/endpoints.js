import api from './api';


export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// الرحلات
export const tripsAPI = {
  getAll: () => api.get('/trips'),
  getById: (id) => api.get(`/trips/${id}`),
  create: (data) => api.post('/trips', data),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
  updateStatus: (id, status) => api.patch(`/trips/${id}/status`, { status }),
};

// السائقين
export const driversAPI = {
  getAll: () => api.get('/drivers'),
  getById: (id) => api.get(`/drivers/${id}`),
  create: (data) => api.post('/drivers', data),
  update: (id, data) => api.put(`/drivers/${id}`, data),
  delete: (id) => api.delete(`/drivers/${id}`),
  updateStatus: (id, status) => api.patch(`/drivers/${id}/status`, { status }),
};

// المدفوعات
export const paymentsAPI = {
  getAll: () => api.get('/payments'),
  process: (id) => api.post(`/payments/${id}/process`),
  refund: (id) => api.post(`/payments/${id}/refund`),
};

// المحطات
export const stationsAPI = {
  getAll: () => api.get('/stations'),
  getById: (id) => api.get(`/stations/${id}`),
};

// التقارير
export const reportsAPI = {
  getStats: () => api.get('/reports/stats'),
  getChartData: () => api.get('/reports/charts'),
  exportPDF: () => api.get('/reports/export/pdf', { responseType: 'blob' }),
  exportExcel: () => api.get('/reports/export/excel', { responseType: 'blob' }),
};

// الشركات والمكافآت
export const companiesAPI = {
  getAll: () => api.get('/companies'),
  getDriverBonus: (driverId) => api.get(`/drivers/${driverId}/bonus`),
  calculateBonus: (driverId, revenue) => api.post(`/drivers/${driverId}/calculate-bonus`, { revenue }),
};