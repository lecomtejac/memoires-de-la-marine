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

  // 🔹 Soumission du formulaire
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
        created_by: user.id, // 🔹 Liaison avec l'utilisateur connecté
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

            <input
              type="number"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            <input
              type="number"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
            />

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

      {/* Boutons bas de page */}
      <div style={{ textAlign: 'center', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/register"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            backgroundColor: '#28a745',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          Créer un compte
        </Link>

        <Link
          href="/lieux/test-carte-leaflet"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            backgroundColor: '#6c757d',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          Retour carte
        </Link>
      </div>

      <section style={{ marginTop: '4rem', lineHeight: '1.6', color: '#333' }}>
        <h2>À propos du projet</h2>
        <p>
          L’objectif est de créer une carte collaborative des lieux de mémoire maritime, avec fiches détaillées, photos,
          informations historiques et contribution des utilisateurs. Chaque lieu peut être validé par un administrateur
          pour garantir la qualité et la fiabilité des données.
        </p>
        <p>
          Les types de lieux recensés incluent : tombes, monuments, plaques, épaves, sites de bataille, lieux de débarquement
          et musées. La base de données est construite sur Supabase et le site est développé avec Next.js.
        </p>
      </section>
    </div>
  );
}
