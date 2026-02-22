import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // clé Service Role
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: lieux, error } = await supabase
    .from('locations')
    .select('id, updated_at')
    .eq('is_published', true); // filtre pour lieux visibles

  if (error) {
    console.error('Erreur récupération lieux:', error);
    return [];
  }

  const urls: MetadataRoute.Sitemap = lieux.map(lieu => ({
    url: `https://memoiresdelamarine.fr/lieux/${lieu.id}`,
    lastModified: new Date(lieu.updated_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // ajouter la page d'accueil
  urls.push({
    url: 'https://memoiresdelamarine.fr',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  });

  return urls;
}
