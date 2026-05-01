import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { showSuccess, showError, showConfirm } from '../../utils/notifications';
import '../../styles/OffersManagement.css';

const OffersManagement = () => {
  const [offers, setOffers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  // تحميل البيانات من localStorage (محاكاة للـ API)
  useEffect(() => {
    const savedOffers = localStorage.getItem('offers');
    if (savedOffers) {
      setOffers(JSON.parse(savedOffers));
    } else {
      
      const mockOffers = [
        {
          id: 1,
          companyName: 'شركة النيل للنقل',
          offerTitle: 'خصم 20% على الرحلات',
          description: 'خصم خاص لعملاء الشركة على جميع الرحلات الداخلية',
          startDate: '2024-06-01',
          endDate: '2024-06-30',
          status: 'active',
          discountRate: 20
        },
        {
          id: 2,
          companyName: 'شركة الأهرام للسفر',
          offerTitle: 'عرض العائلة',
          description: 'تذكرة رابعة مجانية عند حجز 3 تذاكر',
          startDate: '2024-06-01',
          endDate: '2024-07-15',
          status: 'active',
          discountRate: 25
        },
        {
          id: 3,
          companyName: 'شركة الدلتا للنقل',
          offerTitle: 'عرض الـ 10 رحلات',
          description: 'احصل على رحلة مجانية بعد 10 رحلات',
          startDate: '2024-05-01',
          endDate: '2024-05-30',
          status: 'expired',
          discountRate: 10
        },
        {
          id: 4,
          companyName: 'شركة الصعيد للرحلات',
          offerTitle: 'عرض الصيف',
          description: 'خصم 15% على جميع الرحلات لأسيوط والأقصر',
          startDate: '2024-06-10',
          endDate: '2024-08-31',
          status: 'active',
          discountRate: 15
        }
      ];
      setOffers(mockOffers);
      localStorage.setItem('offers', JSON.stringify(mockOffers));
    }
  }, []);

  
  const checkExpiredOffers = (offersList) => {
    const today = new Date().toISOString().split('T')[0];
    return offersList.map(offer => ({
      ...offer,
      status: offer.endDate < today ? 'expired' : offer.status
    }));
  };

  const handleAddOffer = (newOffer) => {
    const offer = {
      ...newOffer,
      id: Date.now(),
      status: 'active'
    };
    const updatedOffers = checkExpiredOffers([offer, ...offers]);
    setOffers(updatedOffers);
    localStorage.setItem('offers', JSON.stringify(updatedOffers));
    setShowModal(false);
    showSuccess('تم إضافة العرض بنجاح');
  };

  const handleEditOffer = (updatedOffer) => {
    const updatedOffers = checkExpiredOffers(
      offers.map(o => o.id === updatedOffer.id ? updatedOffer : o)
    );
    setOffers(updatedOffers);
    localStorage.setItem('offers', JSON.stringify(updatedOffers));
    setShowModal(false);
    showSuccess('تم تحديث العرض بنجاح');
  };

  const handleDeleteOffer = (offerId) => {
    showConfirm('هل أنت متأكد من حذف هذا العرض؟', () => {
      const updatedOffers = offers.filter(o => o.id !== offerId);
      setOffers(updatedOffers);
      localStorage.setItem('offers', JSON.stringify(updatedOffers));
      showSuccess('تم حذف العرض بنجاح');
    });
  };

  const openModal = (mode, offer = null) => {
    setModalMode(mode);
    setSelectedOffer(offer);
    setShowModal(true);
  };

  const activeOffers = offers.filter(o => o.status === 'active').length;
  const expiredOffers = offers.filter(o => o.status === 'expired').length;

  return (
    <motion.div
      className="offers-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="offers-header">
        <h2 className="offers-title">
          <i className="fas fa-gift"></i>
          المكافآت والعروض
        </h2>
        
        <button
          className="add-offer-btn"
          onClick={() => openModal('add')}
        >
          <i className="fas fa-plus"></i>
          إضافة عرض جديد
        </button>
      </div>

      <div className="offers-stats">
        <motion.div 
          className="offer-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="offer-stat-icon active">
            <i className="fas fa-tag"></i>
          </div>
          <div className="offer-stat-value">{activeOffers}</div>
          <div className="offer-stat-label">عروض نشطة</div>
        </motion.div>
        
        <motion.div 
          className="offer-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="offer-stat-icon expired">
            <i className="fas fa-clock"></i>
          </div>
          <div className="offer-stat-value">{expiredOffers}</div>
          <div className="offer-stat-label">عروض منتهية</div>
        </motion.div>
        
        <motion.div 
          className="offer-stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="offer-stat-icon total">
            <i className="fas fa-gift"></i>
          </div>
          <div className="offer-stat-value">{offers.length}</div>
          <div className="offer-stat-label">إجمالي العروض</div>
        </motion.div>
      </div>

      <div className="offers-grid">
        <AnimatePresence>
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              className={`offer-card ${offer.status}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="offer-card-header">
                <div className="offer-company">
                  <i className="fas fa-building"></i>
                  {offer.companyName}
                </div>
                <span className={`offer-status-badge ${offer.status}`}>
                  {offer.status === 'active' ? 'نشط' : 'منتهي'}
                </span>
              </div>

              <h3 className="offer-title">
                <i className="fas fa-percent"></i>
                {offer.offerTitle}
              </h3>
              
              <p className="offer-description">{offer.description}</p>
              
              <div className="offer-dates">
                <div>
                  <i className="fas fa-calendar-alt"></i>
                  <span>من: {offer.startDate}</span>
                </div>
                <div>
                  <i className="fas fa-calendar-check"></i>
                  <span>إلى: {offer.endDate}</span>
                </div>
              </div>

              {offer.discountRate && (
                <div className="offer-discount">
                  نسبة الخصم: <strong>{offer.discountRate}%</strong>
                </div>
              )}

              <div className="offer-actions">
                <button
                  className="offer-action-btn edit"
                  onClick={() => openModal('edit', offer)}
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="offer-action-btn delete"
                  onClick={() => handleDeleteOffer(offer.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

     
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div
              className="modal-content offer-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>
                  <i className="fas fa-gift"></i>
                  {modalMode === 'add' ? 'إضافة عرض جديد' : 'تعديل العرض'}
                </h3>
                <button onClick={() => setShowModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const offerData = {
                    companyName: formData.get('companyName'),
                    offerTitle: formData.get('offerTitle'),
                    description: formData.get('description'),
                    startDate: formData.get('startDate'),
                    endDate: formData.get('endDate'),
                    discountRate: parseInt(formData.get('discountRate'))
                  };
                  
                  if (modalMode === 'add') {
                    handleAddOffer(offerData);
                  } else {
                    handleEditOffer({ ...selectedOffer, ...offerData });
                  }
                }}
              >
                <div className="form-group">
                  <label>اسم الشركة</label>
                  <input 
                    type="text" 
                    name="companyName" 
                    defaultValue={selectedOffer?.companyName}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>عنوان العرض</label>
                  <input 
                    type="text" 
                    name="offerTitle" 
                    defaultValue={selectedOffer?.offerTitle}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>وصف العرض</label>
                  <textarea 
                    name="description" 
                    defaultValue={selectedOffer?.description}
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>تاريخ البدء</label>
                    <input 
                      type="date" 
                      name="startDate" 
                      defaultValue={selectedOffer?.startDate}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>تاريخ الانتهاء</label>
                    <input 
                      type="date" 
                      name="endDate" 
                      defaultValue={selectedOffer?.endDate}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>نسبة الخصم (%)</label>
                  <input 
                    type="number" 
                    name="discountRate" 
                    defaultValue={selectedOffer?.discountRate || 0}
                    min="0"
                    max="100"
                    required 
                  />
                </div>

                <button type="submit" className="submit-btn">
                  {modalMode === 'add' ? 'إضافة العرض' : 'حفظ التغييرات'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OffersManagement;