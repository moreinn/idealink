import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/feed');
  }, [user]);

  return (
    <div style={styles.page}>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>Global Startup Network</div>
        <h1 style={styles.heroTitle}>
          Where Startups Meet <br />
          <span style={styles.heroAccent}>People Who Build</span>
        </h1>
        <p style={styles.heroSub}>
          Post your startup idea, find co-founders, hire services and connect
          with talent from India, USA, UAE and beyond.
        </p>
        <div style={styles.heroActions}>
          <button style={styles.primaryBtn} onClick={() => navigate('/register')}>
            Get Started Free
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate('/feed')}>
            Browse Ideas
          </button>
        </div>
        <p style={styles.heroNote}>No credit card required · Free to join</p>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { number: '500+', label: 'Startup Ideas' },
          { number: '50+', label: 'Countries' },
          { number: '1000+', label: 'Professionals' },
          { number: '200+', label: 'Deals Made' },
        ].map((s, i) => (
          <div key={i} style={styles.statBox}>
            <h3 style={styles.statNumber}>{s.number}</h3>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>How it works</h2>
        <p style={styles.sectionSub}>Three steps to your next big opportunity</p>
        <div style={styles.stepsRow}>
          {[
            { step: '01', title: 'Create your profile', desc: 'Sign up and verify your identity with a government ID. Build trust from day one.' },
            { step: '02', title: 'Post or browse', desc: 'Post what you need or what you offer. Browse ideas from founders worldwide.' },
            { step: '03', title: 'Connect and collaborate', desc: 'Send a connection request, chat in real time, and close deals on video call.' },
          ].map((s, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNumber}>{s.step}</div>
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Who is it for */}
      <div style={styles.sectionDark}>
        <h2 style={{ ...styles.sectionTitle, color: '#fff' }}>Built for everyone in the startup world</h2>
        <div style={styles.rolesRow}>
          {[
            { icon: '🚀', role: 'Startup Founders', desc: 'Post your idea and find the right people to build it with you.' },
            { icon: '💼', role: 'Service Providers', desc: 'Offer your skills, workspace or services to startups globally.' },
            { icon: '🌍', role: 'Global Talent', desc: 'Join startups from any country. Work remotely or locally.' },
          ].map((r, i) => (
            <div key={i} style={styles.roleCard}>
              <span style={styles.roleIcon}>{r.icon}</span>
              <h3 style={styles.roleTitle}>{r.role}</h3>
              <p style={styles.roleDesc}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to find your next opportunity?</h2>
        <p style={styles.ctaSub}>Join thousands of founders and professionals on IdeaLink</p>
        <button style={styles.primaryBtn} onClick={() => navigate('/register')}>
          Create Free Account
        </button>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>© 2025 IdeaLink · Connecting the world's startup ecosystem</p>
      </div>

    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#fff' },

  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    padding: '100px 40px', textAlign: 'center',
  },
  heroBadge: {
    display: 'inline-block', background: 'rgba(233,69,96,0.2)',
    color: '#e94560', padding: '6px 16px', borderRadius: '20px',
    fontSize: '13px', fontWeight: '600', marginBottom: '24px',
    border: '1px solid rgba(233,69,96,0.3)',
  },
  heroTitle: {
    fontSize: '52px', fontWeight: '800', color: '#fff',
    lineHeight: '1.15', marginBottom: '20px', letterSpacing: '-1px',
  },
  heroAccent: { color: '#e94560' },
  heroSub: {
    fontSize: '18px', color: '#94a3b8', maxWidth: '560px',
    margin: '0 auto 36px', lineHeight: '1.7',
  },
  heroActions: { display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '16px' },
  primaryBtn: {
    background: '#e94560', color: '#fff', border: 'none',
    padding: '14px 32px', borderRadius: '10px', fontSize: '16px',
    fontWeight: '700', cursor: 'pointer',
  },
  secondaryBtn: {
    background: 'rgba(255,255,255,0.1)', color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '14px 32px', borderRadius: '10px', fontSize: '16px',
    fontWeight: '600', cursor: 'pointer',
  },
  heroNote: { color: '#64748b', fontSize: '13px' },

  statsRow: {
    display: 'flex', justifyContent: 'center', gap: '0',
    borderBottom: '1px solid #eef0f3', background: '#fff',
  },
  statBox: {
    flex: 1, maxWidth: '220px', padding: '32px 20px',
    textAlign: 'center', borderRight: '1px solid #eef0f3',
  },
  statNumber: { fontSize: '32px', fontWeight: '800', color: '#e94560', marginBottom: '4px' },
  statLabel: { fontSize: '14px', color: '#888', fontWeight: '500' },

  section: { padding: '80px 40px', maxWidth: '1000px', margin: '0 auto', textAlign: 'center' },
  sectionTitle: { fontSize: '32px', fontWeight: '800', color: '#1a1a2e', marginBottom: '10px' },
  sectionSub: { color: '#888', fontSize: '16px', marginBottom: '48px' },
  stepsRow: { display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' },
  stepCard: {
    flex: 1, minWidth: '240px', maxWidth: '300px',
    padding: '32px', borderRadius: '16px',
    border: '1px solid #eef0f3', textAlign: 'left',
    background: '#fafbfc',
  },
  stepNumber: {
    fontSize: '32px', fontWeight: '800', color: '#e94560',
    opacity: 0.3, marginBottom: '16px',
  },
  stepTitle: { fontSize: '17px', fontWeight: '700', color: '#1a1a2e', marginBottom: '10px' },
  stepDesc: { fontSize: '14px', color: '#888', lineHeight: '1.7' },

  sectionDark: {
    background: '#1a1a2e', padding: '80px 40px', textAlign: 'center',
  },
  rolesRow: {
    display: 'flex', gap: '24px', justifyContent: 'center',
    flexWrap: 'wrap', maxWidth: '900px', margin: '48px auto 0',
  },
  roleCard: {
    flex: 1, minWidth: '220px', maxWidth: '260px',
    padding: '32px', borderRadius: '16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  roleIcon: { fontSize: '32px', display: 'block', marginBottom: '16px' },
  roleTitle: { fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '10px' },
  roleDesc: { fontSize: '14px', color: '#94a3b8', lineHeight: '1.7' },

  ctaSection: {
    padding: '80px 40px', textAlign: 'center', background: '#f8f9fb',
  },
  ctaTitle: { fontSize: '32px', fontWeight: '800', color: '#1a1a2e', marginBottom: '12px' },
  ctaSub: { color: '#888', fontSize: '16px', marginBottom: '32px' },

  footer: {
    background: '#1a1a2e', padding: '24px 40px', textAlign: 'center',
  },
  footerText: { color: '#64748b', fontSize: '13px' },
};