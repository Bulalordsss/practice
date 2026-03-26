import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/templateComponents/themed-text';

export type TextFieldProps = TextInputProps & {
  label: string;
  error?: string | null;
  showPasswordToggle?: boolean;
};

export function TextField({
  label,
  error,
  style,
  secureTextEntry,
  showPasswordToggle,
  editable,
  ...rest
}: TextFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordField = Boolean(secureTextEntry);
  const canToggle = Boolean(isPasswordField && showPasswordToggle);

  const resolvedSecureTextEntry = useMemo(() => {
    if (!isPasswordField) return false;
    return !isPasswordVisible;
  }, [isPasswordField, isPasswordVisible]);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, canToggle ? styles.inputWithRight : null, style]}
          secureTextEntry={resolvedSecureTextEntry}
          editable={editable}
          {...rest}
        />

        {canToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            onPress={() => setIsPasswordVisible((v) => !v)}
            disabled={editable === false}
            style={({ pressed }) => [styles.toggle, pressed ? styles.togglePressed : null]}
          >
            <ThemedText style={styles.toggleText}>{isPasswordVisible ? 'Hide' : 'Show'}</ThemedText>
          </Pressable>
        ) : null}
      </View>

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    marginTop: 6,
  },
  inputRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(120,120,120,0.4)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputWithRight: {
    paddingRight: 64,
  },
  toggle: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  togglePressed: {
    opacity: 0.7,
  },
  toggleText: {
    fontWeight: '600',
    opacity: 0.85,
  },
  error: {
    color: '#D12C2C',
    marginTop: 4,
  },
});
