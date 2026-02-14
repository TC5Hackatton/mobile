import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Switch, Text } from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';

type FontSize = 'P' | 'M' | 'G';

export function AppearanceSection() {
  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>('M');

  return (
    <Card style={styles.card} mode="elevated" elevation={2}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="brightness-3" size={24} color={customColors.darkNavy} />
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Aparência
          </Text>
        </View>

        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text variant="titleMedium" style={styles.itemTitle}>
              Modo Escuro
            </Text>
            <Text variant="bodySmall" style={styles.itemSubtitle}>
              Reduz luz da tela
            </Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>

        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text variant="titleMedium" style={styles.itemTitle}>
              Alto Contraste
            </Text>
            <Text variant="bodySmall" style={styles.itemSubtitle}>
              Para melhor legibilidade
            </Text>
          </View>
          <Switch value={highContrast} onValueChange={setHighContrast} />
        </View>

        <View style={styles.fontSizeContainer}>
          <Text variant="titleMedium" style={styles.itemTitle}>
            Tamanho da Fonte
          </Text>
          <View style={styles.fontSizeButtons}>
            {(['P', 'M', 'G'] as FontSize[]).map((size) => (
              <TouchableOpacity
                key={size}
                style={[styles.fontSizeButton, fontSize === size && styles.fontSizeButtonActive]}
                onPress={() => setFontSize(size)}
                accessibilityRole="button"
                accessibilityLabel={`Tamanho ${size === 'P' ? 'Pequeno' : size === 'M' ? 'Médio' : 'Grande'}`}>
                <Text
                  style={[
                    styles.fontSizeButtonText,
                    fontSize === size && styles.fontSizeButtonTextActive,
                  ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: customColors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: customColors.darkNavy,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: customColors.darkNavy,
    marginBottom: spacing.xs,
  },
  itemSubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: customColors.mediumGray,
  },
  fontSizeContainer: {
    marginTop: spacing.md,
  },
  fontSizeButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  fontSizeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: '#F0F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeButtonActive: {
    backgroundColor: customColors.mediumBlue,
  },
  fontSizeButtonText: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.medium,
    color: customColors.mediumGray,
  },
  fontSizeButtonTextActive: {
    color: customColors.white,
  },
});
