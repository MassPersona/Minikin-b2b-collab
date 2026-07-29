import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { storageService } from '../services/storageService';
import { MOCK_CAMPAIGNS } from '../data/mockCampaigns';
import type { Campaign } from '../types';

function DesktopTable({ campaigns }: { campaigns: Campaign[] }) {
  const navigate = useNavigate();
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
            <th style={{ padding: '12px' }}>Campaign</th>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Created</th>
            <th style={{ padding: '12px' }}>Modules</th>
            <th style={{ padding: '12px' }}></th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: 12 }}>
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                <div className="text-secondary" style={{ fontSize: '0.9rem' }}>{c.brandName}</div>
              </td>
              <td style={{ padding: 12 }}><StatusBadge status={c.status} /></td>
              <td style={{ padding: 12 }}>{new Date(c.createdAt).toLocaleDateString()}</td>
              <td style={{ padding: 12 }}>{c.selectedModules.join(', ')}</td>
              <td style={{ padding: 12 }}>
                <Button variant="secondary" size="sm" onClick={() => navigate(`/campaigns/${c.id}`)}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileCards({ campaigns }: { campaigns: Campaign[] }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {campaigns.map((c) => (
        <Card key={c.id} padding="md">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div className="text-secondary" style={{ fontSize: '0.9rem' }}>{c.brandName}</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <StatusBadge status={c.status} />
                <div className="text-secondary" style={{ fontSize: '0.85rem' }}>{new Date(c.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            <div>
              <Button variant="ghost" size="sm" onClick={() => navigate(`/campaigns/${c.id}`)}>View</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function CampaignsPage() {
  const navigate = useNavigate();

  const campaigns = useMemo<Campaign[]>(() => {
    const stored = storageService.getCampaigns();
    return stored.length ? stored : MOCK_CAMPAIGNS;
  }, []);

  return (
    <AppLayout>
      <div className="page-container">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 className="section-title">Campaigns</h2>
            <p className="section-subtitle">Create and manage your brand campaigns</p>
          </div>
          <div>
            <Button variant="primary" onClick={() => navigate('/campaigns/new')}>Create Campaign</Button>
          </div>
        </header>

        {campaigns.length === 0 ? (
          <EmptyState
            title="No campaigns yet"
            description="Create your first campaign to get started"
          />
        ) : (
          <div>
            <div className="hide-on-mobile">
              <DesktopTable campaigns={campaigns} />
            </div>
            <div className="show-on-mobile">
              <MobileCards campaigns={campaigns} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
