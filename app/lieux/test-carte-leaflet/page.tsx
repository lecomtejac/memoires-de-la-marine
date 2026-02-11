'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const LeafletMapSupabase = dynamic(
  () => import('../../../components/LeafletMapSupabase'),
  { ssr: false }
);

interface Lieu {
  id: number;
  title: string;
}

export default function Page() {
  const [latestLieux, setLatestLieux] = useState<Lieu[]>([]);

  useEffect(() => {
    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, title')
        .order('created_at', { ascending: false })
        .limit(5); // Les 5 derniers lieux
      if (error) console.error(error);
      else setLatestLieux(data || []);
    };
    fetchLatest();
  }, []);

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
              ➕ Proposer un nouveau lieu en me connectant
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
    {/* Carte */}
<div
  style={{
    width: '100%',
    margin: '1.5rem 0',
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
      {/* 🔹 Cadre Derniers lieux ajoutés sous la carte */}
        <div
          style={{
            marginTop: '1.5rem',
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ marginBottom: '0.5rem', color: '#0070f3' }}>📰 Derniers lieux ajoutés</h3>
          <ul style={{ margin: 0, paddingLeft: '1rem' }}>
            {latestLieux.map((lieu) => (
              <li key={lieu.id}>
                <Link
                  href={`/lieux/${lieu.id}`}
                  style={{ color: '#003366', textDecoration: 'underline' }}
                >
                  {lieu.title}
                </Link>
              </li>
            ))}
            {latestLieux.length === 0 && <li>Aucun lieu récent</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
