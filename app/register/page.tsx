'use client';

import Link from 'next/link';

export default function RegisterPage() {
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
        Créer un compte pour proposer un lieu de mémoire
      </h1>

      {/* Texte explicatif */}
      <p style={{ marginBottom: '1.5rem', color: '#555' }}>
        La création d’un compte vous permettra de proposer des lieux de mémoire et
        de suivre leur validation par le modérateur du site. Vos informations
        resteront confidentielles et ne seront utilisées que dans le cadre du
        projet.
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
          🛡️ Chaque lieu proposé apparaîtra d’abord comme « non validé », puis
          sera examiné et validé par le modérateur avant publication sur la carte.
        </p>
      </div>

      {/* Formulaire (placeholder) */}
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Adresse email"
          disabled
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            opacity: 0.6,
          }}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          disabled
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            opacity: 0.6,
          }}
        />

        <button
          type="submit"
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
          ✍️ Créer le compte (à venir)
        </button>
      </form>

      {/* Note finale */}
      <p style={{ marginTop: '1.5rem', fontStyle: 'italic', color: '#666' }}>
        La création de compte sera bientôt fonctionnelle. Pour l’instant, les
        champs sont désactivés.
      </p>
    </div>
  );
}
