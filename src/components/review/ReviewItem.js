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

const ReviewItem = ({ item, variant = 'list', card = false, onMorePress }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [measured, setMeasured] = useState(false);

  if (!item) return null;

  const isPreview = variant === 'preview';

  const review = {
    star: item.star || 0,
    content: item.content || item.comment || '',
    name: item.writerName || item.name || item.userName || item.placeName || '',
    date: item.createdAt || item.date || item.createDate || '',
    imageUrls: item.imageUrls || [],
    thumbnailImgUrl: item.thumbnailImgUrl || item.imageUrls?.[0] || null,
  };

  const starSize = isPreview ? 16 : 12;

  const renderStars = () =>
    [...Array(5)].map((_, index) => (
      <RatingIcon
        key={index}
        width={starSize}
        height={starSize}
        color={
          index < Math.floor(review.star)
            ? theme.colors.primary2
            : colors.gray[200]
        }
        style={isPreview ? { marginRight: 1 } : undefined}
      />
    ));

  const renderContentRow = () => (
    <View style={[styles.contentRow, isPreview && styles.contentRowPreview]}>
      <View style={styles.textContainer}>
        <Text
          style={styles.contentText}
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
        <Pressable onPress={() => setIsExpanded(!isExpanded)} hitSlop={8}>
          {isExpanded ? (
            <ArrowUpIcon width={24} height={24} />
          ) : (
            <ArrowDownIcon width={24} height={24} />
          )}
        </Pressable>
      )}
    </View>
  );

  const renderMeta = () => (
    <View style={[styles.metaRow, !isPreview && styles.metaRowList]}>
      <Text style={styles.metaText}>{review.name}</Text>
      <Text style={styles.metaText}>{formatReviewDate(review.date)}</Text>
    </View>
  );

  if (isPreview) {
    const containerStyle = card
      ? [styles.previewContainer, styles.previewCardStyle]
      : styles.previewContainer;

    return (
      <View style={[containerStyle, !measured && { opacity: 0 }]}>
        <View style={styles.previewTextWrapper}>
          <View style={styles.previewStarsRow}>{renderStars()}</View>
          {renderContentRow()}
          {renderMeta()}
        </View>
        {review.thumbnailImgUrl && (
          <Image
            source={{ uri: review.thumbnailImgUrl }}
            style={styles.previewThumbnail}
          />
        )}
      </View>
    );
  }

  const containerStyle = card
    ? [styles.listContainer, styles.listCardStyle]
    : styles.listContainer;

  return (
    <View style={[containerStyle, !measured && { opacity: 0 }]}>
      <View style={styles.starRatingWrapper}>
        <View style={styles.listStarsRow}>{renderStars()}</View>
        {onMorePress && (
          <Pressable onPress={() => onMorePress(item)} hitSlop={8}>
            <ThreeDotIcon width={20} height={20} />
          </Pressable>
        )}
      </View>

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

      {renderContentRow()}
      {renderMeta()}
    </View>
  );
};

export default memo(ReviewItem);

const styles = StyleSheet.create({
  // === Shared ===
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  contentRowPreview: {
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  contentText: {
    ...typography.body3Regular,
    color: theme.colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaRowList: {
    marginTop: 12,
  },
  metaText: {
    ...typography.caption1Regular,
    color: theme.colors.textDisabled,
  },

  // === Preview variant ===
  previewContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  previewCardStyle: {
    borderBottomWidth: 0,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    padding: 16,
    ...theme.shadows.level2,
  },
  previewTextWrapper: {
    flex: 1,
    marginRight: 16,
  },
  previewStarsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  previewThumbnail: {
    width: 80,
    height: 80,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
  },

  // === List variant ===
  listContainer: {
    width: '100%',
    backgroundColor: theme.colors.background,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  listCardStyle: {
    borderBottomWidth: 0,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...theme.shadows.small,
  },
  starRatingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listStarsRow: {
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
});
