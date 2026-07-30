import { useNavigate } from 'react-router-dom';
import { PublicHeader } from '../components/layout/PublicHeader';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <PublicHeader />

      <main style={{ padding: '48px 16px' }}>
        <section style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>Bring your brand into the Minikin experience.</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>
              Launch branded Minikin campaigns, choose the assets that represent your brand, and manage everything from one place - from campaign requests to performance tracking.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button variant="primary" size="lg" onClick={() => navigate('/login')}>Get Started</Button>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: 1100, margin: '40px auto 0', display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Card padding="md">
              <h4 style={{ marginTop: 0 }}>Create Campaigns</h4>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Build and manage campaigns.</p>
            </Card>
          </div>
          <div style={{ flex: 1 }}>
            <Card padding="md">
              <h4 style={{ marginTop: 0 }}>Customize Brand Assets</h4>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Configure your brand identity.</p>
            </Card>
          </div>
          <div style={{ flex: 1 }}>
            <Card padding="md">
              <h4 style={{ marginTop: 0 }}>Track Campaign Activity</h4>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Track campaign performance.</p>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
