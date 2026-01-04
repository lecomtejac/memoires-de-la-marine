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

  // 🔹 PHOTOS (ÉTAPE 1)
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

  // 🔹 Géolocalisation
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

  // 🔹 Soumission formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title || !latitude || !longitude || typeId === null) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);

    console.log('Photos sélectionnées :', photos); // 🔍 debug étape 1

    const { error } = await supabase.from('locations').insert([
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
    ]);

    if (error) {
      console.error(error);
      setMessage('Erreur lors de la proposition du lieu.');
    } else {
      setMessage('Lieu proposé avec succès !');
      setTitle('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setAddressText('');
      setCountry('');
      setTypeId(null);
      setPhotos([]);
    }

    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Proposer un lieu de mémoire</h1>

      {!user ? (
        <p>Vous devez être connecté.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            placeholder="Adresse"
            value={addressText}
            onChange={(e) => setAddressText(e.target.value)}
          />

          <input
            type="text"
            placeholder="Pays"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          <select
            value={typeId ?? ''}
            onChange={(e) => setTypeId(parseInt(e.target.value))}
            required
          >
            <option value="" disabled>Choisir un type</option>
            <option value={1}>Tombe</option>
            <option value={2}>Monument</option>
            <option value={3}>Plaque</option>
            <option value={4}>Mémorial</option>
          </select>

          {/* 🔹 CHAMP PHOTOS (ÉTAPE 1) */}
          <div>
            <label>
              Photos du lieu (facultatif) :
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setPhotos(Array.from(e.target.files));
                  }
                }}
              />
            </label>

            {photos.length > 0 && (
              <ul>
                {photos.map((file, index) => (
                  <li key={index}>
                    {file.name} – {(file.size / 1024).toFixed(1)} Ko
                  </li>
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

      <Link href="/lieux/test-carte-leaflet">Retour à la carte</Link>
    </div>
  );
}
