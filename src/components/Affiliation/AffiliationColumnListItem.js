import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { Image } from 'react-native';
import PlaceHolderImage from '../../../assets/placeHolderImage.svg';
import PlaceIcon from '../../../assets/Vector2.svg';
import CalendarIcon from '../../../assets/calendar.svg';
import UnlikedIcon from '../../../assets/Unliked.svg';
import LikedIcon from '../../../assets/Liked.svg';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import ThreeDotIcon from '../../../assets/threeDot.svg';

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
    top: 18.75,
    left: 18.75,
    width: 18,
    height: 18,
  },
});

const AffiliationColumnListItem = ({
  item,
  navigation,
  handleThreeDotIconPress = null,
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
  useEffect(() => {
    if (user?.role === 'COUNCIL') {
      setIsCouncil(true);
    }
  }, [user]);

  useEffect(() => {
    setEndYear(item?.dateTime?.slice(0, 4));
    setEndMonth(item?.dateTime?.slice(5, 7));
    if (item?.dateTime?.slice(5, 7).startsWith('0')) {
      setEndMonth(item?.dateTime?.slice(6, 7));
    }
    setEndDay(item?.dateTime?.slice(8, 10));
    if (item?.category === 'EVENT') {
      setStartHour(item?.dateTime?.slice(11, 13));
      setStartMinute(item?.dateTime?.slice(14, 16));
    }
  }, [item]);

  const handleLikePress = () => {
    setIsLikeIconPressed(true);
    setLiked(!liked);
    // 다음 프레임에서 플래그 리셋
    setTimeout(() => setIsLikeIconPressed(false), 100);
  };

  const handleItemPress = () => {
    if (!isLikeIconPressed) {
      if (user?.role === 'COUNCIL') {
        navigation?.navigate('CouncilAffiliateDetailScreen', { item });
      } else {
        navigation?.navigate('AffiliationDetailScreen', { item });
      }
    }
  };

  return (
    <Pressable style={styles.container} onPress={handleItemPress}>
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
          />
          {/* <Pressable style={styles.unlikedIcon} onPress={handleLikePress}>
            {liked ? (
              <LikedIcon width={18} height={18} color={colors.orange[500]} />
            ) : (
              <UnlikedIcon width={18} height={18} />
            )}
          </Pressable> */}
        </View>
      ) : (
        <View style={styles.imageContainer}>
          <PlaceHolderImage width={108} height={108} style={styles.image} />
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
        <Text style={styles.title}>{item?.title}</Text>
        <View style={styles.placeAndDate}>
          <View style={styles.placeAndDateItem}>
            <PlaceIcon width={16} height={16} color={colors.gray[300]} />
            <Text style={styles.place}>{item?.place}</Text>
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
            <Text style={styles.date}>
              {item?.category === 'EVENT'
                ? `${endYear}년 ${endMonth}월 ${endDay}일 ${startHour}시 ${startMinute}분`
                : `${endYear}년 ${endMonth}월 ${endDay}일 까지`}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default AffiliationColumnListItem;
