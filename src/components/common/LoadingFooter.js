import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import theme from '../../style';

const LoadingFooter = ({ loading }) => {
  if (!loading) return null;
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={theme.colors.primary1} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default LoadingFooter;
