import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LabelTitle from '../../components/LabelTitle';
import ReviewItem from '../../components/review/ReviewItem';
// import ReviewActionModal from '../../components/review/ReviewActionModal'; // TODO: 스캔 플로우 복구 시 주석 해제
import useCursorPagination from '../../hooks/useCursorPagination';
import LoadingFooter from '../../components/common/LoadingFooter';
import theme from '../../style';
import colors from '../../style/colors';
import typography from '../../style/typography';
import RatingIcon from '../../../assets/icons/rating.svg';

import { getReviewList } from '../../api/review';

const ReviewListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { storeName, star, placeId, reviewSize } = route.params;

  // const [modalVisible, setModalVisible] = useState(false); // TODO: 스캔 플로우 복구 시 주석 해제
  const [filter, setFilter] = useState('LATEST');

  const fetchReviewsFn = useCallback(
    (cursorCreatedAt, cursorId) =>
      getReviewList(placeId, cursorCreatedAt, cursorId, 10),
    [placeId]
  );

  const {
    items: reviews,
    loading,
    refreshing,
    fetchData: fetchReviews,
    handleRefresh,
    handleLoadMore,
  } = useCursorPagination(fetchReviewsFn);

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.ratingSummary}>
        <View style={styles.starsRow}>
          {[...Array(5)].map((_, i) => (
            <RatingIcon
              key={i}
              width={16}
              height={16}
              color={
                i < Math.floor(star) ? theme.colors.primary2 : colors.gray[200]
              }
            />
          ))}
        </View>
        <Text style={styles.ratingScore}>
          {star} <Text style={styles.ratingMax}>/ 5</Text>
        </Text>
      </View>

      <View style={styles.divider} />

      {/* 필터 탭 */}
      <View style={styles.filterRow}>
        <TouchableOpacity onPress={() => setFilter('LATEST')}>
          <Text
            style={[
              styles.filterText,
              filter === 'LATEST' && styles.filterTextActive,
            ]}
          >
            최신순
          </Text>
        </TouchableOpacity>
        <Text style={styles.filterDivider}>|</Text>
        <TouchableOpacity onPress={() => setFilter('RATING')}>
          <Text
            style={[
              styles.filterText,
              filter === 'RATING' && styles.filterTextActive,
            ]}
          >
            평점순
          </Text>
        </TouchableOpacity>

        <Text style={styles.reviewCountLabel}>{reviewSize || 0}개의 리뷰</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    const reviewData = {
      id: item.id,
      comment: item.content,
      name: item.userName || '익명',
      date: item.createDate || '',
      star: item.star,
      imageUrls: item.imageUrls || [],
    };

    return (
      <View style={styles.reviewItemWrapper}>
        <ReviewItem item={reviewData} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>아직 작성된 리뷰가 없습니다.</Text>
      <Text style={styles.emptySubText}>첫 리뷰를 작성해보세요!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LabelTitle
        title={storeName}
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
        additionalStyle={{ marginBottom: 10 }}
      />

      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={<LoadingFooter loading={loading} />}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
      />

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.writeButton}
          onPress={() => {
            // TODO: 스캔 플로우 복구 시 아래 주석 해제
            // setModalVisible(true);
            navigation.navigate('WriteReviewScreen', {
              placeId: placeId,
              storeName: storeName,
              rating: star,
            });
          }}
        >
          <Ionicons
            name="pencil"
            size={18}
            color="white"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.writeButtonText}>글쓰기</Text>
        </TouchableOpacity>
      </View>

      {/* TODO: 스캔 플로우 복구 시 아래 주석 해제
      <ReviewActionModal
        isVisible={modalVisible}
        storeName={storeName}
        onClose={() => setModalVisible(false)}
        onConfirmScan={() => {
          console.log('카메라 스캔 화면으로 이동!');
          navigation.navigate('CameraScanScreen');
        }}
      />
      */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listHeader: {
    paddingBottom: 20,
    marginBottom: 10,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
    gap: 19,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingScore: {
    ...typography.heading3,
    color: theme.colors.text,
  },
  ratingMax: {
    ...typography.heading4,
    color: colors.gray[500],
  },
  divider: {
    borderWidth: 3,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  filterRow: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    color: colors.gray[300],
    ...typography.caption1Regular,
  },
  filterTextActive: {
    color: theme.colors.primary1,
    ...typography.caption1Bold,
  },
  filterDivider: {
    marginHorizontal: 8,
    color: colors.gray[300],
    fontSize: 12,
  },
  reviewCountLabel: {
    marginLeft: 'auto',
    ...typography.caption2Regular,
    color: colors.gray[500],
  },
  reviewItemWrapper: {
    paddingHorizontal: 20,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body3Regular,
    color: colors.gray[400],
    marginBottom: 4,
  },
  emptySubText: {
    ...typography.caption1Regular,
    color: colors.gray[300],
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  writeButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    alignItems: 'center',
    ...theme.shadows.level2,
  },
  writeButtonText: {
    color: theme.colors.background,
    ...typography.heading6,
  },
});

export default ReviewListScreen;
