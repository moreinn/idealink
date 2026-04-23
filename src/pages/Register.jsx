import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword)
      return setError('Passwords do not match');
    if (form.password.length < 6)
      return setError('Password must be at least 6 characters');
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(data.user, data.token);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Join IdeaLink</h2>
        <p style={styles.sub}>Connect with startups and service providers worldwide</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full name</label>
          <input style={styles.input} placeholder="Moin Shaikh" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />

          <label style={styles.label}>Email</label>
          <input style={styles.input} placeholder="you@email.com" type="email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />

          <label style={styles.label}>Password</label>
          <input style={styles.input} placeholder="Min 6 characters" type="password"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />

          <label style={styles.label}>Confirm password</label>
          <input style={styles.input} placeholder="Repeat your password" type="password"
            value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />

          <button style={styles.btn} type="submit">Create Account</button>
        </form>

        <div style={styles.divider}><span>or</span></div>

        <button style={styles.googleBtn} onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}>
          <img src="https://www.google.com/favicon.ico" width="18" height="18" style={{ marginRight: '10px' }} />
          Continue with Google
        </button>

        <p style={styles.footer}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '90vh', background: '#f5f5f5', padding: '20px' },
  card: { background: '#fff', padding: '40px', borderRadius: '16px',
    width: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
  title: { color: '#1a1a2e', marginBottom: '6px' },
  sub: { color: '#888', fontSize: '14px', marginBottom: '24px' },
  label: { display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', marginTop: '14px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '15px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '13px', background: '#e94560', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginTop: '20px' },
  divider: { textAlign: 'center', margin: '20px 0', color: '#ccc',
    borderTop: '1px solid #eee', paddingTop: '20px' },
  googleBtn: { width: '100%', padding: '13px', background: '#fff', color: '#333',
    border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center' },
  error: { background: '#fff5f5', color: '#e94560', padding: '12px', borderRadius: '8px',
    marginBottom: '16px', fontSize: '14px', border: '1px solid #ffd0d0' },
  footer: { textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' },
};