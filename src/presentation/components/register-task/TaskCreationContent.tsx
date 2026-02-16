import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { TaskStatus } from '@/src/domain';
import { AppHeader } from '@/src/presentation/components/shared/app-header';
import { customColors } from '@/src/presentation/constants/paper-theme';

import { useTask } from '../../contexts/TaskContext';

export default function TaskCreationContent() {
  const { createTaskUseCase } = useTask();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [timeType, setTimeType] = useState<'cronometro' | 'fixo'>('cronometro');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const submitTaskCreation = async () => {
    try {
      await createTaskUseCase.execute({
        title,
        description,
        status: TaskStatus.TODO,
        timeSpent: timeType === 'cronometro' ? 0 : Number(selectedTime?.split(' ')[0]),
        timeType: timeType === 'cronometro' ? 'cronometro' : 'tempo_fixo',
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
    <View style={styles.container}>
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
            textColor={customColors.gray}
            outlineColor={customColors.mediumBlue}
            activeOutlineColor={customColors.mediumBlue}
            style={styles.input}
          />

          <TextInput
            label="Descrição da Tarefa"
            placeholder="Ex: Criar microcomponente"
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            textColor={customColors.gray}
            multiline
            numberOfLines={6}
            outlineColor={customColors.mediumBlue}
            activeOutlineColor={customColors.mediumBlue}
            style={styles.textArea}
          />

          <Text style={styles.labelSection}>Tempo da Tarefa</Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, timeType === 'cronometro' ? styles.tabActiveCron : styles.tabInactive]}
              onPress={() => setTimeType('cronometro')}>
              <Text style={[styles.tabText, timeType === 'cronometro' && styles.textWhite]}>Cronômetro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, timeType === 'fixo' ? styles.tabActiveFixo : styles.tabInactive]}
              onPress={() => setTimeType('fixo')}>
              <Text style={[styles.tabText, timeType === 'fixo' && styles.textWhite]}>Tempo fixo</Text>
            </TouchableOpacity>
          </View>

          {timeType === 'cronometro' ? (
            <View style={styles.timerWrapper}>
              <Text style={styles.timerDisplay}>00:00:00</Text>
            </View>
          ) : (
            <View style={styles.fixedTimeList}>
              {['15 min', '25 min', '45 min', '1 hora'].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[styles.timeOption, selectedTime === time && styles.timeOptionSelected]}
                  onPress={() => setSelectedTime(time)}>
                  <Text style={[styles.timeOptionText, selectedTime === time && styles.textWhite]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.footer}>
            <Button
              mode="contained"
              onPress={submitTaskCreation}
              style={styles.btnSave}
              contentStyle={styles.btnContent}>
              {timeType === 'cronometro' ? 'Adicionar Tarefa e Iniciar Cronômetro' : 'Adicionar Tarefa'}
            </Button>

            <Button
              mode="contained"
              onPress={() => router.back()}
              style={styles.btnCancel}
              contentStyle={styles.btnContent}>
              Cancelar
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: customColors.lightGray,
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
  input: { marginBottom: 16, backgroundColor: customColors.white },
  textArea: { marginBottom: 24, backgroundColor: customColors.white, height: 120 },
  labelSection: { fontSize: 16, fontWeight: '600', color: customColors.mediumBlue, marginBottom: 12 },
  tabContainer: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  tabButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  tabInactive: { backgroundColor: customColors.lightGray },
  tabActiveCron: { backgroundColor: customColors.darkNavy },
  tabActiveFixo: { backgroundColor: customColors.lightGreen },
  tabText: { fontWeight: '500', color: customColors.mediumBlue },
  textWhite: { color: customColors.white },
  timerWrapper: { alignItems: 'center', marginVertical: 40 },
  timerDisplay: { fontSize: 64, fontWeight: 'bold', color: customColors.darkNavy },
  fixedTimeList: { gap: 10 },
  timeOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: customColors.mediumBlue,
    alignItems: 'center',
  },
  timeOptionSelected: { backgroundColor: customColors.skyBlue },
  timeOptionText: { color: customColors.mediumBlue, fontSize: 16 },
  footer: { marginTop: 40, gap: 12 },
  btnSave: { backgroundColor: customColors.skyBlue, borderRadius: 25 },
  btnCancel: { backgroundColor: customColors.coral, borderRadius: 25 },
  btnContent: { paddingVertical: 8 },
});
