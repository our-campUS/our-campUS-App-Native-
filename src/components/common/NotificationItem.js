import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../style/colors';
import typography from '../../style/typography';

// TODO: 추후 API에 프로필 이미지 URL 추가 시 URL 기반 Image로 교체
const NOTIFICATION_TYPE_CONFIG = {
  COUNCIL_POST_CREATED: { useIcon: true },
  SYSTEM_NOTICE: { useIcon: false },
  REWARD_GRANTED: { useIcon: false },
};

const ProfileImage = ({ type }) => {
  const config = NOTIFICATION_TYPE_CONFIG[type];

  if (config?.useIcon) {
    return (
      <Ionicons
        name="person-circle"
        size={44}
        color={colors.gray[300]}
      />
    );
  }

  return (
    <Image
      source={require('../../../assets/logo.png')}
      style={styles.profileImage}
    />
  );
};

const NotificationItem = ({ notification, onPress }) => {
  const { type, title, body, isRead, createTimeBeforeNow } = notification;

  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress?.(notification)}
    >
      <View style={styles.row}>
        <View style={styles.profileWrapper}>
          <ProfileImage type={type} />
          {!isRead && <View style={styles.unreadDot} />}
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.textColumn}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.body} numberOfLines={2}>
              {body}
            </Text>
          </View>
          <Text style={styles.time}>{createTimeBeforeNow}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.common.white,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  profileWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.orange[500],
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  textColumn: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...typography.body4Regular,
    color: colors.gray[600],
  },
  body: {
    ...typography.body4Bold,
    color: colors.gray[850],
  },
  time: {
    ...typography.caption1Regular,
    color: colors.gray[400],
  },
});

export default NotificationItem;
