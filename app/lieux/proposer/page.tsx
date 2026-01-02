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

      {/* Introduction */}
      <p style={{ marginBottom: '1.5rem', color: '#555' }}>
        Vous pouvez proposer un lieu de mémoire maritime (tombe, monument,
        plaque, épave, site symbolique…).  
        Les lieux proposés ont vocation à <strong>apparaître sur la carte du site</strong>,
        après <strong>vérification et validation par le modérateur</strong>.
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
          🛡️ Afin de garantir la fiabilité historique et la qualité des informations,
          chaque proposition est examinée par le modérateur du site avant sa mise
          en ligne publique.
        </p>
      </div>

      {/* Bouton connexion */}
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

      {/* Aperçu formulaire */}
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
          Après connexion, vous pourrez soumettre un lieu qui sera examiné puis,
          une fois validé, affiché publiquement sur la carte.
        </p>
      </div>
    </div>
  );
}
