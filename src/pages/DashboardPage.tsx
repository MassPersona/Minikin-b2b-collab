import { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { campaignService } from '../services/campaignService';
import { useToast } from '../context/ToastContext';
import type { CampaignListItem } from '../types';
import { useNavigate } from 'react-router-dom';

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <Card padding="md">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: 4 }}>{value}</div>
        </div>
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campaignService.getAll()
      .then(setCampaigns)
      .catch((err) => addToast('error', err?.data?.message || 'Failed to load campaigns'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter((c) => c.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [campaigns]);

  const recent = useMemo(() => {
    return [...campaigns].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()).slice(0, 5);
  }, [campaigns]);

  return (
    <div className="page-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 className="section-title">Dashboard</h2>
          <p className="section-subtitle">Overview of your campaigns and recent activity</p>
        </div>
        <div>
          <Button variant="primary" onClick={() => navigate('/campaigns/new')}>+ New Campaign</Button>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-text-secondary)' }}>Loading...</div>
      ) : (
        <>
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            <SummaryCard title="Total Campaigns" value={totals.total} />
            <SummaryCard title="Active" value={totals.active} />
            <SummaryCard title="Inactive" value={totals.inactive} />
          </section>

          <section>
            <Card padding="md">
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Recent Campaigns</h3>
              {recent.length === 0 ? (
                <p className="text-secondary">No campaigns yet.</p>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {recent.map((c) => (
                    <div
                      key={c.id}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s' }}
                      onClick={() => navigate(`/campaigns/${c.id}`)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div className="text-secondary" style={{ fontSize: '0.85rem' }}>{c.type.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600,
                          background: c.isActive ? 'var(--color-status-active-bg)' : 'var(--color-status-draft-bg)',
                          color: c.isActive ? 'var(--color-status-active-text)' : 'var(--color-status-draft-text)',
                        }}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{new Date(c.startDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>
        </>
      )}
    </div>
  );
}

