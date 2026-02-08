'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface Location {
  id: number;
  title: string;
  type_id: number;
  latitude: number;
  longitude: number;
  status: string;
  created_at: string;
  created_by: string;
  profiles?: {
    username: string;
  };
}

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

const th: CSSProperties = {
  padding: '8px',
  border: '1px solid #ddd',
  textAlign: 'left',
};

const td: CSSProperties = {
  padding: '8px',
  border: '1px solid #ddd',
};

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [adminChecked, setAdminChecked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');

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

  const fetchLocations = async () => {
    setLoading(true);

    let query = supabase
      .from('locations')
      .select(`
        id,
        title,
        type_id,
        latitude,
        longitude,
        status,
        created_at,
        created_by,
        profiles!locations_created_by_fkey (
          username
        )
      `)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erreur Supabase:', error);
    } else {
      setLocations(data as Location[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (adminChecked) fetchLocations();
  }, [adminChecked, search]);

  if (!adminChecked) return <p>Vérification des droits…</p>;

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto' }}>
      <h1>Admin – Gestion des lieux</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un titre"
      />

      {loading ? (
        <p>Chargement…</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={th}>Titre</th>
              <th style={th}>Type</th>
              <th style={th}>Statut</th>
              <th style={th}>Coordonnées</th>
              <th style={th}>Proposé par</th>
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
                  <strong>{loc.profiles?.username ?? '—'}</strong><br />
                  <small>{new Date(loc.created_at).toLocaleDateString('fr-FR')}</small>
                </td>
                <td style={td}>
                  <Link href={`/admin/locations/${loc.id}`}>✏️ Modifier</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
