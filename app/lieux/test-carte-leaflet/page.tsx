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
  const [searchQuery, setSearchQuery] = useState(''); // barre de recherche
  const [latestLieux, setLatestLieux] = useState<Pick<Lieu, 'id' | 'title'>[]>([]);
  const [typeCounts, setTypeCounts] = useState<Record<number, number>>({});
  const [totalCount, setTotalCount] = useState<number>(0);

  /* ===============================
     FETCH FUNCTIONS
  =============================== */

  async function fetchCounts() {
    let query = supabase.from('locations').select('type_id');

    if (searchQuery) query = query.ilike('title', `%${searchQuery}%`);

    const { data, error } = await query;

    if (error) {
      console.error(error);
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
    let query = supabase
      .from('locations')
      .select('id,title')
      .order('created_at', { ascending: false })
      .limit(5);

    if (searchQuery) query = query.ilike('title', `%${searchQuery}%`);

    const { data, error } = await query;

    if (!error) setLatestLieux(data || []);
  }

  /* ===============================
     LOAD TYPES
  =============================== */

  useEffect(() => {
    async function fetchTypes() {
      const { data, error } = await supabase
        .from('location_types')
        .select('id,label,slug')
        .order('id', { ascending: true });

      if (!error) setTypes(data ?? []);
    }

    fetchTypes();
  }, []);

  /* ===============================
     INITIAL LOAD
  =============================== */

  useEffect(() => {
    fetchCounts();
    fetchLatest();
  }, [searchQuery]); // 🔹 se recharge à chaque recherche

  /* ===============================
     REALTIME
  =============================== */

  useEffect(() => {
    const channel = supabase
      .channel('locations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'locations' },
        () => {
          fetchCounts();
          fetchLatest();
        }
      )
      .subscribe();

    return () => void supabase.removeChannel(channel);
  }, [searchQuery]);

  /* ===============================
     STYLE BADGES ULTRA COMPACT
  =============================== */

  const badgeStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 10px',
    borderRadius: '999px',
    border: active ? '2px solid #0070f3' : '1px solid #ddd',
    backgroundColor: active ? '#0070f3' : '#fff',
    color: active ? '#fff' : '#333',
    fontSize: '0.75rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#f5f7fa', minHeight: '100vh' }}>
      {/* HEADER */}
      <div
        style={{
          background: '#fff',
          padding: '0.6rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.1rem', textAlign: 'center' }}>
          Lieux de mémoire de la marine
        </h1>

        {/* ACTIONS */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            marginTop: 6,
            paddingBottom: 4,
          }}
        >
          <Link href="/" style={actionBtn('#e9edf3', '#333')}>⬅ Accueil</Link>
          <Link href="/lieux/proposer" style={actionBtn('#0070f3', '#fff')}>➕ Lieu</Link>
          <Link href="/register" style={actionBtn('#28a745', '#fff')}>Compte</Link>
        </div>

        {/* FILTRES */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            marginTop: 6,
            paddingBottom: 4,
          }}
        >
          <button
            onClick={() => setSelectedType('all')}
            style={badgeStyle(selectedType === 'all')}
          >
            Tous {totalCount}
          </button>

          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              style={badgeStyle(selectedType === t.id)}
            >
              {t.label} {typeCounts[t.id] || 0}
            </button>
          ))}
        </div>

        {/* BARRE DE RECHERCHE COMME ADMIN */}
        <input
          type="text"
          placeholder="Rechercher par titre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            marginTop: 6,
            width: '100%',
            padding: '6px 10px',
            fontSize: '0.8rem',
            borderRadius: 8,
            border: '1px solid #ddd',
            outline: 'none',
          }}
        />
      </div>

      {/* CARTE */}
      <div
        style={{
          width: '100%',
          height: 'calc(100vh - 160px)',
          minHeight: 350,
        }}
      >
        <LeafletMapSupabase
          typeFilter={selectedType}
          searchQuery={searchQuery} // passe la recherche à la carte
        />
      </div>

      {/* DERNIERS LIEUX */}
      <div
        style={{
          margin: '0.8rem',
          padding: '0.8rem',
          background: '#fff',
          borderRadius: 10,
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#0070f3' }}>
          Derniers ajouts
        </h3>

        <ul style={{ margin: '0.4rem 0 0', paddingLeft: 16, fontSize: '0.85rem' }}>
          {latestLieux.length === 0 && <li>Aucun lieu</li>}

          {latestLieux.map((lieu) => (
            <li key={lieu.id}>
              <Link href={`/lieux/${lieu.id}`}>
                {lieu.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* BOUTONS HEADER */
function actionBtn(bg: string, color: string): React.CSSProperties {
  return {
    padding: '6px 10px',
    borderRadius: 999,
    background: bg,
    color,
    fontSize: '0.75rem',
    fontWeight: 600,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };
}
