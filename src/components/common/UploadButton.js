import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UploadIcon from '@assets/icons/upload.svg';
import colors from '@style/colors';

const VARIANTS = {
  blue: {
    backgroundColor: colors.blue[200],
    color: colors.blue[600],
  },
  orange: {
    backgroundColor: colors.orange[200],
    color: colors.orange[600],
  },
};

const UploadButton = ({ variant = 'blue' }) => {
  const { backgroundColor, color } = VARIANTS[variant];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <UploadIcon width={20} height={20} color={color} />
      <Text style={[styles.text, { color }]}>파일 업로드</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 40,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    fontSize: 13,
    fontFamily: 'Pretendard-SemiBold',
  },
});

export default UploadButton;
