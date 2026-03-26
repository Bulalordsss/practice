import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/templateComponents/themed-text';
import { ThemedView } from '@/components/templateComponents/themed-view';
import { Button } from '@/components/button';
import { TextField } from '@/components/textField';

import { useLoginUIState } from '@/stores/loginUIState';
import { useAuthLogin } from '@/hooks/authLogin';

export default function LoginScreen() {
  const router = useRouter();

  const username = useLoginUIState((s) => s.username);
  const password = useLoginUIState((s) => s.password);
  const setUsername = useLoginUIState((s) => s.setUsername);
  const setPassword = useLoginUIState((s) => s.setPassword);
  const error = useLoginUIState((s) => s.error);

  const { login, isSubmitting } = useAuthLogin();

  const onSubmit = async () => {
    try {
      await login();
      router.replace({ pathname: '/(tabs)' as any });
    } catch {
      console.log('Login failed');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Login</ThemedText>

      <TextField
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isSubmitting}
      />

      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        showPasswordToggle
        editable={!isSubmitting}
        error={error}
      />

      <Button title="Sign in" onPress={onSubmit} isLoading={isSubmitting} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
});
