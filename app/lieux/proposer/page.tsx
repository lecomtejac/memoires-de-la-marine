'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function ProposerLieuPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    fetchUser();

    // Écoute les changements de session (connexion/déconnexion)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', fontWeight: 'bold' }}>
        Chargement…
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {/* Bannière */}
      <div
        style={{
          backgroundColor: '#ffcc00',
          color: '#000',
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
        // Si non connecté
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            Vous devez vous identifier pour proposer un lieu de mémoire.
          </p>
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
            S'identifier
          </Link>
        </div>
      ) : (
        // Formulaire de proposition si connecté
        <form
          style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          // Ici tu ajouteras la logique pour submit vers Supabase
          onSubmit={(e) => {
            e.preventDefault();
            alert('Formulaire soumis (à implémenter)');
          }}
        >
          <input
            type="text"
            placeholder="Titre du lieu"
            style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
          <textarea
            placeholder="Description"
            style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
            rows={4}
          />
          <button
            type="submit"
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#28a745',
              color: '#fff',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Proposer le lieu
          </button>
        </form>
      )}

      {/* Section explicative */}
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
