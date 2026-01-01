import dynamic from 'next/dynamic';

const LeafletMapSupabase = dynamic(
  () => import('../../../components/LeafletMapSupabase'),
  { ssr: false }
);

export default function Page() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test Leaflet + Supabase</h1>
      <LeafletMapSupabase />
    </div>
  );
}
