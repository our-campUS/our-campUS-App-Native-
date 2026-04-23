import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { Image } from 'react-native';
import CheckerboardPlaceholder from '../common/CheckerboardPlaceholder';
import PlaceIcon from '../../../assets/Vector2.svg';
import CalendarIcon from '../../../assets/calendar.svg';
import UnlikedIcon from '../../../assets/Unliked.svg';
import LikedIcon from '../../../assets/Liked.svg';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import ThreeDotIcon from '../../../assets/threeDot.svg';
import AffiliationColumnListItemSkeleton from './AffiliationColumnListItemSkeleton';
import { formatKoreanDate, formatKoreanDateTime } from '../../utils/dateTime';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    height: 108,
    backgroundColor: colors.common.white,
    alignItems: 'center',
    position: 'relative',
    // marginLeft: -10,
    // backgroundColor: 'red',
  },
  content: {
    flexDirection: 'column',
    // position: 'relative',
    // backgroundColor: 'red',
    maxWidth: 240,
    flex: 1,
  },
  threeDotIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  title: {
    ...typography.body3Bold,
  },
  placeAndDate: {
    marginTop: 12,
    // gap: 4,
  },
  placeAndDateItem: {
    flexDirection: 'row',
    gap: 6,
    height: 30,
    alignItems: 'center',
  },
  place: {
    ...typography.body4Regular,
    color: colors.gray[700],
    marginTop: -4,
    flexShrink: 1,
  },
  date: {
    ...typography.body4Regular,
    color: colors.gray[700],
    marginTop: -2,
  },
  image: {
    width: 108,
    height: 108,
    position: 'relative',
    borderRadius: 10,
  },
  imageContainer: {
    position: 'relative',
    width: 108,
    height: 108,
  },
  unlikedIcon: {
    position: 'absolute',
    top: 8.5,
    left: 8.5,
    width: 18,
    height: 18,
  },
});

const AffiliationColumnListItem = ({
  handleLike = null,
  item,
  navigation,
  handleThreeDotIconPress = null,
  councilType = null,
  isLikedScreen = false,
  alwaysShowLiked = false,
}) => {
  const user = useAuthStore((state) => state.user);
  const [liked, setLiked] = useState(item.liked || false);
  const [isLikeIconPressed, setIsLikeIconPressed] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const isCouncil = user?.role === 'COUNCIL';
  const dateValue = item?.endDateTime || item?.dateTime;
  const showLikeIcon = alwaysShowLiked || !!handleLike;

  useEffect(() => {
    setLiked(item.liked || false);
  }, [item.liked]);

  useEffect(() => {
    if (item?.thumbnailImageUrl) {
      setIsImageLoaded(false);
    } else {
      setIsImageLoaded(true);
    }
  }, [item?.postId, item?.thumbnailImageUrl]);

  const handleLikePress = async () => {
    if (alwaysShowLiked) return;
    setIsLikeIconPressed(true);
    const newLikedState = !liked;
    setLiked(newLikedState);

    try {
      await handleLike?.(item?.id || item?.postId);
    } catch (error) {
      setLiked(!newLikedState);
      console.error('handleLikePress error', error);
    }

    setTimeout(() => setIsLikeIconPressed(false), 100);
  };

  const handleItemPress = () => {
    if (!isLikeIconPressed) {
      if (isCouncil) {
        navigation?.navigate('CouncilAffiliateDetailScreen', { item });
      } else if (isLikedScreen) {
        navigation?.navigate('AffiliationLikedScreen', { item, councilType });
      } else {
        navigation?.navigate('AffiliationDetailScreen', { item, councilType });
      }
    }
  };

  const isDataLoaded =
    item?.title && (item?.place || item?.placeName) && dateValue;

  // 데이터가 로드되지 않았거나, 이미지가 있고 아직 로드되지 않았으면 스켈레톤 표시
  const shouldShowSkeleton =
    !isDataLoaded || (item?.thumbnailImageUrl && !isImageLoaded);

  return (
    <View style={{ position: 'relative' }}>
      {shouldShowSkeleton && (
        <View
          style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}
        >
          <AffiliationColumnListItemSkeleton />
        </View>
      )}
      <Pressable
        style={[styles.container, shouldShowSkeleton && { opacity: 0 }]}
        onPress={handleItemPress}
        disabled={shouldShowSkeleton}
      >
        {item?.thumbnailImageUrl ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item?.thumbnailImageUrl }}
              style={styles.image}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(true)}
            />
            {showLikeIcon && (
              <Pressable style={styles.unlikedIcon} onPress={handleLikePress}>
                {alwaysShowLiked || liked ? (
                  <LikedIcon
                    width={18}
                    height={18}
                    color={colors.orange[500]}
                  />
                ) : (
                  <UnlikedIcon width={18} height={18} />
                )}
              </Pressable>
            )}
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <CheckerboardPlaceholder
              width={108}
              height={108}
              borderRadius={10}
            />
          </View>
        )}
        <View style={styles.content}>
          <Text
            style={styles.title}
            numberOfLines={2}
            ellipsizeMode="tail"
            textBreakStrategy="balanced"
          >
            {item?.title}
          </Text>
          <View style={styles.placeAndDate}>
            <View style={styles.placeAndDateItem}>
              <PlaceIcon width={16} height={16} color={colors.gray[300]} />
              <Text style={styles.place} numberOfLines={1} ellipsizeMode="tail">
                {item?.detailedLocation || item?.place || item?.placeName}
              </Text>
            </View>
            <View style={styles.placeAndDateItem}>
              <CalendarIcon
                width={20}
                height={20}
                color={colors.gray[300]}
                style={{ marginLeft: -2 }}
              />
              {dateValue ? (
                <Text
                  style={styles.date}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item?.category === 'EVENT'
                    ? formatKoreanDateTime(dateValue)
                    : formatKoreanDate(dateValue)}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </Pressable>
      {isCouncil && (
        <View style={[styles.threeDotIconContainer, { zIndex: 2 }]}>
          <Pressable onPress={() => handleThreeDotIconPress?.(item)}>
            <ThreeDotIcon width={20} height={20} color={colors.gray[300]} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default AffiliationColumnListItem;
