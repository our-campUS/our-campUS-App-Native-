import React, { useState, useRef } from 'react';
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
import { togglePlaceLike } from '../../api/place';

import LabelTitle from '../../components/LabelTitle';
import Button from '../../components/Button';
import theme from '../../style';
import colors from '../../style/colors';
import typography from '../../style/typography';
import DUMMY_STORE from '../../constants/StoreData';
import ReviewActionModal from '../../components/review/ReviewActionModal';

import StarIcon from '../../../assets/icons/common/star.svg';
import PinIcon from '../../../assets/icons/common/pin.svg';
import PhoneIcon from '../../../assets/icons/common/phone.svg';
import ClockIcon from '../../../assets/icons/common/clock.svg';
import RatingIcon from '../../../assets/icons/rating.svg';

import LikedIcon from '../../../assets/Liked.svg';
import UnlikedIcon from '../../../assets/Unliked.svg';
import ShareIcon from '../../../assets/share.svg';
import ArrowRightIcon from '../../../assets/ArrowRightIcon.svg';
import CloseIcon from '../../../assets/icons/common/close.svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StoreDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);

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

    isPartner: paramStore.isPartnership,
    partnerTags: paramStore.tag ? [paramStore.tag] : [],
  };

  console.log('================= [StoreDetailScreen Debug] =================');
  console.log('1. 이전 화면에서 넘겨준 원본 (route.params):', route.params);
  console.log('-------------------------------------------------------------');
  console.log(
    '2. 최종 렌더링 데이터 (storeData):',
    JSON.stringify(storeData, null, 2)
  );
  console.log('=============================================================');

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveImageIndex(viewableItems[0].index);
    }
  }).current;

  const [isLiked, setIsLiked] = useState(paramStore.isLiked || false);

  const handleLikePress = async () => {
    const previousState = isLiked;
    setIsLiked(!isLiked);

    try {
      await togglePlaceLike(storeData);
    } catch (error) {
      console.error('상세화면 좋아요 실패:', error);
      setIsLiked(previousState);
    }
  };

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
              <View style={styles.emptyBanner}>
                <Ionicons
                  name="image-outline"
                  size={48}
                  color={colors.gray[300]}
                />
              </View>
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
                        width={16}
                        height={15}
                        color={theme.colors.primary2}
                      />
                    ) : (
                      <UnlikedIcon width={16} height={15} />
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7}>
                  <View style={styles.iconCircleButton}>
                    <ShareIcon
                      width={14}
                      height={16}
                      color={colors.gray[400]}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {storeData.isPartner ? (
              <View style={styles.partnerTagRow}>
                {storeData.partnerTags?.map((tag, index) => (
                  <TouchableOpacity key={index} style={styles.partnerTag}>
                    <Text style={styles.partnerTagText}>{tag}</Text>
                    <ArrowRightIcon
                      width={8}
                      height={8}
                      color={theme.colors.primary1}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.nonPartnerRow}>
                <TouchableOpacity style={styles.requestButton}>
                  <Text style={styles.requestButtonText}>제휴 요청하기</Text>
                  <ArrowRightIcon
                    width={8}
                    height={8}
                    color={theme.colors.primary1}
                  />
                </TouchableOpacity>
                {isTooltipVisible && (
                  <View style={styles.tooltip}>
                    <View style={styles.tooltipArrow} />

                    <View style={styles.tooltipTextContainer}>
                      <Text style={styles.tooltipText}>
                        아직 이용할 수 있는 제휴가 없는 매장이에요.
                      </Text>
                      <Text style={styles.tooltipText}>
                        학생회에게 제휴를 요청하실래요?
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => setIsTooltipVisible(false)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.closeButton}
                    >
                      <CloseIcon
                        width={10}
                        height={10}
                        color={theme.colors.primary1}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            <View style={styles.detailList}>
              <View style={styles.detailRow}>
                <StarIcon width={24} height={24} style={{ marginRight: 4 }} />
                {storeData.reviewSize > 0 ? (
                  <>
                    <Text style={styles.detailText}>{storeData.star}</Text>
                    <Text style={styles.detailTextSub}>
                      ({storeData.reviewSize})
                    </Text>
                  </>
                ) : (
                  <Text
                    style={[styles.detailText, { color: colors.gray[400] }]}
                  >
                    첫 리뷰를 작성해보세요!
                  </Text>
                )}
              </View>
              {storeData.address ? (
                <View style={styles.detailRow}>
                  <PinIcon width={24} height={24} style={{ marginRight: 4 }} />
                  <Text style={styles.detailText}>{storeData.address}</Text>
                </View>
              ) : null}
              {storeData.phone ? (
                <View style={styles.detailRow}>
                  <PhoneIcon
                    width={24}
                    height={24}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.detailText}>{storeData.phone}</Text>
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
                리뷰{' '}
                <Text style={styles.detailTextSub}>
                  {storeData.reviewSize}개
                </Text>
              </Text>
              <TouchableOpacity
                disabled={!storeData.reviewSize || storeData.reviewSize === 0}
                onPress={() =>
                  navigation.navigate('ReviewListScreen', {
                    storeName: storeData.name,
                    star: storeData.star,
                    placeId: storeData.placeId,
                    reviewSize: storeData.reviewSize,
                  })
                }
              >
                {storeData.reviewSize > 0 && (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.gray[700]}
                  />
                )}
              </TouchableOpacity>
            </View>

            {storeData.reviews && storeData.reviews.length > 0 ? (
              storeData.reviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewTextWrapper}>
                    <View style={styles.reviewRating}>
                      {[...Array(5)].map((_, i) => (
                        <RatingIcon
                          key={i}
                          width={16}
                          height={16}
                          color={
                            i < review.star
                              ? theme.colors.primary2
                              : colors.gray[200]
                          }
                          style={{ marginRight: 1 }}
                        />
                      ))}
                    </View>
                    <Text style={styles.reviewContent}>{review.content}</Text>
                    <View style={styles.reviewMeta}>
                      <Text style={styles.reviewUser}>{review.writerName}</Text>
                      <Text style={styles.reviewUser}>{review.createdAt}</Text>
                    </View>
                  </View>
                  {review.thumbnailImgUrl ? (
                    <Image
                      source={{ uri: review.thumbnailImgUrl }}
                      style={styles.reviewImagePlaceholder}
                    />
                  ) : (
                    <View style={styles.reviewImagePlaceholder} />
                  )}
                </View>
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
              if (storeData.isPartner) {
                setModalVisible(true);
              } else {
                navigation.navigate('WriteReviewScreen', {
                  placeId: storeData.placeId,
                  storeName: storeData.name,
                  rating: storeData.star,
                });
              }
            }}
            style={styles.customButtonStyle}
            textStyle={styles.customButtonText}
          >
            <Ionicons name="pencil" size={16} color="white" />
          </Button>
        </View>
      </View>

      <ReviewActionModal
        isVisible={modalVisible}
        storeName={storeData.name}
        onClose={() => setModalVisible(false)}
        onConfirmScan={() => {
          console.log('카메라 스캔 화면으로 이동!');
          navigation.navigate('CameraScanScreen');
        }}
      />
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
    ...typography.heading3,
    color: theme.colors.text,
    marginRight: 6,
  },
  storeCategory: {
    ...typography.body3Regular,
    color: colors.gray[500],
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconCircleButton: {
    width: 32,
    height: 32,
    borderRadius: 20,
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
    gap: 4,
  },
  requestButtonText: {
    color: theme.colors.primary1,
    ...typography.caption2Bold,
  },
  tooltip: {
    backgroundColor: theme.colors.primary1Light,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    position: 'relative',
  },
  tooltipTextContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },

  tooltipText: {
    ...typography.caption2Regular,
    color: theme.colors.primary1,
  },

  closeButton: {
    padding: 4,
  },

  tooltipArrow: {
    position: 'absolute',
    left: -6,
    top: 15,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: theme.colors.primary1Light,
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
    colors: colors.gray['000'],
  },
  bannerContainer: {
    height: 250,
    position: 'relative',
  },
  emptyBanner: {
    height: 250,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
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
