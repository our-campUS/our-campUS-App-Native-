import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import LabelTitle from '../../components/LabelTitle';
import ReviewItem from '../../components/MyPage/ReviewItem';
import ReviewActionModal from '../../components/review/ReviewActionModal';
import theme from '../../style';
import colors from '../../style/colors';
import typography from '../../style/typography';
import RatingIcon from '../../../assets/icons/rating.svg';

import { getReviewList } from '../../api/review';

const ReviewListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { storeName, star, placeId, reviewSize, storeData } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('LATEST');

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [nextCursorCreatedAt, setNextCursorCreatedAt] = useState(null);
  const [nextCursorId, setNextCursorId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async (isLoadMore = false) => {
    if (loading) return;
    if (isLoadMore && !hasNext) return;

    try {
      setLoading(true);

      const response = await getReviewList(
        placeId,
        isLoadMore ? nextCursorCreatedAt : null,
        isLoadMore ? nextCursorId : null,
        10
      );

      if (response?.code === 200 || response?.data) {
        const newReviews = response.data.items || [];

        setReviews((prev) =>
          isLoadMore ? [...prev, ...newReviews] : newReviews
        );

        setHasNext(response.data.hasNext || false);
        setNextCursorCreatedAt(response.data.nextCursorCreatedAt);
        setNextCursorId(response.data.nextCursorId);
      }
    } catch (error) {
      console.error('리뷰 목록 조회 실패:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setNextCursorCreatedAt(null);
    setNextCursorId(null);
    fetchReviews(false);
  };

  const handleLoadMore = () => {
    if (hasNext && !loading) {
      fetchReviews(true);
    }
  };

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

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary1} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
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
        ListFooterComponent={renderFooter}
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
            if (storeData.isPartner) {
              setModalVisible(true);
            } else {
              navigation.navigate('WriteReviewScreen', {
                placeId: storeData.placeId,
                store: storeData,
                isNoPartner: true,
              });
            }
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

      <ReviewActionModal
        isVisible={modalVisible}
        storeName={storeName}
        writeWithoutPartner={() => {
          console.log('writeWithoutPartner');
          navigation.navigate('WriteReviewScreen', {
            placeId: storeData.placeId,
            store: storeData,
            isStrange: true,
          });
        }}
        onClose={() => setModalVisible(false)}
        // onConfirmScan={() => {
        //   console.log('카메라 스캔 화면으로 이동!');
        //   navigation.navigate('CameraScanScreen');
        //   // navigation.navigate('CameraScanScreenTest');
        // }}
        onConfirmScan={() => {
          console.log('카메라 스캔 화면으로 이동!');
          // navigation.navigate('CameraScanScreenTest');
          navigation.navigate('CameraScanScreen', { storeData: storeData });
        }}
      />
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
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
