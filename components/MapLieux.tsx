'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction icônes Leaflet (obligatoire sur Vercel / Next.js)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Typage STRICT aligné avec ta table Supabase
interface Lieu {
  id: string;
  title: string;
  description?: string | null;
  latitude: number;
  longitude: number;
}

interface MapLieuxProps {
  lieux: Lieu[];
}

export default function MapLieux({ lieux }: MapLieuxProps) {
  // Centre de la carte :
  // - premier lieu si existant
  // - sinon France par défaut
  const center: [number, number] =
    lieux.length > 0
      ? [lieux[0].latitude, lieux[0].longitude]
      : [46.603354, 1.888334];

  return (
    <div style={{ width: '100%', height: '420px', marginBottom: '2rem' }}>
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {lieux.map((lieu) => (
          <Marker
            key={lieu.id}
            position={[lieu.latitude, lieu.longitude]}
          >
            <Popup>
              <strong>{lieu.title}</strong>

              {lieu.description && (
                <p style={{ marginTop: '0.5rem' }}>
                  {lieu.description}
                </p>
              )}

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${lieu.latitude},${lieu.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '0.5rem',
                  color: '#0070f3',
                  textDecoration: 'underline',
                }}
              >
                Ouvrir dans mon GPS
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
