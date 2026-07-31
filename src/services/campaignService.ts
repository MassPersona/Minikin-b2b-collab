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

  async update(id: string, campaign: Partial<CreateCampaignRequest>, logoImage?: File): Promise<CampaignDetail> {
    const formData = new FormData();
    if (campaign.name !== undefined) formData.append('name', campaign.name);
    if (campaign.description !== undefined && campaign.description !== null) formData.append('description', campaign.description);
    if (campaign.startDate !== undefined) formData.append('startDate', campaign.startDate);
    if (campaign.endDate !== undefined && campaign.endDate !== null) formData.append('endDate', campaign.endDate);
    if (campaign.redeemableAmount !== undefined) formData.append('redeemableAmount', String(campaign.redeemableAmount));
    if (campaign.isFreeShipping !== undefined) formData.append('isFreeShipping', String(campaign.isFreeShipping));
    if (campaign.maxCodesPerUser !== undefined) formData.append('maxCodesPerUser', String(campaign.maxCodesPerUser));
    if (campaign.codeUsageLimit !== undefined && campaign.codeUsageLimit !== null) formData.append('codeUsageLimit', String(campaign.codeUsageLimit));
    if (campaign.numberOfCodesToGenerate !== undefined) formData.append('numberOfCodesToGenerate', String(campaign.numberOfCodesToGenerate));
    if (campaign.tag !== undefined && campaign.tag !== null) formData.append('tag', campaign.tag);
    if (campaign.shopifyCollectionId !== undefined && campaign.shopifyCollectionId !== null) formData.append('shopifyCollectionId', campaign.shopifyCollectionId);
    if (campaign.color1 !== undefined && campaign.color1 !== null) formData.append('color1', campaign.color1);
    if (campaign.color2 !== undefined && campaign.color2 !== null) formData.append('color2', campaign.color2);
    if (campaign.color3 !== undefined && campaign.color3 !== null) formData.append('color3', campaign.color3);
    if (campaign.productIds) campaign.productIds.forEach((pid) => formData.append('productIds', String(pid)));
    if (campaign.defaultAssetItems) campaign.defaultAssetItems.forEach((aid) => formData.append('defaultAssetItems', String(aid)));
    if (campaign.eligibleAssetItems) campaign.eligibleAssetItems.forEach((aid) => formData.append('eligibleAssetItems', String(aid)));
    if (campaign.unlockableMenuItems) campaign.unlockableMenuItems.forEach((item) => formData.append('unlockableMenuItems', item));
    if (logoImage) formData.append('LogoImage', logoImage);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
    const token = localStorage.getItem('minikin_auth_token');
    const headers: Record<string, string> = {};
    if (token && token !== 'demo-token') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/b2b/campaigns/${id}`, {
      method: 'PUT',
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

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/b2b/campaigns/${id}`);
  },
};

export const catalogService = {
  async getCatalog(): Promise<Catalog> {
    return apiClient.get<Catalog>('/b2b/catalog');
  },
};
