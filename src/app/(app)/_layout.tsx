import { Stack } from 'expo-router';
import { TouchableOpacity, Text, View } from 'react-native';
import { supabase } from '@/shared/api/supabase';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function AppLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Gastro Map',
          headerStyle: { backgroundColor: '#e41134' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} className="flex-row items-center mr-2">
              <Feather name="log-out" size={20} color="#fff" />
              <Text className="text-white font-bold ml-2">Salir</Text>
            </TouchableOpacity>
          )
        }} 
      />
      <Stack.Screen 
        name="dish/new" 
        options={{ 
          title: 'Nuevo Platillo',
          headerStyle: { backgroundColor: '#006492' },
          headerTintColor: '#fff',
          presentation: 'modal'
        }} 
      />
    </Stack>
  );
}
