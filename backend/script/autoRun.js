const bcrypt = require('bcryptjs')
const { Customer } = require('../models/customer')

const createInitialAdmin = async () => {
  try {
    const adminExists = await Customer.findOne({
      where: {
        role: 'admin'
      }
    })
    console.log(adminExists);
    

    if (!adminExists) {
      await Customer.create({
        name: 'System Admin',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('Admin@123', 10),
        role: 'admin',
        monthlyIncome: 0,
        creditScore: 850,
        nic: 'ADMIN000'
      })
      console.log('Initial admin created successfully')
    } else {
      console.log('Admin user already exists')
    }
  } catch (error) {
    console.error('Failed to create initial admin:', error.message)
  }
}

module.exports = createInitialAdmin
