'use client';

import { CSSProperties } from 'react';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';

// On charge le composant de carte seulement côté client
const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

export default function CarteLeafletPage() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Carte Leaflet minimal safe Vercel</h1>
      <LeafletMap />
    </div>
  );
}
