import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { campaignService } from '../services/campaignService';
import { useToast } from '../context/ToastContext';
import type { CampaignDetail } from '../types';

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
      <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function CodeStatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    Available: { bg: '#dcfce7', text: '#166534' },
    Reserved: { bg: '#fef9c3', text: '#854d0e' },
    Redeemed: { bg: '#dbeafe', text: '#1e40af' },
  };
  const c = colors[status] || colors.Available;
  return (
    <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600, background: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

function downloadCodesCSV(codes: CampaignDetail['unlockCodes'], campaignName: string) {
  const header = 'Code,Status,Created At\n';
  const rows = codes.map((c) => `${c.code},${c.status},${new Date(c.createdAt).toISOString()}`).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${campaignName.replace(/[^a-zA-Z0-9]/g, '_')}_codes.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function CampaignDetailsPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'codes' | 'redemptions'>('details');

  useEffect(() => {
    if (!campaignId) return;
    campaignService.getById(campaignId)
      .then(setCampaign)
      .catch((err) => {
        addToast('error', err?.data?.message || 'Failed to load campaign');
        navigate('/campaigns');
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  if (loading) {
    return <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading...</div>;
  }
  if (!campaign) return null;

  const typeLabel = campaign.type === 'ProductFlowSingleUser' ? 'Single User'
    : campaign.type === 'ProductFlowMultiUser' ? 'Multi User' : 'Asset Only';

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'details', label: 'Details' },
    { key: 'codes', label: `Unlock Codes (${campaign.unlockCodes.length})` },
    { key: 'redemptions', label: `Redemptions (${campaign.redemptions.length})` },
  ];

  return (
    <div className="page-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/campaigns')}>← Back</Button>
          <h2 className="section-title" style={{ marginTop: 8 }}>{campaign.name}</h2>
          <p className="section-subtitle">{campaign.description}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {campaign.logoURL && <img src={campaign.logoURL} alt="Campaign logo" style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 10, border: '1px solid var(--color-border)' }} />}
          <span style={{
            padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600,
            background: campaign.isActive ? 'var(--color-status-active-bg)' : 'var(--color-status-draft-bg)',
            color: campaign.isActive ? 'var(--color-status-active-text)' : 'var(--color-status-draft-text)',
          }}>
            {campaign.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--color-border)', marginBottom: 24 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === t.key ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: -2,
              fontWeight: activeTab === t.key ? 600 : 400,
              color: activeTab === t.key ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'details' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Card padding="md">
            <h4 style={{ marginTop: 0, marginBottom: 12 }}>Campaign Info</h4>
            <InfoRow label="Type" value={typeLabel} />
            <InfoRow label="Start Date" value={new Date(campaign.startDate).toLocaleDateString()} />
            <InfoRow label="End Date" value={campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'No end date'} />
            <InfoRow label="Free Shipping" value={campaign.isFreeShipping ? 'Yes' : 'No'} />
            <InfoRow label="Max Codes/User" value={campaign.maxCodesPerUser} />
            <InfoRow label="Code Usage Limit" value={campaign.codeUsageLimit ?? 'Unlimited'} />
          </Card>

          <Card padding="md">
            <h4 style={{ marginTop: 0, marginBottom: 12 }}>Branding</h4>
            {campaign.logoURL && (
              <div style={{ marginBottom: 16 }}>
                <img src={campaign.logoURL} alt="Brand logo" style={{ width: 96, height: 96, objectFit: 'contain', borderRadius: 10, border: '1px solid var(--color-border)' }} />
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[campaign.color1, campaign.color2, campaign.color3].map((c, i) => c && (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 28, height: 28, background: c, borderRadius: 6, border: '1px solid var(--color-border)' }} />
                  <span style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{c}</span>
                </div>
              ))}
            </div>
            <InfoRow label="Products" value={campaign.productIds.length > 0 ? campaign.productIds.join(', ') : '—'} />
            <InfoRow label="Default Assets" value={campaign.defaultAssetItems.length > 0 ? campaign.defaultAssetItems.join(', ') : '—'} />
            <InfoRow label="Bundles" value={campaign.unlockableMenuItems.length > 0 ? campaign.unlockableMenuItems.join(', ') : '—'} />
          </Card>
        </div>
      )}

      {activeTab === 'codes' && (
        <Card padding="md">
          {campaign.unlockCodes.length === 0 ? (
            <p className="text-secondary" style={{ textAlign: 'center', padding: 32 }}>No unlock codes generated yet.</p>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <Button variant="secondary" size="sm" onClick={() => downloadCodesCSV(campaign.unlockCodes, campaign.name)}>
                  ↓ Download CSV
                </Button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>
                      <th style={{ padding: '10px 12px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Code</th>
                      <th style={{ padding: '10px 12px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Status</th>
                      <th style={{ padding: '10px 12px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaign.unlockCodes.map((code) => (
                      <tr key={code.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 600 }}>{code.code}</td>
                        <td style={{ padding: '10px 12px' }}><CodeStatusBadge status={code.status} /></td>
                        <td style={{ padding: '10px 12px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{new Date(code.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      )}

      {activeTab === 'redemptions' && (
        <Card padding="md">
          {campaign.redemptions.length === 0 ? (
            <p className="text-secondary" style={{ textAlign: 'center', padding: 32 }}>No redemptions yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '10px 12px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Status</th>
                    <th style={{ padding: '10px 12px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>User ID</th>
                    <th style={{ padding: '10px 12px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Reserved At</th>
                    <th style={{ padding: '10px 12px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Redeemed At</th>
                  </tr>
                </thead>
                <tbody>
                  {campaign.redemptions.map((r) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '10px 12px' }}><CodeStatusBadge status={r.status} /></td>
                      <td style={{ padding: '10px 12px', fontSize: '0.85rem', fontFamily: 'monospace' }}>{r.minikinUserId || '—'}</td>
                      <td style={{ padding: '10px 12px', fontSize: '0.85rem' }}>{r.reservedAt ? new Date(r.reservedAt).toLocaleString() : '—'}</td>
                      <td style={{ padding: '10px 12px', fontSize: '0.85rem' }}>{r.redeemedAt ? new Date(r.redeemedAt).toLocaleString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
