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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
      </div>

      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        onClick={() => setShowAddAdmin(!showAddAdmin)}
      >
        {showAddAdmin ? 'Cancel Admin Registration' : 'Add New Admin'}
      </button>

      {showAddAdmin && (
        <form onSubmit={submitNewAdmin} className="bg-white shadow p-4 rounded mb-6 max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Register Admin</h2>
          {message && <p className="mb-4 text-blue-600">{message}</p>}
          <input type="text" name="name" placeholder="Name" value={adminData.name} onChange={handleAdminChange} required className="w-full border p-2 mb-3" />
          <input type="text" name="nic" placeholder="NIC" value={adminData.nic} onChange={handleAdminChange} required className="w-full border p-2 mb-3" />
          <input type="email" name="email" placeholder="Email" value={adminData.email} onChange={handleAdminChange} required className="w-full border p-2 mb-3" />
          <input type="password" name="password" placeholder="Password" value={adminData.password} onChange={handleAdminChange} required className="w-full border p-2 mb-3" />
          <input type="number" name="income" placeholder="Monthly Income" value={adminData.income} onChange={handleAdminChange} required className="w-full border p-2 mb-3" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register Admin</button>
        </form>
      )}

      <h2 className="text-xl font-semibold mb-2">Customers</h2>
      <table className="w-full mb-8 border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">NIC</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Monthly Income</th>
            <th className="p-2 border">Credit Score</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.id} className="text-center">
              <td className="p-2 border">{c.name}</td>
              <td className="p-2 border">{c.nic}</td>
              <td className="p-2 border">{c.email}</td>
              <td className="p-2 border">{c.monthlyIncome}</td>
              <td className="p-2 border">{c.creditScore}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mb-2">Loan Applications</h2>
      <div className="mb-4">
        <label className="mr-2">Filter by status:</label>
        <select onChange={(e) => setFilter(e.target.value)} className="border p-1">
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Customer ID</th>
            <th className="p-2 border">Loan Amount</th>
            <th className="p-2 border">Duration</th>
            <th className="p-2 border">Purpose</th>
            <th className="p-2 border">Score</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Recommendation</th>
          </tr>
        </thead>
        <tbody>
          {filteredLoans.map(l => (
            <tr key={l.id} className="text-center">
              <td className="p-2 border">{l.customerId}</td>
              <td className="p-2 border">{l.loanAmount}</td>
              <td className="p-2 border">{l.durationMonths} months</td>
              <td className="p-2 border">{l.purpose}</td>
              <td className="p-2 border">{l.score}</td>
              <td className="p-2 border">{l.status}</td>
              <td className="p-2 border">{l.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}