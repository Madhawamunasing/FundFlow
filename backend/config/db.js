const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: 'mysql'
  }
)

const connectMySQL = async () => {
  try {
    await sequelize.authenticate()
    console.log('MySQL connected')
    await sequelize.sync({ alter: true })
    console.log('Sequelize models synced')
  } catch (err) {
    console.error('MySQL connection failed:', err)
  }
}

module.exports = { sequelize, connectMySQL }