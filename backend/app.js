const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')
const customerRoutes = require('./routes/customerRoutes')
const loanRoutes = require('./routes/loanRoutes')

const swaggerUI = require('swagger-ui-express')
const swaggerSpec = require('./docs/swagger')

const { connectMySQL } = require('./config/db')
const connectMongo = require('./config/mongo')

const app = express()
dotenv.config()

connectMySQL()
connectMongo()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/loans', loanRoutes)

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

module.exports = app
