import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { Dish } from '@/entities/dish/types';
import Animated, { 
  FadeInDown, 
  FadeOutLeft, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  runOnJS,
  withTiming
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface DishCardProps {
  dish: Dish;
  onDelete: (id: string) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

export function DishCard({ dish, onDelete }: DishCardProps) {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Allow only swipe left
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (translateX.value < TRANSLATE_X_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH, {}, () => {
          runOnJS(onDelete)(dish.id);
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.95);
    })
    .onFinalize(() => {
      scale.value = withSpring(1);
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ],
    opacity: opacity.value
  }));

  const composedGesture = Gesture.Simultaneous(panGesture, tapGesture);

  return (
    <Animated.View 
      entering={FadeInDown} 
      exiting={FadeOutLeft}
      className="mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative"
    >
      <View className="absolute right-0 top-0 bottom-0 bg-dominoRed justify-center items-end px-6 z-0 w-full">
        <Text className="text-white font-bold">Eliminar</Text>
      </View>
      
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={rStyle} className="bg-white rounded-2xl z-10 shadow-sm border border-gray-100 overflow-hidden">
          {dish.photo_url ? (
            <Image 
              source={{ uri: dish.photo_url }} 
              className="w-full h-48 bg-gray-200"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-48 bg-gray-200 justify-center items-center">
              <Text className="text-gray-400">Sin imagen</Text>
            </View>
          )}
          
          <View className="p-4">
            <Text className="text-xl font-bold text-dominoBlue mb-1">{dish.name}</Text>
            <Text className="text-gray-500 text-sm">
              {dish.city ? `${dish.city}, ` : ''}{dish.country || 'Ubicación desconocida'}
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
