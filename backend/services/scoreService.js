const calculateScore = ({ loanAmount, durationMonths, monthlyIncome, existingLoans, creditScore }) => {
  let score = 0;
  const emi = loanAmount / durationMonths;
  if (emi <= 0.4 * monthlyIncome){score += 30;}
  if (existingLoans <= 2) {score += 20;}
  if (loanAmount <= 500000) {score += 20;}
  score += Math.floor((creditScore / 850) * 30);
  const status = score >= 70 ? 'Approved' : 'Rejected';
  const recommendation = status === 'Approved' ? `Eligible for ${durationMonths}-month loan at 14% interest` : 'Improve credit conditions';
  return { score, status, recommendation };
};

module.exports = calculateScore;