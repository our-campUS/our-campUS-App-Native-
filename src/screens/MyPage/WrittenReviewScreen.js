import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import LabelTitle from '@components/LabelTitle';
import ReviewItem from '@components/review/ReviewItem';
import ReviewEditBottomSheet from '@components/review/ReviewEditBottomSheet';
import { deleteReview, getMyReviews } from '@api/review';
import colors from '@style/colors';
import typography from '@style/typography';

const WrittenReviewScreen = ({ navigation }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchMyReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getMyReviews();
      setReviews(data?.content || []);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '리뷰 목록을 불러오지 못했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyReviews();
  }, [fetchMyReviews]);

  const handleMorePress = (item) => {
    setSelectedReview(item);
    setIsBottomSheetVisible(true);
  };

  const handleEdit = () => {
    setIsBottomSheetVisible(false);
    if (selectedReview) {
      navigation.navigate('WriteReviewScreen', {
        editMode: true,
        review: selectedReview,
      });
    }
  };

  const handleDelete = async () => {
    setIsBottomSheetVisible(false);
    if (!selectedReview) return;

    try {
      const reviewId = selectedReview.reviewId || selectedReview.id;
      await deleteReview(reviewId);
      setReviews((prev) =>
        prev.filter((r) => (r.reviewId || r.id) !== reviewId)
      );
      Toast.show({
        type: 'success',
        text1: '리뷰가 삭제되었습니다.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '리뷰 삭제에 실패하였습니다.',
      });
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  reviewListWrapper: {
    paddingHorizontal: 20,
  },
});

export default WrittenReviewScreen;
