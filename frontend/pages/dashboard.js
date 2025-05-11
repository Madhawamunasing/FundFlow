import { useEffect, useState } from 'react';
import api from '../services/api';
import { getToken, removeToken } from '../utils/auth';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminData, setAdminData] = useState({ name: '', nic: '', email: '', password: '', income: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push('/');
  };

  const fetchData = async () => {
    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const customerRes = await api.get('/customers', { headers });
      const loanRes = await api.get('/loans', { headers });
      setCustomers(customerRes.data);
      setLoans(loanRes.data);
    } catch (err) {
      console.error(err);
      removeToken();
      router.push('/');
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/');
      return;
    }
    fetchData();
  }, []);

  const filteredLoans = filter === 'all' ? loans : loans.filter(l => l.status.toLowerCase() === filter.toLowerCase());

  const handleAdminChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const submitNewAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      await api.post('/auth/register', {
        name: adminData.name,
        nic: adminData.nic,
        email: adminData.email,
        password: adminData.password,
        monthlyIncome: adminData.income,
        role: 'admin'
      }, { headers });
      setMessage('Admin registered successfully');
      setAdminData({ name: '', nic: '', email: '', password: '', income: '' });
    } catch (err) {
      setMessage('Failed to register admin');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>

      <button className="btn btn-success mb-3" onClick={() => setShowAddAdmin(!showAddAdmin)}>
        {showAddAdmin ? 'Cancel Admin Registration' : 'Add New Admin'}
      </button>

      {showAddAdmin && (
        <form onSubmit={submitNewAdmin} className="card p-4 mb-4">
          <h5 className="card-title">Register Admin</h5>
          {message && <div className="alert alert-info">{message}</div>}
          <div className="mb-3">
            <input type="text" name="name" placeholder="Name" value={adminData.name} onChange={handleAdminChange} required className="form-control" />
          </div>
          <div className="mb-3">
            <input type="text" name="nic" placeholder="NIC" value={adminData.nic} onChange={handleAdminChange} required className="form-control" />
          </div>
          <div className="mb-3">
            <input type="email" name="email" placeholder="Email" value={adminData.email} onChange={handleAdminChange} required className="form-control" />
          </div>
          <div className="mb-3">
            <input type="password" name="password" placeholder="Password" value={adminData.password} onChange={handleAdminChange} required className="form-control" />
          </div>
          <div className="mb-3">
            <input type="number" name="income" placeholder="Monthly Income" value={adminData.income} onChange={handleAdminChange} required className="form-control" />
          </div>
          <button type="submit" className="btn btn-primary">Register Admin</button>
        </form>
      )}

      <h4 className="mb-3">Customers</h4>
      <table className="table table-bordered mb-4">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>NIC</th>
            <th>Email</th>
            <th>Monthly Income</th>
            <th>Credit Score</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.nic}</td>
              <td>{c.email}</td>
              <td>{c.monthlyIncome}</td>
              <td>{c.creditScore}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4 className="mb-3">Loan Applications</h4>
      <div className="mb-3">
        <label className="form-label">Filter by status:</label>
        <select onChange={(e) => setFilter(e.target.value)} className="form-select w-auto">
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Customer ID</th>
            <th>Loan Amount</th>
            <th>Duration</th>
            <th>Purpose</th>
            <th>Score</th>
            <th>Status</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {filteredLoans.map(l => (
            <tr key={l.id}>
              <td>{l.customerId}</td>
              <td>{l.loanAmount}</td>
              <td>{l.durationMonths} months</td>
              <td>{l.purpose}</td>
              <td>{l.score}</td>
              <td>{l.status}</td>
              <td>{l.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}