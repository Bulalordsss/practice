import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/templateComponents/themed-text';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  isLoading?: boolean;
  style?: ViewStyle;
};

export function Button({ title, isLoading, disabled, onPress, style, ...rest }: ButtonProps) {
  const isDisabled = Boolean(disabled || isLoading);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isDisabled ? styles.disabled : null,
        pressed && !isDisabled ? styles.pressed : null,
        style,
      ]}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <ThemedText numberOfLines={1} style={styles.text}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: 'white',
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
  },
});
