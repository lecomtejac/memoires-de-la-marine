'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      // 🔍 Vérification unicité du pseudo
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle()

      if (existingUser) {
        setMessage('❌ Ce pseudo est déjà utilisé.')
        setLoading(false)
        return
      }

      // 🔐 Création du compte
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            'https://memoires-de-la-marine-i8gy.vercel.app/compte-active',
        },
      })

      if (error) {
        setMessage('Erreur lors de la création du compte : ' + error.message)
        return
      }

      const user = data.user

      // 👤 Mise à jour du profil (username)
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ username })
          .eq('id', user.id)

        if (profileError) {
          console.error(profileError)
          setMessage("Compte créé, mais erreur lors de l'enregistrement du pseudo.")
          return
        }
      }

      setMessage('✅ Compte créé avec succès. Vous pouvez maintenant vous connecter.')

      setEmail('')
      setPassword('')
      setUsername('')

      setTimeout(() => {
        router.push('/login')
      }, 1500)

    } catch (err) {
      console.error(err)
      setMessage('Erreur inattendue lors de la création du compte.')
    } finally {
      setLoading(false)
    }
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
        ⬅ Retour
      </Link>

      <h1 style={{ marginBottom: '1rem' }}>Créer un compte</h1>

      <form
        onSubmit={handleSignup}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {/* Pseudo */}
        <input
          type="text"
          placeholder="Pseudo"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          required
          minLength={3}
          style={inputStyle}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Login : email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        {/* Mot de passe */}
        <input
          type="password"
          placeholder="Mot de passe (6 caractères minimum)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={inputStyle}
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

const inputStyle: React.CSSProperties = {
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
}
