import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import theme from '../../style';
import colors from '../../style/colors';
import typography from '../../style/typography';

import StarIcon from '../../../assets/icons/common/star.svg';
import TicketIcon from '../../../assets/icons/common/ticket.svg';
import PinIcon from '../../../assets/icons/common/pin.svg';
import { CATEGORIES } from '../../constants/MapData';
import LikedIcon from '../../../assets/Liked.svg';
import UnlikedIcon from '../../../assets/Unliked.svg';

import { togglePlaceLike } from '../../api/place';
import { formatDistance, calculateWalkingTime, calculateDistanceInMeters } from '../../utils/distance';

const StoreListItem = ({
  item,
  userLocation,
  onPress,
  showImages = true,
  showDiscountDetail = false,
  onLikeToggle,
}) => {
  const [isLiked, setIsLiked] = useState(!!item.placeId && item.isLiked);

  useEffect(() => {
    setIsLiked(!!item.placeId && item.isLiked);
  }, [item.placeId, item.isLiked]);

  const handleLikePress = async () => {
    const previousState = isLiked;
    setIsLiked(!isLiked);

    try {
      const responseData = await togglePlaceLike(item);

      if (!responseData) {
        setIsLiked(previousState);
        return;
      }

      if (responseData.placeId) {
        if (onLikeToggle) {
          onLikeToggle(item.placeId, {
            placeId: responseData.placeId,
            isLiked: responseData.liked,
          });
        }
      }
    } catch (error) {
      setIsLiked(previousState);
      console.error('좋아요 토글 실패, 롤백함');
    }
  };

  const categoryLabel =
    CATEGORIES.find((cat) => cat.id === item.category)?.label ||
    item.category;

  const distanceInMeters =
    userLocation && item.latitude && item.longitude
      ? calculateDistanceInMeters(
          userLocation.latitude,
          userLocation.longitude,
          item.latitude,
          item.longitude,
        )
      : (item.distance != null ? item.distance : null);

  const tags = [];
  if (item.tag) tags.push(item.tag);

  const images = item.imgUrls || [];

  return (
    <View style={styles.container}>
      <Pressable
        testID="store-list-item-pressable"
        onPress={onPress}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleWrapper}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>{categoryLabel}</Text>
          </View>
          <Pressable
            testID="store-like-button"
            style={styles.likeButton}
            onPress={handleLikePress}
          >
            {isLiked ? (
              <LikedIcon
                width={12}
                height={11.25}
                color={theme.colors.primary2}
              />
            ) : (
              <UnlikedIcon width={12} height={11.25} />
            )}
          </Pressable>
        </View>

        {(tags.length > 0 || item.partnerships?.length > 0) && (
          <View style={styles.tagRow}>
            {tags.map((tag, index) => (
              <View key={`tag-${index}`} style={styles.badge}>
                <Text style={styles.badgeText}>{tag}</Text>
              </View>
            ))}
            {item.partnerships?.map((p) => (
              <View key={`partner-${p.postId}`} style={styles.badge}>
                <Text style={styles.badgeText}>{p.councilName}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.infoSection}>
          <View style={styles.infoLeft}>
            {!!( item.averageStar ?? item.star) && (
              <View style={styles.infoItem}>
                <StarIcon width={20} height={20} style={styles.iconMargin} />
                <Text style={styles.infoText}>{item.averageStar ?? item.star}</Text>
              </View>
            )}

            {showDiscountDetail ? (
              (item.partnerships?.[0]?.partnershipTitle ?? item.partnerTitle) && (
                <View style={styles.infoItem}>
                  <TicketIcon
                    width={20}
                    height={20}
                    style={styles.iconMargin}
                  />
                  <Text style={styles.infoText}>
                    {item.partnerships?.[0]?.partnershipTitle ?? item.partnerTitle}
                  </Text>
                </View>
              )
            ) : (
              <>
                {(item.partnerships?.[0]?.partnershipTitle ?? item.partnerTitle) && (
                  <View style={styles.infoItem}>
                    <TicketIcon
                      width={20}
                      height={20}
                      style={styles.iconMargin}
                    />
                    <Text style={styles.infoText}>
                      {item.partnerships?.[0]?.partnershipTitle ?? item.partnerTitle}
                    </Text>
                  </View>
                )}
                <View style={styles.infoItem}>
                  <PinIcon
                    width={20}
                    height={20}
                    style={styles.iconMargin}
                  />
                  <Text style={styles.infoText}>
                    걸어서 {calculateWalkingTime(distanceInMeters)}분
                  </Text>
                  <Text style={styles.distanceText}>
                    {formatDistance(distanceInMeters)}
                  </Text>
                </View>
              </>
            )}
          </View>

          {showImages && images.length > 0 && (
            <Image
              testID="store-thumbnail"
              source={{ uri: images[0] }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          )}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  likeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  name: {
    ...typography.heading4,
    color: theme.colors.text,
    marginRight: 8,
  },
  category: {
    ...typography.caption1Regular,
    color: theme.colors.textDim,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
    gap: 4,
  },
  badge: {
    backgroundColor: theme.colors.primary1Light,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  badgeText: {
    color: colors.blue[600],
    ...typography.caption2Bold,
  },
  infoSection: {
    flexDirection: 'row',
    gap: 8,
  },
  infoLeft: {
    flex: 1,
    gap: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  iconMargin: {
    marginRight: 4,
  },
  infoText: {
    ...typography.body4Regular,
    color: theme.colors.textDim,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  distanceText: {
    ...typography.caption1Regular,
    lineHeight: typography.body4Regular.lineHeight,
    color: colors.gray[400],
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginLeft: 4,
    transform: [{translateY: 1}],
  },
  thumbnail: {
    width: 68,
    height: 68,
    borderRadius: 8,
    backgroundColor: theme.colors.backgroundSub,
  },
});

export default React.memo(StoreListItem);
