'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Leaflet
import { MapContainer, TileLayer } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 👉 Centre de la carte (typé correctement pour TypeScript)
const franceCenter: LatLngExpression = [46.603354, 1.888334];

interface Lieu {
  id: string;
  title: string;
  description?: string | null;
  country?: string | null;
  status?: string | null;
  latitude: number;
  longitude: number;
}

export default function LieuxPage() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchLieux = async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*');

        if (error) throw error;

        const filteredData: Lieu[] = (data ?? []).map((row: any) => ({
          id: row.id,
          title: row.title ?? 'Titre inconnu',
          description: row.description ?? null,
          country: row.country ?? null,
          status: row.status ?? null,
          latitude: row.latitude ?? 0,
          longitude: row.longitude ?? 0,
        }));

        setLieux(filteredData);
      } catch (err: any) {
        console.error('Erreur fetch:', err);
        setErrorMsg(err.message ?? 'Erreur lors de la récupération des lieux');
        setLieux([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLieux();
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Carte des lieux de mémoire</h1>

      {/* 🗺️ CARTE */}
<div style={{ height: '70vh', marginBottom: '2rem' }}>
  <MapContainer
    {...{
      center: [46.603354, 1.888334],
      zoom: 6,
      scrollWheelZoom: true,
      style: { height: '100%', width: '100%' },
    } as any}
  >
    <TileLayer
      attribution="&copy; OpenStreetMap contributors"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  </MapContainer>
</div>

      {/* 📋 LISTE */}
      <h2>Liste des lieux de mémoire</h2>

      {loading && <p>Chargement des lieux…</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {!loading && !errorMsg && lieux.length === 0 && <p>Aucun lieu trouvé.</p>}

      {!loading && !errorMsg && lieux.length > 0 && (
        <ul>
          {lieux.map((lieu) => (
            <li key={lieu.id} style={{ marginBottom: '1rem' }}>
              <strong>{lieu.title}</strong>
              {lieu.description && <p>{lieu.description}</p>}
              {lieu.country && <p>Pays : {lieu.country}</p>}
              {lieu.status && <p>Statut : {lieu.status}</p>}
              <p>
                Coordonnées : {lieu.latitude}, {lieu.longitude}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
