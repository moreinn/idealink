import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [docType, setDocType] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSubmit = async () => {
    if (!role) return setError('Please select a role');
    try {
      await api.patch('/auth/me/role', { role });
      setError('');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save role');
    }
  };

  const handleVerificationSubmit = async () => {
    if (!docType) return setError('Please select document type');
    if (!file) return setError('Please upload your document');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('documentType', docType);
      formData.append('document', file);
      await api.post('/auth/me/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.progress}>
          {[1, 2].map(s => (
            <div key={s} style={{
              ...styles.dot,
              background: step >= s ? '#e94560' : '#ddd'
            }} />
          ))}
        </div>

        {step === 1 && (
          <>
            <h2 style={styles.title}>What best describes you?</h2>
            <p style={styles.sub}>You can always change this later</p>

            {[
              { value: 'founder', label: 'Startup Founder', desc: 'I have a startup and need people, services or workspace' },
              { value: 'provider', label: 'Service Provider', desc: 'I offer skills, services or workspace to startups' },
              { value: 'both', label: 'Both', desc: 'I run a startup and also offer services to others' },
            ].map(r => (
              <div key={r.value} onClick={() => setRole(r.value)} style={{
                ...styles.option,
                border: role === r.value ? '2px solid #e94560' : '2px solid #eee',
                background: role === r.value ? '#fff5f7' : '#fff',
              }}>
                <strong style={{ color: '#1a1a2e' }}>{r.label}</strong>
                <p style={styles.optionDesc}>{r.desc}</p>
              </div>
            ))}

            {error && <p style={styles.error}>{error}</p>}
            <button style={styles.btn} onClick={handleRoleSubmit}>Continue</button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={styles.title}>Verify your identity</h2>
            <p style={styles.sub}>Upload a government ID so others can trust you on the platform</p>

            <label style={styles.label}>Document type</label>
            <select style={styles.input} value={docType} onChange={e => setDocType(e.target.value)}>
              <option value="">Select type</option>
              <option value="passport">Passport</option>
              <option value="national_id">National ID card</option>
              <option value="drivers_license">Driver's license</option>
            </select>

            <label style={styles.label}>Upload document (JPG, PNG or PDF — max 5MB)</label>
            <input type="file" accept=".jpg,.jpeg,.png,.pdf"
              onChange={e => setFile(e.target.files[0])}
              style={styles.input} />

            {file && <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>Selected: {file.name}</p>}

            <div style={styles.notice}>
              Your document is stored securely and only reviewed by our team. It will never be shared publicly.
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button style={styles.btn} onClick={handleVerificationSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit for verification'}
            </button>
            <button style={styles.skip} onClick={() => navigate('/feed')}>
              Skip for now
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '90vh', background: '#f5f5f5', padding: '20px' },
  card: { background: '#fff', padding: '40px', borderRadius: '16px',
    width: '500px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
  progress: { display: 'flex', gap: '8px', marginBottom: '32px' },
  dot: { width: '40px', height: '6px', borderRadius: '3px', transition: 'background 0.3s' },
  title: { color: '#1a1a2e', marginBottom: '8px' },
  sub: { color: '#888', marginBottom: '24px', fontSize: '14px' },
  option: { padding: '16px', borderRadius: '12px', marginBottom: '12px',
    cursor: 'pointer', transition: 'all 0.2s' },
  optionDesc: { color: '#666', fontSize: '13px', margin: '6px 0 0' },
  label: { display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', marginTop: '16px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '15px', boxSizing: 'border-box', marginBottom: '8px' },
  notice: { background: '#f0f7ff', border: '1px solid #bdd7f5', borderRadius: '8px',
    padding: '12px', fontSize: '13px', color: '#1a5f9e', margin: '16px 0' },
  btn: { width: '100%', padding: '14px', background: '#e94560', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginTop: '8px' },
  skip: { width: '100%', padding: '12px', background: 'transparent', color: '#888',
    border: 'none', fontSize: '14px', cursor: 'pointer', marginTop: '8px' },
  error: { color: 'red', fontSize: '13px', marginTop: '8px' },
};