'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

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

  const router = useRouter();

  /* =========================
     AUTH
  ========================= */
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  /* =========================
     GEOLOCALISATION
  ========================= */
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
      () => {
        alert('Impossible de récupérer votre position.');
      }
    );
  };

  /* =========================
     IMAGE COMPRESSION
  ========================= */
  async function compressImage(
    file: File,
    maxWidth = 1600,
    quality = 0.85
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) return reject();
        img.src = e.target.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxWidth / img.width);

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

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title || !latitude || !longitude || typeId === null) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        throw new Error('Utilisateur non authentifié');
      }

      const currentUser = sessionData.session.user;

      const { data: locationData, error } = await supabase
        .from('locations')
        .insert([
          {
            title,
            description,
            latitude: Number(latitude),
            longitude: Number(longitude),
            address_text: addressText || null,
            country: country || null,
            type_id: typeId,
            status: 'pending',
            created_by: currentUser.id,
          },
        ])
        .select('id')
        .single();

      if (error) throw error;

      for (const file of photos) {
        try {
          const compressed = await compressImage(file);
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.jpg`;

          const { error: uploadError } = await supabase.storage
            .from('location-photos')
            .upload(fileName, compressed);

          if (uploadError) continue;

          const publicUrl = supabase.storage
            .from('location-photos')
            .getPublicUrl(fileName).data.publicUrl;

          await supabase.from('photos').insert([
            {
              location_id: locationData.id,
              url: publicUrl,
              description: null,
            },
          ]);
        } catch {}
      }

      setTitle('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setAddressText('');
      setCountry('');
      setTypeId(null);
      setPhotos([]);

      setMessage('Lieu proposé avec succès !');

      setTimeout(() => {
        router.push('/lieux/test-carte-leaflet');
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Erreur lors de la création du lieu.');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffcc00',
          padding: '1rem',
          textAlign: 'center',
          fontWeight: 'bold',
          borderRadius: '5px',
          marginBottom: '2rem',
        }}
      >
        ⚠️ Ce site est en construction ⚠️
      </div>

      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Proposer un lieu de mémoire</h1>
      </header>

      {!user ? (
        <div style={{ textAlign: 'center' }}>
          <Link href="/login">S’identifier</Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          <input value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Latitude" />
          <input value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Longitude" />
          <button type="button" onClick={handleGeolocate}>Ma position</button>
          <button type="submit" disabled={loading}>
            {loading ? 'En cours…' : 'Proposer le lieu'}
          </button>
          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  );
}
