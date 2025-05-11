const Loan = require('../models/loan')
const Customer = require('../models/customer')
const Log = require('../models/log')
const calculateScore = require('../services/scoreService')

exports.createLoan = async (req, res) => {
  try {
    const input = req.body
    const customer = await Customer.findOne({
      where: { id: req.user.id }
    })
    if (!customer) {
      return res.status(404).json({ error: 'Customer profile not found' })
    }
    const { score, status, recommendation } = calculateScore({
      ...input,
      creditScore: customer.creditScore
    })
    const loan = await Loan.create({
      ...input,
      customerId: req.user.id,
      score,
      status,
      recommendation
    })
    await Log.create({ userId: req.user.id, input, score, status })
    res.status(201).json({ score, status, recommendation })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll()
    res.status(200).json(loans)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getLoanByUser = async (req, res) => {
  try {
    const id = req.params.id
    const loans = await Loan.findAll({ where: { customerId: id } })
    res.status(200).json(loans)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
