import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { uploadImage } from '@/shared/api/storage';
import { supabase } from '@/shared/api/supabase';
import { useAuth } from '@/features/auth/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { getPendingLocation } from '@/shared/utils/pending-location';

export default function NewDishScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      photo_uri: '',
      latitude: null as number | null,
      longitude: null as number | null,
      city: '',
      country: '',
    },
    onSubmit: async ({ value }) => {
      if (!user) return;
      setLoading(true);
      try {
        let photo_url = null;
        if (value.photo_uri) {
          photo_url = await uploadImage(value.photo_uri);
        }

        const { error } = await supabase.from('dishes').insert({
          user_id: user.id,
          name: value.name,
          photo_url,
          latitude: value.latitude,
          longitude: value.longitude,
          city: value.city,
          country: value.country,
        });

        if (error) throw error;

        queryClient.invalidateQueries({ queryKey: ['dishes'] });
        router.back();
      } catch (e: any) {
        Alert.alert('Error', e.message || 'Error al guardar el platillo');
      } finally {
        setLoading(false);
      }
    },
  });

  const pickImage = async (useCamera: boolean, onChange: (val: string) => void) => {
    let result;
    if (useCamera) {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara');
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.2,
      });
    } else {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a la galería');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.2,
      });
    }

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  const getLocation = async (
    setLat: (v: number) => void, 
    setLon: (v: number) => void, 
    setCity: (v: string) => void, 
    setCountry: (v: string) => void
  ) => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación');
        setIsLocating(false);
        return;
      }

      let location;
      try {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      } catch (err) {
        location = await Location.getLastKnownPositionAsync({});
        if (!location) {
          throw new Error('La ubicación no está disponible en este dispositivo');
        }
      }
      setLat(location.coords.latitude);
      setLon(location.coords.longitude);

      const [geo] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geo) {
        setCity(geo.city || geo.subregion || '');
        setCountry(geo.country || '');
      }
    } catch (e: any) {
      console.error('Location error:', e);
      const message = e?.message || '';
      if (message.includes('Location services') || message.includes('unavailable')) {
        Alert.alert(
          'Ubicación no disponible',
          'Asegúrate de tener los servicios de ubicación activados en el emulador o dispositivo.\n\n' +
          'En el emulador Android: abre Extended Controls (⋮) → Location → marca una ubicación.'
        );
      } else {
        Alert.alert('Error', 'No se pudo obtener la ubicación');
      }
    } finally {
      setIsLocating(false);
    }
  };

  // Check for location returned from map-picker
  useFocusEffect(
    useCallback(() => {
      const loc = getPendingLocation();
      if (!loc) return;
      form.setFieldValue('latitude', loc.lat);
      form.setFieldValue('longitude', loc.lng);
      Location.reverseGeocodeAsync({
        latitude: loc.lat,
        longitude: loc.lng,
      }).then(([geo]) => {
        if (geo) {
          form.setFieldValue('city', geo.city || geo.subregion || '');
          form.setFieldValue('country', geo.country || '');
        }
      });
    }, [form])
  );

  return (
    <ScrollView className="flex-1 bg-dominoWhite" contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
      
      <form.Field
        name="photo_uri"
        validators={{
          onChange: ({ value }) => (!value ? 'La foto es requerida' : undefined),
        }}
      >
        {(field) => (
          <View className="mb-6 items-center">
            {field.state.value ? (
              <Image source={{ uri: field.state.value }} className="w-full h-64 rounded-2xl bg-gray-200" />
            ) : (
              <View className="w-full h-64 rounded-2xl bg-gray-100 justify-center items-center border border-dashed border-gray-300">
                <Text className="text-gray-400">Sin foto</Text>
              </View>
            )}
            {field.state.meta.errors[0] && (
              <Text className="text-dominoRed mt-1">{field.state.meta.errors[0]}</Text>
            )}
            
            <View className="flex-row mt-4 space-x-4">
              <TouchableOpacity 
                className="bg-dominoBlue py-2 px-4 rounded-xl mr-2 flex-row items-center"
                onPress={() => pickImage(true, field.handleChange)}
              >
                <Feather name="camera" size={18} color="#ffffff" />
                <Text className="text-white font-bold ml-2">Tomar Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-dominoRed py-2 px-4 rounded-xl flex-row items-center"
                onPress={() => pickImage(false, field.handleChange)}
              >
                <Feather name="image" size={18} color="#ffffff" />
                <Text className="text-white font-bold ml-2">Galería</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </form.Field>

      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            if (!value) return 'El nombre es requerido';
            if (/\d/.test(value)) return 'El nombre no puede contener números';
            return undefined;
          },
        }}
      >
        {(field) => (
          <Input
            label="Nombre del Platillo"
            placeholder="Ej. Pizza Margarita"
            value={field.state.value}
            onChangeText={(text) => field.handleChange(text)}
            error={field.state.meta.errors[0] as string}
          />
        )}
      </form.Field>

      <View className="bg-gray-100 p-4 rounded-xl mb-6">
        <Text className="font-bold text-dominoBlue mb-2">Ubicación GPS</Text>
        
        <form.Field name="city">
          {(cityField) => (
            <form.Field name="country">
              {(countryField) => (
                <form.Field name="latitude">
                  {(latField) => (
                    <form.Field name="longitude">
                      {(lonField) => (
                        <View>
                          {latField.state.value && lonField.state.value ? (
                            <View className="mb-3">
                              <Text className="text-gray-700 font-bold">
                                <Feather name="map-pin" size={14} color="#374151" /> {cityField.state.value ? `${cityField.state.value}, ` : ''}{countryField.state.value}
                              </Text>
                              <Text className="text-gray-500 text-xs mt-1">{latField.state.value}, {lonField.state.value}</Text>
                            </View>
                          ) : (
                            <Text className="text-dominoRed text-sm mb-3">La ubicación es obligatoria</Text>
                          )}
                          
                          <Button 
                            title={isLocating ? "Obteniendo..." : "Obtener mi ubicación"} 
                            onPress={() => getLocation(
                              latField.handleChange, 
                              lonField.handleChange, 
                              cityField.handleChange, 
                              countryField.handleChange
                            )}
                            variant="outline"
                            loading={isLocating}
                            icon={<Feather name="navigation" size={18} color="#006492" />}
                          />

                          <View className="h-3" />

                          <Button 
                            title="Seleccionar en mapa"
                            onPress={() => router.push('/(app)/dish/map-picker' as any)}
                            variant="secondary"
                            icon={<Feather name="map" size={18} color="#ffffff" />}
                          />
                        </View>
                      )}
                    </form.Field>
                  )}
                </form.Field>
              )}
            </form.Field>
          )}
        </form.Field>
      </View>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button 
            title="Guardar Platillo" 
            onPress={form.handleSubmit} 
            disabled={!canSubmit}
            loading={loading || isSubmitting}
            icon={<Feather name="save" size={20} color="#ffffff" />}
          />
        )}
      </form.Subscribe>

    </ScrollView>
  );
}
