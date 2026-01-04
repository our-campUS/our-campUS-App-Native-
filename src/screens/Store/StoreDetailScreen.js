import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LabelTitle from '../../components/LabelTitle';
import Button from '../../components/Button';
import theme from '../../style';
import colors from '../../style/colors';
import typography from '../../style/typography';
import DUMMY_STORE from '../../constants/StoreData';

import StarIcon from '../../../assets/icons/common/star.svg';
import PinIcon from '../../../assets/icons/common/pin.svg';
import PhoneIcon from '../../../assets/icons/common/phone.svg';
import ClockIcon from '../../../assets/icons/common/clock.svg';

const StoreDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const paramStore = route.params?.store || {};

  // 2. 데이터 병합 (넘어온 정보 + 부족한 정보는 더미로 채움)
  const storeData = {
    ...DUMMY_STORE, // 1. 일단 더미를 바닥에 깝니다.
    ...paramStore, // 2. 그 위에 실제 가게 이름, 위치 등을 덮어씁니다.

    // 3. 리스트 데이터에는 없는 상세 정보들(시간, 리뷰)은 더미에서 가져옵니다.
    hours: paramStore.hours || DUMMY_STORE.hours,
    reviews: paramStore.reviews || DUMMY_STORE.reviews,

    // 4. 데이터 타입 변환 (PARTNER 문자열 -> true/false)
    isPartner: paramStore.type
      ? paramStore.type === 'PARTNER'
      : DUMMY_STORE.isPartner,

    // 5. 제휴 명칭 변환 (문자열 -> 배열)
    // 예: '사회과학대학' -> ['사회과학대학']
    partnerTags: paramStore.partnerTags
      ? paramStore.partnerTags
      : paramStore.partnership
      ? [paramStore.partnership]
      : DUMMY_STORE.partnerTags,

    // [참고] 주소 처리 (Tip)
    // 리스트 데이터의 address는 "걸어서 4분" 같은 요약 정보일 수 있습니다.
    // 상세 주소("서울특별시...")가 필요하다면 더미를 우선시하거나 로직을 수정할 수 있습니다.
    // 지금은 리스트 데이터("걸어서 4분")가 우선 적용됩니다.
    address: paramStore.address || DUMMY_STORE.address,
  };

  const [isLiked, setIsLiked] = useState(false);

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
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={styles.topImagePlaceholder}>
            <Ionicons name="image-outline" size={48} color={colors.gray[300]} />
          </View>

          <View style={styles.infoSection}>
            <View style={styles.titleRow}>
              <View style={styles.titleTextWrapper}>
                <Text style={styles.storeName}>{storeData.name}</Text>
                <Text style={styles.storeCategory}>{storeData.category}</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
                  <Ionicons
                    name={isLiked ? 'heart' : 'heart-outline'}
                    size={24}
                    color={
                      isLiked ? theme.colors.primary2 : theme.colors.border
                    }
                    style={{ marginRight: 12 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons
                    name="share-social-outline"
                    size={24}
                    color={colors.gray[400]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {storeData.isPartner ? (
              <View style={styles.partnerTagRow}>
                {storeData.partnerTags?.map((tag, index) => (
                  <TouchableOpacity key={index} style={styles.partnerTag}>
                    <Text style={styles.partnerTagText}>
                      {tag} {'>'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.nonPartnerRow}>
                <TouchableOpacity style={styles.requestButton}>
                  <Text style={styles.requestButtonText}>
                    제휴 요청하기 {'>'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>
                    아직 이용할 수 있는 제휴가 없는 매장이에요.
                  </Text>
                  <Text style={styles.tooltipText}>
                    학생회에게 제휴를 요청하실래요?
                  </Text>
                  <View style={styles.tooltipArrow} />
                </View>
              </View>
            )}

            <View style={styles.detailList}>
              <View style={styles.detailRow}>
                <StarIcon width={16} height={16} style={{ marginRight: 4 }} />
                <Text style={styles.detailTextBold}>{storeData.rating}</Text>
                <Text style={styles.detailText}>({storeData.reviewCount})</Text>
              </View>
              <View style={styles.detailRow}>
                <PinIcon width={16} height={16} style={{ marginRight: 4 }} />
                <Text style={styles.detailText}>{storeData.address}</Text>
              </View>
              <View style={styles.detailRow}>
                <PhoneIcon width={16} height={16} style={{ marginRight: 4 }} />
                <Text style={styles.detailText}>{storeData.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <ClockIcon width={16} height={16} style={{ marginRight: 4 }} />
                <View>
                  {storeData.hours.map((time, idx) => (
                    <Text key={idx} style={styles.detailText}>
                      {time}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.reviewSection}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewTitle}>
                리뷰{' '}
                <Text style={{ fontWeight: '400', fontSize: 16 }}>
                  {storeData.reviewCount}개
                </Text>
              </Text>
              <TouchableOpacity>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.gray[600]}
                />
              </TouchableOpacity>
            </View>

            {storeData.reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewRating}>
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      width={16}
                      height={16}
                      color={
                        i < review.rating
                          ? theme.colors.primary2
                          : colors.gray[200]
                      }
                    />
                  ))}
                </View>
                <Text style={styles.reviewContent}>{review.content}</Text>
                <View style={styles.reviewMeta}>
                  <Text style={styles.reviewUser}>{review.user}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <View style={styles.reviewImagePlaceholder} />
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <Button
            title="리뷰 작성하기"
            onPress={() => console.log('리뷰 작성 클릭')}
            style={styles.customButtonStyle}
            textStyle={styles.customButtonText}
          >
            <Ionicons name="pencil" size={16} color="white" />
          </Button>
        </View>
      </View>
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
    height: 200,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleTextWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginRight: 8,
  },
  storeCategory: {
    fontSize: 14,
    color: colors.gray[500],
  },
  actionButtons: {
    flexDirection: 'row',
  },

  partnerTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  partnerTag: {
    backgroundColor: theme.colors.primary1Light,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  partnerTagText: {
    color: theme.colors.primary1,
    ...typography.caption2Bold,
  },

  nonPartnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  requestButton: {
    borderWidth: 1,
    borderColor: theme.colors.primary1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 10,
  },
  requestButtonText: {
    color: theme.colors.primary1,
    fontSize: 12,
    fontWeight: '600',
  },
  tooltip: {
    backgroundColor: theme.colors.primary1Light,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    position: 'relative',
  },
  tooltipText: {
    fontSize: 11,
    color: theme.colors.primary1,
    lineHeight: 16,
  },
  tooltipArrow: {
    position: 'absolute',
    left: -6,
    top: 10,
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
    marginBottom: 4,
    marginRight: 10,
  },
  detailText: {
    ...typography.body4Regular,
    color: theme.colors.textDim,
  },
  detailTextBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginRight: 4,
    lineHeight: 20,
  },

  divider: {
    height: 8,
    backgroundColor: theme.colors.border,
  },

  reviewSection: {
    padding: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center',
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  reviewItem: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    paddingBottom: 24,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewContent: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewUser: {
    fontSize: 12,
    color: colors.gray[500],
    marginRight: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.gray[400],
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
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },

  customButtonStyle: {
    backgroundColor: '#6BAAF9',
    borderRadius: 12,
    height: 52,
  },
  customButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StoreDetailScreen;
