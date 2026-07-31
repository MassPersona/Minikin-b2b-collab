import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { campaignService } from '../services/campaignService';
import { useToast } from '../context/ToastContext';
import type { CampaignListItem } from '../types';

function StatusPill({ isActive }: { isActive: boolean }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.8rem',
      fontWeight: 600,
      background: isActive ? 'var(--color-status-active-bg)' : 'var(--color-status-draft-bg)',
      color: isActive ? 'var(--color-status-active-text)' : 'var(--color-status-draft-text)',
    }}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const label = type === 'ProductFlowSingleUser' ? 'Single User'
    : type === 'ProductFlowMultiUser' ? 'Multi User' : 'Asset Only';
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.75rem',
      fontWeight: 500,
      background: '#f0f4ff',
      color: '#3b5998',
    }}>
      {label}
    </span>
  );
}

function DesktopTable({ campaigns }: { campaigns: CampaignListItem[] }) {
  const navigate = useNavigate();
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>
            <th style={{ padding: '12px 16px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>Campaign</th>
            <th style={{ padding: '12px 16px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>Type</th>
            <th style={{ padding: '12px 16px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>Status</th>
            <th style={{ padding: '12px 16px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>Start Date</th>
            <th style={{ padding: '12px 16px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}></th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)', cursor: 'pointer' }} onClick={() => navigate(`/campaigns/${c.id}`)}>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                {c.tag && <div className="text-secondary" style={{ fontSize: '0.85rem' }}>#{c.tag}</div>}
              </td>
              <td style={{ padding: '14px 16px' }}><TypeBadge type={c.type} /></td>
              <td style={{ padding: '14px 16px' }}><StatusPill isActive={c.isActive} /></td>
              <td style={{ padding: '14px 16px' }}>{new Date(c.startDate).toLocaleDateString()}</td>
              <td style={{ padding: '14px 16px' }}>
                <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/campaigns/${c.id}`); }}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileCards({ campaigns }: { campaigns: CampaignListItem[] }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {campaigns.map((c) => (
        <Card key={c.id} padding="md">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }} onClick={() => navigate(`/campaigns/${c.id}`)}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              {c.tag && <div className="text-secondary" style={{ fontSize: '0.85rem' }}>#{c.tag}</div>}
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <TypeBadge type={c.type} />
                <StatusPill isActive={c.isActive} />
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/campaigns/${c.id}`); }}>View</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function CampaignsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    campaignService.getAll()
      .then(setCampaigns)
      .catch((err) => {
        addToast('error', err?.data?.message || 'Failed to load campaigns');
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h2 className="section-title">Campaigns</h2>
          <p className="section-subtitle">Create and manage your brand campaigns</p>
        </div>
        <div>
          <Button variant="primary" onClick={() => navigate('/campaigns/new')}>+ New Campaign</Button>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-text-secondary)' }}>Loading campaigns...</div>
      ) : campaigns.length === 0 ? (
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
  );
}
