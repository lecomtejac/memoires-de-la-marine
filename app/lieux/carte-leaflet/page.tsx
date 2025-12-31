'use client';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

export default function CarteLeafletPage() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Carte Leaflet minimal safe Vercel</h1>
      <LeafletMap />
    </div>
  );
}
