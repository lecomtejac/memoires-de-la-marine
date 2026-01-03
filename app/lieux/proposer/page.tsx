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

  // 🔹 Soumission formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title || !latitude || !longitude || typeId === null) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);

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
      },
    ]);

    if (error) {
      console.error(error);
      setMessage('Erreur lors de la proposition du lieu.');
    } else {
      setMessage('Lieu proposé avec succès ! Il sera vérifié par un modérateur.');
      setTitle('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setAddressText('');
      setCountry('');
      setTypeId(null);
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

      <h1>Proposer un lieu de mémoire</h1>

      {!user ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>Vous devez être connecté pour proposer un lieu.</p>
          <Link href="/login">S’identifier</Link>
        </div>
      ) : (
        <>
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

            <select value={typeId ?? ''} onChange={(e) => setTypeId(Number(e.target.value))} required>
              <option value="" disabled>Choisir un type</option>
              <option value={1}>Tombe</option>
              <option value={2}>Monument</option>
              <option value={3}>Plaque</option>
              <option value={4}>Mémorial</option>
              <option value={5}>Lieu de bataille</option>
              <option value={6}>Débarquement</option>
              <option value={7}>Naufrage</option>
              <option value={8}>Épave</option>
              <option value={9}>Musée</option>
              <option value={10}>Trace de passage</option>
              <option value={11}>Base</option>
              <option value={12}>Port</option>
              <option value={13}>Autre</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? 'Envoi…' : 'Proposer le lieu'}
            </button>

            {message && <p>{message}</p>}
          </form>
        </>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Link href="/lieux/test-carte-leaflet">← Retour à la carte</Link>
      </div>
    </div>
  );
}
