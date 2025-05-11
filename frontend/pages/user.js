import { useState, useEffect } from 'react';
import api from '../services/api';
import { getToken, removeToken } from '../utils/auth';
import { useRouter } from 'next/router';

export default function UserPage() {
  const [form, setForm] = useState({
    loanAmount: '',
    durationMonths: '',
    purpose: '',
    monthlyIncome: '',
    existingLoans: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loanHistory, setLoanHistory] = useState([]);
  const router = useRouter();

  const fetchHistory = async () => {
    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      const res = await api.get(`/loans/getbyid/${userId}`, { headers });
      const userLoans = res.data.filter(l => l.customerId === userId);
      setLoanHistory(userLoans);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/');
      return;
    }
    fetchHistory();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const res = await api.post('/loans', form, { headers });
      setResult(res.data);
      setError('');
      fetchHistory();
    } catch (err) {
      setError('Failed to submit loan request');
    }
  };

  const handleLogout = () => {
    removeToken();
    router.push('/');
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4">Apply for a Loan</h1>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-4 mb-4">
        <div className="mb-3">
          <input
            name="loanAmount"
            type="number"
            placeholder="Loan Amount"
            value={form.loanAmount}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="durationMonths"
            type="number"
            placeholder="Duration (months)"
            value={form.durationMonths}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="purpose"
            type="text"
            placeholder="Purpose"
            value={form.purpose}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="monthlyIncome"
            type="number"
            placeholder="Monthly Income"
            value={form.monthlyIncome}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="existingLoans"
            type="number"
            placeholder="Number of Existing Loans"
            value={form.existingLoans}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit Application</button>
      </form>

      {result && (
        <div className="alert alert-secondary">
          <h5>Loan Result</h5>
          <p><strong>Score:</strong> {result.score}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Recommendation:</strong> {result.recommendation}</p>
        </div>
      )}

      <h4 className="mt-5 mb-3">Your Loan History</h4>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Amount</th>
            <th>Duration</th>
            <th>Purpose</th>
            <th>Score</th>
            <th>Status</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {loanHistory.map((loan, index) => (
            <tr key={index}>
              <td>{loan.loanAmount}</td>
              <td>{loan.durationMonths}</td>
              <td>{loan.purpose}</td>
              <td>{loan.score}</td>
              <td>{loan.status}</td>
              <td>{loan.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}