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
  },
  detailedLocation: {
    ...typography.body4Regular,
    color: colors.gray[700],
    marginLeft: -4,
    marginTop: -4,
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

const LikedColumnListItem = ({
  handleLike = null,
  item,
  navigation,
  handleThreeDotIconPress = null,
  councilType = null,
  isLikedScreen = false,
}) => {
  const [endYear, setEndYear] = useState(null);
  const [endMonth, setEndMonth] = useState(null);
  const [endDay, setEndDay] = useState(null);
  const user = useAuthStore((state) => state.user);
  const [liked, setLiked] = useState(item.liked || false);
  const [isLikeIconPressed, setIsLikeIconPressed] = useState(false);
  const [isCouncil, setIsCouncil] = useState(false);
  const [isThreeDotIconPressed, setIsThreeDotIconPressed] = useState(false);
  const [startHour, setStartHour] = useState(null);
  const [startMinute, setStartMinute] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (user?.role === 'COUNCIL') {
      setIsCouncil(true);
    }
  }, [user]);

  // item.liked가 변경될 때 liked state 동기화
  useEffect(() => {
    setLiked(item.liked || false);
  }, [item.liked]);

  useEffect(() => {
    // item이 변경되면 이미지 로드 상태 리셋
    if (item?.thumbnailImageUrl) {
      setIsImageLoaded(false);
    } else {
      // 이미지가 없으면 바로 로드 완료로 처리
      setIsImageLoaded(true);
    }
  }, [item?.thumbnailImageUrl]);

  useEffect(() => {
    {
      setEndYear(item?.dateTime?.slice(0, 4));
      setEndMonth(item?.dateTime?.slice(5, 7));
      if (item?.endDateTime?.slice(5, 7).startsWith('0')) {
        setEndMonth(item?.dateTime?.slice(6, 7));
      }
      setEndDay(item?.dateTime?.slice(8, 10));
      if (item?.category === 'EVENT') {
        setStartHour(item?.dateTime?.slice(11, 13));
        setStartMinute(item?.dateTime?.slice(14, 16));
      }
    }
  }, [item]);

  // useEffect(() => {
  //   if (user?.role === 'COUNCIL') {
  //     setEndYear(item?.dateTime?.slice(0, 4));
  //     setEndMonth(item?.dateTime?.slice(5, 7));
  //     if (item?.dateTime?.slice(5, 7).startsWith('0')) {
  //       setEndMonth(item?.dateTime?.slice(6, 7));
  //     }
  //     setEndDay(item?.dateTime?.slice(8, 10));
  //     if (item?.category === 'EVENT') {
  //       setStartHour(item?.dateTime?.slice(11, 13));
  //       setStartMinute(item?.dateTime?.slice(14, 16));
  //     }
  //   }
  // }, [item]);

  const handleLikePress = async () => {
    setIsLikeIconPressed(true);
    // 낙관적 업데이트 (즉시 UI 업데이트)
    const newLikedState = !liked;
    setLiked(newLikedState);

    try {
      await handleLike?.(item?.id || item?.postId);
      // 성공 시 item의 liked 상태도 업데이트 (부모에서 업데이트되면 자동 반영됨)
    } catch (error) {
      // 실패 시 롤백
      setLiked(!newLikedState);
      console.error('handleLikePress error', error);
    }

    // 다음 프레임에서 플래그 리셋
    setTimeout(() => setIsLikeIconPressed(false), 100);
  };

  const handleItemPress = () => {
    if (!isLikeIconPressed) {
      if (user?.role === 'COUNCIL') {
        navigation?.navigate('CouncilAffiliateDetailScreen', { item });
      } else if (isLikedScreen) {
        navigation?.navigate('AffiliationLikedScreen', { item, councilType });
      } else {
        navigation?.navigate('AffiliationDetailScreen', { item, councilType });
      }
    }
  };

  // 모든 필수 데이터가 로드되었는지 확인
  const isDataLoaded =
    item?.title &&
    (item?.place || item?.placeName) &&
    endYear &&
    endMonth &&
    endDay;

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
        <View style={styles.threeDotIconContainer}>
          {isCouncil && (
            <Pressable onPress={() => handleThreeDotIconPress?.(item)}>
              <ThreeDotIcon width={20} height={20} color={colors.gray[300]} />
            </Pressable>
          )}
        </View>
        {item?.thumbnailImageUrl ? (
          <View style={styles.imageContainer}>
            {/* <Image source={item.image} style={styles.image} /> */}
            <Image
              source={{ uri: item?.thumbnailImageUrl }}
              style={styles.image}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(true)} // 에러가 나도 스켈레톤을 계속 보여주지 않음
            />
            <Pressable
              style={styles.unlikedIcon}
              // onPress={handleLikePress}
            >
              {/* {liked ? (
                <LikedIcon width={18} height={18} color={colors.orange[500]} />
              ) : (
                <UnlikedIcon width={18} height={18} />
              )} */}
              <LikedIcon width={18} height={18} color={colors.orange[500]} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <CheckerboardPlaceholder width={108} height={108} borderRadius={10} />
            {/* <Pressable style={styles.unlikedIcon} onPress={handleLikePress}>
            {liked ? (
              <LikedIcon width={18} height={18} color={colors.orange[500]} />
            ) : (
              <UnlikedIcon width={18} height={18} />
            )}
          </Pressable> */}
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
              <Text style={styles.place}>{item?.place || item?.placeName}</Text>
              {item?.category === 'EVENT' && (
                <Text style={styles.detailedLocation}>
                  {item?.detailedLocation}
                </Text>
              )}
            </View>
            <View style={styles.placeAndDateItem}>
              <CalendarIcon
                width={20}
                height={20}
                color={colors.gray[300]}
                style={{ marginLeft: -2 }}
              />
              {endYear && endMonth && endDay ? (
                <Text style={styles.date}>
                  {item?.category === 'EVENT'
                    ? `${endYear}년 ${endMonth}월 ${endDay}일 ${
                        startHour || ''
                      }${startHour ? '시' : ''} ${startMinute || ''}${
                        startMinute ? '분' : ''
                      }`
                    : `${endYear}년 ${endMonth}월 ${endDay}일 까지`}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default LikedColumnListItem;
