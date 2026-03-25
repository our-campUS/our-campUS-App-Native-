import React, { useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import RatingIcon from '@assets/icons/rating.svg';
import ArrowDownIcon from '@assets/ArrowDown.svg';
import ArrowUpIcon from '@assets/ArrowUp.svg';
import ThreeDotIcon from '@assets/threeDot.svg';

import colors from '@style/colors';
import typography from '@style/typography';
import theme from '@style';
import { formatReviewDate } from '../../utils/dateTime';

const ReviewItem = ({ item, variant = 'list', onMorePress }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  if (!item) return null;

  // ⭐ API 데이터 안전 변환
  const review = {
    star: item.star || 0,
    imageUrls: item.imageUrls || [],
    comment: item.comment || item.content || '',
    name: item.name || item.userName || item.placeName || item.place || '',
    date: item.date || item.createDate || item.createdAt || '',
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <RatingIcon
        key={index}
        width={12}
        height={12}
        color={
          index < Math.floor(review.star)
            ? theme.colors.primary2
            : colors.gray[200]
        }
      />
    ));
  };

  return (
    <View
      style={[
        styles.baseContainer,
        variant === 'list' && styles.listContainer,
        variant === 'card' && styles.cardContainer,
      ]}
    >
      {/* ⭐ 별점 */}
      <View style={styles.starRatingWrapper}>
        <View style={styles.starsRow}>{renderStars()}</View>
        {onMorePress && (
          <Pressable onPress={() => onMorePress(item)} hitSlop={8}>
            <ThreeDotIcon width={20} height={20} />
          </Pressable>
        )}
      </View>

      {/* ⭐ 이미지 */}
      {review.imageUrls.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScrollWrapper}
          contentContainerStyle={styles.imageScrollContainer}
        >
          {review.imageUrls.map((imgUrl, index, arr) => (
            <Image
              key={index}
              source={{ uri: imgUrl }}
              style={[
                styles.imageItem,
                { marginRight: index === arr.length - 1 ? 0 : 8 },
              ]}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      {/* ⭐ 댓글 */}
      <View style={styles.commentTextWrapper}>
        <View style={styles.commentTextContainer}>
          <Text
            style={styles.commentText}
            numberOfLines={isExpanded ? undefined : 2}
            ellipsizeMode="tail"
            onTextLayout={(e) => {
              if (!isExpanded) {
                setIsTruncated(e.nativeEvent.lines.length > 2);
              }
            }}
          >
            {review.comment}
          </Text>
        </View>

        {isTruncated && (
          <Pressable onPress={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? (
              <ArrowUpIcon width={24} height={24} />
            ) : (
              <ArrowDownIcon width={24} height={24} />
            )}
          </Pressable>
        )}
      </View>

      {/* ⭐ 장소 / 날짜 */}
      <View style={styles.placeAndDateWrapper}>
        <Text style={styles.placeText}>{review.name}</Text>
        <Text style={styles.dateText}>{formatReviewDate(review.date)}</Text>
      </View>
    </View>
  );
};

export default memo(ReviewItem);

const styles = StyleSheet.create({
  baseContainer: {
    width: '100%',
  },

  listContainer: {
    backgroundColor: colors.common.white,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },

  cardContainer: {
    backgroundColor: colors.common.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...theme.shadows.level1,
  },

  starRatingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  imageScrollWrapper: {
    marginBottom: 12,
  },

  imageScrollContainer: {
    paddingRight: 20,
  },

  imageItem: {
    width: 138,
    height: 138,
    borderRadius: 8,
  },

  commentTextWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  commentTextContainer: {
    flexShrink: 1,
    minWidth: 0,
    marginRight: 8,
  },

  commentText: {
    ...typography.body3Regular,
    color: colors.gray[850],
  },

  placeAndDateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },

  placeText: {
    ...typography.caption1Regular,
    color: colors.gray[400],
  },

  dateText: {
    ...typography.caption1Regular,
    color: colors.gray[400],
  },
});
