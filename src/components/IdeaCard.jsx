import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function IdeaCard({ idea, onDelete }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const isNeed = idea.postType === 'need' || !idea.postType;
  const isOwner = user?.id === idea.author?._id;

  const handleConnect = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post('/connections/request', {
        receiverId: idea.author._id,
        ideaId: idea._id,
      });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      await api.delete(`/ideas/${idea._id}`);
      if (onDelete) onDelete(idea._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
      setDeleting(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.headerLeft}>
          <span style={{
            ...styles.typePill,
            background: isNeed ? '#fff0f3' : '#f0fff4',
            color: isNeed ? '#e94560' : '#0f5132',
            border: isNeed ? '1px solid #ffd6df' : '1px solid #9FE1CB',
          }}>
            {isNeed ? 'Looking for' : 'Offering'}
          </span>
          <span style={styles.categoryPill}>{idea.category}</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.date}>
            {new Date(idea.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          {isOwner && (
            <button style={styles.deleteBtn} onClick={handleDelete} disabled={deleting}>
              {deleting ? '...' : 'Delete'}
            </button>
          )}
        </div>
      </div>

      <h3 style={styles.title}>{idea.title}</h3>
      <p style={styles.desc}>{idea.description}</p>

      <div style={styles.tags}>
        {idea.skillsNeeded?.filter(Boolean).map((skill, i) => (
          <span key={i} style={styles.tag}>{skill}</span>
        ))}
      </div>

      <div style={styles.footer}>
        <div style={styles.authorInfo}>
          <div style={styles.authorAvatar}>
            {idea.author?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={styles.authorName}>{idea.author?.name}</p>
            <p style={styles.authorMeta}>{idea.author?.country || 'Global'}</p>
          </div>
        </div>

        <div style={styles.actions}>
          {error && <span style={styles.errorText}>{error}</span>}
          {!isOwner && user && (
            <button style={sent ? styles.btnSent : styles.btn}
              onClick={handleConnect} disabled={sent}>
              {sent ? '✓ Sent' : isNeed ? 'I can help' : 'I am interested'}
            </button>
          )}
          {!user && (
            <button style={styles.btn} onClick={() => navigate('/login')}>
              {isNeed ? 'I can help' : 'I am interested'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff', borderRadius: '14px', padding: '24px',
    border: '1px solid #eef0f3', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  headerLeft: { display: 'flex', gap: '8px', alignItems: 'center' },
  headerRight: { display: 'flex', gap: '12px', alignItems: 'center' },
  typePill: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  categoryPill: {
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
    fontWeight: '500', background: '#f0f2f5', color: '#555',
  },
  date: { fontSize: '12px', color: '#aaa' },
  deleteBtn: {
    background: 'none', color: '#e94560', border: '1px solid #ffd6df',
    padding: '4px 12px', borderRadius: '6px', fontSize: '12px',
    cursor: 'pointer', fontWeight: '500',
  },
  title: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' },
  desc: { fontSize: '14px', color: '#666', lineHeight: '1.7', marginBottom: '16px' },
  tags: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' },
  tag: {
    padding: '4px 12px', borderRadius: '6px', fontSize: '12px',
    background: '#f8f9fb', color: '#555', border: '1px solid #eef0f3',
  },
  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderTop: '1px solid #f5f5f5', paddingTop: '16px',
  },
  authorInfo: { display: 'flex', gap: '10px', alignItems: 'center' },
  authorAvatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: '#1a1a2e', color: '#fff', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700',
  },
  authorName: { fontSize: '14px', fontWeight: '600', color: '#1a1a2e' },
  authorMeta: { fontSize: '12px', color: '#aaa' },
  actions: { display: 'flex', gap: '8px', alignItems: 'center' },
  btn: {
    padding: '10px 20px', background: '#e94560', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
  btnSent: {
    padding: '10px 20px', background: '#f0fff4', color: '#0f5132',
    border: '1px solid #9FE1CB', borderRadius: '8px', fontSize: '14px',
    fontWeight: '600', cursor: 'default',
  },
  errorText: { fontSize: '12px', color: '#e94560' },
};