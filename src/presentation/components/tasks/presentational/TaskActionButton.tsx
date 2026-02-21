import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';

import { TaskStatus } from '@/src/domain';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

interface TaskActionButtonProps {
  status: TaskStatus;
  onPressStart?: () => void;
  onPressFinish?: () => void;
  onPressPause?: () => void;
}

export function TaskActionButton({ status, onPressStart, onPressFinish, onPressPause }: TaskActionButtonProps) {
  const colors = useThemeColors();

  switch (status) {
    case TaskStatus.TODO:
      return (
        <IconButton
          icon="play"
          mode="contained"
          containerColor={colors.primary + '40'}
          iconColor={colors.primary}
          size={24}
          onPress={onPressStart}
        />
      );
    case TaskStatus.DOING:
      return (
        <View style={styles.actionButtonsGroup}>
          <IconButton
            icon="flag-checkered"
            mode="contained"
            containerColor={colors.secondary + '40'}
            iconColor={colors.secondary}
            size={24}
            onPress={onPressFinish}
          />
          <IconButton
            icon="pause"
            mode="contained"
            containerColor={colors.textSecondary + '40'}
            iconColor={colors.textSecondary}
            size={24}
            onPress={onPressPause}
          />
        </View>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  actionButtonsGroup: {
    flexDirection: 'row',
    gap: 4,
  },
});
