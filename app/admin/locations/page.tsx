'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

// ------------------------
// Typage d'un lieu
// ------------------------
interface Location {
  id: number;
  title: string;
  type_id: number;
  description: string | null;
  latitude: number;
  longitude: number;
  status: string;
  created_at: string;
  created_by: string | null;
  profiles?: {
    username: string | null;
  };
}

// ------------------------
// Libellé des types
// ------------------------
function getTypeLabel(typeId: number) {
  const types: Record<number, string> = {
    7: 'Tombe',
    8: 'Monument',
    9: 'Plaque commémorative',
    10: 'Mémorial',
    11: 'Lieu de bataille',
    12: 'Lieu de débarquement',
    13: 'Naufrage',
    14: 'Épave',
    15: 'Musée',
    16: 'Trace de passage',
    17: 'Base',
    18: 'Port',
    19: 'Autre lieu remarquable',
  };
  return types[typeId] || 'Inconnu';
}

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [adminChecked, setAdminChecked] = useState(false);

  const router = useRouter();

  // ------------------------
  // Vérification admin
  // ------------------------
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || profile?.role !== 'admin') {
        router.push('/');
        return;
      }

      setAdminChecked(true);
    };

    checkAdmin();
  }, [router]);

  // ------------------------
  // Fetch des lieux
  // ------------------------
  const fetchLocations = async () => {
    setLoading(true);

    let query = supabase
      .from('locations')
      .select(`
        *,
        profiles:profiles!locations_created_by_fkey (
          username
        )
      `)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur fetch locations:', error);
    } else {
      setLocations(data as Location[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (adminChecked) fetchLocations();
  }, [search, adminChecked]);

  // ------------------------
  // Supprimer un lieu
  // ------------------------
  const handleDelete = async (id: number) => {
    if (!confirm('Confirmer la suppression de ce lieu ?')) return;

    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Erreur lors de la suppression');
    } else {
      setMessage('Lieu supprimé');
      fetchLocations();
    }
  };

  if (!adminChecked) return <p>Vérification des droits…</p>;

  // ------------------------
  // Render
  // ------------------------
  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Admin – Gestion des lieux
      </h1>

      {/* Recherche */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Rechercher par titre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '0.5rem',
            width: '300px',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={fetchLocations}
          style={{
            marginLeft: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Rechercher
        </button>
      </div>

      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={th}>Titre</th>
              <th style={th}>Type</th>
              <th style={th}>Statut</th>
              <th style={th}>Proposé par</th>
              <th style={th}>Coordonnées</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc.id}>
                <td style={td}>{loc.title}</td>
                <td style={td}>{getTypeLabel(loc.type_id)}</td>
                <td style={td}>{loc.status}</td>
                <td style={td}>
                  <strong>{loc.profiles?.username ?? '—'}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    {new Date(loc.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </td>
                <td style={td}>
                  {loc.latitude}, {loc.longitude}
                </td>
                <td style={td}>
                  <Link
                    href={`/admin/locations/${loc.id}`}
                    style={{ marginRight: '0.5rem', color: '#1e88e5' }}
                  >
                    ✏️ Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(loc.id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Styles simples
const th = { padding: '8px', border: '1px solid #ddd', textAlign: 'left' };
const td = { padding: '8px', border: '1px solid #ddd' };
