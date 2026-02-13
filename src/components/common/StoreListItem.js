import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import theme from '../../style';
import typography from '../../style/typography';

import StarIcon from '../../../assets/icons/common/star.svg';
import TicketIcon from '../../../assets/icons/common/ticket.svg';
import PinIcon from '../../../assets/icons/common/pin.svg';
import { CATEGORIES } from '../../constants/MapData';
import LikedIcon from '../../../assets/Liked.svg';
import UnlikedIcon from '../../../assets/Unliked.svg';

import { togglePlaceLike } from '../../api/place';

const StoreListItem = ({
  item,
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
      // 2. 서버 요청
      const response = await togglePlaceLike(item);

      console.log('👍 좋아요 응답:', response);
      const responseData = response.data || response;

      if (responseData && responseData.placeId) {
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
    CATEGORIES.find((cat) => cat.id === item.category)?.label || item.category;

  const tags = [];
  if (item.tag) tags.push(item.tag);

  const images = item.imgUrls || [];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={styles.headerRow}>
          <View style={styles.titleWrapper}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>{categoryLabel}</Text>
          </View>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={handleLikePress}
            activeOpacity={0.7}
          >
            {isLiked ? (
              <LikedIcon width={16} height={15} color={theme.colors.primary2} />
            ) : (
              <UnlikedIcon width={16} height={15} />
            )}
          </TouchableOpacity>
        </View>

        {tags.length > 0 && (
          <View style={styles.tagRow}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{item.tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={[styles.infoRow, !showImages && { marginBottom: 0 }]}>
          <View style={styles.infoItem}>
            <StarIcon width={20} height={20} style={{ marginRight: 4 }} />
            <Text style={styles.infoText}>{item.star}</Text>
          </View>

          {showDiscountDetail ? (
            item.partnerTitle && (
              <View style={styles.infoItem}>
                <TicketIcon width={20} height={20} style={{ marginRight: 4 }} />
                <Text style={styles.infoText}>{item.partnerTitle}</Text>
              </View>
            )
          ) : (
            <>
              {item.partnerTitle && (
                <View style={styles.infoItem}>
                  <TicketIcon
                    width={20}
                    height={20}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.infoText}>{item.partnerTitle}</Text>
                </View>
              )}
              <View style={styles.infoItem}>
                <PinIcon width={20} height={20} style={{ marginRight: 4 }} />
                <Text style={styles.infoText}>
                  {item.address} {item.distance}
                </Text>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>

      {showImages && images.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {images.map((imgUrl, index) => (
            <Image
              key={index}
              source={{ uri: imgUrl }}
              style={styles.storeImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}
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
    marginBottom: 8,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  likeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    marginBottom: 10,
    gap: 6,
  },
  badge: {
    backgroundColor: theme.colors.primary1Light,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  badgeText: {
    color: theme.colors.primary1,
    ...typography.caption2Bold,
  },

  infoRow: {
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  infoText: {
    ...typography.body4Regular,
    color: theme.colors.textDim,
  },
  imageScroll: {
    flexDirection: 'row',
  },
  storeImage: {
    width: 88,
    height: 88,
    borderRadius: 8,
    backgroundColor: theme.colors.backgroundSub,
    marginRight: 8,
  },
});

export default StoreListItem;
