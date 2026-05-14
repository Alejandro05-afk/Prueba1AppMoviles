# Skill: Implementación de Leaflet + OpenStreetMap en Gastro Map

## Objetivo

Implementar un sistema de mapas usando **Leaflet + OpenStreetMap** para permitir:

1. Registrar un platillo con:

   * ubicación actual GPS
   * o selección manual en el mapa

2. Visualizar posteriormente:

   * ubicación del platillo
   * marker exacto
   * distancia entre usuario y platillo
   * línea dibujada entre ambos puntos

---

# Análisis de Arquitectura Actual

El proyecto sigue una arquitectura tipo FSD:

* `app/` → pantallas
* `entities/` → modelos y API
* `widgets/` → componentes reutilizables
* `shared/` → utilidades y UI
* `features/` → lógica específica

Actualmente ya existe:

✅ GPS con `expo-location`
✅ Persistencia en Supabase
✅ Coordenadas guardadas:

* latitude
* longitude

✅ Flujo de registro funcional

Lo que falta es:

❌ Selección manual en mapa
❌ Pantalla detalle
❌ Visualización en mapa
❌ Distancia entre puntos
❌ Ruta visual

---

# Librerías a Instalar

## Para Web + Expo

```bash
npm install leaflet react-leaflet
```

## Tipos TypeScript

```bash
npm install -D @types/leaflet
```

---

# Estructura Recomendada

```txt
src/
├── widgets/
│   └── map/
│       ├── LocationPicker.tsx
│       ├── DishMapView.tsx
│       └── DistanceLine.tsx
│
├── shared/
│   └── utils/
│       └── distance.ts
│
├── app/
│   └── (app)/
│       └── dish/
│           ├── [id].tsx
│           └── map-picker.tsx
```

---

# Flujo Completo

## 1. Registro del Platillo

### Pantalla actual:

`src/app/(app)/dish/new.tsx`

Agregar:

* Botón:

  * "Seleccionar en mapa"

---

## Nuevo flujo

```txt
Nuevo Platillo
↓
Tomar ubicación actual
O
Seleccionar manualmente en mapa
↓
Guardar coordenadas
↓
Insert en Supabase
```

---

# Skill 1 — Selector Manual de Ubicación

## Archivo

```txt
src/widgets/map/LocationPicker.tsx
```

## Función

Permite:

* mover mapa
* tocar un punto
* guardar coordenadas
* mostrar marker

---

## Comportamiento esperado

```txt
Usuario toca mapa
↓
Se actualiza marker
↓
Se guardan lat/lng
↓
Regresa a formulario
```

---

# Ejemplo de Implementación

```tsx
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';

function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function LocationPicker({ onLocationSelect }) {
  return (
    <MapContainer
      center={[-0.1807, -78.4678]}
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution="OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker onSelect={onLocationSelect} />
    </MapContainer>
  );
}
```

---

# Integración en new.tsx

## Agregar botón

```tsx
<Button
  title="Seleccionar en mapa"
  variant="secondary"
  onPress={() => router.push('/(app)/dish/map-picker')}
/>
```

---

## Resultado esperado

```txt
Usuario abre mapa
↓
Selecciona punto
↓
Regresa con coordenadas
↓
Formulario actualizado
```

---

# Skill 2 — Pantalla Detalle del Platillo

## Nuevo archivo

```txt
src/app/(app)/dish/[id].tsx
```

---

# Objetivo

Mostrar:

* imagen
* nombre
* ciudad
* coordenadas
* botón "Ver ubicación"

---

# Flujo

```txt
DishCard
↓
Tap
↓
Pantalla detalle
↓
Botón ver ubicación
↓
Mapa centrado
```

---

# Modificación en DishCard

Archivo:

```txt
src/widgets/dish/DishCard.tsx
```

## Agregar navegación

```tsx
import { useRouter } from 'expo-router';

const router = useRouter();

onPress={() => router.push(`/(app)/dish/${dish.id}`)}
```

---

# Skill 3 — MapView del Platillo

## Archivo

```txt
src/widgets/map/DishMapView.tsx
```

---

# Objetivo

Mostrar:

✅ marker del platillo
✅ ubicación usuario
✅ línea entre ambos
✅ distancia

---

# Ejemplo

```tsx
<MapContainer center={[dish.latitude, dish.longitude]} zoom={15}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  <Marker position={[dish.latitude, dish.longitude]} />

  <Marker position={[userLat, userLng]} />

  <Polyline
    positions={[
      [userLat, userLng],
      [dish.latitude, dish.longitude]
    ]}
  />
</MapContainer>
```

---

# Skill 4 — Calcular Distancia

## Archivo

```txt
src/shared/utils/distance.ts
```

---

# Función Haversine

```ts
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (R * c).toFixed(2);
}
```

---

# Mostrar Distancia

## Ejemplo UI

```tsx
<Text>
  Distancia: {distance} km
</Text>
```

---

# Resultado Visual Esperado

```txt
━━━━━━━━━━━━━━━━━━
|      MAPA       |
|                 |
|   📍 Platillo    |
|        ╲        |
|         ╲       |
|          👤     |
━━━━━━━━━━━━━━━━━━

Distancia: 2.5 km
```

---

# Skill 5 — Obtener Ubicación Actual del Usuario

Ya tienes configurado:

* `expo-location`
* permisos Android/iOS
* GPS

Solo reutiliza:

```tsx
Location.getCurrentPositionAsync()
```

---

# Skill 6 — Mejoras UX Recomendadas

## Centrar mapa automáticamente

```tsx
map.flyTo([lat, lng], 16);
```

---

## Mostrar popup del platillo

```tsx
<Popup>
  {dish.name}
</Popup>
```

---

## Iconos personalizados

```tsx
L.icon({
  iconUrl: 'marker.png',
  iconSize: [32, 32]
})
```

---

# Compatibilidad Importante

## Leaflet funciona mejor en:

✅ Expo Web
✅ React Native Web

---

# Para Android/iOS reales

Leaflet NO es la mejor opción nativa.

Para producción móvil se recomienda:

## Alternativa recomendada

```txt
react-native-maps
```

Porque:

✅ mejor rendimiento
✅ soporte nativo
✅ GPS real
✅ markers fluidos
✅ polylines nativas

---

# Recomendación Arquitectónica

## Mantener esta separación

### Widgets de mapa

```txt
widgets/map/
```

### Utilidades GPS

```txt
shared/utils/
```

### Pantallas

```txt
app/(app)/dish/
```

---

# Flujo Final Completo

```txt
Registrar Platillo
↓
Tomar GPS
o
Seleccionar punto manualmente
↓
Guardar coordenadas
↓
DishCard
↓
Detalle del platillo
↓
Botón "Ver ubicación"
↓
MapView
↓
Marker del platillo
↓
Marker del usuario
↓
Polyline entre ambos
↓
Texto con distancia
```

---

# Ventajas de esta Implementación

✅ UX moderna
✅ Escalable
✅ Compatible con Supabase
✅ Compatible con Expo Router
✅ Aprovecha arquitectura FSD
✅ Reutilizable
✅ OpenStreetMap es gratuito
✅ Sin API Key de Google Maps

---

# Recomendación Final

Para este proyecto académico/móvil híbrido:

## Mejor opción

### Web:

* Leaflet + OpenStreetMap

### Android/iOS:

* `react-native-maps`

Porque el proyecto actual ya está montado sobre Expo SDK 54 y la integración nativa será mucho más estable en dispositivos reales.
