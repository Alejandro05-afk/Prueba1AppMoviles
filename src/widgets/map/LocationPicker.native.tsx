import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

type Props = {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  style?: any;
};

function generateHTML(initialLat: number, initialLng: number) {
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
    var map = L.map('map').setView([${initialLat}, ${initialLng}], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    var marker = null;

    map.on('click', function(e) {
      var lat = e.latlng.lat.toFixed(6);
      var lng = e.latlng.lng.toFixed(6);
      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng]).addTo(map);
      window.ReactNativeWebView.postMessage(JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) }));
    });
  </script>
</body>
</html>`;
}

export default function LocationPicker({ onLocationSelect, initialLat = -0.1807, initialLng = -78.4678, style }: Props) {
  const webViewRef = useRef<WebView>(null);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (typeof data.lat === 'number' && typeof data.lng === 'number') {
        onLocationSelect(data.lat, data.lng);
      }
    } catch {}
  }, [onLocationSelect]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        source={{ html: generateHTML(initialLat, initialLng) }}
        onMessage={handleMessage}
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
  container: { height: 400, width: '100%', borderRadius: 12, overflow: 'hidden' },
  webview: { flex: 1, backgroundColor: 'transparent' },
});
