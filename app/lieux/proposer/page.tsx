'use client';

import Link from 'next/link';

export default function ProposerLieuPage() {
  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Retour */}
      <Link
        href="/lieux/test-carte-leaflet"
        style={{
          display: 'inline-block',
          marginBottom: '1.5rem',
          textDecoration: 'none',
          color: '#0070f3',
          fontWeight: 'bold',
        }}
      >
        ⬅ Retour à la carte
      </Link>

      {/* Titre */}
      <h1 style={{ marginBottom: '0.5rem' }}>
        Proposer un nouveau lieu de mémoire
      </h1>

      <p style={{ marginBottom: '1.5rem', color: '#555' }}>
        Vous pouvez proposer un lieu de mémoire maritime (tombe, monument,
        plaque, épave, site symbolique…).  
        Chaque proposition est <strong>vérifiée avant publication</strong>.
      </p>

      {/* Encadré information */}
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}
      >
        <p style={{ margin: 0 }}>
          🔒 La contribution nécessite un compte utilisateur afin de garantir
          la fiabilité des informations et permettre la modération.
        </p>
      </div>

      {/* Bouton connexion (placeholder) */}
      <Link
        href="/login"
        style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#ff6600',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          marginBottom: '2rem',
        }}
      >
        🔐 Se connecter pour proposer un lieu
      </Link>

      {/* Aperçu formulaire (non actif) */}
      <div
        style={{
          marginTop: '3rem',
          opacity: 0.6,
        }}
      >
        <h2>Informations demandées</h2>
        <ul>
          <li>Nom du lieu de mémoire</li>
          <li>Type de lieu (tombe, monument, épave…)</li>
          <li>Description historique</li>
          <li>Localisation (commune / coordonnées)</li>
          <li>Sources ou références</li>
          <li>Photographies (facultatif)</li>
        </ul>

        <p style={{ fontStyle: 'italic', color: '#666' }}>
          Le formulaire sera accessible après connexion.
        </p>
      </div>
    </div>
  );
}
