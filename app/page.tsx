import React from "react";

export default function Home() {
  return (
    <>
      {/* Bandeau site en construction */}
      <div
        style={{
          backgroundColor: "#fff4e5",
          borderBottom: "1px solid #f0c36d",
          padding: "12px 20px",
          textAlign: "center",
          fontSize: 14,
          fontWeight: "bold",
          color: "#b85c00",
        }}
      >
        🚧 Site en construction — Mémoire de la Marine est en cours de développement. 
        Les contenus et fonctionnalités seront ajoutés progressivement.
      </div>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "60px 20px" }}>
        <h1 style={{ fontSize: 42, marginBottom: 20 }}>
          Mémoire de la Marine
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 40 }}>
          Bienvenue sur le site <strong>Mémoire de la Marine</strong>, un projet collaboratif dédié au recensement et à la consultation 
          des lieux de mémoire liés à l’histoire maritime et navale française.  
        </p>

        <section style={{ marginBottom: 50 }}>
          <h2 style={{ fontSize: 28, marginBottom: 15 }}>🌊 Un atlas vivant de la mémoire maritime</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6 }}>
            Le site a vocation à devenir un atlas interactif et géolocalisé. 
            Chaque contribution enrichit la mémoire des marins, des monuments, des épaves et des sites historiques liés à la mer.
          </p>
        </section>

        <section style={{ marginBottom: 50 }}>
          <h2 style={{ fontSize: 28, marginBottom: 15 }}>🧭 Projet collaboratif et modéré</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6 }}>
            Toute personne peut consulter ou proposer un nouveau lieu de mémoire. Les contributions sont ensuite vérifiées et enrichies 
            pour garantir la qualité, la fiabilité et le respect du caractère mémoriel du projet.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 28, marginBottom: 15 }}>⚓ Pourquoi ce site ?</h2>
          <ul style={{ fontSize: 16, lineHeight: 1.8 }}>
            <li>Recenser la mémoire maritime et navale</li>
            <li>Rendre visibles des lieux parfois oubliés</li>
            <li>Transmettre cette mémoire</li>
            <li>Créer une base de connaissance ouverte et durable</li>
          </ul>
        </section>

        <p style={{ marginTop: 60, fontStyle: "italic", color: "#555" }}>
          Le projet est en construction active. La carte interactive, les contributions et fonctionnalités collaboratives seront ajoutées prochainement.
        </p>
      </main>
    </>
  );
}
