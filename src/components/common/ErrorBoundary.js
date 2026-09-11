import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

import WarningIcon from '@assets/icons/warning-line.svg';
import colors from '@style/colors';
import typography from '@style/typography';
import Button from '../Button';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <WarningIcon width={56} height={56} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{'문제가 발생했습니다'}</Text>
              <Text style={styles.description}>
                {'일시적인 오류가 발생했습니다.\n다시 시도해주세요.'}
              </Text>
            </View>
            <Button
              title="다시 시도"
              onPress={this.handleRetry}
              style={styles.button}
              textStyle={styles.buttonText}
            />
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 24,
  },
  textContainer: {
    gap: 4,
    alignItems: 'center',
  },
  title: {
    ...typography.heading4,
    color: colors.gray[400],
    textAlign: 'center',
  },
  description: {
    ...typography.body4Regular,
    color: colors.gray[300],
    textAlign: 'center',
  },
  button: {
    width: 200,
    height: 49,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray[900],
    borderRadius: 10,
    marginTop: 12,
  },
  buttonText: {
    color: colors.common.white,
    ...typography.heading6,
  },
});

export default ErrorBoundary;
