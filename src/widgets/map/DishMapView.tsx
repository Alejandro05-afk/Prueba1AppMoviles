import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type Props = {
  dishLat: number;
  dishLng: number;
  dishName: string;
  userLat: number;
  userLng: number;
  style?: React.CSSProperties;
};

const dishIcon = L.divIcon({
  html: '<div style="background:#e41134;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)">🍽</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const userIcon = L.divIcon({
  html: '<div style="background:#006492;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)">👤</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function DishMapView({ dishLat, dishLng, dishName, userLat, userLng, style }: Props) {
  const center: [number, number] = [(dishLat + userLat) / 2, (dishLng + userLng) / 2];
  const dishPos: [number, number] = [dishLat, dishLng];
  const userPos: [number, number] = [userLat, userLng];

  return (
    <div style={{ width: '100%', height: 350, borderRadius: 12, overflow: 'hidden', ...style }}>
      <MapContainer
        center={center}
        zoom={14}
        style={{ width: '100%', height: 350 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={dishPos} icon={dishIcon}>
          <Popup>{dishName}</Popup>
        </Marker>
        <Marker position={userPos} icon={userIcon}>
          <Popup>Tu ubicación</Popup>
        </Marker>
        <Polyline
          positions={[dishPos, userPos]}
          color="#e41134"
          weight={3}
          dashArray="8, 8"
        />
      </MapContainer>
    </div>
  );
}
