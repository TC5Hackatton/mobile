import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';

import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';
import { useDependencies } from '@/src/presentation/contexts/DependenciesContext';
import { useSession } from '@/src/presentation/contexts/SessionContext';
import { useTheme } from '@/src/presentation/contexts/ThemeContext';
import { IconSymbol } from './icon-symbol';

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export function AppHeader({ title = 'MindEase', showBackButton = false }: AppHeaderProps) {
  const { logger } = useDependencies();
  const { clearSession } = useSession();
  const { isDark, toggleTheme } = useTheme();

  const [menuVisible, setMenuVisible] = useState(false);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const handleExpandPress = useCallback(() => {
    logger.log('Expand pressed');
    // TODO: Implementar ação de expandir
  }, [logger]);

  const handleThemeTogglePress = useCallback(() => {
    logger.log('Theme toggle pressed');
    toggleTheme();
  }, [logger, toggleTheme]);

  const handleLogout = useCallback(async () => {
    setMenuVisible(false);
    logger.log('Logout pressed');
    await clearSession();
    router.replace('/sign-in');
  }, [logger, clearSession]);

  // Cores dinâmicas baseadas no tema
  const backgroundColor = isDark ? customColors.darkNavy : customColors.white;
  const titleColor = isDark
    ? showBackButton
      ? customColors.darkText
      : customColors.lightBlue
    : showBackButton
      ? customColors.darkNavy
      : customColors.skyBlue;
  const backButtonColor = isDark ? customColors.darkText : customColors.darkNavy;
  const iconColor = isDark ? customColors.lightBlue : customColors.gray;
  const statusIndicatorBorderColor = isDark ? customColors.darkNavy : customColors.white;

  return (
    <View style={[styles.container, { backgroundColor }]} accessibilityLabel="Cabeçalho da aplicação">
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Voltar">
            <IconButton icon="arrow-left" iconColor={backButtonColor} size={24} style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>

      <Text
        style={[styles.title, showBackButton && styles.titleWithBack, { color: titleColor }]}
        accessibilityRole="header">
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
          <IconButton icon="circle-half-full" iconColor={iconColor} size={24} style={styles.icon} />
        </TouchableOpacity>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={styles.profileContainer}
              accessibilityRole="button"
              accessibilityLabel="Menu do usuário">
              <IconSymbol size={36} name="person.circle.fill" color={iconColor} />
              <View style={[styles.statusIndicator, { borderColor: statusIndicatorBorderColor }]} />
            </TouchableOpacity>
          }
          contentStyle={{ backgroundColor: isDark ? customColors.darkNavy : customColors.white }}>
          <Menu.Item
            onPress={handleLogout}
            title="Sair"
            leadingIcon="logout"
            titleStyle={{ color: isDark ? customColors.darkText : customColors.darkNavy }}
          />
        </Menu>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  backButton: {
    margin: 0,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.semiBold,
    flex: 1,
  },
  titleWithBack: {
    textAlign: 'center',
    fontSize: typography.fontSize.lg,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
  },
});
