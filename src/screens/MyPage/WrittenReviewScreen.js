import { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import LabelTitle from '@components/LabelTitle';
import { REVIEW_DATA } from '@constants/DummyData';
import ReviewItem from '@components/review/ReviewItem';
import ReviewEditBottomSheet from '@components/review/ReviewEditBottomSheet';
import { deleteReview } from '@api/review';
import colors from '@style/colors';
import typography from '@style/typography';

const WrittenReviewScreen = ({ navigation }) => {
  const [reviews, setReviews] = useState(REVIEW_DATA);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

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
      await deleteReview(selectedReview.id);
      setReviews((prev) =>
        prev.filter((r) => r.id !== selectedReview.id)
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
          keyExtractor={(item) => item.id.toString()}
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
