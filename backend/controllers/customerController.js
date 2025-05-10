const Customer = require('../models/customer')

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll()
    res.status(200).json(customers)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.updateCustomer = async (req, res) => {
  try {
    const [updatedRowsCount] = await Customer.update(req.body, { where: { id: req.params.id }})
    if (updatedRowsCount === 0) {
      return res.status(404).json({ msg: `No user found with id ${req.params.id}` })
    }
    res.status(200).json({ msg: `Updated user ${req.params.id}` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.destroy({ where: { id: req.params.id } })
    res.status(200).json({ msg: 'Deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
