import { useParams } from 'react-router-dom';

export function CampaignDetailsPage() {
  const { campaignId } = useParams();

  return (
    <main style={{padding: 24}}>
      <h2>Campaign Details</h2>
      <p>Details for campaign: {campaignId}</p>
    </main>
  );
}
