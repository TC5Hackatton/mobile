import { spacing } from '@/src/presentation/constants/spacing';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { AnimatedFAB } from 'react-native-paper';

export function FloatingActionButton() {
  const colors = useThemeColors();
  
  return (
    <AnimatedFAB
      icon="plus"
      label=""
      extended={false}
      onPress={() => router.push('/task-creation')}
      visible={true}
      animateFrom="right"
      iconMode="static"
      style={[styles.fabStyle, { backgroundColor: colors.primary }]}
      color={colors.white}
    />
  );
}

const styles = StyleSheet.create({
  fabStyle: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
  },
});
