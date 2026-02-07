'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import Link from 'next/link';

// Typage
interface Location {
  id: number;
  title: string;
  type_id: number;
  description: string | null;
  latitude: number;
  longitude: number;
  status: string;
}

// Typage pour les photos
interface Photo {
  id: number;
  url: string;
  description: string | null;
}

export default function AdminEditLocationPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const router = useRouter();

  const [location, setLocation] = useState<Location | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState('');
  const [typeId, setTypeId] = useState<number | null>(null);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

  // Fetch du lieu
  const fetchLocation = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('locations').select('*').eq('id', id).single();
    if (error || !data) console.error(error);
    else {
      setLocation(data);
      setTitle(data.title);
      setDescription(data.description || '');
      setLatitude(data.latitude.toString());
      setLongitude(data.longitude.toString());
      setStatus(data.status);
      setTypeId(data.type_id);
    }

    const { data: photosData, error: photosError } = await supabase.from('photos').select('*').eq('location_id', id);
    if (photosError) console.error(photosError);
    else setPhotos(photosData || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // Sauvegarde
  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('locations')
      .update({
        title,
        description,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        status,
        type_id: typeId,
      })
      .eq('id', id);
    if (error) setMessage('Erreur lors de la mise à jour');
    else setMessage('Lieu mis à jour avec succès');

    // Upload nouvelles photos
    for (const file of newPhotos) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('location-photos').upload(fileName, file);
      if (uploadError) console.error(uploadError);
      else {
        const publicUrl = supabase.storage.from('location-photos').getPublicUrl(fileName).data.publicUrl;
        await supabase.from('photos').insert({ location_id: id, url: publicUrl, description: null });
      }
    }

    setNewPhotos([]);
    fetchLocation();
    setLoading(false);
  };

  // Supprimer une photo
  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm('Supprimer cette photo ?')) return;
    const { error } = await supabase.from('photos').delete().eq('id', photoId);
    if (error) console.error(error);
    else setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  if (loading || !location) return <p>Chargement…</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Modifier le lieu</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Latitude" />
        <input value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Longitude" />

        <select value={typeId ?? ''} onChange={(e) => setTypeId(parseInt(e.target.value))}>
          <option value="" disabled>Type de lieu</option>
          {Object.entries({
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
          }).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">pending</option>
          <option value="approved">approved</option>
        </select>

        {/* Upload nouvelles photos */}
        <input type="file" multiple onChange={(e) => e.target.files && setNewPhotos([...newPhotos, ...Array.from(e.target.files)])} />

        {/* Liste des photos existantes */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {photos.map((p) => (
            <div key={p.id} style={{ position: 'relative' }}>
              <img src={p.url} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '6px' }} />
              <button
                onClick={() => handleDeletePhoto(p.id)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  padding: '2px 6px',
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0070f3', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
        >
          Sauvegarder
        </button>

        <Link href="/admin/locations" style={{ color: '#1e88e5' }}>
          ← Retour à la liste
        </Link>
      </div>
    </div>
  );
}
