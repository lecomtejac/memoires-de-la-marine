import React from "react";

export default function Home() {
  return (
    <>
      {/* Bandeau site en construction */}
      <div
        style={{
          backgroundColor: "#f4f6f8",
          borderBottom: "1px solid #ddd",
          padding: "12px 20px",
          textAlign: "center",
          fontSize: 14,
        }}
      >
        🚧 <strong>Site en construction</strong> — Mémoire de la Marine est en
        cours de développement. Les contenus et fonctionnalités arriveront
        progressivement.
      </div>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "60px 20px" }}>
        <h1 style={{ fontSize: 42, marginBottom: 20 }}>
          Mémoire de la Marine
        </h1>

        <p style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 40 }}>
          <strong>Mémoire de la Marine</strong> est un projet collaboratif
          dédié au recensement et à la transmission des lieux de mémoire
          liés à l’histoire maritime et navale.
        </p>

        <p style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 40 }}>
          Tombes de marins, monuments, plaques commémoratives, épaves,
          lieux de naufrage, sites de bataille, ports historiques,
          musées ou simples traces de passage : chaque lieu raconte une
          part de l’histoire de celles et ceux qui ont servi la mer.
        </p>

        <section style={{ marginBottom: 50 }}>
          <h2>🌊 Un atlas vivant de la mémoire maritime</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6 }}>
            Le site a vocation à devenir un atlas interactif,
            géolocalisé et évolutif, construit collectivement.
            Chaque contribution enrichit une mémoire parfois dispersée,
            fragile ou menacée d’oubli.
          </p>
        </section>

        <section style={{ marginBottom: 50 }}>
          <h2>🧭 Un projet collaboratif et modéré</h2>
          <p style={{ fontSize: 16, lineHeight: 1.6 }}>
            Toute personne peut proposer un lieu de mémoire.
            Les contributions sont ensuite vérifiées et enrichies
            afin de garantir la qualité, la fiabilité et le respect
            du caractère mémoriel du projet.
          </p>
        </section>

        <section>
          <h2>⚓ Pourquoi ce site ?</h2>
          <ul style={{ fontSize: 16, lineHeight: 1.8 }}>
            <li>Préserver la mémoire maritime et navale</li>
            <li>Rendre visibles des lieux parfois oubliés</li>
            <li>Transmettre aux générations futures</li>
            <li>Créer une base de connaissance ouverte et durable</li>
          </ul>
        </section>

        <p style={{ marginTop: 60, fontStyle: "italic", color: "#555" }}>
          Le projet est en construction active.  
          La carte interactive, les premières contributions et les
          fonctionnalités collaboratives seront ajoutées prochainement.
        </p>
      </main>
    </>
  );
}
