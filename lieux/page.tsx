import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

type Lieu = {
  id: string;
  nom: string;
  description: string;
  type: string;
  validated: boolean;
};

export default function Lieux() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase
        .from<Lieu>("locations")
        .select("*")
        .order("nom", { ascending: true });

      if (error) {
        console.error("Erreur Supabase :", error);
      } else {
        setLieux(data);
      }
      setLoading(false);
    }

    fetchLieux();
  }, []);

  if (loading) return <p>Chargement des lieux...</p>;

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 36, marginBottom: 25 }}>Tous les lieux de mémoire</h1>
      {lieux.map((lieu) => (
        <div
          key={lieu.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 20,
            marginBottom: 20,
            backgroundColor: lieu.validated ? "#f4fff4" : "#fff4f4",
          }}
        >
          <h2 style={{ fontSize: 24 }}>{lieu.nom}</h2>
          <p style={{ fontSize: 16 }}>{lieu.description}</p>
          <small>
            Type : {lieu.type} | Validé : {lieu.validated ? "Oui" : "Non"}
          </small>
        </div>
      ))}
    </main>
  );
}
