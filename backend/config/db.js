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
  let retries = 5
  while (retries) {
    try {
      await sequelize.authenticate()
      console.log('MySQL connected')
      break
    } catch (err) {
      console.error('MySQL connection failed, retrying in 5s...')
      retries -= 1
      await new Promise(res => setTimeout(res, 5000))
    }
  }
  if (retries === 0) {
    console.error('MySQL connection failed after retries. Exiting.')
    process.exit(1)
  }
}

module.exports = { sequelize, connectMySQL }
