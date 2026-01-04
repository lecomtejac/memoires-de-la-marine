'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';

export default function ProposerLieuPage() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [addressText, setAddressText] = useState('');
  const [country, setCountry] = useState('');
  const [typeId, setTypeId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    }
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n’est pas supportée par votre navigateur.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
      },
      () => alert('Impossible de récupérer votre position.')
    );
  };

  async function compressImage(file: File, maxWidth = 1920, quality = 0.85): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) return reject();
        img.src = e.target.result as string;
      };

      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject();
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          quality
        );
      };

      reader.readAsDataURL(file);
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title || !latitude || !longitude || typeId === null) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);

    try {
      // Création du lieu
      const { data: locationData, error } = await supabase
        .from('locations')
        .insert([{
          title,
          description,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          address_text: addressText || null,
          country: country || null,
          type_id: typeId,
          status: 'pending',
          created_by: user.id,
        }])
        .select('id')
        .single();

      if (error || !locationData) throw error;

      // Upload de toutes les photos
      for (const file of photos) {
        const compressed = await compressImage(file);

        const ext = compressed.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('location-photos')
          .upload(fileName, compressed);

        if (uploadError) continue;

        const { data } = supabase.storage
          .from('location-photos')
          .getPublicUrl(fileName);

        await supabase.from('photos').insert([{
          location_id: locationData.id,
          url: data.publicUrl,
          description: null,
          size: compressed.size,
        }]);
      }

      // Reset
      setTitle('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setAddressText('');
      setCountry('');
      setTypeId(null);
      setPhotos([]);
      setMessage('Lieu proposé avec succès ! Il sera vérifié par un modérateur.');

    } catch (err) {
      console.error(err);
      setMessage('Une erreur est survenue.');
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Proposer un lieu de mémoire</h1>

      {!user ? (
        <Link href="/login">S’identifier</Link>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre" required />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />

          <div>
            <input value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="Latitude" required />
            <input value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="Longitude" required />
            <button type="button" onClick={handleGeolocate}>Ma position</button>
          </div>

          <select value={typeId ?? ''} onChange={e => setTypeId(Number(e.target.value))} required>
            <option value="" disabled>Choisir un type</option>
            <option value={1}>Tombe</option>
            <option value={2}>Monument</option>
            <option value={3}>Plaque</option>
            <option value={4}>Mémorial</option>
          </select>

          <div>
            <label>Photos (plusieurs possibles)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (!e.target.files) return;
                setPhotos((prev) => [...prev, ...Array.from(e.target.files)]);
              }}
            />
            {photos.length > 0 && (
              <ul>
                {photos.map((file, i) => (
                  <li key={i}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Envoi…' : 'Proposer le lieu'}
          </button>

          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  );
}
