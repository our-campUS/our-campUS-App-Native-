import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import typography from '../../style/typography';
import colors from '../../style/colors';

const BulletText = ({ children, style }) => {
  return (
    <View style={[styles.bulletRow, style]}>
      <Text style={styles.bulletPoint}>•</Text>
      <Text style={styles.bulletContent}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: 4,
  },
  bulletPoint: {
    ...typography.body4Regular,
    color: colors.gray[600],
    marginRight: 6,
  },
  bulletContent: {
    flex: 1,
    ...typography.body4Regular,
    color: colors.gray[600],
    lineHeight: 18,
  },
});

export default BulletText;
