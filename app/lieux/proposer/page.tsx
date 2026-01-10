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
            latitude: Number(latitude),
            longitude: Number(longitude),
            address_text: addressText || null,
            country: country || null,
            type_id: typeId,
            status: 'pending',
            created_by: user.id,
          },
        ])
        .select('id')
        .single();

      if (error || !locationData) {
        throw error;
      }

      for (const file of photos) {
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
          },
        ]);
      }

      setTitle('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setAddressText('');
      setCountry('');
      setTypeId(null);
      setPhotos([]);

      setMessage(
        'Lieu proposé avec succès ! Il sera vérifié par un modérateur.'
      );

      setTimeout(() => {
        router.push('/lieux/test-carte-leaflet');
      }, 1500);
    } catch {
      setMessage('Une erreur est survenue lors de la proposition du lieu.');
    }

    setLoading(false);
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
        <p style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
          Vous pouvez contribuer à enrichir la mémoire maritime.
        </p>
      </header>

      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <Link
          href="/lieux/test-carte-leaflet"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: '#fff',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          ← Retour à la carte
        </Link>
      </div>

      {!user ? (
        <div style={{ textAlign: 'center' }}>
          <Link href="/login">S’identifier</Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" required />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            style={{
              fontFamily: 'sans-serif',
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '5px',
              border: '1px solid #ccc',
              minHeight: '150px',
              resize: 'vertical',
            }}
          />

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Latitude" required />
            <input value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Longitude" required />
            <button type="button" onClick={handleGeolocate}>Ma position</button>
          </div>

          <input value={addressText} onChange={(e) => setAddressText(e.target.value)} placeholder="Adresse (optionnel)" />
          <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Pays (optionnel)" />

          <select value={typeId ?? ''} onChange={(e) => setTypeId(Number(e.target.value))} required>
            <option value="" disabled>Choisir un type de lieu</option>
            <option value={7}>Tombe</option>
            <option value={8}>Monument</option>
            <option value={9}>Plaque commémorative</option>
            <option value={10}>Mémorial</option>
            <option value={11}>Lieu de bataille</option>
            <option value={12}>Lieu de débarquement</option>
            <option value={13}>Naufrage</option>
            <option value={14}>Épave</option>
            <option value={15}>Musée</option>
            <option value={16}>Trace de passage</option>
            <option value={17}>Base</option>
            <option value={18}>Port</option>
            <option value={19}>Autre lieu remarquable</option>
          </select>

          <input type="file" multiple accept="image/*" onChange={(e) => e.target.files && setPhotos(Array.from(e.target.files))} />

          <button type="submit" disabled={loading}>
            {loading ? 'Proposition en cours…' : 'Proposer le lieu'}
          </button>

          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  );
}
