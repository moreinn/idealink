import { useNavigate } from 'react-router-dom';

export default function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      number: '01',
      icon: '🚀',
      title: 'Create your profile',
      desc: 'Sign up in seconds. Verify your identity with a government ID to build trust with other members on the platform.',
      color: '#e94560',
    },
    {
      number: '02',
      icon: '💡',
      title: 'Post or discover ideas',
      desc: 'Post what your startup needs — team, service, or workspace. Or browse offers from providers worldwide and filter by country, category and skill.',
      color: '#f59e0b',
    },
    {
      number: '03',
      icon: '🤝',
      title: 'Connect instantly',
      desc: 'Send a connection request to anyone that interests you. Accept or decline — you stay in control of who you work with.',
      color: '#10b981',
    },
    {
      number: '04',
      icon: '💬',
      title: 'Chat in real time',
      desc: 'Once connected, jump into a real-time chat. Discuss your idea, share details, and build trust before committing.',
      color: '#6366f1',
    },
    {
      number: '05',
      icon: '🎥',
      title: 'Video call and close',
      desc: 'Start a video call directly from the chat. Meet face to face, finalize the collaboration, and get to work.',
      color: '#e94560',
    },
  ];

  return (
    <div style={styles.page}>

      {/* Hero */}
      <div style={styles.hero}>
        <span style={styles.badge}>How IdeaLink works</span>
        <h1 style={styles.heroTitle}>
          From idea to collaboration<br />
          <span style={styles.heroAccent}>in 5 simple steps</span>
        </h1>
        <p style={styles.heroSub}>
          IdeaLink connects startup founders with service providers, talent
          and workspace  across borders, in real time.
        </p>
      </div>

      {/* Steps */}
      <div style={styles.stepsContainer}>
        {steps.map((step, i) => (
          <div key={i} style={styles.stepRow}>
            <div style={styles.stepLeft}>
              <div style={{ ...styles.stepIconBox, background: step.color + '18', border: `1px solid ${step.color}30` }}>
                <span style={styles.stepIcon}>{step.icon}</span>
              </div>
              {i < steps.length - 1 && <div style={styles.stepLine} />}
            </div>
            <div style={styles.stepRight}>
              <span style={{ ...styles.stepNumber, color: step.color }}>Step {step.number}</span>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDesc}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Who is it for */}
      <div style={styles.rolesSection}>
        <h2 style={styles.sectionTitle}>Built for everyone in the startup world</h2>
        <div style={styles.rolesGrid}>
          {[
            { icon: '🏢', title: 'Startup Founders', desc: 'Post what your startup needs and find the right people to build with.' },
            { icon: '🛠', title: 'Service Providers', desc: 'Offer your skills, services or workspace to startups globally.' },
            { icon: '🌍', title: 'Global Talent', desc: 'Join startups from any country. Work remotely or locally.' },
          ].map((r, i) => (
            <div key={i} style={styles.roleCard}>
              <span style={styles.roleIcon}>{r.icon}</span>
              <h3 style={styles.roleTitle}>{r.title}</h3>
              <p style={styles.roleDesc}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to find your next opportunity?</h2>
        <p style={styles.ctaSub}>Join thousands of founders and professionals on IdeaLink it's free.</p>
        <div style={styles.ctaActions}>
        </div>
      </div>

    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#fff' },
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '80px 40px', textAlign: 'center',
  },
  badge: {
    display: 'inline-block', background: 'rgba(233,69,96,0.15)',
    color: '#e94560', padding: '6px 16px', borderRadius: '20px',
    fontSize: '13px', fontWeight: '600', marginBottom: '20px',
    border: '1px solid rgba(233,69,96,0.25)',
  },
  heroTitle: {
    fontSize: '44px', fontWeight: '800', color: '#fff',
    lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-1px',
  },
  heroAccent: { color: '#e94560' },
  heroSub: {
    fontSize: '17px', color: '#94a3b8', maxWidth: '520px',
    margin: '0 auto', lineHeight: '1.7',
  },
  stepsContainer: {
    maxWidth: '720px', margin: '0 auto', padding: '72px 24px',
  },
  stepRow: {
    display: 'flex', gap: '28px', marginBottom: '0',
  },
  stepLeft: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', width: '56px', flexShrink: 0,
  },
  stepIconBox: {
    width: '56px', height: '56px', borderRadius: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  stepIcon: { fontSize: '24px' },
  stepLine: {
    width: '2px', flex: 1, background: '#eef0f3',
    margin: '8px 0', minHeight: '40px',
  },
  stepRight: {
    paddingBottom: '40px', flex: 1,
  },
  stepNumber: { fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' },
  stepTitle: {
    fontSize: '20px', fontWeight: '700', color: '#1a1a2e',
    margin: '6px 0 10px',
  },
  stepDesc: {
    fontSize: '15px', color: '#666', lineHeight: '1.7',
  },
  rolesSection: {
    background: '#f8f9fb', padding: '72px 40px', textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '30px', fontWeight: '800', color: '#1a1a2e', marginBottom: '40px',
  },
  rolesGrid: {
    display: 'flex', gap: '20px', justifyContent: 'center',
    flexWrap: 'wrap', maxWidth: '860px', margin: '0 auto',
  },
  roleCard: {
    flex: 1, minWidth: '220px', maxWidth: '260px',
    background: '#fff', padding: '32px 24px', borderRadius: '16px',
    border: '1px solid #eef0f3', textAlign: 'left',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  },
  roleIcon: { fontSize: '28px', display: 'block', marginBottom: '14px' },
  roleTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' },
  roleDesc: { fontSize: '14px', color: '#888', lineHeight: '1.7' },
  cta: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '80px 40px', textAlign: 'center',
  },
  ctaTitle: { fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '12px' },
  ctaSub: { color: '#94a3b8', fontSize: '16px', marginBottom: '32px' },
  ctaActions: { display: 'flex', gap: '14px', justifyContent: 'center' },
  ctaBtn: {
    background: '#e94560', color: '#fff', border: 'none',
    padding: '14px 32px', borderRadius: '10px', fontSize: '16px',
    fontWeight: '700', cursor: 'pointer',
  },
  ctaSecondary: {
    background: 'rgba(255,255,255,0.1)', color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '14px 32px', borderRadius: '10px', fontSize: '16px',
    fontWeight: '600', cursor: 'pointer',
  },
};