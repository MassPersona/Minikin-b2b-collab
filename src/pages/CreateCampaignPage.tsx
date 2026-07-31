import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { campaignService, catalogService } from '../services/campaignService';
import { useToast } from '../context/ToastContext';
import type { CampaignType, CatalogProduct, CatalogAsset, CreateCampaignRequest } from '../types';
import { BUNDLE_MENU_ITEMS } from '../types';

function validateHex(hex: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

export function CreateCampaignPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Catalog data from API
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [assets, setAssets] = useState<CatalogAsset[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    catalogService.getCatalog()
      .then((data) => { setProducts(data.products); setAssets(data.assets); })
      .catch((err) => addToast('error', err?.data?.message || 'Failed to load catalog'))
      .finally(() => setCatalogLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Campaign type modal
  const [showTypeModal, setShowTypeModal] = useState(true);
  const [campaignType, setCampaignType] = useState<CampaignType>('ProductFlowSingleUser');

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  // Only for ProductFlowMultiUser
  const [codeUsageLimit, setCodeUsageLimit] = useState<string>('');
  // Only for ProductFlowSingleUser
  const [numberOfCodesToGenerate, setNumberOfCodesToGenerate] = useState(1);

  // Selections
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedDefaultAssets, setSelectedDefaultAssets] = useState<number[]>([]);
  const [selectedBundles, setSelectedBundles] = useState<string[]>([]);
  const [assetFilter, setAssetFilter] = useState('');

  const filteredAssets = assets.filter((a) =>
    a.name.toLowerCase().includes(assetFilter.toLowerCase()) || String(a.id).includes(assetFilter)
  );

  // Colors
  const [color1, setColor1] = useState('#435268');
  const [color2, setColor2] = useState('#a78bfa');
  const [color3, setColor3] = useState('#34d399');

  // Logo file upload
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const toggleProduct = useCallback((id: number) => {
    setSelectedProducts((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);

  const toggleDefaultAsset = useCallback((id: number) => {
    setSelectedDefaultAssets((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);

  const toggleBundle = useCallback((item: string) => {
    setSelectedBundles((prev) => prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]);
  }, []);

  function validate() {
    const out: Record<string, string> = {};
    if (!name.trim()) out.name = 'Campaign name is required';
    if (!startDate) out.startDate = 'Start date is required';
    if (endDate && startDate && new Date(endDate) < new Date(startDate)) out.endDate = 'End date cannot be before start';
    if (color1 && !validateHex(color1)) out.color1 = 'Invalid hex color';
    if (color2 && !validateHex(color2)) out.color2 = 'Invalid hex color';
    if (color3 && !validateHex(color3)) out.color3 = 'Invalid hex color';
    if (campaignType === 'ProductFlowSingleUser' && numberOfCodesToGenerate < 1) out.codes = 'Must generate at least 1 code';
    if (campaignType === 'ProductFlowMultiUser' && codeUsageLimit) {
      const limit = parseInt(codeUsageLimit, 10);
      if (isNaN(limit) || limit < 1 || limit > 1000000) out.codeUsageLimit = 'Must be between 1 and 1,000,000';
    }
    setErrors(out);
    return Object.keys(out).length === 0;
  }

  async function handleSubmit() {
    if (submitting) return;
    if (!validate()) return;
    setSubmitting(true);

    const payload: CreateCampaignRequest = {
      name: name.trim(),
      description: description.trim() || null,
      type: campaignType,
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : null,
      redeemableAmount: 0,
      productIds: selectedProducts,
      shopifyCollectionId: 'gid://shopify/Collection/304721526877',
      tag: null,
      isFreeShipping,
      maxCodesPerUser: 1,
      codeUsageLimit: campaignType === 'ProductFlowMultiUser' && codeUsageLimit ? parseInt(codeUsageLimit, 10) : null,
      numberOfCodesToGenerate: campaignType === 'ProductFlowSingleUser' ? numberOfCodesToGenerate : 1,
      defaultAssetItems: selectedDefaultAssets,
      eligibleAssetItems: [],
      unlockableMenuItems: selectedBundles,
      logoURL: null,
      color1: color1 || null,
      color2: color2 || null,
      color3: color3 || null,
    };

    try {
      await campaignService.create(payload, logoFile ?? undefined);
      addToast('success', 'Campaign created successfully!');
      navigate('/campaigns', { replace: true });
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      addToast('error', e?.data?.message || 'Failed to create campaign');
    } finally {
      setSubmitting(false);
    }
  }

  const typeOptions: { value: CampaignType; label: string; desc: string }[] = [
    { value: 'ProductFlowSingleUser', label: 'Single User', desc: 'One unique code per user. Codes are generated upfront.' },
    { value: 'ProductFlowMultiUser', label: 'Multi User', desc: 'Shared code that multiple users can redeem.' },
    { value: 'AssetOnly', label: 'Asset Only', desc: 'Unlock digital assets only.' },
  ];

  return (
    <div className="page-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/campaigns')}>← Back</Button>
          <h2 className="section-title" style={{ marginTop: 8 }}>Create Campaign</h2>
          <p className="section-subtitle">Fill in the details below to launch a new campaign</p>
        </div>
      </header>

      {/* Type selection modal */}
      {showTypeModal && (
        <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
          <div style={{ width: 680, maxWidth: '95%' }}>
            <Card padding="md">
              <h3 style={{ margin: '0 0 16px' }}>Select Campaign Type</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                {typeOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setCampaignType(opt.value)}
                    style={{
                      border: campaignType === opt.value ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      padding: 16, borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                      background: campaignType === opt.value ? 'rgba(42,171,225,0.04)' : 'transparent',
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>{opt.label}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Button variant="ghost" onClick={() => { setShowTypeModal(false); navigate('/campaigns'); }}>Cancel</Button>
                <Button variant="primary" onClick={() => setShowTypeModal(false)}>Continue</Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {catalogLoading ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading catalog...</div>
      ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: 'grid', gap: 20 }}>

            {/* Basic Info */}
            <Card padding="md">
              <h4 style={{ marginTop: 0, marginBottom: 16 }}>Basic Information</h4>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: 4 }}>Campaign Name *</label>
                  <input style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                    value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Summer 2026 Promo" maxLength={255} />
                  {errors.name && <div className="text-error" style={{ fontSize: '0.8rem', marginTop: 4 }}>{errors.name}</div>}
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: 4 }}>Description</label>
                  <textarea style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', minHeight: 80, resize: 'vertical' }}
                    value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief campaign description..." maxLength={2000} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: 4 }}>Start Date *</label>
                    <input type="date" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                      value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    {errors.startDate && <div className="text-error" style={{ fontSize: '0.8rem', marginTop: 4 }}>{errors.startDate}</div>}
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: 4 }}>End Date</label>
                    <input type="date" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                      value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    {errors.endDate && <div className="text-error" style={{ fontSize: '0.8rem', marginTop: 4 }}>{errors.endDate}</div>}
                  </div>
                </div>
              </div>
            </Card>

            {/* Codes & Shipping */}
            <Card padding="md">
              <h4 style={{ marginTop: 0, marginBottom: 16 }}>Codes & Shipping</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {campaignType === 'ProductFlowSingleUser' && (
                  <div>
                    <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: 4 }}>Number of Codes to Generate *</label>
                    <input type="number" min={1} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                      value={numberOfCodesToGenerate} onChange={(e) => setNumberOfCodesToGenerate(parseInt(e.target.value) || 1)} />
                    {errors.codes && <div className="text-error" style={{ fontSize: '0.8rem', marginTop: 4 }}>{errors.codes}</div>}
                  </div>
                )}
                {campaignType === 'ProductFlowMultiUser' && (
                  <div>
                    <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: 4 }}>Code Usage Limit *</label>
                    <input type="number" min={1} max={1000000} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                      value={codeUsageLimit} onChange={(e) => setCodeUsageLimit(e.target.value)} placeholder="1 – 1,000,000" />
                    {errors.codeUsageLimit && <div className="text-error" style={{ fontSize: '0.8rem', marginTop: 4 }}>{errors.codeUsageLimit}</div>}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: campaignType === 'AssetOnly' ? 0 : 24 }}>
                  <input type="checkbox" id="freeShipping" checked={isFreeShipping} onChange={(e) => setIsFreeShipping(e.target.checked)} />
                  <label htmlFor="freeShipping" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Free Shipping</label>
                </div>
              </div>
            </Card>

            {/* Products */}
            <Card padding="md">
              <h4 style={{ marginTop: 0, marginBottom: 12 }}>Products</h4>
              <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: 12 }}>Select products to include in this campaign</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                {products.map((p) => (
                  <label key={p.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    border: selectedProducts.includes(p.id) ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: 8, cursor: 'pointer', transition: 'border 0.15s',
                  }}>
                    <input type="checkbox" checked={selectedProducts.includes(p.id)} onChange={() => toggleProduct(p.id)} />
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{p.currency} {p.price.toFixed(2)}</div>
                    </div>
                  </label>
                ))}
              </div>
            </Card>

            {/* Bundles */}
            <Card padding="md">
              <h4 style={{ marginTop: 0, marginBottom: 12 }}>Bundles (Unlockable Menu Items)</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {BUNDLE_MENU_ITEMS.map((item) => (
                  <label key={item} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                    border: selectedBundles.includes(item) ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500,
                    background: selectedBundles.includes(item) ? 'rgba(42,171,225,0.06)' : 'transparent',
                  }}>
                    <input type="checkbox" checked={selectedBundles.includes(item)} onChange={() => toggleBundle(item)} style={{ display: 'none' }} />
                    {item}
                  </label>
                ))}
              </div>
            </Card>

            {/* Assets */}
            <Card padding="md">
              <h4 style={{ marginTop: 0, marginBottom: 12 }}>Default Assets</h4>
              <p className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: 12 }}>Select default assets to include in this campaign</p>
              <input
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginBottom: 12 }}
                placeholder="Search assets..."
                onChange={(e) => setAssetFilter(e.target.value)}
              />
              <div style={{ maxHeight: 360, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                {filteredAssets.map((a) => {
                  const selected = selectedDefaultAssets.includes(a.id);
                  return (
                    <label key={a.id} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: 10,
                      border: selected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      borderRadius: 8, cursor: 'pointer', transition: 'border 0.15s',
                      background: selected ? 'rgba(42,171,225,0.04)' : 'transparent',
                    }}>
                      <input type="checkbox" checked={selected} onChange={() => toggleDefaultAsset(a.id)} style={{ display: 'none' }} />
                      {a.iconUrl ? (
                        <img src={a.iconUrl} alt={a.name} style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 6 }} />
                      ) : (
                        <div style={{ width: 48, height: 48, background: 'var(--color-bg)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--color-text-secondary)' }}>No img</div>
                      )}
                      <span style={{ fontSize: '0.8rem', fontWeight: 500, textAlign: 'center', lineHeight: 1.2 }}>{a.name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>#{a.id}</span>
                    </label>
                  );
                })}
                {filteredAssets.length === 0 && <div className="text-secondary" style={{ gridColumn: '1 / -1', padding: 12 }}>No assets match your search</div>}
              </div>
            </Card>

            {/* Branding */}
            <Card padding="md">
              <h4 style={{ marginTop: 0, marginBottom: 16 }}>Branding</h4>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: 4 }}>Campaign Logo (512×512, max 5MB)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--color-border)' }} />
                  ) : (
                    <div style={{ width: 80, height: 80, background: 'var(--color-bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '0.75rem', border: '1px dashed var(--color-border)' }}>512×512</div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLogoError('');
                      if (file.size > 5 * 1024 * 1024) { setLogoError('File must be less than 5MB'); return; }
                      const img = new Image();
                      img.onload = () => {
                        // Resize to 512×512 using canvas
                        const canvas = document.createElement('canvas');
                        canvas.width = 512;
                        canvas.height = 512;
                        const ctx = canvas.getContext('2d')!;
                        // Fill white background
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, 512, 512);
                        // Calculate fit (maintain aspect ratio, center)
                        const scale = Math.min(512 / img.width, 512 / img.height);
                        const w = img.width * scale;
                        const h = img.height * scale;
                        const x = (512 - w) / 2;
                        const y = (512 - h) / 2;
                        ctx.drawImage(img, x, y, w, h);
                        URL.revokeObjectURL(img.src);
                        canvas.toBlob((blob) => {
                          if (!blob) { setLogoError('Failed to process image'); return; }
                          const resizedFile = new File([blob], file.name, { type: 'image/png' });
                          setLogoFile(resizedFile);
                          setLogoPreview(URL.createObjectURL(resizedFile));
                        }, 'image/png');
                      };
                      img.onerror = () => setLogoError('Invalid image file');
                      img.src = URL.createObjectURL(file);
                    }} />
                    {logoFile && <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null); }} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left' }}>Remove</button>}
                    {logoError && <div className="text-error" style={{ fontSize: '0.8rem' }}>{logoError}</div>}
                    <div className="text-secondary" style={{ fontSize: '0.8rem' }}>PNG or JPG, max 5MB. For best results, upload a 512×512px image.</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: 4 }}>Color 1</label>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} style={{ width: 36, height: 36, border: 'none', cursor: 'pointer' }} />
                    <input value={color1} onChange={(e) => setColor1(e.target.value)} style={{ width: 90, padding: '6px 8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '0.8rem' }} />
                  </div>
                  {errors.color1 && <div className="text-error" style={{ fontSize: '0.75rem' }}>{errors.color1}</div>}
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: 4 }}>Color 2</label>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} style={{ width: 36, height: 36, border: 'none', cursor: 'pointer' }} />
                    <input value={color2} onChange={(e) => setColor2(e.target.value)} style={{ width: 90, padding: '6px 8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '0.8rem' }} />
                  </div>
                  {errors.color2 && <div className="text-error" style={{ fontSize: '0.75rem' }}>{errors.color2}</div>}
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: 4 }}>Color 3</label>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input type="color" value={color3} onChange={(e) => setColor3(e.target.value)} style={{ width: 36, height: 36, border: 'none', cursor: 'pointer' }} />
                    <input value={color3} onChange={(e) => setColor3(e.target.value)} style={{ width: 90, padding: '6px 8px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '0.8rem' }} />
                  </div>
                  {errors.color3 && <div className="text-error" style={{ fontSize: '0.75rem' }}>{errors.color3}</div>}
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  <div style={{ width: 36, height: 36, background: color1, borderRadius: 6, border: '1px solid var(--color-border)' }} />
                  <div style={{ width: 36, height: 36, background: color2, borderRadius: 6, border: '1px solid var(--color-border)' }} />
                  <div style={{ width: 36, height: 36, background: color3, borderRadius: 6, border: '1px solid var(--color-border)' }} />
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '8px 0 24px' }}>
              <Button variant="ghost" onClick={() => navigate('/campaigns')}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Campaign'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
