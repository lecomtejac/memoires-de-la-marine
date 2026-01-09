'use client';

import React, { useState, useEffect } from 'react';
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
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    fetchUser();

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
        alert(
          'Impossible de récupérer votre position. Vérifiez vos permissions.'
        );
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

    if (!user) {
      setMessage('Vous devez être connecté pour proposer un lieu.');
      return;
    }

    if (!title || !latitude || !longitude || typeId === null) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);

    try {
      const { data: locationData, error } = await supabase
        .from('locations')
        .insert([
          {
            title,
            description,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            address_text: addressText || null,
            country: country || null,
            type_id: typeId,
            status: 'pending',
            created_by: user.id,
          },
        ])
        .select('id')
        .single();

      if (error || !locationData) throw error;

      for (const file of photos) {
        const compressed = await compressImage(file);
        const name = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.jpg`;

        await supabase.storage
          .from('location-photos')
          .upload(name, compressed);

        const publicUrl = supabase.storage
          .from('location-photos')
          .getPublicUrl(name).data.publicUrl;

        await supabase.from('photos').insert([
          {
            location_id: locationData.id,
            url: publicUrl,
          },
        ]);
      }

      setMessage(
        'Lieu proposé avec succès ! Il sera vérifié par un modérateur.'
      );

      setTimeout(() => {
        router.push('/lieux/test-carte-leaflet');
      }, 1500);
    } catch (error: any) {
  console.error('ERREUR SUPABASE :', error);
  setMessage(
    error?.message ??
      'Une erreur est survenue lors de la proposition du lieu.'
  );
    }

    setLoading(false);
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Proposer un lieu de mémoire</h1>

      {!user ? (
        <Link href="/login">S’identifier</Link>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ minHeight: '150px' }}
          />

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
            <button type="button" onClick={handleGeolocate}>
              Ma position
            </button>
          </div>

          <select
            value={typeId ?? ''}
            onChange={(e) => setTypeId(Number(e.target.value))}
            required
          >
            <option value="" disabled>
              Choisir un type
            </option>
            <option value={1}>Tombe</option>
            <option value={2}>Monument</option>
            <option value={3}>Plaque</option>
            <option value={4}>Mémorial</option>
          </select>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              e.target.files && setPhotos(Array.from(e.target.files))
            }
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Envoi…' : 'Proposer le lieu'}
          </button>

          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  );
}
