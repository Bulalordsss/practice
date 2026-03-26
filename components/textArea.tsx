import React from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/templateComponents/themed-text';

export type TextAreaProps = TextInputProps & {
  label: string;
  error?: string | null;
};

export function TextArea({ label, error, style, ...rest }: TextAreaProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        multiline
        textAlignVertical="top"
        style={[styles.input, style]}
        placeholderTextColor="rgba(120,120,120,0.7)"
        {...rest}
      />
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    marginTop: 4,
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(120,120,120,0.35)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
  },
  error: {
    color: '#D12C2C',
  },
});
