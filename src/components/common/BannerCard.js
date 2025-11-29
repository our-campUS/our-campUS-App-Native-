import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../../style';
import colors from '../../style/colors';

const BannerCard = ({ title, subtitle, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.imagePlaceholder} />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.common.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 11,

    borderWidth: 1,
    borderColor: theme.colors.border,

    ...theme.shadows.small,
  },
  imagePlaceholder: {
    width: 52,
    height: 52,
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...theme.typography.body3Bold,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.body4Regular,
    color: theme.colors.text,
  },
});

export default BannerCard;
