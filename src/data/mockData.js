// بيانات حقيقية للرحلات
export const tripsData = [
  {
    id: 1,
    tripNumber: "TR-2024-001",
    driver: "أحمد علي",
    driverId: "DR-001",
    from: "القاهرة",
    to: "الإسكندرية",
    departureTime: "2024-03-15 08:00",
    arrivalTime: "2024-03-15 12:30",
    status: "completed",
    passengers: 45,
    revenue: 6750,
    distance: 220,
    duration: "4.5 ساعات"
  },
  {
    id: 2,
    tripNumber: "TR-2024-002",
    driver: "محمد حسن",
    driverId: "DR-002",
    from: "الجيزة",
    to: "الأقصر",
    departureTime: "2024-03-15 09:30",
    arrivalTime: "2024-03-15 18:45",
    status: "in-progress",
    passengers: 38,
    revenue: 9500,
    distance: 670,
    duration: "9 ساعات"
  },
  {
    id: 3,
    tripNumber: "TR-2024-003",
    driver: "خالد محمود",
    driverId: "DR-003",
    from: "الإسكندرية",
    to: "مرسى مطروح",
    departureTime: "2024-03-15 10:15",
    arrivalTime: "2024-03-15 14:30",
    status: "scheduled",
    passengers: 32,
    revenue: 4800,
    distance: 290,
    duration: "4 ساعات"
  },
  {
    id: 4,
    tripNumber: "TR-2024-004",
    driver: "سعيد عمر",
    driverId: "DR-004",
    from: "طنطا",
    to: "المنصورة",
    departureTime: "2024-03-15 11:00",
    arrivalTime: "2024-03-15 13:15",
    status: "delayed",
    passengers: 28,
    revenue: 2800,
    distance: 110,
    duration: "2 ساعات"
  },
  {
    id: 5,
    tripNumber: "TR-2024-005",
    driver: "إبراهيم ناصر",
    driverId: "DR-005",
    from: "المنيا",
    to: "أسيوط",
    departureTime: "2024-03-15 12:30",
    arrivalTime: "2024-03-15 15:45",
    status: "scheduled",
    passengers: 35,
    revenue: 3500,
    distance: 180,
    duration: "3 ساعات"
  }
];

// بيانات السائقين 
export const driversData = [
  {
    id: "DR-001",
    name: "أحمد علي",
    phone: "01234567890",
    license: "LIC-2024-001",
    licenseExpiry: "2025-03-20",
    status: "active",
    totalTrips: 156,
    rating: 4.8,
    vehicle: "مرسيدس بنز سبرينتر",
    plateNumber: "س ج د 1234",
    joinDate: "2023-01-15",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    company: "شركة النيل للنقل",
    bonus: 3900,
    bonusRate: 5
  },
  {
    id: "DR-002",
    name: "محمد حسن",
    phone: "01234567891",
    license: "LIC-2024-002",
    licenseExpiry: "2025-06-15",
    status: "active",
    totalTrips: 142,
    rating: 4.9,
    vehicle: "مان حافلة",
    plateNumber: "ر م و 5678",
    joinDate: "2023-03-20",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    company: "شركة الأهرام للسفر",
    bonus: 4970,
    bonusRate: 7
  },
  {
    id: "DR-003",
    name: "خالد محمود",
    phone: "01234567892",
    license: "LIC-2024-003",
    licenseExpiry: "2024-12-10",
    status: "inactive",
    totalTrips: 89,
    rating: 4.5,
    vehicle: "فولفو حافلة",
    plateNumber: "ل أ أ 9012",
    joinDate: "2023-06-10",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    company: "شركة الدلتا للنقل",
    bonus: 1780,
    bonusRate: 4
  },
  {
    id: "DR-004",
    name: "سعيد عمر",
    phone: "01234567893",
    license: "LIC-2024-004",
    licenseExpiry: "2025-09-05",
    status: "active",
    totalTrips: 203,
    rating: 5.0,
    vehicle: "سكانيا حافلة",
    plateNumber: "م ص ر 3456",
    joinDate: "2022-11-05",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    company: "شركة الصعيد للرحلات",
    bonus: 6090,
    bonusRate: 6
  },
  {
    id: "DR-005",
    name: "إبراهيم ناصر",
    phone: "01234567894",
    license: "LIC-2024-005",
    licenseExpiry: "2024-08-30",
    status: "suspended",
    totalTrips: 67,
    rating: 3.9,
    vehicle: "فورد ترانزيت",
    plateNumber: "ق ط ن 7890",
    joinDate: "2023-09-18",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    company: "شركة النيل للنقل",
    bonus: 0,
    bonusRate: 0
  }
];

// بيانات المدفوعات
export const paymentsData = [
  {
    id: "PAY-001",
    tripId: "TR-2024-001",
    passengerName: "محمد عبدالله",
    amount: 250,
    method: "visa",
    status: "completed",
    date: "2024-03-15 08:15",
    reference: "REF-123456"
  },
  {
    id: "PAY-002",
    tripId: "TR-2024-001",
    passengerName: "فاطمة أحمد",
    amount: 250,
    method: "vodafone",
    status: "completed",
    date: "2024-03-15 08:20",
    reference: "REF-123457"
  },
  {
    id: "PAY-003",
    tripId: "TR-2024-002",
    passengerName: "عمر خالد",
    amount: 380,
    method: "visa",
    status: "pending",
    date: "2024-03-15 09:45",
    reference: "REF-123458"
  },
  {
    id: "PAY-004",
    tripId: "TR-2024-003",
    passengerName: "سارة محمود",
    amount: 180,
    method: "fawry",
    status: "failed",
    date: "2024-03-15 10:30",
    reference: "REF-123459"
  },
  {
    id: "PAY-005",
    tripId: "TR-2024-004",
    passengerName: "نور الدين",
    amount: 420,
    method: "wallet",
    status: "completed",
    date: "2024-03-15 11:15",
    reference: "REF-123460"
  }
];

// طرق الدفع
export const paymentMethodsList = [
  { id: 'visa', name: 'Visa', icon: 'fab fa-cc-visa', color: '#1A1F71' },
  { id: 'fawry', name: 'فوري', icon: 'fas fa-qrcode', color: '#005A9C' },
  { id: 'vodafone', name: 'فودافون كاش', icon: 'fas fa-mobile-alt', color: '#E60000' },
  { id: 'wallet', name: 'محفظة', icon: 'fas fa-wallet', color: '#4A7554' }
];

// بيانات المحطات للخريطة
export const stationsData = [
  {
    id: 1,
    name: "محطة القاهرة",
    city: "القاهرة",
    lat: 30.0444,
    lng: 31.2357,
    activeBuses: 15,
    capacity: 30,
    status: "active",
    nextTrip: "08:30",
    lastUpdated: "2024-03-15 07:00"
  },
  {
    id: 2,
    name: "محطة الجيزة",
    city: "الجيزة",
    lat: 30.0081,
    lng: 31.2109,
    activeBuses: 12,
    capacity: 25,
    status: "active",
    nextTrip: "09:00",
    lastUpdated: "2024-03-15 07:15"
  },
  {
    id: 3,
    name: "محطة الإسكندرية",
    city: "الإسكندرية",
    lat: 31.2001,
    lng: 29.9187,
    activeBuses: 10,
    capacity: 20,
    status: "maintenance",
    nextTrip: "10:30",
    lastUpdated: "2024-03-15 06:45"
  },
  {
    id: 4,
    name: "محطة طنطا",
    city: "طنطا",
    lat: 30.7865,
    lng: 31.0004,
    activeBuses: 8,
    capacity: 15,
    status: "active",
    nextTrip: "09:45",
    lastUpdated: "2024-03-15 07:30"
  },
  {
    id: 5,
    name: "محطة المنصورة",
    city: "المنصورة",
    lat: 31.0409,
    lng: 31.3785,
    activeBuses: 6,
    capacity: 15,
    status: "active",
    nextTrip: "10:15",
    lastUpdated: "2024-03-15 07:20"
  }
];

// بيانات حقيقية للرسوم البيانية
export const chartData = {
  monthlyRevenue: {
    labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
    values: [125000, 150000, 180000, 210000, 195000, 225000, 275000, 290000, 265000, 310000, 335000, 380000]
  },
  dailyTrips: {
    labels: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    values: [45, 52, 48, 61, 58, 35, 42]
  },
  paymentMethods: {
    labels: ["Visa", "فوري", "فودافون كاش", "محفظة"],
    values: [35, 25, 25, 15]
  },
  driverPerformance: {
    labels: ["أحمد علي", "محمد حسن", "خالد محمود", "سعيد عمر", "إبراهيم ناصر"],
    trips: [156, 142, 89, 203, 67],
    revenue: [78000, 71000, 44500, 101500, 33500]
  },
  weeklyStats: {
    trips: [320, 345, 298, 367, 412, 289, 356],
    revenue: [48000, 51750, 44700, 55050, 61800, 43350, 53400],
    passengers: [1250, 1345, 1162, 1431, 1607, 1127, 1388]
  }
};

// بيانات المستخدمين للنظام
export const usersData = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    role: "مدير النظام",
    name: "أحمد محمد",
    email: "ahmed@microeg.com",
    phone: "01234567890",
    address: "القاهرة، مصر",
    department: "الإدارة العليا",
    joinDate: "2024-01-01",
    avatar: null
  },
  {
    id: 2,
    username: "supervisor",
    password: "super123",
    role: "مشرف",
    name: "محمد السيد",
    email: "mohamed@microeg.com",
    phone: "01234567891",
    address: "الجيزة، مصر",
    department: "المشرفين",
    joinDate: "2024-02-15",
    avatar: null
  }
];