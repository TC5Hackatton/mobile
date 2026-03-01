import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { TaskStatus } from '@/src/domain';
import { AppHeader } from '@/src/presentation/components/shared/app-header';
import { CustomButton } from '@/src/presentation/components/shared/custom-button';
import { useTask } from '@/src/presentation/contexts/TaskContext';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

export default function TaskCreationContent() {
  const { createTaskUseCase } = useTask();
  const colors = useThemeColors();
  const { fontSize } = useFontSize();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [timeType, setTimeType] = useState<'cronometro' | 'fixo'>('cronometro');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const submitTaskCreation = async () => {
    try {
      await createTaskUseCase.execute({
        title,
        description,
        status: timeType === 'cronometro' ? TaskStatus.DOING : TaskStatus.TODO,
        timeValue: timeType === 'cronometro' ? 0 : Number(selectedTime?.split(' ')[0]),
        timeSpend: 0,
        timeType: timeType === 'cronometro' ? 'cronometro' : 'tempo_fixo',
        createdAt: new Date(),
        ...(timeType === 'cronometro' && { statusChangedAt: new Date() }),
      });

      Toast.show({
        type: 'success',
        text1: 'Tarefa criada com sucesso',
      });
      router.push('/tasks');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao criar tarefa',
        text2: String(error).split(':')[1],
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <AppHeader title="Criar Tarefa" showBackButton />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <TextInput
            label="Nome da Tarefa"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
            textColor={colors.text}
            outlineColor={colors.tertiary}
            activeOutlineColor={colors.tertiary}
            style={[styles.input, { backgroundColor: colors.surface }]}
            contentStyle={{ fontSize: fontSize.md }}
            theme={{ fonts: { bodyLarge: { fontFamily: 'Raleway_400Regular' } } }}
          />

          <TextInput
            label="Descrição da Tarefa"
            placeholder="Ex: Criar microcomponente"
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            textColor={colors.text}
            multiline
            numberOfLines={6}
            outlineColor={colors.tertiary}
            activeOutlineColor={colors.tertiary}
            style={[styles.textArea, { backgroundColor: colors.surface }]}
            contentStyle={{ fontSize: fontSize.md }}
            theme={{ fonts: { bodyLarge: { fontFamily: 'Raleway_400Regular' } } }}
          />

          <Text style={[styles.labelSection, { color: colors.text, fontSize: fontSize.md }]}>Tempo da Tarefa</Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                { backgroundColor: colors.surfaceVariant },
                timeType === 'cronometro' && { backgroundColor: colors.secondary },
              ]}
              onPress={() => setTimeType('cronometro')}>
              <Text
                style={[
                  styles.tabText,
                  { color: colors.text, fontSize: fontSize.md },
                  timeType === 'cronometro' && { color: colors.text },
                ]}>
                Cronômetro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                { backgroundColor: colors.surfaceVariant },
                timeType === 'fixo' && { backgroundColor: colors.secondary },
              ]}
              onPress={() => setTimeType('fixo')}>
              <Text
                style={[
                  styles.tabText,
                  { color: colors.text, fontSize: fontSize.md },
                  timeType === 'fixo' && { color: colors.white },
                ]}>
                Tempo fixo
              </Text>
            </TouchableOpacity>
          </View>

          {timeType === 'cronometro' ? (
            <View style={styles.timerWrapper}>
              <Text style={[styles.timerDisplay, { color: colors.text, fontSize: fontSize.xxxl }]}>00:00:00</Text>
            </View>
          ) : (
            <View style={styles.fixedTimeList}>
              {['15 min', '25 min', '35 min', '45 min'].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeOption,
                    { borderColor: colors.tertiary },
                    selectedTime === time && { backgroundColor: colors.tertiary },
                  ]}
                  onPress={() => setSelectedTime(time)}>
                  <Text
                    style={[
                      styles.timeOptionText,
                      { color: colors.text, fontSize: fontSize.md },
                      selectedTime === time && { color: colors.white },
                    ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.footer}>
            <CustomButton
              label={timeType === 'cronometro' ? 'Adicionar Tarefa e Iniciar Cronômetro' : 'Adicionar Tarefa'}
              onPress={submitTaskCreation}
              variant="primary"
            />

            <CustomButton
              label="Cancelar"
              onPress={() => router.back()}
              variant="cancel"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  input: { marginBottom: 16 },
  textArea: { marginBottom: 24, height: 120 },
  labelSection: { fontWeight: '600', marginBottom: 12 },
  tabContainer: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  tabButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  tabText: { fontWeight: '500' },
  timerWrapper: { alignItems: 'center', marginVertical: 40 },
  timerDisplay: { fontWeight: 'bold' },
  fixedTimeList: { gap: 10 },
  timeOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  timeOptionText: {},
  footer: { marginTop: 40, gap: 12 },
});
