import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LabelTitle from '../../components/LabelTitle';
import ReviewActionModal from '../../components/review/ReviewActionModal';
import theme from '../../style';
import colors from '../../style/colors';

import RatingIcon from '../../../assets/icons/rating.svg';
import typography from '../../style/typography';

const REVIEWS = [
  {
    id: 1,
    rating: 5,
    content:
      '떡볶이 정말 양 많아요. 아 근데 스벅이네... 리뷰는 두 줄 까지만 보이게 노출해요! 오른쪽 더보기 누르면 나머지 내용 더 볼 수 있는 구조입니다!!',
    date: '21.10.10',
    user: '최서*',
    isVerified: true,
    images: [1, 2],
  },
  {
    id: 2,
    rating: 5,
    content: '공부하기 너무 좋아요. 조용하고 쾌적합니다.',
    date: '21.10.11',
    user: '김다*',
    isVerified: true,
    images: [],
  },
  {
    id: 3,
    rating: 4,
    content: '직원분들이 친절해요.',
    date: '21.10.12',
    user: '이영*',
    isVerified: false,
    images: [1],
  },
];

const ReviewListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { storeName, rating } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('LATEST');
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
                i < Math.floor(rating)
                  ? theme.colors.primary2
                  : colors.gray[200]
              }
            />
          ))}
        </View>
        <Text style={styles.ratingScore}>
          {rating} <Text style={styles.ratingMax}>/ 5</Text>
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

        <Text style={styles.reviewCountLabel}>{REVIEWS.length}개의 리뷰</Text>
      </View>
    </View>
  );

  // [TODO] components/MyPage/ReviewItem 사용 예정
  const renderItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewRatingRow}>
        {[...Array(5)].map((_, i) => (
          <RatingIcon
            key={i}
            width={12}
            height={12}
            color={i < item.rating ? theme.colors.primary2 : colors.gray[200]}
          />
        ))}
      </View>

      {item.images.length > 0 && (
        <View style={styles.reviewImagesScroll}>
          <View style={styles.reviewImage} />
          <View style={styles.reviewImage} />
        </View>
      )}

      <Text style={styles.reviewContent} numberOfLines={2}>
        {item.content}
      </Text>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="chevron-down" size={16} color={colors.gray[400]} />
      </TouchableOpacity>

      <View style={styles.reviewMeta}>
        <Text style={styles.reviewUser}>{item.user}</Text>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
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
        data={REVIEWS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.writeButton}
          onPress={() => setModalVisible(true)}
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
        onClose={() => setModalVisible(false)}
        onConfirmScan={() => {
          console.log('카메라 스캔 화면으로 이동!');
          navigation.navigate('CameraScanScreen');
          // navigation.navigate('CameraScanScreenTest');
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

  reviewItem: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  reviewRatingRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewImagesScroll: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 8,
  },
  reviewImage: {
    width: 80,
    height: 80,
    backgroundColor: colors.gray[200],
    borderRadius: 8,
  },
  reviewContent: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  moreButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewUser: {
    fontSize: 12,
    color: colors.gray[500],
    marginRight: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.gray[400],
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
