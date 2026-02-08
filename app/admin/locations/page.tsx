'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

// Typage d'un lieu
interface Location {
  id: number;
  title: string;
  type_id: number;
  description: string | null;
  latitude: number;
  longitude: number;
  status: string;
  created_at: string;
  created_by: string;
}

// Fonction pour obtenir un nom lisible du type
function getTypeLabel(typeId: number) {
  const types: { [key: number]: string } = {
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
  const [userMap, setUserMap] = useState<Record<string, string>>({});

  // ------------------------
  // Vérification admin
  // ------------------------
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        router.push('/');
        return;
      }

      setAdminChecked(true);
    };

    checkAdmin();
  }, [router]);

  // ------------------------
  // Fetch lieux et utilisateurs
  // ------------------------
  const fetchData = async () => {
    setLoading(true);

    // 🔹 Fetch lieux
    let query = supabase
      .from('locations')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data: locationsData, error: locError } = await query;
    if (locError) console.error('Erreur fetch locations:', locError);
    else setLocations(locationsData as Location[]);

    // 🔹 Fetch users
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('id, username, email');

    if (usersError) {
      console.error('Erreur fetch users:', usersError);
    } else {
      const map: Record<string, string> = {};
      usersData.forEach((u) => {
        map[u.id] = u.username || u.email || u.id;
      });
      setUserMap(map);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (adminChecked) fetchData();
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
      fetchData();
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
          style={{ padding: '0.5rem', width: '300px' }}
        />
      </div>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={th}>Titre</th>
              <th style={th}>Type</th>
              <th style={th}>Statut</th>
              <th style={th}>Coordonnées</th>
              <th style={th}>Créé par</th>
              <th style={th}>Date</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc.id}>
                <td style={td}>{loc.title}</td>
                <td style={td}>{getTypeLabel(loc.type_id)}</td>
                <td style={td}>{loc.status}</td>
                <td style={td}>{loc.latitude}, {loc.longitude}</td>
                <td style={td}>
                  {userMap[String(loc.created_by)] || '—'}
                </td>
                <td style={td}>
                  {new Date(loc.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td style={td}>
                  <Link href={`/admin/locations/${loc.id}`}>✏️ Modifier</Link>{' '}
                  <button onClick={() => handleDelete(loc.id)}>🗑️</button>
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
const th = { padding: '8px', border: '1px solid #ddd', textAlign: 'left' as const };
const td = { padding: '8px', border: '1px solid #ddd' };
