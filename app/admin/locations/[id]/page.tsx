'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';

// Typage
interface Location {
  id: number;
  title: string;
  type_id: number;
  description: string | null;
  latitude: number;
  longitude: number;
  status: string;
  period_start: string | null;
}

interface Photo {
  id: number;
  url: string;
  description: string | null;
  created_at: string | null;
}

export default function AdminLocationPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const router = useRouter();

  const [location, setLocation] = useState<Location | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminChecked, setAdminChecked] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Vérification admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') return router.push('/');
      setAdminChecked(true);
    };
    checkAdmin();
  }, [router]);

  // Fetch location + photos
  useEffect(() => {
    if (!adminChecked) return;

    const fetchData = async () => {
      const { data: loc } = await supabase
        .from('locations')
        .select('*')
        .eq('id', id)
        .single();

      const { data: photosData } = await supabase
        .from('photos')
        .select('*')
        .eq('location_id', id);

      setLocation(loc as Location);
      setPhotos(photosData as Photo[]);
      setLoading(false);
    };

    fetchData();
  }, [id, adminChecked]);

  // Sauvegarde
  const handleSave = async () => {
    if (!location) return;
    const { error } = await supabase.from('locations').update(location).eq('id', id);
    if (error) setMessage('Erreur lors de la sauvegarde');
    else setMessage('Lieu mis à jour !');
  };

  // Update champs
  const handleChange = (field: keyof Location, value: any) => {
    setLocation({ ...location!, [field]: value });
  };

  // Supprimer photo
  const handleDeletePhoto = async (photo: Photo) => {
    if (!confirm('Voulez-vous vraiment supprimer cette photo ?')) return;

    // 1️⃣ Supprimer dans Supabase Storage
    try {
      const fileName = photo.url.split('/').pop()!;
      const { error: storageError } = await supabase.storage
        .from('location-photos')
        .remove([fileName]);

      if (storageError) throw storageError;

      // 2️⃣ Supprimer dans la table photos
      const { error: dbError } = await supabase.from('photos').delete().eq('id', photo.id);
      if (dbError) throw dbError;

      // 3️⃣ Mettre à jour l'état
      setPhotos(photos.filter(p => p.id !== photo.id));
      setMessage('Photo supprimée !');
    } catch (err: any) {
      alert('Erreur lors de la suppression : ' + err.message);
    }
  };

  if (!adminChecked) return <p>Vérification des droits…</p>;
  if (loading || !location) return <p>Chargement...</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <button onClick={() => router.push('/admin/locations')} style={{ marginBottom: '1rem', color: '#1e88e5' }}>
        ← Retour à la liste
      </button>

      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#003366' }}>
        <input
          type="text"
          value={location.title}
          onChange={(e) => handleChange('title', e.target.value)}
          style={{ fontSize: '2rem', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </h1>

      {/* Description */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3 style={{ color: '#0070f3' }}>ℹ️ Description</h3>
        <textarea
          value={location.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          style={{ width: '100%', borderRadius: '6px', border: '1px solid #ccc', padding: '0.5rem' }}
        />
      </div>

      {/* Localisation */}
      <div style={{ backgroundColor: '#eef6f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3 style={{ color: '#0070f3' }}>📍 Localisation</h3>
        <input
          type="text"
          value={location.latitude}
          onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
          placeholder="Latitude"
          style={{ marginRight: '0.5rem', width: '120px' }}
        />
        <input
          type="text"
          value={location.longitude}
          onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
          placeholder="Longitude"
          style={{ width: '120px' }}
        />
      </div>

      {/* Type et statut */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1, backgroundColor: '#fff3e6', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#d97706' }}>🏷️ Type de lieu</h3>
          <select
            value={location.type_id}
            onChange={(e) => handleChange('type_id', parseInt(e.target.value))}
          >
            {Object.entries({
              7: 'Tombe', 8: 'Monument', 9: 'Plaque commémorative', 10: 'Mémorial',
              11: 'Lieu de bataille', 12: 'Lieu de débarquement', 13: 'Naufrage',
              14: 'Épave', 15: 'Musée', 16: 'Trace de passage', 17: 'Base',
              18: 'Port', 19: 'Autre lieu remarquable'
            }).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, backgroundColor: '#f0f5ff', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#3b82f6' }}>📌 Statut</h3>
          <select
            value={location.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      {/* Photos existantes */}
      <div style={{ backgroundColor: '#eef6f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3 style={{ color: '#0070f3' }}>📷 Photos</h3>
        {photos.map((p) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <img src={p.url} style={{ width: '100px', borderRadius: '6px', marginRight: '0.5rem' }} />
            <input
              type="text"
              value={p.description || ''}
              placeholder="Description"
              onChange={async (e) => {
                const newDesc = e.target.value;
                setPhotos(photos.map(ph => ph.id === p.id ? { ...ph, description: newDesc } : ph));
                await supabase.from('photos').update({ description: newDesc }).eq('id', p.id);
              }}
              style={{ flex: 1, padding: '0.3rem', marginRight: '0.5rem' }}
            />
            <button
              onClick={() => handleDeletePhoto(p)}
              style={{ backgroundColor: '#f87171', border: 'none', color: 'white', borderRadius: '4px', padding: '0.3rem 0.5rem', cursor: 'pointer' }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Ajouter une photo */}
      <div style={{ backgroundColor: '#eef6f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3 style={{ color: '#0070f3' }}>📷 Ajouter une photo</h3>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            if (!e.target.files || e.target.files.length === 0) return;
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `location_${location.id}_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from('location-photos')
              .upload(fileName, file);
            if (uploadError) { alert('Erreur lors de l\'upload : ' + uploadError.message); return; }

            const { data: publicData } = supabase.storage.from('location-photos').getPublicUrl(fileName);
            const publicUrl = publicData.publicUrl;
            if (!publicUrl) { alert('Erreur lors de la récupération de l\'URL publique'); return; }

            const { data: photoData, error: photoError } = await supabase
              .from('photos')
              .insert([{ location_id: location.id, url: publicUrl, description: '' }])
              .select()
              .single();
            if (photoError) { alert('Erreur lors de l\'ajout en base : ' + photoError.message); return; }

            setPhotos([...photos, photoData as Photo]);
          }}
        />
      </div>

      <button
        onClick={handleSave}
        style={{ padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', borderRadius: '6px', border: 'none' }}
      >
        💾 Sauvegarder
      </button>

      {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
