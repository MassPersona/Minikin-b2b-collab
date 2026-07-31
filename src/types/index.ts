// Campaign types matching B2B API
export type CampaignType = 'ProductFlowSingleUser' | 'ProductFlowMultiUser' | 'AssetOnly';
export type UnlockCodeStatus = 'Available' | 'Reserved' | 'Redeemed';
export type RedemptionStatus = 'Reserved' | 'Redeemed';

export interface CampaignListItem {
  id: string;
  name: string;
  description: string;
  type: CampaignType;
  startDate: string;
  endDate: string | null;
  redeemableAmount: number;
  isFreeShipping: boolean;
  isActive: boolean;
  tag: string | null;
  logoURL: string | null;
  color1: string | null;
  color2: string | null;
  color3: string | null;
}

export interface UnlockCode {
  id: string;
  code: string;
  status: UnlockCodeStatus;
  createdAt: string;
}

export interface Redemption {
  id: string;
  unlockCodeId: string;
  minikinUserId: string | null;
  status: RedemptionStatus;
  reservedAt: string | null;
  reservedUntil: string | null;
  redeemedAt: string | null;
}

export interface CampaignDetail extends CampaignListItem {
  productIds: number[];
  defaultAssetItems: number[];
  unlockableMenuItems: string[];
  maxCodesPerUser: number;
  codeUsageLimit: number | null;
  shopifyCollectionId: string | null;
  unlockCodes: UnlockCode[];
  redemptions: Redemption[];
}

export interface CreateCampaignRequest {
  name: string;
  description: string | null;
  type: CampaignType;
  startDate: string;
  endDate: string | null;
  redeemableAmount: number;
  productIds: number[];
  shopifyCollectionId: string | null;
  tag: string | null;
  isFreeShipping: boolean;
  maxCodesPerUser: number;
  codeUsageLimit: number | null;
  numberOfCodesToGenerate: number;
  defaultAssetItems: number[];
  eligibleAssetItems: number[];
  unlockableMenuItems: string[];
  logoURL: string | null;
  color1: string | null;
  color2: string | null;
  color3: string | null;
}

// Catalog types
export interface CatalogProduct {
  id: number;
  name: string;
  price: number;
  currency: string;
}

export interface CatalogAsset {
  id: number;
  name: string;
  iconUrl: string | null;
}

export interface Catalog {
  products: CatalogProduct[];
  assets: CatalogAsset[];
}

// Auth
export interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

// Bundles (hardcoded menu items)
export const BUNDLE_MENU_ITEMS = [
  'Head',
  'Face',
  'Body',
  'Outfit',
  'Base',
  'Pose',
  'Emotion',
] as const;
