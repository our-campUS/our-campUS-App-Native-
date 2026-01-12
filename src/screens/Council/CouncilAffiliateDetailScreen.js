import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  useWindowDimensions,
  Pressable,
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
import useAuthStore from '../../store/authStore';
import {
  getCouncilAffiliatePostDetail,
  getCouncilAffiliatePosts,
} from '../../api/councilAffiliate';

const CouncilAffiliateDetailScreen = ({ navigation, route }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [labelTitle, setLabelTitle] = useState('');
  const { user, accessToken } = useAuthStore();
  const [detailData, setDetailData] = useState(null);
  const [endYear, setEndYear] = useState(null);
  const [endMonth, setEndMonth] = useState(null);
  const [endDay, setEndDay] = useState(null);
  const [recommendData, setRecommendData] = useState(null);
  console.log('user', user);
  console.log('route.params', route.params);
  const postId = route.params?.item?.postId;
  console.log('postId', postId);
  useEffect(() => {
    if (postId) {
      const fetchPostDetail = async () => {
        const response = await getCouncilAffiliatePostDetail(
          postId,
          accessToken
        );
        // console.log('response', response);
        setDetailData(response.data.data);
      };
      fetchPostDetail();
      const fetchRecommendData = async () => {
        const response = await getCouncilAffiliatePosts(accessToken);
        console.log('response', response.data.data?.content);
        const filteredData = response.data.data?.content.filter(
          (item) => item.postId !== postId
        );
        setRecommendData(filteredData);
      };
      fetchRecommendData();
    }
  }, [postId]);

  useEffect(() => {
    console.log('recommendData', recommendData);
  }, [recommendData]);

  useEffect(() => {
    if (detailData) {
      console.log('detailData', detailData);
      setEndYear(detailData?.endDate?.slice(0, 4));
      setEndMonth(
        detailData?.endDate?.slice(5, 7) === '0'
          ? detailData?.endDate?.slice(6, 7)
          : detailData?.endDate?.slice(5, 7)
      );
      setEndDay(
        detailData?.endDate?.slice(8, 10) === '0'
          ? detailData?.endDate?.slice(9, 10)
          : detailData?.endDate?.slice(8, 10)
      );
    }
  }, [detailData]);
  const { width } = useWindowDimensions();
  const detailImages = detailData?.images || [];
  const isEmpty = detailImages.length === 0;

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <LabelTitle
        title={detailData?.writerName + ' 제휴'}
        navigation={navigation}
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <View style={{ height: 20 }} />
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
            renderItem={({ item, index }) => (
              <View style={[styles.imageContainer, { width }]}>
                {isEmpty ? (
                  <PlaceHolderImage
                    width={width}
                    height={375}
                    preserveAspectRatio="none"
                  />
                ) : (
                  <Image
                    source={{ uri: item }}
                    style={[styles.detailImage, { width }]}
                  />
                )}
              </View>
            )}
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
        <View style={styles.detailInfoContainer}>
          <View style={styles.topLayer}>
            <Text style={styles.title}>{route.params?.item?.title}</Text>
            <View style={styles.buttonWrapper}>
              {/* <Pressable
                style={styles.button}
                onPress={() => setIsLiked(!isLiked)}
              >
                <LikeIcon
                  width={18}
                  height={18}
                  color={isLiked ? colors.orange[500] : colors.gray[300]}
                />
              </Pressable> */}
              <Pressable style={styles.button}>
                <ShareIcon width={18} height={18} />
              </Pressable>
            </View>
          </View>
          <View style={styles.placeAndDate}>
            <View style={styles.placeWrapper}>
              <PlaceIcon width={20} height={20} color={colors.gray[300]} />
              <Text style={styles.place}>{route.params?.item?.place}</Text>
              {/* <Text style={styles.distance}>0.0km</Text> */}
            </View>
          </View>
          <View style={styles.dateWrapper}>
            <DateIcon width={24} height={24} color={colors.gray[300]} />
            <Text style={styles.date}>
              {endYear}년 {endMonth}월 {endDay}일 까지
            </Text>
            {/* <Text style={styles.time}>D-1</Text> */}
          </View>
        </View>
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
            // data={AFFILIATION_RECOMMEND_DATA}
            data={recommendData}
            horizontal
            contentContainerStyle={{ gap: 10 }}
            style={{ marginTop: 20 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.recommendItemContainer}>
                <View style={styles.imageWrapper}>
                  {item.thumbnailImageUrl ? (
                    <Image
                      source={{ uri: item.thumbnailImageUrl }}
                      style={{ width: 56, height: 56, borderRadius: 8 }}
                    />
                  ) : (
                    <PlaceHolderRepresentativeImage width={56} height={56} />
                  )}
                </View>
                <View style={styles.infoWrapper}>
                  <View style={styles.titleWrapper}>
                    {item?.approved && <BadgeIcon width={20} height={20} />}
                    <Text style={styles.recommendTitle}>{item?.place}</Text>
                    {/* <Text style={styles.placeType}>{item?.placeType}</Text> */}
                  </View>
                  <View style={styles.detailWrapper}>
                    <View style={styles.detailExplainWrapper}>
                      <CouponIcon width={15} height={15} />
                      <Text style={styles.detailExplain}>{item?.title}</Text>
                    </View>
                    {/* <View style={styles.detailDistanceWrapper}>
                      <PlaceIcon
                        width={12}
                        height={12}
                        color={colors.gray[300]}
                      />
                      <Text style={styles.detailDistance}>
                        {item?.distance}
                      </Text>
                    </View> */}
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  topLayer: {
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
    ...typography.heading6,
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
    marginLeft: 12,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendTitle: {
    ...typography.body4Bold,
    color: colors.gray[850],
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

export default CouncilAffiliateDetailScreen;
