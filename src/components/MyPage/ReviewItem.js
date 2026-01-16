import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import RatingIcon from '../../../assets/icons/rating.svg';
import colors from '../../style/colors';
import typography from '../../style/typography';
import ArrowDownIcon from '../../../assets/ArrowDown.svg';
import ArrowUpIcon from '../../../assets/ArrowUp.svg';
import { useState } from 'react';
import theme from '../../style';

const ReviewItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.slice(2).replace(/-/g, '.');
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <RatingIcon
        key={index}
        width={12}
        height={12}
        color={
          index < Math.floor(item.star)
            ? theme.colors.primary2
            : colors.gray[200]
        }
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.starRatingWrapper}>{renderStars()}</View>

      {item.imageUrls && item.imageUrls.length > 0 && (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.imageScrollWrapper}
          contentContainerStyle={styles.imageScrollContainer}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        >
          {item.imageUrls.map((imgUrl, index, arr) => (
            <Image
              key={index}
              source={{ uri: imgUrl }}
              style={[
                styles.imageItem,
                {
                  marginRight: index === arr.length - 1 ? 0 : 8,
                },
              ]}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}

      {/* ✅ 댓글 텍스트 */}
      <View style={styles.commentTextWrapper}>
        <View style={styles.commentTextContainer}>
          <Text
            style={styles.commentText}
            numberOfLines={isExpanded ? undefined : 2}
            ellipsizeMode="tail"
          >
            {item.comment}
          </Text>
        </View>
        <Pressable onPress={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <ArrowUpIcon width={24} height={24} />
          ) : (
            <ArrowDownIcon width={24} height={24} />
          )}
        </Pressable>
      </View>

      <View style={styles.placeAndDateWrapper}>
        <Text style={styles.placeText}>{item.name || item.place}</Text>
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.common.white,
    width: '100%',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  starRatingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 12,
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
  commentTextContainer: {
    flexShrink: 1,
    minWidth: 0,
    marginRight: 8,
  },
  commentText: {
    ...typography.body3Regular,
    color: colors.gray[850],
  },
  commentTextWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
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

export default ReviewItem;
