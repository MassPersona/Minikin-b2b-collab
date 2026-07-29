import type { AuthSession, Campaign } from '../types';

const KEYS = {
  AUTH: 'minikin_auth_session',
  CAMPAIGNS: 'minikin_campaigns',
} as const;

function safeRead<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    // Silently discard corrupted data
    localStorage.removeItem(key);
    return null;
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error(`[storageService] Failed to write key: ${key}`);
  }
}

// Auth session
export const storageService = {
  getAuth(): AuthSession | null {
    return safeRead<AuthSession>(KEYS.AUTH);
  },

  setAuth(session: AuthSession): void {
    safeWrite(KEYS.AUTH, session);
  },

  clearAuth(): void {
    localStorage.removeItem(KEYS.AUTH);
  },

  // Campaigns
  getCampaigns(): Campaign[] {
    return safeRead<Campaign[]>(KEYS.CAMPAIGNS) ?? [];
  },

  setCampaigns(campaigns: Campaign[]): void {
    safeWrite(KEYS.CAMPAIGNS, campaigns);
  },

  addCampaign(campaign: Campaign): void {
    const existing = storageService.getCampaigns();
    storageService.setCampaigns([campaign, ...existing]);
  },

  updateCampaign(updated: Campaign): void {
    const existing = storageService.getCampaigns();
    storageService.setCampaigns(
      existing.map((c) => (c.id === updated.id ? updated : c))
    );
  },

  getCampaignById(id: string): Campaign | null {
    return storageService.getCampaigns().find((c) => c.id === id) ?? null;
  },
};
