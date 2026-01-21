import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/src/presentation/components/haptic-tab';
import { IconSymbol } from '@/src/presentation/components/ui/icon-symbol';
import { customColors } from '@/src/presentation/constants/paper-theme';
import { useColorScheme } from '@/src/presentation/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: customColors.coral,
        tabBarInactiveTintColor: customColors.mediumGray,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: customColors.white,
          borderTopWidth: 1,
          borderTopColor: customColors.lightGray,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Raleway_400Regular',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='house.fill' color={color} />,
        }}
      />
      <Tabs.Screen
        name='explore'
        options={{
          title: 'Tarefas',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='doc.text.fill' color={color} />,
        }}
      />
      <Tabs.Screen
        name='lorem'
        options={{
          title: 'Lorem',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='square' color={color} />,
        }}
      />
      <Tabs.Screen
        name='preferences'
        options={{
          title: 'Preferências',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name='gearshape.fill' color={color} />,
        }}
      />
    </Tabs>
  );
}
