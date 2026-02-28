import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Switch, Text } from 'react-native-paper';

import { spacing } from '@/src/presentation/constants/spacing';
import { typography, type FontSizeScale } from '@/src/presentation/constants/typography';
import { useFontSizeContext } from '@/src/presentation/contexts/FontSizeContext';
import { useTheme } from '@/src/presentation/contexts/ThemeContext';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';

export function AppearanceSection() {
  const colors = useThemeColors();
  const { fontSize } = useFontSize();
  const { isDark, setTheme } = useTheme();
  const { fontSizeScale, setFontSizeScale } = useFontSizeContext();

  const handleThemeToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleFontSizeChange = (size: FontSizeScale) => {
    setFontSizeScale(size);
  };

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
          <Switch value={isDark} onValueChange={handleThemeToggle} />
        </View>

        <View style={styles.fontSizeContainer}>
          <Text
            variant="titleMedium"
            style={[styles.itemTitle, { fontSize: fontSize.md }]}
            theme={{ colors: { onSurface: colors.text } }}>
            Tamanho da Fonte
          </Text>
          <View style={styles.fontSizeButtons}>
            {(['P', 'M', 'G'] as FontSizeScale[]).map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.fontSizeButton,
                  { backgroundColor: colors.surfaceVariant },
                  fontSizeScale === size && { backgroundColor: colors.primary },
                ]}
                onPress={() => handleFontSizeChange(size)}
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
