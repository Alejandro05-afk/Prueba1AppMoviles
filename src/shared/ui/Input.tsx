import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <View className={`mb-4 ${className}`}>
      <Text className="text-gray-700 font-semibold mb-2 ml-1">{label}</Text>
      <TextInput
        className={`bg-gray-100 px-4 py-4 rounded-xl text-base border ${error ? 'border-dominoRed' : 'border-transparent'}`}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && <Text className="text-dominoRed text-sm mt-1 ml-1">{error}</Text>}
    </View>
  );
}
