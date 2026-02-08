'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

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

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [adminChecked, setAdminChecked] = useState(false);

  const router = useRouter();

  // 🔐 Vérification admin
useEffect(() => {
  const checkAdmin = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) {
      router.push('/login');
      return;
    }

    // ⚡ Récupération correcte du profil
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)  // user.id est bien l'UUID
      .single();

    if (!profile || profile.role !== 'admin') {
      router.push('/');
      return;
    }

    setAdminChecked(true);
  };

  checkAdmin();
}, [router]);

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        return router.push('/');
      }

      setAdminChecked(true);
    };

    checkAdmin();
  }, [router]);

  // 📥 Fetch lieux + profils
  useEffect(() => {
    if (!adminChecked) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: locationsData } = await supabase
        .from('locations')
        .select('*')
        .ilike('title', `%${search}%`)
        .order('created_at', { ascending: false });

      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, username, email');

      const map: Record<string, string> = {};
      usersData?.forEach((u) => {
        map[u.id] = u.username || u.email || 'Utilisateur';
      });

      setUserMap(map);
      setLocations(locationsData || []);
      setLoading(false);
    };

    fetchData();
  }, [adminChecked, search]);

  // 🗑️ Suppression
  const handleDelete = async (id: number) => {
    if (!confirm('Confirmer la suppression ?')) return;

    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) setMessage('Erreur lors de la suppression');
    else setMessage('Lieu supprimé');
  };

  if (!adminChecked) return <p>Vérification des droits…</p>;

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto' }}>
      <h1>Admin – Gestion des lieux</h1>

      <input
        type="text"
        placeholder="Recherche par titre"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem' }}
      />

      {loading ? (
        <p>Chargement…</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Coordonnées</th>
              <th>Créé par</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc.id}>
                <td>{loc.title}</td>
                <td>{getTypeLabel(loc.type_id)}</td>
                <td>{loc.status}</td>
                <td>{loc.latitude}, {loc.longitude}</td>
                <td>
                  {loc.created_by
                    ? userMap[loc.created_by] || 'Utilisateur inconnu'
                    : '—'}
                </td>
                <td>{new Date(loc.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <Link href={`/admin/locations/${loc.id}`}>✏️</Link>{' '}
                  <button onClick={() => handleDelete(loc.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
