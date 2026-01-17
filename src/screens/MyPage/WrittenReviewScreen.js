import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../../components/LabelTitle';
import { REVIEW_DATA } from '../../constants/DummyData';
import ReviewItem from '../../components/MyPage/ReviewItem';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { getMyReviewList } from '../../api/review';
import { useEffect, useState } from 'react';

const WrittenReviewScreen = ({ navigation }) => {
  const [reviewList, setReviewList] = useState([]);

  useEffect(() => {
    const fetchReviewList = async () => {
      const response = await getMyReviewList();
      setReviewList(response.data.data.content);
    };
    fetchReviewList();
  }, []);

  useEffect(() => {
    console.log('reviewList', reviewList);
  }, [reviewList]);
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="내가 쓴 리뷰"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.reviewListWrapper}>
        <FlatList
          data={reviewList}
          renderItem={({ item }) => <ReviewItem item={item} isMine={true} />}
          keyExtractor={(item) => item.reviewId}
        />
      </View>
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
    // paddingVertical: 20,
  },
});

export default WrittenReviewScreen;
