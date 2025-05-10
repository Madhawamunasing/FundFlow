const Loan = require('../models/loan');
const Log = require('../models/log');
const calculateScore = require('../services/scoreService');

exports.createLoan = async (req, res) => {
  try {
    const input = req.body;
    const { score, status, recommendation } = calculateScore(input);
    const loan = await Loan.create({ ...input, customerId: req.user.id, score, status, recommendation });
    await Log.create({ userId: req.user.id, input, score, status });
    res.status(201).json({ score, status, recommendation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll();
    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};