import React, { memo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RatingIcon from '../../../assets/icons/rating.svg';

import colors from '../../style/colors';
import typography from '../../style/typography';
import theme from '../../style';

const ReviewItemCompact = ({ item, variant = 'default' }) => {
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
    <View style={containerStyle}>
      <View style={styles.reviewTextWrapper}>
        <View style={styles.reviewRating}>{renderStars()}</View>
        <Text style={styles.reviewContent}>{review.content}</Text>
        <View style={styles.reviewMeta}>
          <Text style={styles.reviewUser}>{review.writerName}</Text>
          <Text style={styles.reviewUser}>{review.createdAt}</Text>
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
  reviewContent: {
    ...typography.body3Regular,
    color: theme.colors.text,
    marginBottom: 8,
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
