'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const LeafletMapSupabase = dynamic(
  () => import('../../../components/LeafletMapSupabase'),
  { ssr: false }
);

export default function Page() {
  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        backgroundColor: '#f5f7fa',
        minHeight: '100vh',
      }}
    >
      {/* En-tête */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '1.6rem',
              textAlign: 'center',
            }}
          >
            Carte des lieux de mémoire
          </h1>

          {/* Boutons */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Link
              href="/"
              style={{
                padding: '0.7rem 1.4rem',
                backgroundColor: '#e9edf3',
                color: '#333',
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                whiteSpace: 'nowrap',
              }}
            >
              ⬅ Retour accueil
            </Link>

            <Link
              href="/lieux/proposer"
              style={{
                padding: '0.7rem 1.4rem',
                backgroundColor: '#0070f3',
                color: '#fff',
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                whiteSpace: 'nowrap',
              }}
            >
              ➕ Proposer un nouveau lieu de mémoire en me connectant
            </Link>

            <Link
              href="/register"
              style={{
                padding: '0.7rem 1.4rem',
                backgroundColor: '#28a745',
                color: '#fff',
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                whiteSpace: 'nowrap',
              }}
            >
              📝 Créer un compte
            </Link>
          </div>
        </div>
      </div>

      {/* Carte */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '1.5rem auto',
          padding: '0 1rem',
        }}
      >
        <div
          style={{
            height: '75vh',
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            backgroundColor: '#fff',
          }}
        >
          <LeafletMapSupabase />
        </div>
      </div>
    </div>
  );
}
