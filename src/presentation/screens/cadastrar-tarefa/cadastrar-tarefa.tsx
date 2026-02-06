/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppHeader } from '@/src/presentation/components/app-header';
import { customColors } from '@/src/presentation/constants/paper-theme';

export default function CadastrarTarefaScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'cronometro' | 'fixo'>('cronometro');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <AppHeader title="Cadastrar Tarefa" showBackButton onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          label="Nome da Tarefa"
          mode="outlined"
          textColor={customColors.gray}
          outlineColor={customColors.mediumBlue}
          activeOutlineColor={customColors.mediumBlue}
          style={styles.input}
        />

        <TextInput
          label="Descrição da Tarefa"
          placeholder="Ex: Criar microcomponente"
          mode="outlined"
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
            style={[styles.tabButton, tab === 'cronometro' ? styles.tabActiveCron : styles.tabInactive]}
            onPress={() => setTab('cronometro')}
          >
            <Text style={[styles.tabText, tab === 'cronometro' && styles.textWhite]}>Cronômetro</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabButton, tab === 'fixo' ? styles.tabActiveFixo : styles.tabInactive]}
            onPress={() => setTab('fixo')}
          >
            <Text style={[styles.tabText, tab === 'fixo' && styles.textWhite]}>Tempo fixo</Text>
          </TouchableOpacity>
        </View>

        {tab === 'cronometro' ? (
          <View style={styles.timerWrapper}>
            <Text style={styles.timerDisplay}>00:00:00</Text>
          </View>
        ) : (
          <View style={styles.fixedTimeList}>
            {['15 min', '25 min', '45 min', '1 hora'].map((time) => (
              <TouchableOpacity 
                key={time} 
                style={[styles.timeOption, selectedTime === time && styles.timeOptionSelected]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.timeOptionText, selectedTime === time && styles.textWhite]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Button 
            mode="contained" 
            onPress={() => {}} 
            style={styles.btnSave}
            contentStyle={styles.btnContent}
          >
            {tab === 'cronometro' ? "Adicionar Tarefa e Iniciar Cronômetro" : "Adicionar Tarefa"}
          </Button>

          <Button 
            mode="contained" 
            onPress={() => router.back()} 
            style={styles.btnCancel}
            contentStyle={styles.btnContent}
          >
            Cancelar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20 },
  input: { marginBottom: 16, backgroundColor: '#FFF' },
  textArea: { marginBottom: 24, backgroundColor: '#FFF', height: 120 },
  labelSection: { fontSize: 16, fontWeight: '600', color: '#64748B', marginBottom: 12 },
  tabContainer: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  tabButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  tabInactive: { backgroundColor: '#CBD5E1' },
  tabActiveCron: { backgroundColor: '#334155' }, // Azul escuro do mockup
  tabActiveFixo: { backgroundColor: '#A2D9A1' }, // Verde do mockup
  tabText: { fontWeight: '500', color: '#64748B' },
  textWhite: { color: '#FFF' },
  timerWrapper: { alignItems: 'center', marginVertical: 40 },
  timerDisplay: { fontSize: 64, fontWeight: 'bold', color: '#1E293B' },
  fixedTimeList: { gap: 10 },
  timeOption: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: customColors.mediumBlue, alignItems: 'center' },
  timeOptionSelected: { backgroundColor: '#6488B4' }, // Cor azul destacada
  timeOptionText: { color: customColors.mediumBlue, fontSize: 16 },
  footer: { marginTop: 40, gap: 12 },
  btnSave: { backgroundColor: '#6495ED', borderRadius: 25 }, // Azul do mockup
  btnCancel: { backgroundColor: '#E9967A', borderRadius: 25 }, // Salmão do mockup
  btnContent: { paddingVertical: 8 }
});