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
          chaque proposition apparaîtra dans un premier temps comme « non validée »,
          puis sera examinée par le modérateur du site, qui validera formellement
          le lieu de mémoire.
        </p>
      </div>

      {/* Boutons connexion / création de compte */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '3rem',
        }}
      >
        <Link
          href="/login"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#ff6600',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          🔐 Se connecter
        </Link>

        <Link
          href="/login"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#ffffff',
            color: '#333',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            border: '1px solid #ccc',
          }}
        >
          ✍️ Créer un compte
        </Link>
      </div>

      {/* Aperçu formulaire */}
      <div style={{ opacity: 0.6 }}>
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
          Le formulaire sera accessible après connexion ou création de compte.
        </p>
      </div>
    </div>
  );
}
