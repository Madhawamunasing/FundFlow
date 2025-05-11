const calculateScore = ({
  loanAmount,
  durationMonths,
  monthlyIncome,
  existingLoans,
  creditScore
}) => {
  const loan = parseFloat(loanAmount)
  const duration = parseInt(durationMonths)
  const income = parseFloat(monthlyIncome)
  const existing = parseInt(existingLoans)
  const credit = parseInt(creditScore)

  if ([loan, duration, income, existing, credit].some(isNaN)) {
    return {
      score: 0,
      status: 'Rejected',
      recommendation: 'Invalid input values'
    }
  }

  const monthlyRate = 0.14 / 12
  const emi =
    (loan * monthlyRate * Math.pow(1 + monthlyRate, duration)) /
    (Math.pow(1 + monthlyRate, duration) - 1)
  let score = 0
  if (emi <= 0.4 * income) score += 40
  if (existing < 2) score += 20
  score += 20 * (1 - Math.min(loan, 1000000) / 1000000)
  score += ((credit - 300) / 550) * 20
  score = Math.min(100, Math.max(0, Math.round(score)))

  const status = score >= 70 ? 'Approved' : 'Rejected'
  const recommendation =
    status === 'Approved'
      ? `Eligible for ${duration}-month loan at 14% interest`
      : 'Not eligible - Consider reducing loan amount or improving credit score'

  return { score, status, recommendation }
}

module.exports = calculateScore
