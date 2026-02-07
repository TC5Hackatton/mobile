import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FAB, Portal } from 'react-native-paper';

export function FloatingActionButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Portal>
      <View style={styles.wrapper}>
        {open && (
          <View style={styles.actions}>
            {/* Checklist */}
            <Pressable
              style={styles.pillButton}
              onPress={() => {
                setOpen(false);
                console.log('Checklist');
              }}>
              <MaterialCommunityIcons name="format-list-checks" size={20} color="#4A617C" />
              <Text style={styles.pillText}>Checklist</Text>
            </Pressable>

            {/* Tarefa */}
            <Pressable
              style={styles.pillButton}
              onPress={() => {
                setOpen(false);
                router.push('/cadastrar-tarefa');
              }}>
              <MaterialCommunityIcons name="file-document-outline" size={20} color="#4A617C" />
              <Text style={styles.pillText}>Tarefa</Text>
            </Pressable>
          </View>
        )}

        <FAB icon={open ? 'close' : 'plus'} onPress={() => setOpen(!open)} style={styles.fab} color="#fff" />
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    alignItems: 'flex-end',
  },

  actions: {
    marginBottom: 12,
    gap: 10,
  },

  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BDD1E6',
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 42,
    gap: 10,
  },

  pillText: {
    color: '#4A617C',
    fontSize: 15,
    fontWeight: '600',
  },

  fab: {
    backgroundColor: customColors.mediumBlue,
    borderRadius: 28,
  },
});
