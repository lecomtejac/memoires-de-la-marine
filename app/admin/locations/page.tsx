'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

// Typage d'un lieu
interface Location {
  id: number;
  title: string;
  type_id: number;
  description: string | null;
  latitude: number;
  longitude: number;
  status: string;
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

  // Fetch des lieux
  const fetchLocations = async () => {
    setLoading(true);
    let query = supabase.from('locations').select('*').order('created_at', { ascending: false });
    
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) console.error(error);
    else setLocations(data as Location[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();
  }, [search]);

  // Supprimer un lieu
  const handleDelete = async (id: number) => {
    if (!confirm('Confirmer la suppression de ce lieu ?')) return;
    const { error } = await supabase.from('locations').delete().eq('id', id);
    if (error) setMessage('Erreur lors de la suppression');
    else {
      setMessage('Lieu supprimé');
      fetchLocations();
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Admin – Gestion des lieux</h1>

      {/* Barre de recherche */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Rechercher par titre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', borderRadius: '6px', border: '1px solid #ccc' }}
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
            <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Titre</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Type</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Statut</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Coordonnées</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{loc.title}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{getTypeLabel(loc.type_id)}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{loc.status}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {loc.latitude}, {loc.longitude}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <Link href={`/admin/locations/${loc.id}`} style={{ marginRight: '0.5rem', color: '#1e88e5' }}>
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
                    🗑️ Supprimer
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
