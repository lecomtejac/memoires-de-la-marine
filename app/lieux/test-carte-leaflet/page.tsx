'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const LeafletMapSupabase = dynamic(
  () => import('../../../components/LeafletMapSupabase'),
  { ssr: false }
);

export default function Page() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      
      {/* En-tête avec boutons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <h1 style={{ margin: 0 }}>Carte des lieux de mémoire</h1>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#0070f3',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              whiteSpace: 'nowrap',
            }}
          >
            ⬅ Retour accueil
          </Link>

          <Link
            href="/lieux/proposer"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ff6600',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              whiteSpace: 'nowrap',
            }}
          >
            ➕ Proposer un nouveau lieu de mémoire en me connectant
          </Link>
        </div>
      </div>

      {/* Carte Leaflet */}
      <div
        style={{
          height: '70vh',
          width: '100%',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <LeafletMapSupabase />
      </div>
    </div>
  );
}
