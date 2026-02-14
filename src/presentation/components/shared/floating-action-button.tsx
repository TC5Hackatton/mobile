import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { AnimatedFAB } from 'react-native-paper';

export function FloatingActionButton() {
  return (
    <AnimatedFAB
      icon="plus"
      label=""
      extended={false}
      onPress={() => router.push('/task-creation')}
      visible={true}
      animateFrom="right"
      iconMode="static"
      style={styles.fabStyle}
      color="#fff"
    />
  );
}

const styles = StyleSheet.create({
  fabStyle: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: customColors.mediumBlue,
  },
});
