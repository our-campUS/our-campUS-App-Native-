import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WarningIcon from '../../../assets/icons/warning-line.svg';
import theme from '../../style';
import colors from '../../style/colors';
import typography from '../../style/typography';

const EmptyResult = ({
  message = '검색 결과가 없습니다.',
  paddingTop = 200,
  icon,
}) => (
  <View style={[styles.container, { paddingTop }]}>
    {icon || <WarningIcon width={56} height={56} />}
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 20,
    color: colors.gray[300],
    ...typography.body2Bold,
  },
});

export default EmptyResult;
