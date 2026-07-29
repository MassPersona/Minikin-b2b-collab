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
        <section style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 24, gridTemplateColumns: '1fr 420px', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>Create and manage brand campaigns in one place</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>
              Collaborate with brands, select assets, and monitor performance — everything partners need to run successful campaigns.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="primary" size="lg" onClick={() => navigate('/login')}>Get Started</Button>
              <Button variant="ghost" size="lg" onClick={() => navigate('/login')}>Login</Button>
            </div>
          </div>

          <Card className="" padding="md">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ height: 10, background: 'linear-gradient(90deg, rgba(67,82,104,0.12), rgba(67,82,104,0.04))', borderRadius: 6 }} />
              <h3 style={{ margin: 0 }}>Partner Portal Preview</h3>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                A compact overview of campaigns, status badges, and quick actions — designed for fast partner workflows.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                <div style={{ background: 'var(--color-bg)', padding: 10, borderRadius: 8 }}>
                  <div style={{ height: 8, background: 'var(--color-primary)', borderRadius: 6, marginBottom: 8 }} />
                  <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 6 }} />
                </div>
                <div style={{ background: 'var(--color-bg)', padding: 10, borderRadius: 8 }}>
                  <div style={{ height: 8, background: 'var(--color-primary-hover)', borderRadius: 6, marginBottom: 8 }} />
                  <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 6 }} />
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section style={{ maxWidth: 1100, margin: '40px auto 0', display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Card padding="md">
              <h4 style={{ marginTop: 0 }}>Create Campaigns</h4>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Quickly assemble a campaign and select brand assets.</p>
            </Card>
          </div>
          <div style={{ flex: 1 }}>
            <Card padding="md">
              <h4 style={{ marginTop: 0 }}>Customize Brand Assets</h4>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Tailor colors, logos, and modular items for each campaign.</p>
            </Card>
          </div>
          <div style={{ flex: 1 }}>
            <Card padding="md">
              <h4 style={{ marginTop: 0 }}>Track Campaign Activity</h4>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Monitor status, approvals, and recent changes in one place.</p>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
