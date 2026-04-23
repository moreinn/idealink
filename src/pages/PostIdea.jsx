import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function PostIdea() {
  const [form, setForm] = useState({
    title: '', description: '', category: '',
    skillsNeeded: '', country: '', postType: 'need'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        skillsNeeded: form.skillsNeeded.split(',').map(s => s.trim()).filter(Boolean)
      };
      await api.post('/ideas', payload);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create a Post</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>

          <label style={styles.label}>Post type</label>
          <div style={styles.typeRow}>
            {[
              { value: 'need', label: 'I need something', desc: 'Looking for team, service or workspace' },
              { value: 'offer', label: 'I offer something', desc: 'Offering skills, services or workspace' },
            ].map(t => (
              <div key={t.value} onClick={() => setForm({ ...form, postType: t.value })} style={{
                ...styles.typeOption,
                border: form.postType === t.value ? '2px solid #e94560' : '2px solid #eee',
                background: form.postType === t.value ? '#fff5f7' : '#fff',
              }}>
                <strong style={{ color: '#1a1a2e', fontSize: '14px' }}>{t.label}</strong>
                <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0' }}>{t.desc}</p>
              </div>
            ))}
          </div>

          <label style={styles.label}>Title</label>
          <input style={styles.input} placeholder="e.g. Looking for a marketing partner in the US"
            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />

          <label style={styles.label}>Description</label>
          <textarea style={styles.textarea} placeholder="Describe what you need or offer in detail..."
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />

          <label style={styles.label}>Category</label>
          <select style={styles.input} value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })} required>
            <option value="">Select category</option>
            <option value="tech">Tech</option>
            <option value="service">Service</option>
            <option value="workspace">Workspace</option>
            <option value="marketing">Marketing</option>
            <option value="legal">Legal</option>
            <option value="finance">Finance</option>
            <option value="logistics">Logistics</option>
            <option value="other">Other</option>
          </select>

          <label style={styles.label}>Skills needed (comma separated)</label>
          <input style={styles.input} placeholder="e.g. React, Node.js, Sales"
            value={form.skillsNeeded} onChange={e => setForm({ ...form, skillsNeeded: e.target.value })} />

          <label style={styles.label}>Country</label>
          <input style={styles.input} placeholder="e.g. India, USA, Global"
            value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />

          <button style={styles.btn} type="submit">Post</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', padding: '40px 20px',
    background: '#f5f5f5', minHeight: '90vh' },
  card: { background: '#fff', padding: '40px', borderRadius: '12px',
    width: '560px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  title: { marginBottom: '24px', color: '#1a1a2e' },
  label: { display: 'block', marginBottom: '6px', color: '#555',
    fontSize: '14px', marginTop: '16px' },
  typeRow: { display: 'flex', gap: '12px', marginBottom: '8px' },
  typeOption: { flex: 1, padding: '14px', borderRadius: '10px',
    cursor: 'pointer', transition: 'all 0.2s' },
  input: { width: '100%', padding: '12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '15px', boxSizing: 'border-box', minHeight: '120px', resize: 'vertical' },
  btn: { width: '100%', padding: '14px', background: '#e94560', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginTop: '24px' },
  error: { color: 'red', marginBottom: '12px' },
};