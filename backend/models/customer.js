const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Customer = sequelize.define('Customer', {
  name: { type: DataTypes.STRING, allowNull: false },
  nic: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  monthlyIncome: { type: DataTypes.INTEGER, allowNull: false },
  creditScore: { type: DataTypes.INTEGER, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'customer' },
  password: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Customer;