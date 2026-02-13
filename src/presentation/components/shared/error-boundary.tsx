import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ErrorHandler } from '@/src/infrastructure/error-handler';
import { customColors } from '@/src/presentation/constants/paper-theme';
import { typography } from '@/src/presentation/constants/typography';
import { CustomButton } from './custom-button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    ErrorHandler.handle(error, 'ErrorBoundary');
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container} accessibilityRole="alert">
          <View style={styles.content}>
            <Text style={styles.title} accessibilityRole="header">
              Ops! Algo deu errado
            </Text>
            <Text style={styles.message}>
              {ErrorHandler.getUserFriendlyMessage(ErrorHandler.handle(this.state.error || new Error('Unknown error')))}
            </Text>
            <CustomButton
              label="Tentar novamente"
              onPress={this.handleReset}
              variant="primary"
              accessibilityLabel="Tentar novamente após erro"
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: customColors.lightGray,
  },
  content: {
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontFamily: typography.fontFamily.semiBold,
    color: customColors.darkNavy,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.regular,
    color: customColors.mediumGray,
    marginBottom: 24,
    textAlign: 'center',
  },
});
