'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('../../../components/LeafletMap'), {
  ssr: false, // important pour Next.js App Router
});

export default function Page() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test carte Leaflet</h1>
      <LeafletMap />
    </div>
  );
}
