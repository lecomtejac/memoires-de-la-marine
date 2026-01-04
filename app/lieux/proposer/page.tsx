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

  // 🔹 Session utilisateur
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

  // 🔹 Déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n’est pas supportée.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
      },
      () => alert('Impossible de récupérer la position.')
    );
  };

  // 🔹 Compression image
  async function compressImage(file: File, maxWidth = 1600, quality = 0.85): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.src = reader.result as string;
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
      const { data: location, error } = await supabase
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

      if (error || !location) throw error;

      for (const file of photos) {
        const compressed = await compressImage(file);

        const ext = compressed.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('location-photos')
          .upload(fileName, compressed);

        if (uploadError) continue;

        const publicUrl = supabase.storage
          .from('location-photos')
          .getPublicUrl(fileName).data.publicUrl;

        await supabase.from('photos').insert([{
          location_id: location.id,
          url: publicUrl,
          size: compressed.size,
          description: null,
        }]);
      }

      setTitle('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setAddressText('');
      setCountry('');
      setTypeId(null);
      setPhotos([]);
      setMessage('Lieu proposé avec succès. Il sera vérifié par un modérateur.');

    } catch (err) {
      console.error(err);
      setMessage('Une erreur est survenue.');
    }

    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

      {/* 🔹 BANDEAU UTILISATEUR CONNECTÉ */}
      {user && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#f0f6ff',
            borderRadius: '6px',
          }}
        >
          <span style={{ fontWeight: 'bold', color: '#0070f3' }}>
            Connecté avec le compte : {user.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Se déconnecter
          </button>
        </div>
      )}

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

          <input value={addressText} onChange={e => setAddressText(e.target.value)} placeholder="Adresse" />
          <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Pays" />

          <select value={typeId ?? ''} onChange={e => setTypeId(Number(e.target.value))} required>
            <option value="" disabled>Choisir un type</option>
            <option value={1}>Tombe</option>
            <option value={2}>Monument</option>
            <option value={3}>Plaque commémorative</option>
            <option value={4}>Mémorial</option>
            <option value={5}>Épave</option>
            <option value={6}>Lieu de bataille</option>
            <option value={7}>Musée</option>
            <option value={8}>Autre lieu de mémoire</option>
          </select>

          <div>
            <label>Photos</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (!e.target.files) return;
                setPhotos((prev) => [...prev, ...Array.from(e.target.files)]);
              }}
            />
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
