import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({ title, variant = 'primary', loading, icon, className = '', ...props }: ButtonProps) {
  const baseClasses = "py-4 px-6 rounded-2xl flex-row justify-center items-center shadow-sm";
  
  const variantClasses = {
    primary: "bg-dominoRed",
    secondary: "bg-dominoBlue",
    outline: "bg-transparent border-2 border-dominoBlue",
  };

  const textClasses = {
    primary: "text-dominoWhite font-bold text-lg ml-2",
    secondary: "text-dominoWhite font-bold text-lg ml-2",
    outline: "text-dominoBlue font-bold text-lg ml-2",
  };

  return (
    <TouchableOpacity 
      className={`${baseClasses} ${variantClasses[variant]} ${props.disabled ? 'opacity-50' : ''} ${className}`}
      disabled={loading || props.disabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#006492' : '#ffffff'} />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          <Text className={textClasses[variant]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
