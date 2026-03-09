import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

import WarningIcon from '@assets/icons/warning-line.svg';
import colors from '@style/colors';
import typography from '@style/typography';

const WIPScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <WarningIcon width={56} height={56} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{'서비스 준비중입니다. '}</Text>
          <Text style={styles.description}>
            {'이용에 불편을 드려 죄송합니다. \n'}
            {'보다 나은 서비스 제공을 위해 페이지 준비중에 있습니다.\n'}
            {'빠른시일내에 준비하여 찾아뵙겠습니다. '}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

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
});

export default WIPScreen;
