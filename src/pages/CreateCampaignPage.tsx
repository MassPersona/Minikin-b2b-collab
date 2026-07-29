import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { storageService } from '../services/storageService';
import { MODULE_OPTIONS, BRANDED_ASSETS } from '../data/mockCampaigns';
import type { Campaign, ModuleId } from '../types';

// Mock products list (id, name, price)
const PRODUCTS = [
  { id: 0, name: 'Original Small', price: 25.0 },
  { id: 1, name: 'Original Medium', price: 35.0 },
  { id: 2, name: 'Original Large', price: 80.0 },
  { id: 3, name: 'Bobblehead Small', price: 35.0 },
  { id: 4, name: 'Bobblehead Medium', price: 45.0 },
  { id: 5, name: 'Bobblehead Large', price: 90.0 },
  { id: 6, name: 'Snow Globe Small', price: 125.0 },
  { id: 7, name: 'Snow Globe Medium', price: 150.0 },
  { id: 8, name: 'Snow Globe Large', price: 200.0 },
  { id: 9, name: 'Original Small (Free)', price: 0.0 },
  { id: 10, name: 'Original Medium (Free)', price: 0.0 },
];

// Note: module options are sourced from `MODULE_OPTIONS` in data/mockCampaigns

function validateHex(hex: string) {
  return /^#?[0-9A-Fa-f]{6}$/.test(hex);
}

export function CreateCampaignPage() {
  const navigate = useNavigate();

  // Modal for campaign type selection
  const [showTypeModal, setShowTypeModal] = useState(true);
  const [campaignType, setCampaignType] = useState<string>('single');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Logo upload
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoFileRef = useRef<File | null>(null);

  // Colors
  const [primaryColor, setPrimaryColor] = useState('#435268');
  const [secondaryColor, setSecondaryColor] = useState('#a78bfa');
  const [accentColor, setAccentColor] = useState('#34d399');

  const [selectedModules, setSelectedModules] = useState<ModuleId[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<Partial<Record<ModuleId, string[]>>>({});
  const [selectedBrandedAssets, setSelectedBrandedAssets] = useState<string[]>([]);

  // (reserved) number of promo codes to generate if needed

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const productsOptions = PRODUCTS;

  const toggleModule = useCallback((id: ModuleId) => {
    setSelectedModules((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const toggleAsset = useCallback((moduleId: ModuleId, assetId: string) => {
    setSelectedAssets((prev) => {
      const list = prev[moduleId] ?? [];
      const next = list.includes(assetId) ? list.filter((x) => x !== assetId) : [...list, assetId];
      return { ...prev, [moduleId]: next };
    });
  }, []);

  const toggleProduct = useCallback((id: number) => {
    setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const toggleBrandedAsset = useCallback((id: string) => {
    setSelectedBrandedAssets((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const handleLogoChange = useCallback((file?: File) => {
    if (!file) return;
    const maxMB = 5;
    if (file.size > maxMB * 1024 * 1024) {
      setErrors((e) => ({ ...e, logo: 'File too large (max 5MB)' }));
      return;
    }
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      setErrors((e) => ({ ...e, logo: 'Unsupported file type' }));
      return;
    }
    logoFileRef.current = file;
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(String(reader.result));
    reader.readAsDataURL(file);
    setErrors((e) => ({ ...e, logo: '' }));
  }, []);

  const removeLogo = useCallback(() => {
    logoFileRef.current = null;
    setLogoPreview(null);
  }, []);

  // palette preview is rendered directly in the JSX using color swatches

  function validate() {
    const out: Record<string, string> = {};
    if (!name.trim()) out.name = 'Campaign name is required';
    if (!description.trim()) out.description = 'Description is required';
    if (!startDate) out.startDate = 'Start date is required';
    if (endDate && startDate && new Date(endDate) < new Date(startDate)) out.endDate = 'End date cannot be before start date';
    if (selectedProducts.length === 0) out.products = 'Select at least one product';
    if (selectedModules.length === 0) out.modules = 'Select at least one module';
    if (!validateHex(primaryColor)) out.primaryColor = 'Invalid hex';
    if (!validateHex(secondaryColor)) out.secondaryColor = 'Invalid hex';
    if (!validateHex(accentColor)) out.accentColor = 'Invalid hex';
    setErrors(out);
    return Object.keys(out).length === 0;
  }

  async function save(status: Campaign['status']) {
    if (submitting) return;
    if (!validate() && status !== 'draft') return;
    setSubmitting(true);

    const campaign: Campaign = {
      id: `camp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      brandName: campaignType,
      description: description.trim(),
      startDate,
      endDate,
      logoPreview,
      primaryColor,
      secondaryColor,
      accentColor,
      selectedModules,
      selectedAssets,
      brandedAssets: selectedBrandedAssets,
      status,
      createdAt: new Date().toISOString(),
    };

    storageService.addCampaign(campaign);
    setSubmitting(false);
    // Simple success feedback — navigate back
    navigate('/campaigns', { replace: true });
  }

  return (
    <AppLayout>
      <div className="page-container">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="section-title">Create Campaign</h2>
            <p className="section-subtitle">Choose a type and fill campaign details</p>
          </div>
        </header>

        {/* Type modal */}
        {showTypeModal && (
          <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.4)' }}>
            <div style={{ width: 920, maxWidth: '95%' }}>
              <Card padding="md">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>Choose Campaign Type</h3>
                <button aria-label="Close type modal" onClick={() => setShowTypeModal(false)} style={{ background: 'transparent' }}>✕</button>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1, border: '1px solid var(--color-border)', padding: 16, borderRadius: 8 }}>
                  <h4>Single User</h4>
                  <p className="text-secondary">One code per user.</p>
                  <Button variant={campaignType === 'single' ? 'primary' : 'ghost'} onClick={() => setCampaignType('single')}>Select</Button>
                </div>
                <div style={{ flex: 1, border: '1px solid var(--color-border)', padding: 16, borderRadius: 8 }}>
                  <h4>Multi User</h4>
                  <p className="text-secondary">Shared code for multiple users.</p>
                  <Button variant={campaignType === 'multi' ? 'primary' : 'ghost'} onClick={() => setCampaignType('multi')}>Select</Button>
                </div>
                <div style={{ flex: 1, border: '1px solid var(--color-border)', padding: 16, borderRadius: 8 }}>
                  <h4>Asset Only</h4>
                  <p className="text-secondary">Unlock assets only.</p>
                  <Button variant={campaignType === 'asset' ? 'primary' : 'ghost'} onClick={() => setCampaignType('asset')}>Select</Button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Button variant="ghost" onClick={() => setShowTypeModal(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => setShowTypeModal(false)}>Create This Type</Button>
              </div>
              </Card>
            </div>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          <section style={{ display: 'grid', gap: 16, marginTop: 16 }}>
            <Card padding="md">
              <div style={{ display: 'grid', gap: 12 }}>
                <label>
                  <div style={{ fontWeight: 600 }}>Campaign name</div>
                  <input value={name} onChange={(e) => setName(e.target.value)} />
                  {errors.name && <div className="text-error">{errors.name}</div>}
                </label>

                <label>
                  <div style={{ fontWeight: 600 }}>Description</div>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                  {errors.description && <div className="text-error">{errors.description}</div>}
                </label>

                <div style={{ display: 'flex', gap: 12 }}>
                  <label style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>Start date</div>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    {errors.startDate && <div className="text-error">{errors.startDate}</div>}
                  </label>
                  <label style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>End date</div>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    {errors.endDate && <div className="text-error">{errors.endDate}</div>}
                  </label>
                </div>

                <div>
                  <div style={{ fontWeight: 600 }}>Products</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginTop: 8 }}>
                    {productsOptions.map((p) => (
                      <label key={p.id} style={{ border: '1px solid var(--color-border)', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="checkbox" checked={selectedProducts.includes(p.id)} onChange={() => toggleProduct(p.id)} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div className="text-secondary">${p.price.toFixed(2)}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.products && <div className="text-error">{errors.products}</div>}
                </div>
              </div>
            </Card>

            <Card padding="md">
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ fontWeight: 600 }}>Brand Logo</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" style={{ width: 96, height: 96, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--color-border)' }} />
                  ) : (
                    <div style={{ width: 96, height: 96, background: 'var(--color-bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>96x96</div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input id="logo-file" type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml" onChange={(e) => handleLogoChange(e.target.files?.[0])} />
                    {logoPreview && <Button variant="ghost" onClick={removeLogo}>Remove</Button>}
                    {errors.logo && <div className="text-error">{errors.logo}</div>}
                    <div className="text-secondary text-sm">PNG, JPG, SVG — max 5MB. (Preview only)</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card padding="md">
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ fontWeight: 600 }}>Brand Colors</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label className="text-sm">Primary</label>
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                    <input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                    {errors.primaryColor && <div className="text-error">{errors.primaryColor}</div>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label className="text-sm">Secondary</label>
                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
                    <input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
                    {errors.secondaryColor && <div className="text-error">{errors.secondaryColor}</div>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label className="text-sm">Accent</label>
                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                    <input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                    {errors.accentColor && <div className="text-error">{errors.accentColor}</div>}
                  </div>

                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <div style={{ width: 40, height: 40, background: primaryColor, borderRadius: 6 }} />
                    <div style={{ width: 40, height: 40, background: secondaryColor, borderRadius: 6 }} />
                    <div style={{ width: 40, height: 40, background: accentColor, borderRadius: 6 }} />
                  </div>
                </div>
              </div>
            </Card>

            <Card padding="md">
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ fontWeight: 600 }}>Bundles</div>
                <div style={{ fontSize: '0.95rem' }} className="text-secondary">Choose bundles and optionally pick specific asset IDs for each selected bundle.</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                  {MODULE_OPTIONS.map((opt) => {
                    const isSelected = selectedModules.includes(opt.id);
                    const chosen = selectedAssets[opt.id] ?? [];
                    return (
                      <div key={opt.id} style={{ border: '1px solid var(--color-border)', padding: 12, borderRadius: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 600 }}>{opt.label}</div>
                            <div className="text-secondary" style={{ fontSize: '0.9rem' }}>{opt.description}</div>
                          </div>
                          <input aria-label={`select bundle ${opt.label}`} type="checkbox" checked={isSelected} onChange={() => toggleModule(opt.id)} />
                        </div>

                                {isSelected && opt.sampleAssets && (
                                  <div style={{ marginTop: 10 }}>
                                    <div style={{ fontWeight: 600, marginBottom: 6 }}>Select asset IDs</div>
                                    <div style={{ display: 'grid', gap: 6 }}>
                                      {opt.sampleAssets.map((asset) => {
                                        const assetId = String(asset.id);
                                        return (
                                          <label key={assetId} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <input type="checkbox" checked={chosen.includes(assetId)} onChange={() => toggleAsset(opt.id, assetId)} />
                                            <span className="text-mono">[{assetId}] {asset.label}</span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                      </div>
                    );
                  })}
                </div>
                {errors.modules && <div className="text-error">{errors.modules}</div>}
              </div>
            </Card>

              <Card padding="md">
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ fontWeight: 600 }}>Branded Assets</div>
                  <div className="text-secondary">Pick branded assets to include in the campaign (multi-select)</div>
                  <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                    {BRANDED_ASSETS.map((a) => (
                      <label key={String(a.id)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="checkbox" checked={selectedBrandedAssets.includes(String(a.id))} onChange={() => toggleBrandedAsset(String(a.id))} />
                        <span className="text-mono">[{a.id}]</span>
                        <span>{a.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </Card>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
              <Button variant="ghost" onClick={() => navigate('/campaigns')}>Cancel</Button>
              <Button variant="secondary" onClick={() => save('draft')}>Save as Draft</Button>
              <Button variant="primary" onClick={() => save('pending-review')}>Submit Campaign</Button>
            </div>
          </section>
        </form>
      </div>
    </AppLayout>
  );
}
