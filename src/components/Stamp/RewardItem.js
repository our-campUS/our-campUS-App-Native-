import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import theme from '../../style';
import typography from '../../style/typography';
import colors from '../../style/colors';

const RewardItem = ({ item, onPress }) => {
  const isComplete = item.status === 'complete';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageWrapper}>
        {item.image ? (
          <Image source={item.image} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>신청일 : {item.date}</Text>

        <View
          style={[
            styles.badge,
            isComplete ? styles.badgeComplete : styles.badgePending,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              isComplete ? styles.badgeTextComplete : styles.badgeTextPending,
            ]}
          >
            {isComplete ? '지급 완료' : '지급 대기'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    backgroundColor: theme.colors.background,
  },
  imageWrapper: {
    marginRight: 20,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  imagePlaceholder: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...typography.body2Bold,
    color: theme.colors.text,
  },
  date: {
    ...typography.caption1Regular,
    color: colors.gray[500],
    marginBottom: 32,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 3,
    alignSelf: 'flex-start',
  },
  badgePending: {
    backgroundColor: colors.gray[100],
  },
  badgeComplete: {
    backgroundColor: colors.blue[400],
  },
  badgeText: {
    ...typography.caption1Regular,
  },
  badgeTextPending: {
    color: colors.gray[600],
  },
  badgeTextComplete: {
    color: theme.colors.textWhite,
  },
});

export default RewardItem;
