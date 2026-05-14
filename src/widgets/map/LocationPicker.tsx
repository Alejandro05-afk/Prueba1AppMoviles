import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type Props = {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  style?: React.CSSProperties;
};

function LocationMarker({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function LocationPicker({ onLocationSelect, initialLat = -0.1807, initialLng = -78.4678, style }: Props) {
  const handleSelect = useCallback((lat: number, lng: number) => {
    onLocationSelect(lat, lng);
  }, [onLocationSelect]);

  return (
    <div style={{ width: '100%', flex: 1, minHeight: 400, ...style }}>
      <MapContainer
        center={[initialLat, initialLng]}
        zoom={13}
        style={{ width: '100%', flex: 1, minHeight: 400 }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelect={handleSelect} />
      </MapContainer>
    </div>
  );
}
