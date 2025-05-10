const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Customer = require('../models/customer');

exports.register = async (req, res) => {
  try {
    const { name, nic, email, monthlyIncome, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const creditScore = Math.floor(Math.random() * 551 + 300);
    const user = await Customer.create({ name, nic, email, monthlyIncome, creditScore, password: hash, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Customer.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};