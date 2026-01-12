'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ProposerLieuPage() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [personName, setPersonName] = useState('');
const [personRank, setPersonRank] = useState('');
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
      (error) => {
        console.error(error);
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
      const { data: locationData, error: insertError } = await supabase
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

      if (insertError || !locationData) {
        throw insertError ?? new Error('Erreur lors de la création du lieu.');
      }

      for (const file of photos) {
        const compressedFile = await compressImage(file);
        const fileExt = compressedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('location-photos')
          .upload(fileName, compressedFile);

        if (uploadError) {
          console.error('Erreur upload:', uploadError);
          continue;
        }

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
    } catch (error) {
      console.error(error);
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
          Vous pouvez contribuer à enrichir la mémoire maritime en ajoutant des
          lieux de mémoire.
        </p>
      </header>

      {/* BOUTON RETOUR VERS CARTE */}
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <span style={{ fontWeight: 'bold', color: '#0070f3' }}>
              Connecté en tant que :{' '}
              {user.email || user.user_metadata?.full_name || 'Utilisateur'}
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

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '2rem',
            }}
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
  style={{
    fontFamily: 'sans-serif',
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    minHeight: '150px',  // <-- taille augmentée
    resize: 'vertical',   // permet de redimensionner verticalement
  }}
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

            <input
              type="text"
              placeholder="Adresse (optionnel)"
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
            />

            <input
              type="text"
              placeholder="Pays (optionnel)"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />

            <select
              value={typeId ?? ''}
              onChange={(e) => setTypeId(parseInt(e.target.value))}
              required
            >
              <option value="" disabled>
                Choisir un type de lieu
              </option>
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
{/* MARIN CONCERNÉ */}
<div style={{ marginTop: '0.5rem' }}>
  <label
    style={{
      fontWeight: 'bold',
      fontSize: '0.9rem',
      display: 'block',
      marginBottom: '0.3rem',
    }}
  >
    Marin célèbre concerné par ce lieu de mémoire (optionnel)
  </label>

  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
    <input
      type="text"
      placeholder="Grade / rang"
      value={personRank}
      onChange={(e) => setPersonRank(e.target.value)}
      style={{
        flex: '1 1 150px',
        padding: '0.5rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
      }}
    />

    <input
      type="text"
      placeholder="Nom du marin"
      value={personName}
      onChange={(e) => setPersonName(e.target.value)}
      style={{
        flex: '2 1 250px',
        padding: '0.5rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
      }}
    />
  </div>

  <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.3rem' }}>
    Exemple : <em>Amiral</em> – <em>Jean Bart</em>
  </p>
</div>
            <div>
  <label style={{ fontWeight: 'bold' }}>Photos du lieu (optionnel)</label>

  {/* Input pour choisir depuis la galerie */}
  <input
    type="file"
    accept="image/*"
    multiple
    id="fileInput"
    style={{ display: 'none' }}
    onChange={(e) => {
      if (e.target.files) setPhotos((prev) => [...prev, ...Array.from(e.target.files)]);
    }}
  />

  {/* Input pour prendre une photo avec l’appareil photo */}
  <input
    type="file"
    accept="image/*"
    capture="environment"
    id="cameraInput"
    style={{ display: 'none' }}
    onChange={(e) => {
      if (e.target.files) setPhotos((prev) => [...prev, ...Array.from(e.target.files)]);
    }}
  />

  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
    {/* Bouton pour choisir depuis la galerie */}
    <button
      type="button"
      onClick={() => document.getElementById('fileInput')?.click()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#0070f3',
        color: '#fff',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      📁 Choisir depuis la galerie
    </button>

    {/* Bouton pour prendre une photo avec la caméra */}
    <button
      type="button"
      onClick={() => document.getElementById('cameraInput')?.click()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#28a745',
        color: '#fff',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}
    >
      📷 Prendre une photo
    </button>
  </div>

  {/* Aperçu des fichiers sélectionnés */}
  {photos.length > 0 && (
    <ul style={{ marginTop: '0.5rem' }}>
      {photos.map((file, i) => (
        <li key={i}>{file.name}</li>
      ))}
    </ul>
  )}
</div>



            {/* BOUTON PROPOSER LE LIEU PLUS GROS ET BLEU */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '1.25rem 2.5rem',
                backgroundColor: '#0070f3',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {loading ? 'Proposition en cours…' : 'Proposer le lieu'}
            </button>

            {message && (
              <p style={{ color: '#d63333', fontWeight: 'bold' }}>
                {message}
              </p>
            )}
          </form>
        </>
      )}
    </div>
  );
}
