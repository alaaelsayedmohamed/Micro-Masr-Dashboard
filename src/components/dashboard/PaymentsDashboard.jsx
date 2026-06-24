import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { paymentsData, paymentMethodsList } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { showSuccess, showPaymentNotification, showConfirm } from '../../utils/notifications';
import '../../styles/PaymentsDashboard.css';

const PaymentsDashboard = () => {
  const [payments, setPayments] = useState(paymentsData);

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const completedAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const getMethodStats = () => {
    const stats = {};
    payments.forEach(payment => {
      if (payment.status === 'completed') {
        stats[payment.method] = (stats[payment.method] || 0) + payment.amount;
      }
    });
    return stats;
  };

  const methodStats = getMethodStats();

  const getPaymentIcon = (method) => {
    const found = paymentMethodsList.find(m => m.id === method);
    return found ? found.icon : 'fas fa-credit-card';
  };

  const getPaymentName = (method) => {
    const found = paymentMethodsList.find(m => m.id === method);
    return found ? found.name : method;
  };

  const getPaymentColor = (method) => {
    const found = paymentMethodsList.find(m => m.id === method);
    return found ? found.color : '#4A7554';
  };

  const chartData = payments.map(p => ({
    name: p.id,
    amount: p.amount
  }));

  const paymentMethodsChartData = Object.entries(methodStats).map(([method, amount]) => ({
    name: getPaymentName(method),
    amount: amount,
    method: method
  }));

 
  const handleProcessPayment = (payment) => {
    showConfirm(
      `هل أنت متأكد من معالجة الدفع بقيمة ${payment.amount} ج.م؟`,
      () => {
        setPayments(payments.map(p => 
          p.id === payment.id ? {...p, status: 'completed'} : p
        ));
        showPaymentNotification(payment.amount, 'received');
      }
    );
  };

  
  const handleCancelPayment = (payment) => {
    showConfirm(
      `هل أنت متأكد من إلغاء الدفع بقيمة ${payment.amount} ج.م؟`,
      () => {
        setPayments(payments.map(p => 
          p.id === payment.id ? {...p, status: 'cancelled'} : p
        ));
        showSuccess(`تم إلغاء الدفع بقيمة ${payment.amount} ج.م`);
      }
    );
  };

  
  const handleRefundPayment = (payment) => {
    showConfirm(
      `هل أنت متأكد من استرجاع الدفع بقيمة ${payment.amount} ج.م؟`,
      () => {
        setPayments(payments.map(p => 
          p.id === payment.id ? {...p, status: 'refunded'} : p
        ));
        showPaymentNotification(payment.amount, 'refunded');
      }
    );
  };

  
  const handleDeletePayment = (payment) => {
    showConfirm(
      `هل أنت متأكد من حذف هذا الدفع؟`,
      () => {
        setPayments(payments.filter(p => p.id !== payment.id));
        showSuccess('تم حذف الدفع بنجاح');
      }
    );
  };

  return (
    <div className="payments-container">
      <motion.div
        className="payments-list"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="payments-title">
          <i className="fas fa-credit-card"></i>
          آخر المدفوعات
        </h2>

        {payments.map((payment, index) => (
          <motion.div
            key={payment.id}
            className="payment-item"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="payment-info">
              <h4>{payment.passengerName}</h4>
              <p>
                <i className="fas fa-hashtag"></i>
                {payment.tripId}
              </p>
              <p>
                <i className={getPaymentIcon(payment.method)} style={{ marginLeft: '5px', color: getPaymentColor(payment.method) }}></i>
                {getPaymentName(payment.method)}
              </p>
            </div>
            <div className="payment-amount">
              <div className="amount">{payment.amount} ج.م</div>
              <div className={`status ${payment.status}`}>
                {payment.status === 'completed' && 'مكتمل'}
                {payment.status === 'pending' && 'معلق'}
                {payment.status === 'failed' && 'فشل'}
                {payment.status === 'refunded' && 'مسترجع'}
                {payment.status === 'cancelled' && 'ملغي'}
              </div>
              <div className="payment-actions">
                {payment.status === 'pending' && (
                  <>
                    <button
                      className="process-btn"
                      onClick={() => handleProcessPayment(payment)}
                    >
                      <i className="fas fa-check"></i>
                      معالجة
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelPayment(payment)}
                    >
                      <i className="fas fa-times"></i>
                      إلغاء
                    </button>
                  </>
                )}
                {payment.status === 'completed' && (
                  <>
                    <button
                      className="refund-btn"
                      onClick={() => handleRefundPayment(payment)}
                    >
                      <i className="fas fa-undo"></i>
                      استرجاع
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeletePayment(payment)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </>
                )}
                {(payment.status === 'failed' || payment.status === 'cancelled') && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeletePayment(payment)}
                  >
                    <i className="fas fa-trash"></i>
                    حذف
                  </button>
                )}
                {payment.status === 'refunded' && (
                  <span className="refunded-label">تم الاسترجاع</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="payment-summary"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="summary-card">
          <h3>إجمالي المدفوعات</h3>
          <div className="amount">{totalAmount.toLocaleString()} ج.م</div>
          <div className="change">+١٥٪ عن الشهر الماضي</div>
        </div>

        <div className="summary-card" style={{ background: 'linear-gradient(135deg, #9BBF4E 0%, #5F8A61 100%)' }}>
          <h3>المدفوعات المكتملة</h3>
          <div className="amount">{completedAmount.toLocaleString()} ج.م</div>
          <div className="change">{((completedAmount/totalAmount)*100).toFixed(1)}٪ من الإجمالي</div>
        </div>

        <div className="summary-card" style={{ background: 'linear-gradient(135deg, #E09162 0%, #E09162 100%)' }}>
          <h3>المدفوعات المعلقة</h3>
          <div className="amount">{pendingAmount.toLocaleString()} ج.م</div>
          <div className="change">{((pendingAmount/totalAmount)*100).toFixed(1)}٪ من الإجمالي</div>
        </div>

        <div className="payment-methods-stats">
          <h3><i className="fas fa-chart-pie"></i> توزيع طرق الدفع</h3>
          <div className="methods-grid">
            {paymentMethodsChartData.map((method, index) => (
              <div key={index} className="method-item">
                <div className="method-info">
                  <i className={getPaymentIcon(method.method)} style={{ color: getPaymentColor(method.method) }}></i>
                  <span>{method.name}</span>
                </div>
                <div className="method-amount">{method.amount.toLocaleString()} ج.م</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DBC8" />
              <XAxis dataKey="name" stroke="#5F8A61" />
              <YAxis stroke="#5F8A61" />
              <Tooltip 
                formatter={(value) => `${value} ج.م`}
                contentStyle={{
                  background: '#FFFFFF',
                  border: '1px solid #9BBF4E',
                  borderRadius: '10px',
                  fontFamily: 'Cairo'
                }}
              />
              <Bar dataKey="amount" fill="#9BBF4E" name="المبلغ" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentsDashboard;




