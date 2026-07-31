import { apiClient } from './apiClient';
import type { CampaignListItem, CampaignDetail, CreateCampaignRequest, Catalog } from '../types';

export const campaignService = {
  async getAll(): Promise<CampaignListItem[]> {
    return apiClient.get<CampaignListItem[]>('/b2b/campaigns');
  },

  async getById(id: string): Promise<CampaignDetail> {
    return apiClient.get<CampaignDetail>(`/b2b/campaigns/${id}`);
  },

  async create(campaign: CreateCampaignRequest, logoImage?: File): Promise<CampaignDetail> {
    const formData = new FormData();
    formData.append('name', campaign.name);
    if (campaign.description) formData.append('description', campaign.description);
    formData.append('type', campaign.type);
    formData.append('startDate', campaign.startDate);
    if (campaign.endDate) formData.append('endDate', campaign.endDate);
    formData.append('redeemableAmount', String(campaign.redeemableAmount));
    formData.append('isFreeShipping', String(campaign.isFreeShipping));
    formData.append('maxCodesPerUser', String(campaign.maxCodesPerUser));
    if (campaign.codeUsageLimit !== null) formData.append('codeUsageLimit', String(campaign.codeUsageLimit));
    formData.append('numberOfCodesToGenerate', String(campaign.numberOfCodesToGenerate));
    if (campaign.tag) formData.append('tag', campaign.tag);
    if (campaign.shopifyCollectionId) formData.append('shopifyCollectionId', campaign.shopifyCollectionId);
    if (campaign.color1) formData.append('color1', campaign.color1);
    if (campaign.color2) formData.append('color2', campaign.color2);
    if (campaign.color3) formData.append('color3', campaign.color3);
    campaign.productIds.forEach((id) => formData.append('productIds', String(id)));
    campaign.defaultAssetItems.forEach((id) => formData.append('defaultAssetItems', String(id)));
    campaign.eligibleAssetItems.forEach((id) => formData.append('eligibleAssetItems', String(id)));
    campaign.unlockableMenuItems.forEach((item) => formData.append('unlockableMenuItems', item));
    if (logoImage) formData.append('LogoImage', logoImage);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
    const token = localStorage.getItem('minikin_auth_token');
    const headers: Record<string, string> = {};
    if (token && token !== 'demo-token') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/b2b/campaigns`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error: { status: number; message: string; data?: unknown } = {
        status: response.status,
        message: response.statusText,
      };
      try { error.data = await response.json(); } catch { /* no body */ }
      throw error;
    }

    return response.json() as Promise<CampaignDetail>;
  },
};

export const catalogService = {
  async getCatalog(): Promise<Catalog> {
    return apiClient.get<Catalog>('/b2b/catalog');
  },
};
