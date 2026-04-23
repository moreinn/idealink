import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', country: '', bio: '', skills: '' });
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('info');

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => {
      setProfile(data);
      setForm({
        name: data.name || '',
        country: data.country || '',
        bio: data.bio || '',
        skills: data.skills?.join(', ') || '',
      });
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/me', {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      setProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSocialUpdate = async (platform, url) => {
    try {
      await api.patch('/auth/me/social', { platform, url });
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return (
    <div style={{ textAlign: 'center', marginTop: '80px', color: '#888' }}>
      Loading profile...
    </div>
  );

  const verificationColors = {
    unverified: { bg: '#fff8e1', color: '#f59e0b', text: 'Not verified' },
    pending: { bg: '#e0f2fe', color: '#0284c7', text: 'Pending review' },
    verified: { bg: '#dcfce7', color: '#16a34a', text: 'Verified' },
    rejected: { bg: '#fee2e2', color: '#dc2626', text: 'Rejected' },
  };

  const vs = verificationColors[profile.verification?.status || 'unverified'];
  const roleLabel = {
    founder: 'Startup Founder',
    provider: 'Service Provider',
    both: 'Founder & Provider',
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>

        {/* Profile card */}
        <div style={styles.card}>

          {/* Header */}
          <div style={styles.header}>
            <div style={styles.avatarBox}>
              <div style={styles.avatar}>
                {profile.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div style={styles.headerInfo}>
              <h2 style={styles.name}>{profile.name}</h2>
              <p style={styles.email}>{profile.email}</p>
              <div style={styles.badgeRow}>
                <span style={styles.roleBadge}>
                  {roleLabel[profile.role] || 'Member'}
                </span>
                <span style={{ ...styles.verifiedBadge, background: vs.bg, color: vs.color }}>
                  {vs.text}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.tabRow}>
            {[
              { key: 'info', label: 'Profile Info' },
              { key: 'socials', label: 'Social Links' },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                ...styles.tabBtn,
                color: tab === t.key ? '#e94560' : '#888',
                borderBottom: tab === t.key ? '2px solid #e94560' : '2px solid transparent',
              }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={styles.content}>
            {tab === 'info' && (
              <form onSubmit={handleSave}>
                {[
                  { key: 'name', label: 'Full name', placeholder: 'Your full name' },
                  { key: 'country', label: 'Country', placeholder: 'e.g. India, USA' },
                  { key: 'bio', label: 'Bio', placeholder: 'Tell others about yourself...' },
                  { key: 'skills', label: 'Skills', placeholder: 'Node.js, React, MongoDB' },
                ].map(f => (
                  <div key={f.key} style={styles.fieldGroup}>
                    <label style={styles.label}>{f.label}</label>
                    <input
                      style={styles.input}
                      value={form[f.key]}
                      placeholder={f.placeholder}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  </div>
                ))}
                <button style={styles.saveBtn} type="submit">
                  {saved ? '✓ Saved!' : 'Save Profile'}
                </button>
              </form>
            )}

            {tab === 'socials' && (
              <div>
                <p style={styles.socialsNote}>
                  Add your social links. They appear on your public profile so others can verify your work.
                </p>
                {['github', 'linkedin', 'instagram', 'x', 'portfolio'].map(platform => (
                  <div key={platform} style={styles.socialField}>
                    <label style={styles.label}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </label>
                    <div style={styles.socialRow}>
                      <input
                        style={{ ...styles.input, flex: 1, marginBottom: 0 }}
                        defaultValue={profile.socials?.[platform]?.url || ''}
                        placeholder={`https://${platform === 'x' ? 'x.com' : platform + '.com'}/yourprofile`}
                        onBlur={e => handleSocialUpdate(platform, e.target.value)}
                      />
                      <span style={{
                        ...styles.selfReported,
                        background: profile.socials?.[platform]?.verified ? '#dcfce7' : '#f1f5f9',
                        color: profile.socials?.[platform]?.verified ? '#16a34a' : '#94a3b8',
                      }}>
                        {profile.socials?.[platform]?.verified ? 'Verified' : 'Self-reported'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Verification notice if unverified */}
        {profile.verification?.status === 'unverified' && (
          <div style={styles.verifyNotice}>
            <p style={styles.verifyText}>
              Your account is not verified yet. Verified accounts build more trust and get more connections.
            </p>
            <button style={styles.verifyBtn}
              onClick={() => window.location.href = '/onboarding'}>
              Verify my identity
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: '#f8f9fb', padding: '40px 20px',
  },
  wrapper: {
    maxWidth: '640px', margin: '0 auto',
  },
  card: {
    background: '#fff', borderRadius: '20px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)', overflow: 'hidden',
    border: '1px solid #eef0f3',
  },
  header: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '36px 32px', display: 'flex', gap: '20px', alignItems: 'center',
  },
  avatarBox: { flexShrink: 0 },
  avatar: {
    width: '72px', height: '72px', borderRadius: '50%',
    background: '#e94560', color: '#fff', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '28px', fontWeight: '800',
    border: '3px solid rgba(255,255,255,0.2)',
  },
  headerInfo: { flex: 1 },
  name: { fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' },
  email: { fontSize: '14px', color: '#94a3b8', marginBottom: '12px' },
  badgeRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  roleBadge: {
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
    fontWeight: '600', background: 'rgba(255,255,255,0.15)', color: '#fff',
  },
  verifiedBadge: {
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
  },
  tabRow: {
    display: 'flex', borderBottom: '1px solid #eef0f3', padding: '0 32px',
  },
  tabBtn: {
    padding: '16px 20px', background: 'none', border: 'none',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600',
    transition: 'all 0.2s',
  },
  content: { padding: '32px' },
  fieldGroup: { marginBottom: '20px' },
  label: {
    display: 'block', fontSize: '13px', fontWeight: '600',
    color: '#374151', marginBottom: '8px',
  },
  input: {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: '1px solid #e5e7eb', fontSize: '15px',
    boxSizing: 'border-box', outline: 'none', color: '#1a1a2e',
    background: '#fafafa', transition: 'border 0.2s',
  },
  saveBtn: {
    width: '100%', padding: '14px', background: '#e94560', color: '#fff',
    border: 'none', borderRadius: '10px', fontSize: '15px',
    fontWeight: '700', cursor: 'pointer', marginTop: '8px',
  },
  socialsNote: {
    fontSize: '14px', color: '#888', marginBottom: '24px', lineHeight: '1.6',
  },
  socialField: { marginBottom: '20px' },
  socialRow: { display: 'flex', gap: '10px', alignItems: 'center' },
  selfReported: {
    padding: '8px 12px', borderRadius: '8px', fontSize: '12px',
    fontWeight: '600', whiteSpace: 'nowrap',
  },
  verifyNotice: {
    marginTop: '20px', background: '#fff', borderRadius: '16px',
    padding: '24px 28px', border: '1px solid #fde68a',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  verifyText: { fontSize: '14px', color: '#666', flex: 1 },
  verifyBtn: {
    background: '#f59e0b', color: '#fff', border: 'none',
    padding: '10px 20px', borderRadius: '8px', fontSize: '14px',
    fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
  },
};