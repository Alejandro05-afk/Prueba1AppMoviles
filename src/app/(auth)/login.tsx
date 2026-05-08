import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { useRouter, Link } from 'expo-router';
import { supabase } from '@/shared/api/supabase';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password,
      });

      setLoading(false);
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        router.replace('/(app)');
      }
    },
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-dominoWhite"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View className="mb-10 items-center">
          <View className="bg-dominoBlue p-4 rounded-full mb-4">
            <Feather name="map-pin" size={48} color="#ffffff" />
          </View>
          <Text className="text-4xl font-extrabold text-dominoBlue mb-2">Gastro Map</Text>
          <Text className="text-gray-500 text-base text-center">Inicia sesión para registrar tus platillos favoritos.</Text>
        </View>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => (!value ? 'El email es requerido' : !/\S+@\S+\.\S+/.test(value) ? 'Email no válido' : undefined),
          }}
        >
          {(field) => (
            <Input
              label="Correo electrónico"
              placeholder="tu@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={field.state.value}
              onChangeText={(text) => field.handleChange(text)}
              error={field.state.meta.errors[0] as string}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => (!value ? 'La contraseña es requerida' : value.length < 6 ? 'Mínimo 6 caracteres' : undefined),
          }}
        >
          {(field) => (
            <Input
              label="Contraseña"
              placeholder="••••••••"
              secureTextEntry
              value={field.state.value}
              onChangeText={(text) => field.handleChange(text)}
              error={field.state.meta.errors[0] as string}
            />
          )}
        </form.Field>

        <View className="mt-6">
          <Button 
            title="Iniciar Sesión" 
            onPress={form.handleSubmit} 
            loading={loading} 
            disabled={!form.state.canSubmit}
            icon={<Feather name="log-in" size={20} color="#ffffff" />}
          />
        </View>

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-600">¿No tienes cuenta? </Text>
          <Link href="/(auth)/register" asChild>
            <Text className="text-dominoRed font-bold">Regístrate</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
