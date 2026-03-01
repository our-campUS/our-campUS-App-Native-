import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  useWindowDimensions,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import colors from '../../style/colors';
import typography from '../../style/typography';
import LabelTitle from '../../components/LabelTitle';
import PlaceHolderImage from '../../../assets/blankImage.svg';
import LikeIcon from '../../../assets/Liked.svg';
import UnLikeIcon from '../../../assets/Unliked.svg';
import ShareIcon from '../../../assets/share.svg';
import PlaceIcon from '../../../assets/Vector2.svg';
import DateIcon from '../../../assets/calendar.svg';
import { AFFILIATION_RECOMMEND_DATA } from '../../constants/DummyData';
import PlaceHolderRepresentativeImage from '../../../assets/placeHolderImage.svg';
import BadgeIcon from '../../../assets/badgeIcon.svg';
import CouponIcon from '../../../assets/couponIcon.svg';
import Toast from '../../components/common/Toast';
import useToast from '../../hooks/useToast';
import {
  getStudentAffiliateDetail,
  getStudentAffiliateRecommendList,
  toggleStudentAffiliateLike,
} from '../../api/studentAffiliate';
import useAuthStore from '../../store/authStore';

const AffiliationDetailScreen = ({ navigation, route }) => {
  const [isLiked, setIsLiked] = useState(route.params?.item?.liked || false);
  const { accessToken } = useAuthStore();
  const [item, setItem] = useState(route.params?.item);
  const [councilType, setCouncilType] = useState(route.params?.councilType);
  const [dateYear, setDateYear] = useState();
  const [dateMonth, setDateMonth] = useState();
  const [dateDay, setDateDay] = useState();
  const [dateHour, setDateHour] = useState();
  const [dateMinute, setDateMinute] = useState();
  const [detailData, setDetailData] = useState();
  const [detailImages, setDetailImages] = useState();
  const [isEmpty, setIsEmpty] = useState(true);
  const [recommendData, setRecommendData] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState({}); // 각 이미지의 로딩 상태 추적
  const { toastVisible, toastMessage, showToast, hideToast } = useToast();
  const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false); // 첫 번째 이미지 로딩 상태
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // 스켈레톤 shimmer 애니메이션
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  useEffect(() => {
    console.log('route.params?.item', route.params?.item);
    const fetchStudentAffiliateDetail = async () => {
      const response = await getStudentAffiliateDetail(
        accessToken,
        route.params?.item?.id
      );
      console.log('fetchStudentAffiliateDetail response', response);
      const data = response.data.data;
      setDetailData(data);
      // detailData에서 liked 상태 업데이트
      if (data?.liked !== undefined) {
        setIsLiked(data.liked);
      }
    };
    fetchStudentAffiliateDetail();
  }, [route.params?.item]);

  useEffect(() => {
    console.log('councilType', councilType);
  }, [route.params?.councilType]);

  useEffect(() => {
    setDateYear(item?.endDateTime?.slice(0, 4));
    setDateMonth(item?.endDateTime?.slice(5, 7));
    if (item?.endDateTime?.slice(5, 7).startsWith('0')) {
      setDateMonth(item?.endDateTime?.slice(6, 7));
    }
    setDateDay(item?.endDateTime?.slice(8, 10));
    if (item?.endDateTime?.slice(8, 10).startsWith('0')) {
      setDateDay(item?.endDateTime?.slice(9, 10));
    }
  }, [item?.endDateTime]);

  useEffect(() => {
    console.log('detailData', detailData);
    const images = detailData?.images || [];
    const prevImages = detailImages || [];

    // images 배열이 실제로 변경되었는지 확인
    const imagesChanged =
      images.length !== prevImages.length ||
      images.some((img, idx) => img !== prevImages[idx]);

    if (imagesChanged) {
      setDetailImages(images);
      setIsEmpty(images.length === 0);
      // 이미지가 변경될 때만 로딩 상태 리셋
      setImagesLoaded({});
      setIsFirstImageLoaded(false);
    }
  }, [detailData?.images]);

  useEffect(() => {
    const fetchStudentAffiliateRecommendList = async () => {
      let category = detailData?.category;
      const response = await getStudentAffiliateRecommendList(
        accessToken,
        councilType,
        item?.id,
        detailData?.category
      );
      setRecommendData(response?.data?.data?.content || []);
    };
    fetchStudentAffiliateRecommendList();
  }, [detailData]);

  useEffect(() => {
    console.log('recommendData', recommendData);
  }, [recommendData]);

  const { width } = useWindowDimensions();

  // 빈 배열일 경우 5개 placeholder 이미지 생성
  const displayImages = isEmpty ? Array(5).fill(null) : detailImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title={
          detailData?.category === 'PARTNERSHIP'
            ? detailData?.writerName + ' 제휴'
            : detailData?.writerName + ' 행사'
        }
        navigation={navigation}
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      {/* <View style={{ height: 20 }} /> */}
      <ScrollView style={{ flex: 1 }}>
        <View style={{ width: '100%' }}>
          <FlatList
            ref={flatListRef}
            data={displayImages}
            horizontal
            pagingEnabled
            // style={{ marginTop: 20 }}
            contentContainerStyle={{ paddingHorizontal: 0 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const isImageLoaded = imagesLoaded[index] || false;
              const isFirstImage = index === 0;

              return (
                <View style={[styles.imageContainer, { width }]}>
                  {isEmpty ? (
                    <PlaceHolderImage
                      width={width}
                      height={375}
                      preserveAspectRatio="none"
                    />
                  ) : (
                    <>
                      {!isImageLoaded && (
                        <Animated.View
                          style={[
                            styles.skeletonImage,
                            { width },
                            {
                              opacity: shimmerAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.3, 0.7],
                              }),
                            },
                          ]}
                        />
                      )}
                      <Image
                        source={{ uri: item }}
                        style={[
                          styles.detailImage,
                          { width },
                          !isImageLoaded && styles.hiddenImage,
                        ]}
                        onLoad={() => {
                          setImagesLoaded((prev) => ({
                            ...prev,
                            [index]: true,
                          }));
                          if (isFirstImage) {
                            setIsFirstImageLoaded(true);
                          }
                        }}
                        onError={() => {
                          setImagesLoaded((prev) => ({
                            ...prev,
                            [index]: true,
                          }));
                          if (isFirstImage) {
                            setIsFirstImageLoaded(true);
                          }
                        }}
                      />
                    </>
                  )}
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        </View>
        <View style={styles.dotContainer}>
          {displayImages.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.dotActive]}
            />
          ))}
        </View>
        {!isEmpty && !isFirstImageLoaded ? null : (
          <View style={styles.detailInfoContainer}>
            <View style={styles.topLayer}>
              <Text
                style={styles.title}
                numberOfLines={2}
                ellipsizeMode="tail"
                textBreakStrategy="balanced"
              >
                {route.params?.item?.title}
              </Text>
            </View>
            <View style={styles.buttonWrapper}>
              <Pressable
                style={styles.button}
                onPress={async () => {
                  const newLikedState = !isLiked;
                  // 낙관적 업데이트 (즉시 UI 업데이트)
                  setIsLiked(newLikedState);
                  try {
                    const postId = item?.id || item?.postId || detailData?.id;
                    await toggleStudentAffiliateLike(accessToken, postId);
                    // 성공 시 detailData도 업데이트
                    if (detailData) {
                      setDetailData({ ...detailData, liked: newLikedState });
                    }
                    showToast(newLikedState ? '관심 목록에 추가되었어요!' : '관심 목록에서 삭제되었어요.');
                  } catch (error) {
                    // 실패 시 롤백
                    setIsLiked(!newLikedState);
                    console.error('handleLike error', error);
                  }
                }}
              >
                {isLiked ? (
                  <LikeIcon width={18} height={18} color={colors.orange[500]} />
                ) : (
                  <UnLikeIcon width={18} height={18} color={colors.gray[300]} />
                )}
              </Pressable>
              <Pressable style={styles.button}>
                <ShareIcon width={18} height={18} />
              </Pressable>
            </View>
            <View style={styles.placeAndDate}>
              <View style={styles.placeWrapper}>
                <PlaceIcon width={20} height={20} color={colors.gray[300]} />
                <Text style={styles.place}>
                  {route.params?.item?.placeName}
                </Text>
                {/* <Text style={styles.distance}>0.0km</Text> */}
              </View>
            </View>
            <View style={styles.dateWrapper}>
              <DateIcon width={24} height={24} color={colors.gray[300]} />
              {/* <Text style={styles.date}>{route.params?.item?.date}</Text> */}
              {item?.category === 'PARTNERSHIP' ? (
                <Text style={styles.date}>
                  {dateYear}년 {dateMonth}월 {dateDay}일 까지
                </Text>
              ) : (
                <Text style={styles.date}>
                  {dateYear}년 {dateMonth}월 {dateDay}일 {dateHour}시{' '}
                  {dateMinute}분
                </Text>
              )}
              {/* <Text style={styles.time}>D-1</Text> */}
            </View>
          </View>
        )}
        {!isEmpty && !isFirstImageLoaded ? null : (
          <View style={styles.recommendContainer}>
            {detailData?.category === 'PARTNERSHIP' ? (
              <Text style={styles.recommendTitle}>
                {detailData?.writerName}에서 진행하는 {'\n'}다른 제휴 매장
                둘러보기
              </Text>
            ) : (
              <Text style={styles.recommendTitle}>
                {detailData?.writerName}의 다가오는 행사
              </Text>
            )}
            <FlatList
              data={recommendData}
              horizontal
              contentContainerStyle={{ gap: 10 }}
              style={{ marginTop: 20 }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.recommendItemContainer}>
                  <View style={styles.imageWrapper}>
                    {item?.thumbnailImageUrl ? (
                      <Image
                        source={{ uri: item?.thumbnailImageUrl }}
                        style={{ width: 56, height: 56, borderRadius: 8 }}
                      />
                    ) : (
                      <PlaceHolderRepresentativeImage width={56} height={56} />
                    )}
                  </View>
                  <View style={styles.infoWrapper}>
                    <View style={styles.titleWrapper}>
                      {item?.approved && <BadgeIcon width={20} height={20} />}
                      <Text style={styles.recommendTitle}>
                        {item?.placeName}
                      </Text>
                      <Text style={styles.placeType}>{item?.placeType}</Text>
                    </View>
                    <View style={styles.detailWrapper}>
                      <View style={styles.detailExplainWrapper}>
                        <CouponIcon width={15} height={15} />
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          textBreakStrategy="balanced"
                          style={styles.detailExplain}
                        >
                          {item?.title}
                        </Text>
                      </View>
                      <View style={styles.detailDistanceWrapper}>
                        <PlaceIcon
                          width={12}
                          height={12}
                          color={colors.gray[300]}
                        />
                        <Text style={styles.detailDistance}>
                          {/* {item?.distance} */}
                          0.0km
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        )}
      </ScrollView>
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 375,
    borderRadius: 0,
    paddingHorizontal: 0,
  },
  detailImage: {
    height: 375,
    resizeMode: 'cover',
    borderRadius: 0,
  },
  hiddenImage: {
    position: 'absolute',
    opacity: 0,
  },
  skeletonImage: {
    height: 375,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
  },
  skeletonShimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray[200],
  },
  placeholderWrapper: {
    width: '100%',
    height: 375,
    borderRadius: 0,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gray[250],
  },
  dotActive: {
    backgroundColor: colors.gray[500],
  },
  detailInfoContainer: {
    position: 'relative',
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  topLayer: {
    maxWidth: 247,
    // width: 247,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.heading4,
  },
  buttonWrapper: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    top: 28,
    right: 20,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeAndDate: {
    marginTop: 12,
    gap: 4,
  },
  placeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  place: {
    marginLeft: 10,
    ...typography.body3Regular,
    color: colors.gray[700],
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    marginLeft: 4,
    ...typography.body4Regular,
    color: colors.gray[400],
    textAlignVertical: 'center',
  },
  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    marginLeft: -2,
  },
  date: {
    marginLeft: 4,
    ...typography.body3Regular,
    color: colors.gray[700],
  },
  time: {
    marginLeft: 2,
    ...typography.body4Regular,
    color: colors.gray[400],
    textAlignVertical: 'center',
  },
  recommendContainer: {
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  recommendTitle: {
    ...typography.heading4,
    color: colors.gray[850],
  },
  recommendItemContainer: {
    width: 280,
    height: 88,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray['050'],
    backgroundColor: colors.gray['000'],
    padding: 16,
    flexDirection: 'row',
  },
  imageWrapper: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  infoWrapper: {
    // backgroundColor: 'red',
    maxWidth: 180,
    marginLeft: 12,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  placeType: {
    ...typography.caption2Regular,
    color: colors.gray[700],
    marginLeft: 4,
  },
  detailWrapper: {
    flexDirection: 'column',
    gap: 2,
    marginTop: 4,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  detailExplainWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -2,
  },
  detailDistanceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailExplain: {
    ...typography.caption1Regular,
    color: colors.gray[700],
    marginLeft: 4,
  },
  detailDistance: {
    ...typography.caption1Regular,
    color: colors.gray[700],
    marginLeft: 4,
  },
});

export default AffiliationDetailScreen;
