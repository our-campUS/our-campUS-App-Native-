import React, { useCallback } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LabelTitle from '../../components/LabelTitle';
import NotificationItem from '../../components/common/NotificationItem';
import EmptyResult from '../../components/common/EmptyResult';
import LoadingFooter from '../../components/common/LoadingFooter';
import useCursorPagination from '../../hooks/useCursorPagination';
import {
  getNotifications,
  markNotificationRead,
} from '../../api/notification';
import colors from '../../style/colors';

const NotificationScreen = () => {
  const navigation = useNavigation();

  const fetchNotificationsFn = useCallback(
    (cursorCreatedAt, cursorId) =>
      getNotifications(20, cursorCreatedAt, cursorId),
    [],
  );

  const {
    items: notifications,
    setItems: setNotifications,
    loading,
    refreshing,
    fetchData,
    handleRefresh,
    handleLoadMore,
  } = useCursorPagination(fetchNotificationsFn);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const handleItemPress = async (notification) => {
    // 읽음 처리
    if (!notification.isRead) {
      const success = await markNotificationRead(notification.id);
      if (success) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id ? { ...item, isRead: true } : item,
          ),
        );
      }
    }

    // 타입별 화면 이동
    switch (notification.type) {
      case 'COUNCIL_POST_CREATED':
        // TODO: 알림 API에 councilType 필드 추가 시 councilType도 전달 (추천 목록 조회용)
        navigation.navigate('AffiliationDetailScreen', {
          item: { id: notification.referenceId },
        });
        break;
      case 'REWARD_GRANTED':
        navigation.navigate('MainTab', { screen: 'Stamp' });
        break;
      case 'SYSTEM_NOTICE':
      default:
        break;
    }
  };

  const renderItem = ({ item }) => (
    <NotificationItem notification={item} onPress={handleItemPress} />
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <EmptyResult
        icon={
          <Ionicons
            name="notifications-outline"
            size={56}
            color={colors.gray[300]}
          />
        }
        message="새로운 알림이 없습니다"
        paddingTop={0}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <LabelTitle
        title="알림함"
        useBackButton
        onPressBack={() => navigation.goBack()}
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={<LoadingFooter loading={loading} />}
        contentContainerStyle={
          notifications.length === 0 ? styles.emptyContent : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default NotificationScreen;
