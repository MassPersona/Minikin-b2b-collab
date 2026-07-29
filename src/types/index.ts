export type CampaignStatus = 'draft' | 'pending-review' | 'active' | 'rejected';

export type ModuleId = 'hair-assets' | 'outfit-assets' | 'base-assets' | 'pose-assets';

export interface Campaign {
  id: string;
  name: string;
  brandName: string;
  description: string;
  startDate: string;   // ISO date string YYYY-MM-DD
  endDate: string;     // ISO date string YYYY-MM-DD
  logoPreview: string | null; // base64 data URL — real storage will use API/cloud
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  selectedModules: ModuleId[];
  status: CampaignStatus;
  createdAt: string; // ISO datetime string
}

export interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
}

export interface AuthSession {
  user: User;
  // Password is intentionally never stored in session
}

export interface ModuleOption {
  id: ModuleId;
  label: string;
  description: string;
  itemCount: number;
}
