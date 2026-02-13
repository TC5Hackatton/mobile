import { StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';

import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function FloatingActionButton({
  onPress,
  icon = 'plus',
  testID,
  accessibilityLabel = 'Adicionar',
  accessibilityHint,
}: FloatingActionButtonProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}>
      <IconButton icon={icon} iconColor={customColors.white} size={24} style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: customColors.mediumBlue,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    margin: 0,
  },
});
