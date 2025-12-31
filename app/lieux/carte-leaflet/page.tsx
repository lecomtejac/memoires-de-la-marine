'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Import dynamique du composant Map pour éviter le SSR
const MapComponent = dynamic(() => import('../components/Map'), { ssr: false });

export default function CarteLeafletPage() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Carte Leaflet des lieux de mémoire</h1>
      <button
        onClick={() => setShowMap(true)}
        style={{ padding: '10px 20px', marginBottom: '20px', cursor: 'pointer' }}
      >
        Afficher la carte
      </button>

      {showMap && (
        <div style={{ height: '500px', width: '100%' }}>
          <MapComponent />
        </div>
      )}
    </div>
  );
}
