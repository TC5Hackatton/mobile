import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Switch, Text } from 'react-native-paper';

import { Settings, type FontSizeScale } from '@/src/domain';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

interface AppearanceSectionProps {
  isDark: boolean;
  fontSizeScale: FontSizeScale;
  onThemeToggle: () => void;
  onFontSizeChange: (size: FontSizeScale) => void;
}

export function AppearanceSection({ isDark, fontSizeScale, onThemeToggle, onFontSizeChange }: AppearanceSectionProps) {
  const colors = useThemeColors();
  const { fontSize } = useFontSize();

  return (
    <Card
      style={[styles.card, { backgroundColor: colors.surface }]}
      mode="elevated"
      elevation={2}
      theme={{ colors: { surface: colors.surface } }}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="brightness-3" size={24} color={colors.text} />
          <Text
            variant="titleLarge"
            style={[styles.sectionTitle, { fontSize: fontSize.lg }]}
            theme={{ colors: { onSurface: colors.text } }}>
            Aparência
          </Text>
        </View>

        <View style={styles.item}>
          <View style={styles.itemContent}>
            <Text
              variant="titleMedium"
              style={[styles.itemTitle, { fontSize: fontSize.md }]}
              theme={{ colors: { onSurface: colors.text } }}>
              Modo Escuro
            </Text>
            <Text
              variant="bodySmall"
              style={[styles.itemSubtitle, { fontSize: fontSize.sm }]}
              theme={{ colors: { onSurface: colors.textSecondary } }}>
              Reduz luz da tela
            </Text>
          </View>
          <Switch value={isDark} onValueChange={onThemeToggle} />
        </View>

        <View style={styles.fontSizeContainer}>
          <Text
            variant="titleMedium"
            style={[styles.itemTitle, { fontSize: fontSize.md }]}
            theme={{ colors: { onSurface: colors.text } }}>
            Tamanho da Fonte
          </Text>
          <View style={styles.fontSizeButtons}>
            {Settings.VALID_FONT_SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontSizeButton,
                  { backgroundColor: colors.surfaceVariant },
                  fontSizeScale === size && { backgroundColor: colors.primary },
                ]}
                onPress={() => onFontSizeChange(size)}
                accessibilityRole="button"
                accessibilityLabel={`Tamanho ${size === 'P' ? 'Pequeno' : size === 'M' ? 'Médio' : 'Grande'}`}>
                <Text
                  style={[
                    styles.fontSizeButtonText,
                    {
                      color: colors.textSecondary,
                      fontSize: fontSize.md,
                    },
                    fontSizeScale === size && { color: colors.white },
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
    fontFamily: typography.fontFamily.bold,
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
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.xs,
  },
  itemSubtitle: {
    fontFamily: typography.fontFamily.regular,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeButtonText: {
    fontFamily: typography.fontFamily.medium,
  },
});
