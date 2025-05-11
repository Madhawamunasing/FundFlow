const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Customer = sequelize.define('Customer', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  nic: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
    validate: {
      isEmail: true
    }
  },
  monthlyIncome: { 
    type: DataTypes.FLOAT, 
    allowNull: false,
    defaultValue: 0 
  },
  creditScore: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  role: { 
    type: DataTypes.ENUM('admin', 'customer'),
    allowNull: false,
    defaultValue: 'admin'
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }
}, {
  hooks: {
    beforeCreate: (Customer) => {
      if (Customer.role === 'admin') {
        Customer.creditScore = 850;
        Customer.monthlyIncome = 0;
      }
    }
  }
});

module.exports = Customer;