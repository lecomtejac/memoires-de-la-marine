'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Lieu } from '../../../components/LeafletMapSupabase';

const LeafletMapSupabase = dynamic(
  () => import('../../../components/LeafletMapSupabase'),
  { ssr: false }
);

// 🔹 Type pour les derniers lieux (id et title seulement)
type LatestLieu = { id: number; title: string };

// 🔹 Type pour les types de lieu
type TypeLieu = { id: number; label: string; slug: string };

export default function Page() {
  const [latestLieux, setLatestLieux] = useState<LatestLieu[]>([]);
  const [types, setTypes] = useState<TypeLieu[]>([]);
  const [selectedType, setSelectedType] = useState<number | 'all'>('all');

  // 🔹 Récupération des derniers lieux
  useEffect(() => {
    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, title')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) console.error(error);
      else setLatestLieux(data || []);
    };
    fetchLatest();
  }, []);

  // 🔹 Récupération des types de lieux
  useEffect(() => {
    const fetchTypes = async () => {
      const { data, error } = await supabase
        .from('location_types')
        .select('id,label,slug');

      if (error) console.error(error);
      else setTypes(data || []);
    };
    fetchTypes();
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
          <h1 style={{ margin: 0, fontSize: '1.6rem', textAlign: 'center' }}>
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
              ➕ Proposer un nouveau lieu
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

          {/* 🔹 Filtre par type */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '0.95rem',
              }}
            >
              <option value="all">Tous les types</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Carte */}
      <div style={{ width: '100%', margin: '1.5rem 0 0 0', height: '80vh', minHeight: '500px' }}>
        <LeafletMapSupabase typeFilter={selectedType} />
      </div>

      {/* Derniers lieux ajoutés */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto 2rem auto',
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
  );
}
