import dynamic from 'next/dynamic';

// Charge Leaflet seulement côté client
const LeafletMap = dynamic(() => import('../../../components/LeafletMap'), {
  ssr: false,
});

export default function Page() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test carte Leaflet</h1>
      <LeafletMap />
    </div>
  );
}
