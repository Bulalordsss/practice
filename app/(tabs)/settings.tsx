import React from 'react';

import { ThemedText } from '@/components/templateComponents/themed-text';
import { ThemedView } from '@/components/templateComponents/themed-view';

export default function SettingsScreen() {
  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <ThemedText type="title">Settings</ThemedText>
    </ThemedView>
  );
}
