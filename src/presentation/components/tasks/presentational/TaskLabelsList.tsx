import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

import { TaskLabel } from '../types/TaskLabel';

interface TaskLabelsListProps {
  labels: TaskLabel[];
}

export function TaskLabelsList({ labels }: TaskLabelsListProps) {
  if (!labels || labels.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {labels.map((label, index) => (
        <View key={`${label}-${index}`} style={[styles.labelContainer, { backgroundColor: label.color + '40' }]}>
          <IconButton icon={label.icon} size={14} iconColor={label.color} style={styles.labelIcon} />
          <Text variant="labelSmall" style={{ color: label.color }}>
            {label.text}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingRight: 8,
    alignSelf: 'flex-start',
  },
  labelIcon: {
    margin: 0,
    padding: 0,
    width: 20,
    height: 20,
  },
});
