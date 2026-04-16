import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { paymentsData } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { showSuccess, showPaymentNotification } from '../../utils/notifications';
import '../../styles/PaymentsDashboard.css';

const PaymentsDashboard = () => {
  const [payments, setPayments] = useState(paymentsData);

  // حساب الإحصائيات
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const completedAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  // بيانات الرسم البياني
  const chartData = payments.map(p => ({
    name: p.id,
    amount: p.amount
  }));

  const handlePaymentAction = (payment, action) => {
    if (action === 'process' && payment.status === 'pending') {
      setPayments(payments.map(p => 
        p.id === payment.id ? {...p, status: 'completed'} : p
      ));
      showPaymentNotification(payment.amount, 'received');
    } else if (action === 'refund') {
      setPayments(payments.map(p => 
        p.id === payment.id ? {...p, status: 'refunded'} : p
      ));
      showPaymentNotification(payment.amount, 'refunded');
    }
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
                <i className="fas fa-credit-card" style={{ marginRight: '10px' }}></i>
                {payment.method}
              </p>
            </div>
            <div className="payment-amount">
              <div className="amount">{payment.amount} ج.م</div>
              <div className={`status ${payment.status}`}>
                {payment.status === 'completed' && 'مكتمل'}
                {payment.status === 'pending' && 'معلق'}
                {payment.status === 'failed' && 'فشل'}
                {payment.status === 'refunded' && 'مسترجع'}
              </div>
              {payment.status === 'pending' && (
                <button
                  className="process-btn"
                  onClick={() => handlePaymentAction(payment, 'process')}
                >
                  معالجة
                </button>
              )}
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