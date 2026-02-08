'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';

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
  const [adminChecked, setAdminChecked] = useState(false);

  const router = useRouter();

  // Vérification admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

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

  // Fetch lieux + utilisateurs
  useEffect(() => {
    if (!adminChecked) return;

    const fetchData = async () => {
      setLoading(true);

      const { data: locationsData } = await supabase
        .from('locations')
        .select('*')
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
  }, [adminChecked]);

  if (!adminChecked) return <p>Vérification des droits…</p>;

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', fontFamily: 'Arial, sans-serif', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>
        Admin – Gestion des lieux
      </h1>

      {loading ? (
        <p>Chargement…</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: '#1f78d1', color: '#fff', textAlign: 'left' }}>
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
                <tr key={loc.id} style={{ borderBottom: '1px solid #ddd', transition: 'background 0.2s', cursor: 'default' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                  <td style={td}>{loc.title}</td>
                  <td style={td}>{getTypeLabel(loc.type_id)}</td>
                  <td style={td}>{loc.status}</td>
                  <td style={td}>{loc.latitude}, {loc.longitude}</td>
                  <td style={td}>{loc.created_by ? userMap[loc.created_by] || 'Utilisateur inconnu' : '—'}</td>
                  <td style={td}>{new Date(loc.created_at).toLocaleDateString('fr-FR')}</td>
                  <td style={td}>
  <Link 
    href={`/admin/locations/${loc.id}`} 
    style={{ marginRight: '0.5rem', color: '#1f78d1', fontWeight: 'bold', textDecoration: 'none' }}
  >
    ✏️ Modifier
  </Link>
  <button 
    onClick={() => handleDelete(loc.id)} 
    style={{
      backgroundColor: '#e74c3c',
      color: '#fff',
      border: 'none',
      padding: '4px 8px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold'
    }}
  >
    🗑️ Supprimer
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Styles simples
const th = { padding: '10px', border: '1px solid #ddd' };
const td = { padding: '10px', border: '1px solid #ddd' };
