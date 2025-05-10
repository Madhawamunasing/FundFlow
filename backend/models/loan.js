const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Loan = sequelize.define('Loan', {
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  loanAmount: { type: DataTypes.INTEGER, allowNull: false },
  durationMonths: { type: DataTypes.INTEGER, allowNull: false },
  purpose: { type: DataTypes.STRING, allowNull: false },
  monthlyIncome: { type: DataTypes.INTEGER, allowNull: false },
  existingLoans: { type: DataTypes.INTEGER, allowNull: false },
  score: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING },
  recommendation: { type: DataTypes.STRING }
});

module.exports = Loan;