import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export const revalidate = 3600

export default async function LieuxPage() {

  const { data: lieux, error } = await supabase
    .from('locations')
    .select('id, title, country')
    .order('title', { ascending: true })

  if (error) {
    console.error(error)
    return <p>Erreur chargement lieux</p>
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>

      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#003366' }}>
        Lieux de mémoire maritime
      </h1>

      <p style={{ marginBottom: '2rem' }}>
        Liste des lieux recensés sur le site.
      </p>

      <ul style={{ lineHeight: '1.8' }}>
        {lieux?.map((lieu) => (
          <li key={lieu.id}>
            <Link href={`/lieux/${lieu.id}`}>
              {lieu.title} {lieu.country ? `– ${lieu.country}` : ''}
            </Link>
          </li>
        ))}
      </ul>

    </div>
  )
}
