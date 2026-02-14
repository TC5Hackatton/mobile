import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/src/presentation/components/shared/haptic-tab';
import { IconSymbol } from '@/src/presentation/components/shared/icon-symbol';
import { customColors } from '@/src/presentation/constants/paper-theme';

export default function TabLayout() {
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
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tarefas',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="doc.text.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="preferences"
        options={{
          title: 'Preferências',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
      <Tabs.Screen name="task-creation" options={{ headerShown: false }} />
    </Tabs>
  );
}
