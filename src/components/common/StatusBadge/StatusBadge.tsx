import type { CampaignStatus } from '../../../types';
import './StatusBadge.css';

const LABEL_MAP: Record<CampaignStatus, string> = {
  draft: 'Draft',
  'pending-review': 'Pending Review',
  active: 'Active',
  rejected: 'Rejected',
};

interface StatusBadgeProps {
  status: CampaignStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      {LABEL_MAP[status]}
    </span>
  );
}
