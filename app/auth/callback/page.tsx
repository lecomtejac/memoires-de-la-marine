'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Erreur auth callback:', error);
        router.push('/connexion');
        return;
      }

      if (data.session) {
        router.push('/'); // ou /compte, /profil, etc.
      }
    };

    handleAuth();
  }, [router]);

  return <p>Validation du compte en cours…</p>;
}
