import React from "react";
import Link from "next/link"; // <- pour les liens Next.js

export default function Home() {
  return (
    <>
      {/* Bandeau site en construction */}
      <div
        style={{
          backgroundColor: "#fff4e5",
          borderBottom: "3px solid #f0c36d",
          padding: "14px 20px",
          textAlign: "center",
          fontSize: 14,
          fontWeight: "bold",
          color: "#b85c00",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        🚧 Site en construction — <strong>Mémoires de la Marine</strong> est en cours de développement. 
        Les contenus et fonctionnalités seront ajoutés progressivement.
      </div>

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
            fontSize: 48,
            marginBottom: 25,
            textAlign: "center",
            color: "#0b3d91",
          }}
        >
          Mémoires de la Marine
        </h1>

        <p
          style={{
            fontSize: 20,
            marginBottom: 50,
            textAlign: "center",
            maxWidth: 800,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Bienvenue sur le site <strong>Mémoires de la Marine</strong>, un projet collaboratif dédié à la consultation et au recensement des lieux de mémoires liés à l’histoire navale française.
        </p>

        {/* Bouton vers la page lieux */}
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <Link
            href="/lieux"
            style={{
              backgroundColor: "#0b3d91",
              color: "#fff",
              padding: "14px 28px",
              borderRadius: 8,
              fontSize: 18,
              fontWeight: "bold",
              textDecoration: "none",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              transition: "background-color 0.3s",
            }}
          >
            Explorer tous les lieux 🌊
          </Link>
        </div>

        <section
          style={{
            backgroundColor: "#f4f8ff",
            padding: "30px 25px",
            borderRadius: 12,
            marginBottom: 40,
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ fontSize: 32, marginBottom: 15, color: "#0b3d91" }}>
            🌊 Un atlas vivant de la mémoire maritime
          </h2>
          <p style={{ fontSize: 18 }}>
            Le site a vocation à devenir un atlas interactif, collaboratif et géolocalisé. Chaque contribution enrichit la mémoire des marins, des monuments, des épaves et des sites historiques liés à la mer. Toutes les traces de l'histoire navale française seront recensées et valorisées.
          </p>
        </section>

        <section
          style={{
            backgroundColor: "#e8f7f2",
            padding: "30px 25px",
            borderRadius: 12,
            marginBottom: 40,
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ fontSize: 32, marginBottom: 15, color: "#0a6b45" }}>
            🧭 Projet collaboratif et modéré
          </h2>
          <p style={{ fontSize: 18 }}>
            Toute personne peut consulter ou proposer (après inscription) un nouveau lieu de mémoire. Les contributions sont ensuite vérifiées et enrichies pour garantir la qualité, la fiabilité et le respect du caractère mémoriel du projet.
          </p>
        </section>

        <section
          style={{
            backgroundColor: "#fff9f4",
            padding: "30px 25px",
            borderRadius: 12,
            marginBottom: 50,
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ fontSize: 32, marginBottom: 15, color: "#b85c00" }}>
            ⚓ Pourquoi ce site ?
          </h2>
          <ul style={{ fontSize: 18, lineHeight: 2, paddingLeft: 20 }}>
            <li>Recenser la mémoire navale de la France</li>
            <li>Rendre visibles des lieux parfois oubliés</li>
            <li>Créer une base de connaissance ouverte et durable</li>
          </ul>
        </section>

        <p
          style={{
            marginTop: 50,
            fontStyle: "italic",
            color: "#555",
            textAlign: "center",
          }}
        >
          Le projet est en construction active. La carte interactive, les contributions et fonctionnalités collaboratives seront ajoutées prochainement.
        </p>
      </main>
    </>
  );
}
