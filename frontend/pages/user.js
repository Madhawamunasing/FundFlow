import { useState, useEffect } from 'react'
import api from '../services/api'
import { getToken, removeToken } from '../utils/auth'
import { useRouter } from 'next/router'

export default function UserPage () {
  const [form, setForm] = useState({
    loanAmount: '',
    durationMonths: '',
    purpose: '',
    monthlyIncome: '',
    existingLoans: ''
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loanHistory, setLoanHistory] = useState([])
  const router = useRouter()

  const fetchHistory = async () => {
    try {
      const token = getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const res = await api.get('/loans', { headers })
      const userId = JSON.parse(atob(token.split('.')[1])).id
      const userLoans = res.data.filter(l => l.customerId === userId)
      setLoanHistory(userLoans)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/')
      return
    }
    fetchHistory()
  }, [])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const token = getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const res = await api.post('/loans', form, { headers })
      setResult(res.data)
      setError('')
      fetchHistory()
    } catch (err) {
      setError('Failed to submit loan request')
    }
  }

  const handleLogout = () => {
    removeToken()
    router.push('/')
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Apply for a Loan</h1>
        <button
          onClick={handleLogout}
          className='bg-red-500 text-white px-3 py-1 rounded'
        >
          Logout
        </button>
      </div>

      {error && <p className='text-red-500 mb-4'>{error}</p>}

      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-md p-6 rounded max-w-lg'
      >
        <input
          name='loanAmount'
          type='number'
          placeholder='Loan Amount'
          value={form.loanAmount}
          onChange={handleChange}
          className='w-full border p-2 mb-4'
          required
        />
        <input
          name='durationMonths'
          type='number'
          placeholder='Duration (months)'
          value={form.durationMonths}
          onChange={handleChange}
          className='w-full border p-2 mb-4'
          required
        />
        <input
          name='purpose'
          type='text'
          placeholder='Purpose'
          value={form.purpose}
          onChange={handleChange}
          className='w-full border p-2 mb-4'
          required
        />
        <input
          name='monthlyIncome'
          type='number'
          placeholder='Monthly Income'
          value={form.monthlyIncome}
          onChange={handleChange}
          className='w-full border p-2 mb-4'
          required
        />
        <input
          name='existingLoans'
          type='number'
          placeholder='Number of Existing Loans'
          value={form.existingLoans}
          onChange={handleChange}
          className='w-full border p-2 mb-4'
          required
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded w-full'
        >
          Submit Application
        </button>
      </form>

      {result && (
        <div className='mt-6 p-4 border rounded bg-gray-100'>
          <h2 className='text-xl font-semibold mb-2'>Loan Result</h2>
          <p>
            <strong>Score:</strong> {result.score}
          </p>
          <p>
            <strong>Status:</strong> {result.status}
          </p>
          <p>
            <strong>Recommendation:</strong> {result.recommendation}
          </p>
        </div>
      )}

      <h2 className='text-xl font-bold mt-10 mb-2'>Your Loan History</h2>
      <table className='w-full border'>
        <thead className='bg-gray-200'>
          <tr>
            <th className='p-2 border'>Amount</th>
            <th className='p-2 border'>Duration</th>
            <th className='p-2 border'>Purpose</th>
            <th className='p-2 border'>Score</th>
            <th className='p-2 border'>Status</th>
            <th className='p-2 border'>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {loanHistory.map((loan, index) => (
            <tr key={index} className='text-center'>
              <td className='p-2 border'>{loan.loanAmount}</td>
              <td className='p-2 border'>{loan.durationMonths}</td>
              <td className='p-2 border'>{loan.purpose}</td>
              <td className='p-2 border'>{loan.score}</td>
              <td className='p-2 border'>{loan.status}</td>
              <td className='p-2 border'>{loan.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
