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

  // 🔹 PHOTOS
  const [photos, setPhotos] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 🔹 Vérification session utilisateur
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

  // 🔹 Remplir latitude/longitude avec la position actuelle
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
      (error) => {
        console.error(error);
        alert('Impossible de récupérer votre position. Vérifiez vos permissions.');
      }
    );
  };

  // 🔹 Fonction de compression
  async function compressImage(file: File, maxWidth = 1600, quality = 0.85): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) return reject('Erreur lecture image');
        img.src = e.target.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Impossible de créer le canvas');

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject('Erreur conversion blob');
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = (err) => reject(err);
      reader.onerror = (err) => reject(err);

      reader.readAsDataURL(file);
    });
  }

  // 🔹 Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title || !latitude || !longitude || typeId === null) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);

    try {
      // 🔹 1️⃣ Créer le lieu
      const { data: locationData, error: insertError } = await supabase
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

      if (insertError || !locationData) {
        throw insertError ?? new Error('Erreur lors de la création du lieu.');
      }

      // 🔹 2️⃣ Upload des photos avec compression
      for (const file of photos) {
        const compressedFile = await compressImage(file);

        const fileExt = compressedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('location-photos')
          .upload(filePath, compressedFile);

        if (uploadError) {
          console.error('Erreur upload:', uploadError);
          continue;
        }

        const publicUrl = supabase.storage
          .from('location-photos')
          .getPublicUrl(filePath).data.publicUrl;

        // 🔹 3️⃣ Insertion dans la table photos
        await supabase.from('photos').insert([{
          location_id: locationData.id,
          url: publicUrl,
          description: null,
        }]);
      }

      // 🔹 4️⃣ Reset formulaire
      setTitle('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setAddressText('');
      setCountry('');
      setTypeId(null);
      setPhotos([]);
      setMessage('Lieu proposé avec succès ! Il sera vérifié par un modérateur.');
    } catch (error) {
      console.error(error);
      setMessage('Une erreur est survenue lors de la proposition du lieu.');
    }

    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {/* Bannière */}
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
          Vous pouvez contribuer à enrichir la mémoire maritime en ajoutant des lieux de mémoire.
        </p>
      </header>

      {!user ? (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p>Vous devez vous identifier pour proposer un lieu de mémoire.</p>
          <Link
            href="/login"
            style={{
              display: 'inline-block',
              padding: '1rem 2rem',
              backgroundColor: '#0070f3',
              color: '#fff',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.2rem',
            }}
          >
            S’identifier
          </Link>
        </div>
      ) : (
        <>
          {/* 🔹 Utilisateur connecté */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 'bold', color: '#0070f3' }}>
              Connecté en tant que : {user.email || user.user_metadata?.full_name || 'Utilisateur'}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: '#fff',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Se déconnecter
            </button>
          </div>

          {/* 🔹 Formulaire */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <input
              type="text"
              placeholder="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc', minHeight: '100px' }}
            />

            {/* Latitude / Longitude */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
                style={{ flex: 1, padding: '0.5rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <input
                type="number"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
                style={{ flex: 1, padding: '0.5rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <button
                type="button"
                onClick={handleGeolocate}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#17a2b8',
                  color: '#fff',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Ma position
              </button>
            </div>

            <input
              type="text"
              placeholder="Adresse (optionnel)"
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            <input
              type="text"
              placeholder="Pays (optionnel)"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            <select
              value={typeId ?? ''}
              onChange={(e) => setTypeId(parseInt(e.target.value))}
              required
              style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
            >
              <option value="" disabled>Choisir un type de lieu</option>
              <option value={1}>Tombe</option>
              <option value={2}>Monument</option>
              <option value={3}>Plaque commémorative</option>
              <option value={4}>Mémorial</option>
              <option value={5}>Lieu de bataille</option>
              <option value={6}>Lieu de débarquement</option>
              <option value={7}>Naufrage</option>
              <option value={8}>Épave</option>
              <option value={9}>Musée</option>
              <option value={10}>Trace de passage</option>
              <option value={11}>Base</option>
              <option value={12}>Port</option>
              <option value={13}>Autre lieu remarquable</option>
            </select>

            {/* 🔹 PHOTOS */}
            <div>
              <label style={{ fontWeight: 'bold' }}>
                Photos du lieu (optionnel)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setPhotos(Array.from(e.target.files));
                  }
                }}
                style={{ marginTop: '0.5rem' }}
              />

              {photos.length > 0 && (
                <ul style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  {photos.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#0070f3',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {loading ? 'Proposition en cours…' : 'Proposer le lieu'}
            </button>

            {message && <p style={{ marginTop: '1rem', color: '#d63333', fontWeight: 'bold' }}>{message}</p>}
          </form>
        </>
      )}
    </div>
  );
}
