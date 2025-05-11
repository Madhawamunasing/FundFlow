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
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <form
        onSubmit={showRegister ? handleRegister : handleLogin}
        className="bg-white p-4 rounded shadow-sm w-100"
        style={{ maxWidth: '400px' }}
      >
        <h2 className="mb-4 text-center">{showRegister ? 'Register' : 'Login'} to FundFlow</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {showRegister && (
          <>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="NIC"
                className="form-control"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                placeholder="Monthly Income"
                className="form-control"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {showRegister ? 'Register' : 'Login'}
        </button>
        <button
          type="button"
          onClick={() => setShowRegister(!showRegister)}
          className="btn btn-link w-100 mt-2"
        >
          {showRegister ? 'Back to Login' : "Don't have an account? Register"}
        </button>
      </form>
    </div>
  );
}
