import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  togglePlaceLike,
  getPlaceStatus,
  suggestPartnership,
  getPlacesByKeyword,
} from '@api/place';
import Toast from '@components/common/Toast';
import useToast from '../../hooks/useToast';
import { getReviewList } from '@api/review';

import LabelTitle from '@components/LabelTitle';
import Button from '@components/Button';
import theme from '@style';
import colors from '@style/colors';
import typography from '@style/typography';
// import ReviewActionModal from '@components/review/ReviewActionModal'; // TODO: 스캔 플로우 복구 시 주석 해제
import ReviewItem from '@components/review/ReviewItem';

import StarIcon from '@assets/icons/common/star.svg';
import PinIcon from '@assets/icons/common/pin.svg';
import PhoneIcon from '@assets/icons/common/phone.svg';
import ClockIcon from '@assets/icons/common/clock.svg';

import LikedIcon from '@assets/Liked.svg';
import UnlikedIcon from '@assets/Unliked.svg';
import ShareIcon from '@assets/share.svg';
import ArrowRightIcon from '@assets/ArrowRightIcon.svg';
import LocationTooltip from '@components/map/LocationTooltip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StoreDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // const [modalVisible, setModalVisible] = useState(false); // TODO: 스캔 플로우 복구 시 주석 해제
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  const onUpdatePlace = route.params?.onUpdatePlace;

  const paramStore = route.params?.store || {};

  const CATEGORY_MAP = {
    CAFE: '카페',
    FOOD: '음식점',
    PUB: '술집',
    STORE: '편의점',
    PARTNER: '제휴',
  };

  const storeData = {
    ...paramStore,
    name: paramStore.name || '이름 없음',
    address: paramStore.address || '',

    category:
      CATEGORY_MAP[paramStore.category] || paramStore.category || '기타',

    imgUrls: paramStore.imgUrls || [],

    rating: paramStore.star || 0,
    reviews:
      paramStore.reviews && paramStore.reviews.length > 0
        ? paramStore.reviews
        : [],

    reviewSize:
      paramStore.reviews && paramStore.reviews.length > 0
        ? paramStore.reviewSize
        : 0,

    phone: paramStore.telephone || paramStore.phone || '',
    hours: paramStore.hours || [],

    isPartner:
      paramStore.isPartnership ||
      paramStore.type === 'PARTNER' ||
      paramStore.category === 'PARTNER' ||
      paramStore.partnerships?.length > 0,
    partnerTags:
      paramStore.partnerships?.length > 0
        ? paramStore.partnerships.map((p) => p.councilName).filter(Boolean)
        : paramStore.tag
        ? [paramStore.tag]
        : [],

    backendPlaceId:
      paramStore.backendPlaceId !== undefined
        ? paramStore.backendPlaceId
        : paramStore.placeId || null,
    placeId: paramStore.placeId || null,
    placeKey: paramStore.placeKey || paramStore.id,
  };

  const { toastVisible, toastMessage, showToast, hideToast } = useToast();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(storeData.isLiked || false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isPartnershipRequested, setIsPartnershipRequested] = useState(false);
  const [currentPlaceId, setCurrentPlaceId] = useState(
    storeData.backendPlaceId
  );
  const [reviews, setReviews] = useState(storeData.reviews);
  const [reviewSize, setReviewSize] = useState(storeData.reviewSize);
  const [isPartner, setIsPartner] = useState(storeData.isPartner);
  const [partnerTags, setPartnerTags] = useState(storeData.partnerTags);
  const [phone, setPhone] = useState(storeData.phone);
  const [address, setAddress] = useState(storeData.address);

  useEffect(() => {
    if (storeData.phone || !storeData.name) return;
    getPlacesByKeyword(storeData.name)
      .then((results) => {
        if (results && results.length > 0) {
          const match = results[0];
          if (match.telephone || match.phone) {
            setPhone(match.telephone || match.phone);
          }
          if (match.address && !storeData.address) {
            setAddress(match.address);
          }
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!storeData.backendPlaceId || storeData.reviews?.length > 0) return;
    getReviewList(storeData.backendPlaceId)
      .then((res) => {
        const items = (res?.data?.items || []).map((r) => ({
          id: r.id,
          star: r.star,
          comment: r.content,
          name: r.userName,
          date: r.createDate ?? '',
          imageUrls: r.imageUrls?.length ? r.imageUrls : undefined,
        }));
        setReviews(items);
        setReviewSize(items.length);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeData.placeId]);

  const handleLikePress = async () => {
    const previousState = isLiked;
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    try {
      const requestBody = {
        ...storeData,
        backendPlaceId: currentPlaceId,
      };

      const response = await togglePlaceLike(requestBody);
      const newPlaceId = response?.data?.placeId || response?.placeId;

      showToast(newLikedState ? '관심 목록에 추가되었어요!' : '관심 목록에서 삭제되었어요');

      if (!currentPlaceId && newPlaceId) {
        setCurrentPlaceId(newPlaceId);
      }

      if (onUpdatePlace) {
        const targetId = currentPlaceId || newPlaceId || storeData.placeKey;
        onUpdatePlace(targetId, {
          isLiked: newLikedState,
          placeId: newPlaceId || currentPlaceId,
        });
      }
    } catch (error) {
      setIsLiked(previousState);
      if (onUpdatePlace) {
        const targetId = currentPlaceId || storeData.placeKey;
        onUpdatePlace(targetId, { isLiked: previousState });
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      const placeId = currentPlaceId || storeData.placeId;
      if (!placeId) return;

      let isActive = true;

      const fetchLatestStatus = async () => {
        try {
          const status = await getPlaceStatus(
            placeId,
            storeData.latitude,
            storeData.longitude
          );
          if (isActive && status) {
            setIsLiked(status.isLiked);
            if (status.placeId && !currentPlaceId) {
              setCurrentPlaceId(status.placeId);
            }
            const fetchedIsPartner =
              status.isPartnership || status.partnerships?.length > 0;
            if (fetchedIsPartner !== undefined) {
              setIsPartner((prev) => prev || !!fetchedIsPartner);
            }
            if (status.partnerships?.length > 0) {
              setPartnerTags(
                status.partnerships.map((p) => p.councilName).filter(Boolean)
              );
            }
            if (status.telephone || status.phone) {
              setPhone(status.telephone || status.phone);
            }
            if (status.address) {
              setAddress(status.address);
            }
          }
        } catch (error) {
          // silent
        }
      };

      fetchLatestStatus();

      return () => {
        isActive = false;
      };
    }, [
      currentPlaceId,
      storeData.placeId,
      storeData.latitude,
      storeData.longitude,
    ])
  );

  const handleSuggestPartnership = async () => {
    if (isSuggesting) return;
    setIsSuggesting(true);
    try {
      const result = await suggestPartnership({
        ...storeData,
        placeId: storeData.backendPlaceId || null,
      });
      if (result === 'SUCCESS') {
        setIsPartnershipRequested(true);
        setIsTooltipVisible(false);
        showToast('제휴 요청이 완료되었어요!');
      } else if (result === 'ALREADY_REQUESTED') {
        setIsPartnershipRequested(true);
        setIsTooltipVisible(false);
        showToast('이미 제휴 신청이 완료된 장소예요.');
      } else {
        showToast('제휴 요청에 실패했어요. 다시 시도해주세요.');
      }
    } catch {
      showToast('제휴 요청에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveImageIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <LabelTitle
        title={storeData.name}
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
        additionalStyle={styles.headerStyle}
      />

      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <View style={styles.bannerContainer}>
            {storeData.imgUrls && storeData.imgUrls.length > 0 ? (
              <View>
                <FlatList
                  data={storeData.imgUrls}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  onViewableItemsChanged={onViewableItemsChanged}
                  viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: item }}
                      style={{ width: SCREEN_WIDTH, height: 250 }}
                      resizeMode="cover"
                    />
                  )}
                />

                <View style={styles.pageIndicator}>
                  <Text style={styles.pageIndicatorText}>
                    {activeImageIndex + 1} / {storeData.imgUrls.length}
                  </Text>
                </View>
              </View>
            ) : (
              <Image
                source={require('../../../assets/images/default_image.webp')}
                style={styles.emptyBanner}
                resizeMode="cover"
              />
            )}
          </View>

          <View style={styles.infoSection}>
            <View style={styles.titleRow}>
              <View style={styles.titleTextWrapper}>
                <Text style={styles.storeName}>{storeData.name}</Text>
                <Text style={styles.storeCategory}>{storeData.category}</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={handleLikePress} activeOpacity={0.7}>
                  <View
                    style={[
                      styles.iconCircleButton,
                      isLiked && styles.likedBorder,
                      { marginRight: 8 },
                    ]}
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
                  </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7}>
                  <View style={styles.iconCircleButton}>
                    <ShareIcon
                      width={10.5}
                      height={12}
                      color={colors.gray[400]}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {isPartner ? (
              <View style={styles.partnerTagRow}>
                {partnerTags?.map((tag, index) => (
                  <TouchableOpacity key={index} style={styles.partnerTag}>
                    <Text style={styles.partnerTagText}>{tag}</Text>
                    <ArrowRightIcon
                      width={5}
                      height={8}
                      color={theme.colors.primary1}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.nonPartnerRow}>
                <TouchableOpacity
                  style={[
                    styles.requestButton,
                    isPartnershipRequested && styles.requestButtonDone,
                  ]}
                  onPress={handleSuggestPartnership}
                  disabled={isSuggesting || isPartnershipRequested}
                >
                  <Text
                    style={[
                      styles.requestButtonText,
                      isPartnershipRequested && styles.requestButtonTextDone,
                    ]}
                  >
                    {isPartnershipRequested
                      ? '제휴 요청 완료'
                      : '제휴 요청하기'}
                  </Text>
                  {!isPartnershipRequested && (
                    <ArrowRightIcon
                      width={5}
                      height={10}
                      color={colors.blue[600]}
                    />
                  )}
                </TouchableOpacity>
                {isTooltipVisible && (
                  <LocationTooltip
                    text={[
                      '아직 이용할 수 있는 제휴가 없는 매장이에요.',
                      '학생회에게 제휴를 요청하실래요?',
                    ]}
                    arrowDirection="left"
                    onClose={() => setIsTooltipVisible(false)}
                  />
                )}
              </View>
            )}

            <View style={styles.detailList}>
              <View style={styles.detailRow}>
                <StarIcon width={24} height={24} style={{ marginRight: 4 }} />
                {reviewSize > 0 ? (
                  <>
                    <Text style={styles.detailText}>
                      {storeData.averageStar ?? storeData.star}
                    </Text>
                    <Text style={styles.detailTextSub}>({reviewSize})</Text>
                  </>
                ) : (
                  <Text
                    style={[styles.detailText, { color: colors.gray[400] }]}
                  >
                    첫 리뷰를 작성해보세요!
                  </Text>
                )}
              </View>
              {address ? (
                <View style={styles.detailRow}>
                  <PinIcon width={24} height={24} style={{ marginRight: 4 }} />
                  <Text style={styles.detailText}>{address}</Text>
                </View>
              ) : null}
              {phone ? (
                <View style={styles.detailRow}>
                  <PhoneIcon
                    width={24}
                    height={24}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.detailText}>{phone}</Text>
                </View>
              ) : null}
              {storeData.hours && storeData.hours.length > 0 ? (
                <View style={styles.detailRow}>
                  <ClockIcon
                    width={24}
                    height={24}
                    style={{ marginRight: 4 }}
                  />
                  <View>
                    {storeData.hours.map((time, idx) => (
                      <Text key={idx} style={styles.detailText}>
                        {time}
                      </Text>
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.reviewSection}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewTitle}>
                리뷰 <Text style={styles.detailTextSub}>{reviewSize}개</Text>
              </Text>
              <TouchableOpacity
                disabled={!reviewSize}
                onPress={() =>
                  navigation.navigate('ReviewListScreen', {
                    storeName: storeData.name,
                    star: storeData.averageStar ?? storeData.star,
                    placeId: currentPlaceId,
                    reviewSize: reviewSize,
                    store: storeData,
                  })
                }
              >
                {reviewSize > 0 && (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.gray[700]}
                  />
                )}
              </TouchableOpacity>
            </View>

            {reviews?.length > 0 ? (
              reviews.map((review) => (
                <ReviewItem key={review.id} item={review} variant="preview" />
              ))
            ) : (
              <View style={styles.emptyReviewContainer}>
                <Text style={styles.emptyReviewText}>
                  아직 작성된 리뷰가 없어요.
                </Text>
                <Text style={styles.emptyReviewSubText}>
                  첫 리뷰의 주인공이 되어보세요!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <Button
            title="리뷰 작성하기"
            onPress={() => {
              // TODO: 스캔 플로우 복구 시 아래 주석 해제
              // if (storeData.isPartner) {
              //   setModalVisible(true);
              // } else {
              //   navigation.navigate('WriteReviewScreen', {
              //     placeId: storeData.placeId,
              //     placeKey: storeData.placeKey,
              //     storeName: storeData.name,
              //     rating: storeData.star,
              //   });
              // }
              navigation.navigate('WriteReviewScreen', {
                store: storeData,
                placeId: storeData.backendPlaceId || null,
                placeKey: storeData.placeKey,
                storeName: storeData.name,
                rating: storeData.star,
              });
            }}
            style={styles.customButtonStyle}
            textStyle={styles.customButtonText}
          >
            <Ionicons name="pencil" size={16} color="white" />
          </Button>
        </View>
      </View>

      {/* TODO: 스캔 플로우 복구 시 아래 주석 해제
      <ReviewActionModal
        isVisible={modalVisible}
        storeName={storeData.name}
        onClose={() => setModalVisible(false)}
        onConfirmScan={() => {
          console.log('카메라 스캔 화면으로 이동!');
          navigation.navigate('CameraScanScreen');
        }}
      />
      */}

      <Toast message={toastMessage} visible={toastVisible} onHide={hideToast} hasNavBar={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerStyle: {
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
  },
  topImagePlaceholder: {
    height: 220,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleTextWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  storeName: {
    ...typography.heading4,
    color: theme.colors.text,
    marginRight: 6,
  },
  storeCategory: {
    ...typography.body4Regular,
    color: colors.gray[500],
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconCircleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    gap: 8,
  },
  partnerTag: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderColor: colors.blue[600],
    borderWidth: 0.8,
    borderRadius: 36,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  partnerTagText: {
    color: theme.colors.primary1,
    ...typography.caption2Bold,
  },

  nonPartnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  requestButton: {
    borderWidth: 1,
    borderColor: theme.colors.primary1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 21,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requestButtonDone: {
    borderColor: colors.blue[300],
    backgroundColor: colors.blue[100],
  },
  requestButtonText: {
    color: colors.blue[600],
    ...typography.caption2Bold,
  },
  requestButtonTextDone: {
    color: colors.blue[300],
  },
  detailList: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailText: {
    ...typography.body4Regular,
    color: theme.colors.text,
  },
  detailTextSub: {
    ...typography.body4Regular,
    color: theme.colors.textDisabled,
    marginLeft: 4,
  },

  reviewSection: {
    paddingHorizontal: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  reviewTitle: {
    ...typography.heading4,
    color: theme.colors.text,
    marginRight: 14,
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reviewTextWrapper: {
    flex: 1,
    marginRight: 16,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reviewContent: {
    ...typography.body3Regular,
    color: theme.colors.text,
    marginBottom: 8,
  },
  reviewMeta: {
    flexDirection: 'row',
  },
  reviewUser: {
    ...typography.caption1Regular,
    color: theme.colors.textDisabled,
    marginRight: 12,
  },
  reviewImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
  },

  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },

  customButtonStyle: {
    backgroundColor: colors.blue[400],
    borderRadius: 16,
    height: 50,
  },
  customButtonText: {
    ...typography.heading6,
    color: colors.gray['000'],
  },
  bannerContainer: {
    height: 250,
    position: 'relative',
  },
  emptyBanner: {
    width: '100%',
    height: 250,
  },
  pageIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pageIndicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyReviewContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 10,
  },
  emptyReviewText: {
    ...typography.body3Regular,
    color: colors.gray[400],
    marginBottom: 4,
  },
  emptyReviewSubText: {
    ...typography.caption1Regular,
    color: colors.gray[300],
  },
});

export default StoreDetailScreen;
