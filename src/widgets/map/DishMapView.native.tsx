import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

type Props = {
  dishLat: number;
  dishLng: number;
  dishName: string;
  userLat: number;
  userLng: number;
  style?: any;
};

function generateHTML(dishLat: number, dishLng: number, dishName: string, userLat: number, userLng: number) {
  const centerLat = (dishLat + userLat) / 2;
  const centerLng = (dishLng + userLng) / 2;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { height: 100%; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var dishPos = [${dishLat}, ${dishLng}];
    var userPos = [${userLat}, ${userLng}];

    var map = L.map('map').setView([${centerLat}, ${centerLng}], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    var dishIcon = L.divIcon({
      html: '<div style="background:#e41134;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)">🍽</div>',
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    var userIcon = L.divIcon({
      html: '<div style="background:#006492;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)">👤</div>',
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    L.marker(dishPos, { icon: dishIcon }).addTo(map)
      .bindPopup('<b>${dishName}</b>');

    L.marker(userPos, { icon: userIcon }).addTo(map)
      .bindPopup('<b>Tu ubicación</b>');

    L.polyline([dishPos, userPos], {
      color: '#e41134',
      weight: 3,
      dashArray: '8, 8'
    }).addTo(map);

    var bounds = L.latLngBounds(dishPos, userPos);
    map.fitBounds(bounds, { padding: [50, 50] });
  </script>
</body>
</html>`;
}

export default function DishMapView({ dishLat, dishLng, dishName, userLat, userLng, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ html: generateHTML(dishLat, dishLng, dishName, userLat, userLng) }}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        scalesPageToFit={true}
        style={styles.webview}
        originWhitelist={['*']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 350, width: '100%', borderRadius: 12, overflow: 'hidden' },
  webview: { flex: 1, backgroundColor: 'transparent' },
});
