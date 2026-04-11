import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '@components/LabelTitle';
import ReviewItem from '@components/review/ReviewItem';
import ReviewEditBottomSheet from '@components/review/ReviewEditBottomSheet';
import EmptyResult from '@components/common/EmptyResult';
import Toast from '@components/common/Toast';
import useToast from '@/hooks/useToast';
import { deleteReview, getMyReviews } from '@api/review';
import colors from '@style/colors';

const WrittenReviewScreen = ({ navigation }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const { toastVisible, toastMessage, showToast, hideToast } = useToast();

  const fetchMyReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getMyReviews();
      setReviews(data?.content || []);
    } catch (error) {
      console.error('리뷰 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMyReviews();
    });
    return unsubscribe;
  }, [navigation, fetchMyReviews]);

  const handleMorePress = (item) => {
    setSelectedReview(item);
    setIsBottomSheetVisible(true);
  };

  const handleEdit = () => {
    if (selectedReview) {
      navigation.navigate('WriteReviewScreen', {
        editMode: true,
        review: selectedReview,
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedReview) return;

    try {
      const reviewId = selectedReview.reviewId || selectedReview.id;
      await deleteReview(reviewId);
      setReviews((prev) =>
        prev.filter((r) => (r.reviewId || r.id) !== reviewId)
      );
      showToast('리뷰가 삭제되었습니다.');
    } catch (error) {
      showToast('리뷰 삭제에 실패하였습니다.');
    }
    setSelectedReview(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="내가 쓴 리뷰"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.reviewListWrapper}>
        <FlatList
          data={reviews}
          renderItem={({ item }) => (
            <ReviewItem item={item} onMorePress={handleMorePress} />
          )}
          keyExtractor={(item) => (item.reviewId || item.id).toString()}
          contentContainerStyle={reviews.length === 0 && styles.emptyContent}
          ListEmptyComponent={
            !isLoading ? (
              <EmptyResult
                message={
                  "아직 작성한 리뷰가 없어요.\n'제휴 보기'에서 첫 리뷰를 작성해보세요."
                }
                paddingTop={0}
              />
            ) : null
          }
        />
      </View>
      <ReviewEditBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={() => {
          setIsBottomSheetVisible(false);
          setSelectedReview(null);
        }}
        onSelectEdit={handleEdit}
        onSelectDelete={handleDelete}
      />
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={hideToast}
        hasNavBar={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  reviewListWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});

export default WrittenReviewScreen;
