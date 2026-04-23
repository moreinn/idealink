import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import IdeaCard from '../components/IdeaCard';

export default function Feed() {
  const [ideas, setIdeas] = useState([]);
  const [tab, setTab] = useState('all');
  const [filters, setFilters] = useState({ category: '', country: '', skill: '' });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchIdeas();
  }, [user]);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.country) params.country = filters.country;
      if (filters.skill) params.skill = filters.skill;
      const { data } = await api.get('/ideas', { params });
      setIdeas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = ideas.filter(idea => {
    if (tab === 'needs') return idea.postType === 'need';
    if (tab === 'offers') return idea.postType === 'offer';
    return true;
  });

  if (!user) return null;

  return (
    <div style={styles.page}>

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Global Startup <span style={styles.heroAccent}>Feed</span>
        </h1>
        <p style={styles.heroSub}>
          Browse ideas from founders worldwide. Connect, collaborate and build together.
        </p>
      </div>

      <div style={styles.container}>

        <div style={styles.tabRow}>
          {[
            { key: 'all', label: 'All Posts' },
            { key: 'needs', label: 'Startups Looking' },
            { key: 'offers', label: 'Services Offered' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              ...styles.tab,
              background: tab === t.key ? '#e94560' : '#fff',
              color: tab === t.key ? '#fff' : '#555',
              border: tab === t.key ? '2px solid #e94560' : '2px solid #eef0f3',
            }}>
              {t.label}
            </button>
          ))}
          <button style={styles.postBtn} onClick={() => navigate('/post-idea')}>
            + Post
          </button>
        </div>

        <div style={styles.filterRow}>
          <input style={styles.filterInput} placeholder="Category"
            value={filters.category}
            onChange={e => setFilters({ ...filters, category: e.target.value })} />
          <input style={styles.filterInput} placeholder="Country"
            value={filters.country}
            onChange={e => setFilters({ ...filters, country: e.target.value })} />
          <input style={styles.filterInput} placeholder="Skill needed"
            value={filters.skill}
            onChange={e => setFilters({ ...filters, skill: e.target.value })} />
          <button style={styles.searchBtn} onClick={fetchIdeas}>Search</button>
          {(filters.category || filters.country || filters.skill) && (
            <button style={styles.clearBtn} onClick={() => {
              setFilters({ category: '', country: '', skill: '' });
              fetchIdeas();
            }}>Clear</button>
          )}
        </div>

        <p style={styles.count}>
          {loading ? 'Loading...' : `${filtered.length} post${filtered.length !== 1 ? 's' : ''} found`}
        </p>

        <div style={styles.grid}>
          {loading ? (
            <div style={styles.emptyBox}>Loading posts...</div>
          ) : filtered.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>No posts found</p>
              <p style={{ color: '#aaa', fontSize: '14px' }}>Try adjusting your filters</p>
            </div>
          ) : (
            filtered.map(idea => (
              <IdeaCard
                key={idea._id}
                idea={idea}
                onDelete={(id) => setIdeas(prev => prev.filter(i => i._id !== id))}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f8f9fb' },
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '48px 40px', textAlign: 'center',
  },
  heroTitle: {
    fontSize: '36px', fontWeight: '800', color: '#fff',
    marginBottom: '12px', letterSpacing: '-0.5px',
  },
  heroAccent: { color: '#e94560' },
  heroSub: { color: '#94a3b8', fontSize: '16px' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '36px 20px' },
  tabRow: {
    display: 'flex', gap: '10px', marginBottom: '20px',
    flexWrap: 'wrap', alignItems: 'center',
  },
  tab: {
    padding: '10px 20px', borderRadius: '24px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '500',
  },
  postBtn: {
    marginLeft: 'auto', background: '#1a1a2e', color: '#fff',
    border: 'none', padding: '10px 20px', borderRadius: '24px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
  },
  filterRow: { display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' },
  filterInput: {
    flex: 1, minWidth: '120px', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #eef0f3', fontSize: '14px', background: '#fff', outline: 'none',
  },
  searchBtn: {
    padding: '10px 20px', background: '#e94560', color: '#fff',
    border: 'none', borderRadius: '8px', fontWeight: '600',
    fontSize: '14px', cursor: 'pointer',
  },
  clearBtn: {
    padding: '10px 16px', background: '#fff', color: '#888',
    border: '1px solid #eef0f3', borderRadius: '8px',
    fontSize: '14px', cursor: 'pointer',
  },
  count: { color: '#aaa', fontSize: '13px', marginBottom: '20px' },
  grid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  emptyBox: { textAlign: 'center', padding: '60px', color: '#888' },
};