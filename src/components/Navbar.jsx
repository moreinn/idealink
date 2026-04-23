import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to={user ? '/feed' : '/'} style={styles.brand}>
        <span style={styles.brandAccent}>Idea</span>Link
      </Link>

      <div style={styles.links}>
        {user ? (
          <>
           <Link to="/" style={styles.link}>Browse</Link>
           <Link to="/how-it-works" style={styles.link}>How it works</Link>
            <Link to="/post-idea" style={styles.link}>Post</Link>
            <Link to="/connections" style={styles.link}>Connections</Link>
            <Link to="/profile" style={styles.profileBtn}>
              <div style={styles.avatar}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={styles.userName}>{user.name}</span>
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 40px', background: '#fff', height: '64px',
    position: 'sticky', top: 0, zIndex: 1000,
    borderBottom: '1px solid #eef0f3',
    boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
  },
  brand: { fontSize: '22px', fontWeight: '800', color: '#1a1a2e', letterSpacing: '-0.5px' },
  brandAccent: { color: '#e94560' },
  links: { display: 'flex', gap: '4px', alignItems: 'center' },
  link: {
    color: '#555', fontSize: '14px', padding: '8px 14px',
    borderRadius: '8px', fontWeight: '500',
  },
  profileBtn: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '6px 12px', borderRadius: '8px',
    border: '1px solid #eef0f3', color: '#1a1a2e', marginLeft: '4px',
  },
  avatar: {
    width: '28px', height: '28px', borderRadius: '50%',
    background: '#e94560', color: '#fff', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '700',
  },
  userName: { fontSize: '14px', fontWeight: '600', color: '#1a1a2e' },
  logoutBtn: {
    background: 'none', color: '#888', border: '1px solid #eef0f3',
    padding: '8px 14px', borderRadius: '8px', fontSize: '14px',
    marginLeft: '4px', cursor: 'pointer',
  },
  registerBtn: {
    background: '#e94560', color: '#fff', border: 'none',
    padding: '10px 20px', borderRadius: '8px', fontSize: '14px',
    fontWeight: '700', marginLeft: '8px', cursor: 'pointer',
  },
};