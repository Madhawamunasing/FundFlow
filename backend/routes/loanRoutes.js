const router = require('express').Router()
const { createLoan, getAllLoans, getLoanByUser } = require('../controllers/loanController')
const auth = require('../middleware/auth')
const authorize = require('../middleware/role')

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Loan applications and review
 */

router.use(auth)

/**
 * @swagger
 * /api/loans:
 *   post:
 *     summary: Submit a loan application (customer only)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loanAmount:
 *                 type: number
 *               durationMonths:
 *                 type: number
 *               purpose:
 *                 type: string
 *               monthlyIncome:
 *                 type: number
 *               existingLoans:
 *                 type: number
 *     responses:
 *       200:
 *         description: Loan decision and score
 */
router.post('/',authorize('customer'), createLoan)

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Get all loan applications (admin only)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of loans
 */
router.get('/', authorize('admin'), getAllLoans)

/**
 * @swagger
 * /api/loans/getbyid/{id}:
 *   get:
 *     summary: Get loans for the authenticated customer
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of the customer's loan records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   loanAmount:
 *                     type: number
 *                   durationMonths:
 *                     type: number
 *                   purpose:
 *                     type: string
 *                   score:
 *                     type: number
 *                   status:
 *                     type: string
 *                   recommendation:
 *                     type: string
 */
router.get('/getbyid/:id', getLoanByUser);

module.exports = router
