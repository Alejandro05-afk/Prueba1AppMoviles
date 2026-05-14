import { fetchDish } from '@/entities/dish/api';
import { Dish } from '@/entities/dish/types';
import { Button } from '@/shared/ui/Button';
import { calculateDistance } from '@/shared/utils/distance';
import DishMapView from '@/widgets/map/DishMapView.native';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchDish(id)
      .then(setDish)
      .catch((e) => Alert.alert('Error', e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const getUserLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLoc({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    } catch (e: any) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación');
    } finally {
      setLocating(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-dominoWhite">
        <ActivityIndicator size="large" color="#006492" />
      </View>
    );
  }

  if (!dish) {
    return (
      <View className="flex-1 justify-center items-center bg-dominoWhite p-4">
        <Feather name="alert-circle" size={48} color="#e41134" />
        <Text className="text-dominoRed mt-4 text-center">No se encontró el platillo</Text>
      </View>
    );
  }

  const hasCoords = dish.latitude && dish.longitude;

  return (
    <ScrollView className="flex-1 bg-dominoWhite" contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
      {dish.photo_url ? (
        <Image source={{ uri: dish.photo_url }} className="w-full h-64 bg-gray-200" resizeMode="cover" />
      ) : (
        <View className="w-full h-64 bg-gray-200 justify-center items-center">
          <Feather name="image" size={48} color="#9ca3af" />
        </View>
      )}

      <View className="p-5">
        <Text className="text-2xl font-bold text-dominoBlue mb-2">{dish.name}</Text>

        <View className="flex-row items-center mb-1">
          <Feather name="map-pin" size={16} color="#e41134" />
          <Text className="text-gray-600 ml-2">
            {dish.city ? `${dish.city}, ` : ''}{dish.country || 'Ubicación desconocida'}
          </Text>
        </View>

        {hasCoords && (
          <Text className="text-gray-400 text-xs ml-6 mb-4">
            {dish.latitude!.toFixed(4)}, {dish.longitude!.toFixed(4)}
          </Text>
        )}

        {hasCoords && (
          <View className="mt-4">
            {!userLoc ? (
              <Button
                title={locating ? 'Obteniendo ubicación...' : 'Ver ubicación en mapa'}
                onPress={getUserLocation}
                loading={locating}
                icon={<Feather name="map" size={18} color="#ffffff" />}
              />
            ) : (
              <View>
                <DishMapView
                  dishLat={dish.latitude!}
                  dishLng={dish.longitude!}
                  dishName={dish.name}
                  userLat={userLoc.lat}
                  userLng={userLoc.lng}
                />
                <View className="mt-3 bg-dominoBlue/10 p-3 rounded-xl flex-row items-center">
                  <Feather name="navigation" size={18} color="#006492" />
                  <Text className="text-dominoBlue font-bold ml-2">
                    Distancia: {calculateDistance(userLoc.lat, userLoc.lng, dish.latitude!, dish.longitude!)} km
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
