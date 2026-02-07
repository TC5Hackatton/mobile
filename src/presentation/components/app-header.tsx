import { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';

import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useDependencies } from '@/src/presentation/contexts/DependenciesContext';
import { IconSymbol } from './ui/icon-symbol';

interface AppHeaderProps {
  title: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  const { logger } = useDependencies();

  const handleExpandPress = useCallback(() => {
    logger.log('Expand pressed');
    // TODO: Implementar ação de expandir
  }, [logger]);

  const handleThemeTogglePress = useCallback(() => {
    logger.log('Theme toggle pressed');
    // TODO: Implementar toggle de tema
  }, [logger]);

  return (
    <>
      <View style={styles.container} accessibilityLabel="Cabeçalho da aplicação">
        <Text style={styles.appName} accessibilityRole="header">
          {title}
        </Text>

        <View style={styles.rightSection}>
          <TouchableOpacity
            onPress={handleExpandPress}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Expandir"
            accessibilityHint="Expande o conteúdo da tela">
            <IconButton icon="arrow-expand-all" iconColor={customColors.coral} size={24} style={styles.icon} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleThemeTogglePress}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Alternar tema"
            accessibilityHint="Alterna entre tema claro e escuro">
            <IconButton icon="circle-half-full" iconColor={customColors.gray} size={24} style={styles.icon} />
          </TouchableOpacity>

          <View style={styles.profileContainer} accessibilityRole="button" accessibilityLabel="Perfil do usuário">
            <IconSymbol size={36} name="person.circle.fill" color={customColors.gray} />
            <View style={styles.statusIndicator} />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: customColors.white,
  },
  appName: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.semiBold,
    color: customColors.skyBlue,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: customColors.darkNavy,
    flex: 1,
  },
  iconButton: {
    margin: 0,
  },
  icon: {
    margin: 0,
  },
  profileContainer: {
    position: 'relative',
    marginLeft: spacing.sm,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: customColors.lightBlue,
  },
  statusIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: customColors.lightGreen,
    borderWidth: 2,
    borderColor: customColors.white,
  },
});
