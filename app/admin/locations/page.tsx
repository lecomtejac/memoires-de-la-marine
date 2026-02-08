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

      console.log('Session user:', user);

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log('Profile:', profile, 'Error:', error);

      if (!profile || profile.role !== 'admin') {
        router.push('/');
        return;
      }

      setAdminChecked(true);
    };

    checkAdmin();
  }, [router]);

  // Fetch lieux + profils
  useEffect(() => {
    if (!adminChecked) return;

    const fetchData = async () => {
      setLoading(true);
      const { data: locationsData } = await supabase.from('locations').select('*').order('created_at', { ascending: false });
      const { data: usersData } = await supabase.from('profiles').select('id, username, email');

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
    <div style={{ maxWidth: '1100px', margin: '2rem auto' }}>
      <h1>Admin – Gestion des lieux</h1>
      {loading ? <p>Chargement…</p> : (
        <table>
          <thead>
            <tr>
              <th>Titre</th><th>Type</th><th>Statut</th><th>Coordonnées</th><th>Créé par</th><th>Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc.id}>
                <td>{loc.title}</td>
                <td>{loc.type_id}</td>
                <td>{loc.status}</td>
                <td>{loc.latitude}, {loc.longitude}</td>
                <td>{loc.created_by ? userMap[loc.created_by] || 'Utilisateur inconnu' : '—'}</td>
                <td>{new Date(loc.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <Link href={`/admin/locations/${loc.id}`}>✏️</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
