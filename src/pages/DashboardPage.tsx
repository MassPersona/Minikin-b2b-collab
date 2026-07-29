import { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { AppLayout } from '../components/layout/AppLayout';
import { storageService } from '../services/storageService';
import { MOCK_CAMPAIGNS } from '../data/mockCampaigns';
import type { Campaign } from '../types';
import { useNavigate } from 'react-router-dom';

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <Card padding="md">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{title}</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{value}</div>
        </div>
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const stored = storageService.getCampaigns();
    return stored.length ? stored : MOCK_CAMPAIGNS;
  });

  // Keep local state in sync if storage changes elsewhere
  useEffect(() => {
    const fromStorage = storageService.getCampaigns();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fromStorage.length) setCampaigns(fromStorage);
  }, []);

  const totals = useMemo(() => {
    const total = campaigns.length;
    const draft = campaigns.filter((c) => c.status === 'draft').length;
    const active = campaigns.filter((c) => c.status === 'active').length;
    return { total, draft, active };
  }, [campaigns]);

  const recent = useMemo(() => {
    return [...campaigns].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 5);
  }, [campaigns]);

  return (
    <AppLayout>
      <div className="page-container">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 className="section-title">Welcome back</h2>
            <p className="section-subtitle">Overview of your campaigns and recent activity</p>
          </div>
          <div>
            <Button variant="primary" onClick={() => navigate('/campaigns/new')}>Create Campaign</Button>
          </div>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <SummaryCard title="Total Campaigns" value={totals.total} />
          <SummaryCard title="Draft Campaigns" value={totals.draft} />
          <SummaryCard title="Active Campaigns" value={totals.active} />
        </section>

        <section>
          <Card padding="md">
            <h3 style={{ marginTop: 0 }}>Recent Campaigns</h3>

            {recent.length === 0 ? (
              <p className="text-secondary">No campaigns yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {recent.map((c) => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div className="text-secondary" style={{ fontSize: '0.9rem' }}>{c.brandName}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <StatusBadge status={c.status} />
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{new Date(c.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}

