import React, { useState, memo } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import RatingIcon from '../../../assets/icons/rating.svg';
import ArrowDownIcon from '@assets/ArrowDown.svg';
import ArrowUpIcon from '@assets/ArrowUp.svg';

import colors from '../../style/colors';
import typography from '../../style/typography';
import theme from '../../style';
import { formatReviewDate } from '../../utils/dateTime';

const ReviewItemCompact = ({ item, variant = 'default' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [measured, setMeasured] = useState(false);

  if (!item) return null;

  // 다양한 데이터 포맷 지원
  const review = {
    star: item.star || 0,
    content: item.content || item.comment || '',
    writerName: item.writerName || item.name || '',
    createdAt: item.createdAt || item.date || '',
    thumbnailImgUrl: item.thumbnailImgUrl || item.imageUrls?.[0] || null,
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <RatingIcon
        key={index}
        width={16}
        height={16}
        color={index < review.star ? theme.colors.primary2 : colors.gray[200]}
        style={{ marginRight: 1 }}
      />
    ));
  };

  const containerStyle =
    variant === 'card'
      ? [styles.reviewItem, styles.cardVariant]
      : styles.reviewItem;

  return (
    <View style={[containerStyle, !measured && { opacity: 0 }]}>
      <View style={styles.reviewTextWrapper}>
        <View style={styles.reviewRating}>{renderStars()}</View>
        <View style={styles.reviewContentWrapper}>
          <View style={styles.reviewContentTextContainer}>
            <Text
              style={styles.reviewContentText}
              numberOfLines={measured && !isExpanded ? 2 : undefined}
              ellipsizeMode="tail"
              onTextLayout={(e) => {
                if (!measured) {
                  setIsTruncated(e.nativeEvent.lines.length > 2);
                  setMeasured(true);
                }
              }}
            >
              {review.content}
            </Text>
          </View>
          {isTruncated && (
            <Pressable
              onPress={() => setIsExpanded(!isExpanded)}
              hitSlop={8}
            >
              {isExpanded ? (
                <ArrowUpIcon width={20} height={20} />
              ) : (
                <ArrowDownIcon width={20} height={20} />
              )}
            </Pressable>
          )}
        </View>
        <View style={styles.reviewMeta}>
          <Text style={styles.reviewUser}>{review.writerName}</Text>
          <Text style={styles.reviewUser}>{formatReviewDate(review.createdAt)}</Text>
        </View>
      </View>
      {review.thumbnailImgUrl && (
        <Image
          source={{ uri: review.thumbnailImgUrl }}
          style={styles.reviewImagePlaceholder}
        />
      )}
    </View>
  );
};

export default memo(ReviewItemCompact);

const styles = StyleSheet.create({
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardVariant: {
    borderBottomWidth: 0,
    borderRadius: 20,
    backgroundColor: '#FFF',
    padding: 16,
    ...theme.shadows.level2,
  },
  reviewTextWrapper: {
    flex: 1,
    marginRight: 16,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reviewContentWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  reviewContentTextContainer: {
    flexShrink: 1,
    minWidth: 0,
    marginRight: 8,
  },
  reviewContentText: {
    ...typography.body3Regular,
    color: theme.colors.text,
  },
  reviewMeta: {
    flexDirection: 'row',
  },
  reviewUser: {
    ...typography.caption1Regular,
    color: theme.colors.textDisabled,
    marginRight: 12,
  },
  reviewImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
  },
});
