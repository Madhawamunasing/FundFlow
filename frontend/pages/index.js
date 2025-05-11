import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';
import { setToken, getToken } from '../utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [nic, setNic] = useState('');
  const [income, setIncome] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      const role = JSON.parse(atob(token.split('.')[1])).role;
      if (role === 'admin') router.push('/dashboard');
      else if (role === 'customer') router.push('/user');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, role } = res.data;
      setToken(token);
      if (role === 'admin') router.push('/dashboard');
      else if (role === 'customer') router.push('/user');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        name,
        nic,
        email,
        password,
        monthlyIncome: income,
        role: 'customer'
      });
      setShowRegister(false);
      setError('Registered successfully! Please log in.');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={showRegister ? handleRegister : handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">{showRegister ? 'Register' : 'Login'} to FundFlow</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {showRegister && (
          <>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="NIC"
              className="w-full p-2 border rounded mb-4"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Monthly Income"
              className="w-full p-2 border rounded mb-4"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              required
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          {showRegister ? 'Register' : 'Login'}
        </button>
        <button
          type="button"
          onClick={() => setShowRegister(!showRegister)}
          className="w-full mt-3 text-blue-500 text-sm hover:underline"
        >
          {showRegister ? 'Back to Login' : 'Don\'t have an account? Register'}
        </button>
      </form>
    </div>
  );
}
