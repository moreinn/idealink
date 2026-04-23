import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Connections() {
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [tab, setTab] = useState('requests');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
    fetchConnections();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/connections/requests');
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConnections = async () => {
    try {
      const { data } = await api.get('/connections/mine');
      setConnections(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRespond = async (connectionId, status) => {
    try {
      await api.put(`/connections/request/${connectionId}`, { status });
      fetchRequests();
      fetchConnections();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Connections</h2>

      <div style={styles.tabs}>
        {[
          { key: 'requests', label: `Requests (${requests.length})` },
          { key: 'connections', label: `My Connections (${connections.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            ...styles.tab,
            background: tab === t.key ? '#e94560' : '#fff',
            color: tab === t.key ? '#fff' : '#555',
            border: tab === t.key ? '2px solid #e94560' : '2px solid #eee',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'requests' && (
        <div style={styles.list}>
          {requests.length === 0
            ? <p style={styles.empty}>No pending requests</p>
            : requests.map(req => (
              <div key={req._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <h4 style={styles.name}>{req.sender?.name}</h4>
                    <p style={styles.meta}>
                      {req.sender?.country} · {req.sender?.skills?.join(', ')}
                    </p>
                    <p style={styles.ideaTitle}>For: {req.idea?.title}</p>
                  </div>
                </div>
                <div style={styles.actions}>
                  <button style={styles.acceptBtn}
                    onClick={() => handleRespond(req._id, 'accepted')}>
                    Accept
                  </button>
                  <button style={styles.declineBtn}
                    onClick={() => handleRespond(req._id, 'declined')}>
                    Decline
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {tab === 'connections' && (
        <div style={styles.list}>
          {connections.length === 0
            ? <p style={styles.empty}>No connections yet</p>
            : connections.map(conn => {
              const other = conn.sender?._id === user?.id ? conn.receiver : conn.sender;
              return (
                <div key={conn._id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div>
                      <h4 style={styles.name}>{other?.name}</h4>
                      <p style={styles.meta}>
                        {other?.country} · {other?.skills?.join(', ')}
                      </p>
                      <p style={styles.ideaTitle}>Topic: {conn.idea?.title}</p>
                    </div>
                    <button style={styles.chatBtn}
                      onClick={() => navigate(`/chat/${conn._id}`)}>
                      Open Chat
                    </button>
                  </div>
                </div>
              );
            })
          }
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '40px auto', padding: '0 20px' },
  title: { color: '#1a1a2e', marginBottom: '24px' },
  tabs: { display: 'flex', gap: '12px', marginBottom: '24px' },
  tab: { padding: '10px 20px', borderRadius: '24px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  empty: { color: '#888', textAlign: 'center', marginTop: '40px' },
  card: { background: '#fff', borderRadius: '12px', padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: '#1a1a2e', margin: '0 0 4px' },
  meta: { color: '#888', fontSize: '13px', margin: '0 0 6px' },
  ideaTitle: { color: '#555', fontSize: '13px', margin: 0 },
  actions: { display: 'flex', gap: '12px', marginTop: '16px' },
  acceptBtn: { padding: '8px 20px', background: '#1D9E75', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  declineBtn: { padding: '8px 20px', background: '#fff', color: '#e94560',
    border: '1px solid #e94560', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  chatBtn: { padding: '8px 20px', background: '#1a1a2e', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
};