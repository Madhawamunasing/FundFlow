const router = require('express').Router();
const { getAllCustomers, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Admin customer management
 */

router.use(auth);
router.use(authorize('admin'));

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers (admin only)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 */
router.get('/', getAllCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated
 */
router.put('/:id', updateCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted
 */
router.delete('/:id', deleteCustomer);

module.exports = router;