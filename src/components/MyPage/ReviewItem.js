import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import StarIcon from '../../../assets/Star.svg';
import colors from '../../style/colors';
import typography from '../../style/typography';
import PlaceHolderImage from '../../../assets/placeHolderImage.svg';
import ArrowDownIcon from '../../../assets/ArrowDown.svg';
import ArrowUpIcon from '../../../assets/ArrowUp.svg';
import { useState } from 'react';

const ReviewItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.starRatingWrapper}>
        <StarIcon width={12} height={12} />
        <StarIcon width={12} height={12} />
        <StarIcon width={12} height={12} />
        <StarIcon width={12} height={12} />
        <StarIcon width={12} height={12} />
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.imageScrollWrapper}
        contentContainerStyle={styles.imageScrollContainer}
      >
        {[1, 2, 3, 4].map((img, index, arr) => (
          <View
            key={index}
            style={{
              marginRight: index === arr.length - 1 ? 0 : -20,
              width: 138,
              height: 138,
              // backgroundColor: 'red',
              marginLeft: index === 0 ? -13 : 0,
            }}
          >
            <PlaceHolderImage width={138} height={138} />
          </View>
        ))}
      </ScrollView>
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
        <Text style={styles.placeText}>{item.place}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
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
    // backgroundColor: 'green',
  },
  imageScrollWrapper: {
    flexDirection: 'row',
    // gap: 2,
    height: 138,
  },
  imageScrollContainer: {
    gap: 2,
    flexDirection: 'row',
    flex: 1,
    // backgroundColor: 'blue',
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
    marginTop: 12,
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
