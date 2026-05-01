import toast from 'react-hot-toast';


export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: '#4A7554',
      color: '#FFFFFF',
      fontFamily: 'Cairo',
      fontSize: '14px',
      padding: '12px 20px',
      borderRadius: '15px',
      direction: 'rtl',
    },
  });
};


export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-center',
    style: {
      background: '#E09162',
      color: '#FFFFFF',
      fontFamily: 'Cairo',
      fontSize: '14px',
      padding: '12px 20px',
      borderRadius: '15px',
      direction: 'rtl',
    },
  });
};


export const showWarning = (message) => {
  toast(message, {
    duration: 3500,
    position: 'top-center',
    icon: '⚠️',
    style: {
      background: '#FFD700',
      color: '#2C3E2F',
      fontFamily: 'Cairo',
      fontSize: '14px',
      padding: '12px 20px',
      borderRadius: '15px',
      direction: 'rtl',
    },
  });
};


export const showInfo = (message) => {
  toast(message, {
    duration: 3000,
    position: 'top-center',
    icon: 'ℹ️',
    style: {
      background: '#9BBF4E',
      color: '#FFFFFF',
      fontFamily: 'Cairo',
      fontSize: '14px',
      padding: '12px 20px',
      borderRadius: '15px',
      direction: 'rtl',
    },
  });
};


export const showTripNotification = (tripNumber, action) => {
  const messages = {
    added: `تم إضافة الرحلة ${tripNumber} بنجاح`,
    updated: `تم تحديث الرحلة ${tripNumber} بنجاح`,
    deleted: `تم حذف الرحلة ${tripNumber} بنجاح`,
    started: `بدأت الرحلة ${tripNumber}`,
    completed: `اكتملت الرحلة ${tripNumber}`,
    delayed: `تأخرت الرحلة ${tripNumber}`,
  };

  toast.success(messages[action] || messages.added, {
    icon: '🚌',
    duration: 3500,
    style: {
      background: '#4A7554',
      color: '#FFFFFF',
      fontFamily: 'Cairo',
      borderRadius: '15px',
      direction: 'rtl',
    },
  });
};


export const showDriverNotification = (driverName, action) => {
  const messages = {
    added: `تم إضافة السائق ${driverName} بنجاح`,
    updated: `تم تحديث بيانات ${driverName} بنجاح`,
    deleted: `تم حذف السائق ${driverName} بنجاح`,
    suspended: `تم تعليق ${driverName}`,
    activated: `تم تنشيط ${driverName}`,
  };

  toast.success(messages[action] || messages.added, {
    icon: '👨‍✈️',
    duration: 3500,
    style: {
      background: '#4A7554',
      color: '#FFFFFF',
      fontFamily: 'Cairo',
      borderRadius: '15px',
      direction: 'rtl',
    },
  });
};


export const showPaymentNotification = (amount, action) => {
  const messages = {
    received: `تم استلام مبلغ ${amount} ج.م`,
    refunded: `تم استرجاع مبلغ ${amount} ج.م`,
    failed: `فشلت عملية الدفع بقيمة ${amount} ج.م`,
  };

  toast.success(messages[action] || messages.received, {
    icon: '💰',
    duration: 3500,
    style: {
      background: '#4A7554',
      color: '#FFFFFF',
      fontFamily: 'Cairo',
      borderRadius: '15px',
      direction: 'rtl',
    },
  });
};


export const showLoading = (message) => {
  return toast.loading(message, {
    position: 'top-center',
    style: {
      background: '#FFFFFF',
      color: '#2C3E2F',
      fontFamily: 'Cairo',
      fontSize: '14px',
      padding: '12px 20px',
      borderRadius: '15px',
      direction: 'rtl',
    },
  });
};


export const showConfirm = (message, onConfirm) => {
  if (window.confirm(message)) {
    onConfirm();
  }
};