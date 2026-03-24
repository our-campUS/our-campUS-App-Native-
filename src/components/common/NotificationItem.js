import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../../style';
import colors from '../../style/colors';
import typography from '../../style/typography';

const ProfileImage = ({ profileImageUrl, type }) => {
  if (profileImageUrl) {
    return (
      <Image
        source={{ uri: profileImageUrl }}
        style={styles.profileImage}
      />
    );
  }

  // fallback: URL 없을 때 타입별 기본 아이콘
  if (type === 'COUNCIL_POST_CREATED') {
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
          <ProfileImage profileImageUrl={notification.profileImageUrl} type={type} />
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
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
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
    backgroundColor: theme.colors.primary2,
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
    color: theme.colors.text,
  },
  time: {
    ...typography.caption1Regular,
    color: theme.colors.textDisabled,
  },
});

export default NotificationItem;
