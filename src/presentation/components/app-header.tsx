import { Image } from 'expo-image';
import { useCallback } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { logger } from '@/src/infrastructure/logger';
import { customColors } from '@/src/presentation/constants/paper-theme';
import { spacing } from '@/src/presentation/constants/spacing';
import { typography } from '@/src/presentation/constants/typography';

export function AppHeader() {
  const insets = useSafeAreaInsets();

  const handleExpandPress = useCallback(() => {
    logger.log('Expand pressed');
    // TODO: Implementar ação de expandir
  }, []);

  const handleThemeTogglePress = useCallback(() => {
    logger.log('Theme toggle pressed');
    // TODO: Implementar toggle de tema
  }, []);

  return (
    <>
      {Platform.OS === 'ios' && <View style={[styles.statusBarBackground, { height: insets.top }]} />}
      <View style={styles.container} accessibilityLabel="Cabeçalho da aplicação">
        <Text style={styles.appName} accessibilityRole="header">
          MindEase
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
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
              style={styles.profileImage}
              contentFit="cover"
              accessibilityIgnoresInvertColors
            />
            <View style={styles.statusIndicator} />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  statusBarBackground: {
    backgroundColor: customColors.darkNavy,
    width: '100%',
  },
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
