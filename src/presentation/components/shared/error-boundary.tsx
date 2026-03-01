import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ErrorHandler } from '@/src/infrastructure/error-handler';
import { customColors } from '@/src/presentation/constants/paper-theme';
import { typography } from '@/src/presentation/constants/typography';
import { FontSizeProvider } from '@/src/presentation/contexts/FontSizeContext';
import { useFontSize } from '@/src/presentation/hooks/use-font-size';
import { CustomButton } from './custom-button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function ErrorFallbackContent({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  const { fontSize } = useFontSize();
  const message = ErrorHandler.getUserFriendlyMessage(
    ErrorHandler.handle(error || new Error('Unknown error')),
  );
  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { fontSize: fontSize.xxl, fontFamily: typography.fontFamily.semiBold, color: customColors.darkNavy },
          ]}
          accessibilityRole="header">
          Ops! Algo deu errado
        </Text>
        <Text
          style={[
            styles.message,
            { fontSize: fontSize.md, fontFamily: typography.fontFamily.regular, color: customColors.mediumGray },
          ]}>
          {message}
        </Text>
        <CustomButton
          label="Tentar novamente"
          onPress={onRetry}
          variant="primary"
          accessibilityLabel="Tentar novamente após erro"
        />
      </View>
    </View>
  );
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
        <FontSizeProvider>
          <ErrorFallbackContent error={this.state.error} onRetry={this.handleReset} />
        </FontSizeProvider>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
  },
});
