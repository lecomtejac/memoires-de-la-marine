'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Retour */}
      <Link
        href="/lieux/proposer"
        style={{
          display: 'inline-block',
          marginBottom: '1.5rem',
          textDecoration: 'none',
          color: '#0070f3',
          fontWeight: 'bold',
        }}
      >
        ⬅ Retour
      </Link>

      {/* Titre */}
      <h1 style={{ marginBottom: '1rem' }}>
        Se connecter pour proposer un lieu de mémoire
      </h1>

      {/* Texte explicatif */}
      <p style={{ marginBottom: '1.5rem', color: '#555' }}>
        La création d’un compte est nécessaire pour proposer un lieu de mémoire.
        Elle permet d’assurer la traçabilité des contributions, la fiabilité des
        informations et le bon déroulement du processus de validation.
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
          🛡️ Les informations transmises sont utilisées uniquement dans le cadre
          du projet mémoriel.  
          Les lieux proposés apparaîtront d’abord comme « non validés » puis
          seront examinés par le modérateur avant publication.
        </p>
      </div>

      {/* Boutons (placeholders) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <button
          disabled
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#ff6600',
            color: '#fff',
            fontWeight: 'bold',
            opacity: 0.6,
            cursor: 'not-allowed',
          }}
        >
          🔐 Se connecter (à venir)
        </button>

        <button
          disabled
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            color: '#333',
            opacity: 0.6,
            cursor: 'not-allowed',
          }}
        >
          ✍️ Créer un compte (à venir)
        </button>
      </div>

      {/* Note finale */}
      <p style={{ fontStyle: 'italic', color: '#666' }}>
        La connexion et la création de compte seront prochainement disponibles.
      </p>
    </div>
  );
}
