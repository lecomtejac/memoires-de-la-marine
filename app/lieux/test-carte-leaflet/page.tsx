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

export default function Page() {
  const [types, setTypes] = useState<{ id: number; label: string; slug: string }[]>([]);
  const [selectedType, setSelectedType] = useState<number | 'all'>('all');
  const [latestLieux, setLatestLieux] = useState<Pick<Lieu, 'id' | 'title'>[]>([]);

  const [typeCounts, setTypeCounts] = useState<Record<number, number>>({});
  const [totalCount, setTotalCount] = useState<number>(0);

  /* ===============================
     FETCH FUNCTIONS (réutilisables)
  =============================== */

  async function fetchCounts() {
    const { data, error } = await supabase
      .from('locations')
      .select('type_id');

    if (error) {
      console.error('Erreur counts:', error);
      return;
    }

    const counts: Record<number, number> = {};
    let total = 0;

    data?.forEach((row) => {
      if (!row.type_id) return;
      counts[row.type_id] = (counts[row.type_id] || 0) + 1;
      total++;
    });

    setTypeCounts(counts);
    setTotalCount(total);
  }

  async function fetchLatest() {
    const { data, error } = await supabase
      .from('locations')
      .select('id, title')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) console.error(error);
    else setLatestLieux(data || []);
  }

  /* ===============================
     TYPES
  =============================== */

  useEffect(() => {
    async function fetchTypes() {
      const { data, error } = await supabase
        .from('location_types')
        .select('id,label,slug')
        .order('id', { ascending: true });

      if (error) console.error('Erreur types:', error);
      else setTypes(data ?? []);
    }

    fetchTypes();
  }, []);

  /* ===============================
     LOAD INITIAL DATA
  =============================== */

  useEffect(() => {
    fetchCounts();
    fetchLatest();
  }, []);

  /* ===============================
     REALTIME AUTO UPDATE
  =============================== */

  useEffect(() => {
    const channel = supabase
      .channel('locations-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'locations',
        },
        () => {
          console.log('🔄 Changement détecté → refresh');

          fetchCounts();
          fetchLatest();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* En-tête */}
      <div
        style={{
          backgroundColor: '#fff',
          padding: '1rem 1.5rem',
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
          <h1 style={{ margin: 0, fontSize: '1.5rem', textAlign: 'center' }}>
            Carte des lieux de mémoire
          </h1>

          {/* Boutons */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Link href="/" style={{ padding: '0.6rem 1rem', backgroundColor: '#e9edf3', color: '#333', borderRadius: '999px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              ⬅ Retour accueil
            </Link>

            <Link href="/lieux/proposer" style={{ padding: '0.6rem 1rem', backgroundColor: '#0070f3', color: '#fff', borderRadius: '999px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              ➕ Proposer un nouveau lieu
            </Link>

            <Link href="/register" style={{ padding: '0.6rem 1rem', backgroundColor: '#28a745', color: '#fff', borderRadius: '999px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              📝 Créer un compte
            </Link>
          </div>

          {/* Filtre type avec compte */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              style={{
                padding: '0.5rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '0.9rem',
                minWidth: '180px',
              }}
            >
              <option value="all">Tous les types ({totalCount})</option>

              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label} ({typeCounts[t.id] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Carte */}
      <div style={{ width: '100%', margin: '1.5rem 0 0 0', height: '75vh', minHeight: '400px' }}>
        <LeafletMapSupabase typeFilter={selectedType} />
      </div>

      {/* Derniers lieux */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '2rem auto',
          padding: '1rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ marginBottom: '0.5rem', color: '#0070f3' }}>
          📰 Derniers lieux ajoutés
        </h3>

        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
          {latestLieux.length === 0 && <li>Aucun lieu récent</li>}

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
        </ul>
      </div>
    </div>
  );
}
