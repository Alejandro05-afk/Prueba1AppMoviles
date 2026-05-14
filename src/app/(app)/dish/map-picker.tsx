import { Button } from '@/shared/ui/Button';
import { setPendingLocation } from '@/shared/utils/pending-location';
import LocationPicker from '@/widgets/map/LocationPicker.native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapPickerScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);

  const handleSelect = useCallback((lat: number, lng: number) => {
    setSelected({ lat, lng });
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selected) {
      Alert.alert('Selecciona una ubicación', 'Toca el mapa para marcar la ubicación del platillo.');
      return;
    }
    setPendingLocation(selected.lat, selected.lng);
    router.back();
  }, [selected, router]);

  return (
    <SafeAreaView className="flex-1 bg-dominoWhite">
      <View className="flex-1">
        <LocationPicker
          onLocationSelect={handleSelect}
          style={{ flex: 1, borderRadius: 0 }}
        />
      </View>

      <View className="p-4 bg-white border-t border-gray-200">
        {selected ? (
          <View className="mb-3 flex-row items-center">
            <Feather name="map-pin" size={16} color="#006492" />
            <Text className="text-dominoBlue ml-2 font-medium">
              {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
            </Text>
          </View>
        ) : (
          <Text className="text-gray-500 text-center mb-3">Toca el mapa para seleccionar un punto</Text>
        )}
        <Button title="Confirmar ubicación" onPress={handleConfirm} />
      </View>
    </SafeAreaView>
  );
}
