import dynamic from 'next/dynamic';

const LeafletMapSupabase = dynamic(
  () => import('../../../components/LeafletMapSupabase'),
  { ssr: false } // Important pour que Leaflet et useEffect fonctionnent côté client
);

export default function Page() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test Carte Leaflet + Supabase</h1>
      <LeafletMapSupabase />
    </div>
  );
}
