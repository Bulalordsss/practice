import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/templateComponents/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/templateHooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />
        }}
      />
      <Tabs.Screen
        name="To-Do"
        options={{
          title: 'To-Do',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="description" color={color} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="settings" color={color} />
        }}
      />    
    </Tabs>
  );
}
