import React from 'react';
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDishes, deleteDish } from '@/entities/dish/api';
import { DishCard } from '@/widgets/dish/DishCard';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function DishesList() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: dishes, isLoading, error } = useQuery({
    queryKey: ['dishes'],
    queryFn: fetchDishes,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handlePress = (id: string) => {
    router.push({ pathname: '/(app)/dish/[id]', params: { id } } as any);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#006492" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-gray-50">
        <Feather name="alert-circle" size={48} color="#e41134" className="mb-4" />
        <Text className="text-dominoRed text-center">Error al cargar platillos: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={dishes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <DishCard dish={item} onDelete={handleDelete} onPress={handlePress} />
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
            <Feather name="camera-off" size={64} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-lg">No tienes platillos registrados.</Text>
            <Text className="text-gray-500 mt-1">¡Añade tu primero!</Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-dominoBlue w-16 h-16 rounded-full justify-center items-center shadow-lg"
        onPress={() => router.push('/(app)/dish/new')}
      >
        <Feather name="plus" size={32} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}
