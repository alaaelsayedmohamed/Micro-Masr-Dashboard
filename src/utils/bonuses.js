const BONUS_PERCENTAGE = parseFloat(process.env.REACT_APP_COMPANY_BONUS_PERCENTAGE) || 5;


export const contractedCompanies = [
  { id: 1, name: 'شركة النيل للنقل', bonusRate: 5, isActive: true },
  { id: 2, name: 'شركة الأهرام للسفر', bonusRate: 7, isActive: true },
  { id: 3, name: 'شركة الدلتا للنقل', bonusRate: 4, isActive: true },
  { id: 4, name: 'شركة الصعيد للرحلات', bonusRate: 6, isActive: true },
];


export const calculateDriverBonus = (revenue, companyName) => {
  const company = contractedCompanies.find(c => c.name === companyName);
  
  if (!company || !company.isActive) {
    return { bonus: 0, rate: 0, isEligible: false, message: 'الشركة غير متعاقد معها' };
  }
  
  const bonus = (revenue * company.bonusRate) / 100;
  
  return {
    bonus: Math.round(bonus),
    rate: company.bonusRate,
    isEligible: true,
    message: `تم حساب المكافأة بنسبة ${company.bonusRate}% من الإيرادات`,
  };
};


export const isDriverEligibleForBonus = (driver) => {
  if (!driver.company) return false;
  
  const company = contractedCompanies.find(c => c.name === driver.company);
  if (!company || !company.isActive) return false;
  
  
  const hasEnoughTrips = (driver.totalTrips || 0) >= 50;
  const hasGoodRating = (driver.rating || 0) >= 4;
  
  return hasEnoughTrips && hasGoodRating;
};


export const updateDriverBonus = (driver, revenue) => {
  const eligibility = isDriverEligibleForBonus(driver);
  
  if (!eligibility) {
    return {
      ...driver,
      bonus: 0,
      bonusMessage: 'غير مؤهل للمكافأة (عدد الرحلات أقل من 50 أو التقييم أقل من 4)',
    };
  }
  
  const { bonus, rate } = calculateDriverBonus(revenue, driver.company);
  
  return {
    ...driver,
    bonus,
    bonusRate: rate,
    lastBonusDate: new Date().toISOString(),
    bonusMessage: `تم إضافة مكافأة ${bonus} ج.م بنسبة ${rate}%`,
  };
}


export const getCompanyBonusStats = (drivers) => {
  const stats = {};
  
  drivers.forEach(driver => {
    if (driver.company && driver.bonus) {
      if (!stats[driver.company]) {
        stats[driver.company] = {
          totalBonus: 0,
          driversCount: 0,
          bonusRate: contractedCompanies.find(c => c.name === driver.company)?.bonusRate || 0,
        };
      }
      stats[driver.company].totalBonus += driver.bonus;
      stats[driver.company].driversCount += 1;
    }
  });
  
  return stats;
};