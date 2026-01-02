'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, setLogin] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    // 1️⃣ Créer l’utilisateur dans Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage('Erreur Auth : ' + error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // 2️⃣ Ajouter login et rôle dans profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, login, role: 'user' }])

      if (profileError) {
        setMessage(
          'Compte créé dans Auth mais erreur profiles : ' + profileError.message
        )
      } else {
        setMessage('✅ Compte créé avec succès !')
        setEmail('')
        setPassword('')
        setLogin('')

        // 3️⃣ Rediriger vers la carte après 2 secondes
        setTimeout(() => {
          router.push('/lieux/test-carte-leaflet')
        }, 2000)
      }
    }

    setLoading(false)
  }

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

      {/* Encadré info */}
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

      {/* Formulaire */}
      <form
        onSubmit={handleSignup}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />

        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#28a745',
            color: '#fff',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Création en cours...' : '✍️ Créer le compte'}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p
          style={{
            marginTop: '1.5rem',
            color: message.startsWith('✅') ? 'green' : 'red',
          }}
        >
          {message}
        </p>
      )}
    </div>
  )
}
