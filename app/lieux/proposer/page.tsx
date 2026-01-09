'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ProposerLieuPage() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [addressText, setAddressText] = useState('');
  const [country, setCountry] = useState('');
  const [typeId, setTypeId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  /* =========================
     AUTH
  ========================= */
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  /* =========================
     GEOLOCALISATION
  ========================= */
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n’est pas supportée par votre navigateur.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
      },
      (error) => {
        console.error(error);
        alert(
          'Impossible de récupérer votre position. Vérifiez vos permissions.'
        );
      }
    );
  };

  /* =========================
     IMAGE COMPRESSION
  ========================= */
  async function compressImage(
    file: File,
    maxWidth = 1600,
    quality = 0.85
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) return reject('Erreur lecture image');
        img.src = e.target.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxWidth / img.width);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Impossible de créer le canvas');

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject('Erreur conversion blob');
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = (err) => reject(err);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title || !latitude || !longitude || typeId === null) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);

    try {
      // 🔒 Sécurisation de la session (évite les erreurs aléatoires)
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session?.user) {
        throw new Error('Session utilisateur introuvable');
      }

      const currentUser = sessionData.session.user;

      const { data: locationData, error: insertError } = await supabase
        .from('locations')
        .insert([
          {
            title,
            description,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            address_text: addressText || null,
            country: country || null,
            type_id: typeId,
            status: 'pending',
            created_by: currentUser.id,
          },
        ])
        .select('id')
        .single();

      if (insertError) {
        console.error('Erreur Supabase locations:', insertError);
        throw new Error(insertError.message);
      }

      if (!locationData) {
        throw new Error('Aucune donnée retournée après création du lieu');
      }

      for (const file of photos) {
        try {
          const compressedFile = await compressImage(file);
          const fileExt = compressedFile.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('location-photos')
            .upload(fileName, compressedFile);

          if (uploadError) {
            console.error('Erreur upload photo:', uploadError);
            continue;
          }

          const publicUrl = supabase.storage
            .from('location-photos')
            .getPublicUrl(fileName).data.publicUrl;

          const { error: photoInsertError } = await supabase
            .from('photos')
            .insert([
              {
                location_id: locationData.id,
                url: publicUrl,
                description: null,
              },
            ]);

          if (photoInsertError) {
            console.error('Erreur insertion photo:', photoInsertError);
          }
        } catch (photoError) {
          console.error('Erreur traitement image:', photoError);
        }
      }

      setTitle('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setAddressText('');
      setCountry('');
      setTypeId(null);
      setPhotos([]);

      setMessage(
        'Lieu proposé avec succès ! Il sera vérifié par un modérateur.'
      );

      setTimeout(() => {
        router.push('/lieux/test-carte-leaflet');
      }, 1500);
    } catch (error: any) {
      console.error('ERREUR COMPLETE:', error);
      setMessage(
        error?.message ||
          'Une erreur est survenue lors de la proposition du lieu.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    /* ⚠️ RENDU STRICTEMENT IDENTIQUE — NON MODIFIÉ ⚠️ */
    // ⬇️ (le reste de ton JSX est inchangé)
    <div
      style={{
        fontFamily: 'sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
      }}
    >
      {/* … JSX inchangé … */}
    </div>
  );
}
