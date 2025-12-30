import React from "react";
import Link from "next/link";

export default function Lieux() {
  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "60px 20px",
        fontFamily: "Arial, sans-serif",
        color: "#222",
        lineHeight: 1.7,
      }}
    >
      <h1
        style={{
          fontSize: 42,
          marginBottom: 25,
          textAlign: "center",
          color: "#0b3d91",
        }}
      >
        🌍 Lieux de mémoire
      </h1>

      <p
        style={{
          fontSize: 18,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        Cette page affichera tous les lieux de mémoire maritime recensés. Pour l’instant, c’est un contenu de test.
      </p>

      <ul style={{ fontSize: 18, lineHeight: 2, paddingLeft: 20 }}>
        <li>Lieu 1 - Test</li>
        <li>Lieu 2 - Test</li>
        <li>Lieu 3 - Test</li>
      </ul>

      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Link href="/">
          <a
            style={{
              backgroundColor: "#0b3d91",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Retour à l'accueil
          </a>
        </Link>
      </div>
    </main>
  );
}

