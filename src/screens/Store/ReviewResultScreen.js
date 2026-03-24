import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StampImage from '@assets/images/stamp.png';
import Button from '@components/Button';
import ReviewItemCompact from '@components/review/ReviewPreviewItem';

import theme from '@style';
import typography from '@style/typography';
import colors from '@style/colors';
import RankingIcon from '@assets/icons/trophy.svg';
import LinearGradient from 'react-native-linear-gradient';
import BannerCard from '@components/common/BannerCard';
import RecommendStoreCard from '@components/Affiliation/RecommendStoreCard';
import ArrowRightIcon from '@assets/ArrowRightIcon.svg';
import { getPartnershipList } from '@api/review';

const formatDistance = (meters) => {
  if (meters == null) return null;
  return meters >= 1000
    ? `${(meters / 1000).toFixed(1)}km`
    : `${Math.round(meters)}m`;
};

const getOrdinal = (n) => {
  const ordinals = ['첫번째', '두번째', '세번째', '네번째', '다섯번째', '여섯번째', '일곱번째', '여덟번째', '아홉번째', '열번째'];
  return n >= 1 && n <= 10 ? ordinals[n - 1] : `${n}번째`;
};

const getJosa = (str) => {
  if (!str) return '이';
  const code = str.charCodeAt(str.length - 1);
  if (code < 0xAC00 || code > 0xD7A3) return '이';
  return (code - 0xAC00) % 28 > 0 ? '이' : '가';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.slice(2).replace(/-/g, '.');
};

const ReviewResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { reviewResult, caseType = 3, placeName = '' } = route.params || {};
  const reviewData = reviewResult?.review;
  const resultData = reviewResult?.result;
  const rankingData = reviewResult?.ranking;

  const [partnerRequested, setPartnerRequested] = useState(false);
  const [partnerStores, setPartnerStores] = useState([]);

  useEffect(() => {
    const fetchStores = (lat, lng) => {
      getPartnershipList(lat, lng)
        .then((data) => {
setPartnerStores(
            data.map((item) => ({
              id: item.placeId,
              placeName: item.placeName,
              category: item.category,
              benefit: item.partnership,
              thumbnailImageUrl: item.thumbnailUrl,
              distance: formatDistance(item.distance),
              type: '제휴',
            })),
          );
        })
        .catch((e) => console.error('제휴 매장 목록 오류:', e));
    };

    fetchStores(37.505, 126.957);
  }, []);

  const handleClose = () => {
    navigation.popToTop();
  };

  const renderTopSection = () => {
    let title = '';
    let subTitle = '';
    let showStamp = false;

    switch (caseType) {
      case 1:
        title = '3번째 스탬프 적립 완료!';
        subTitle = '제휴를 이용하고 스탬프를 모아보세요.';
        showStamp = true;
        break;
      case 2:
        title = '3번째 스탬프 적립 예정!';
        subTitle =
          '담당자가 영수증 정보를 확인한 뒤\n스탬프가 자동으로 적립될 예정이에요!';
        showStamp = true;
        break;
      case 3:
      case 4:
        return null;
    }

    return (
      <View style={styles.topMessageContainer}>
        <Text style={styles.topTitle}>{title}</Text>
        <Text style={styles.topSubtitle}>{subTitle}</Text>
        {showStamp && (
          <View style={styles.stampWrapper}>
            <Image
              source={StampImage}
              style={{
                width: 160,
                height: 160,
                resizeMode: 'contain',
              }}
            />
          </View>
        )}
      </View>
    );
  };

  const renderReviewCard = () => {
    const ordinal = getOrdinal(resultData?.userReviewCountOfPlace ?? 1);
    const reviewItemData = {
      star: reviewData?.star ?? 0,
      comment: reviewData?.content ?? '',
      name: reviewData?.userName ?? '',
      date: formatDate(reviewData?.createDate),
      imageUrls: reviewData?.imageUrls?.length ? reviewData.imageUrls : undefined,
    };

    return (
      <View style={styles.reviewSection}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={styles.reviewCompleteTitle}>
            <Text style={{ color: '#6BAAF9' }}>{ordinal}</Text> 리뷰 작성 완료!
          </Text>
          <Text style={styles.reviewCompleteSub}>
            {placeName}의 {ordinal} 리뷰 작성 완료
          </Text>
        </View>

        <ReviewItemCompact item={reviewItemData} variant="card" />

        <View style={styles.rankingContainer}>
          <View style={styles.rankingHeader}>
            <RankingIcon width={18} height={18} />
            <Text style={styles.rankingTitle}>{reviewData?.userName ?? ''}님의 리뷰 랭킹</Text>
          </View>
          <View style={styles.rankingRow}>
            <Text style={styles.rankingLabel}>{rankingData?.major?.scope}에서</Text>
            <Text style={styles.rankingValue}>{getOrdinal(rankingData?.major?.rank ?? 1)} 리뷰</Text>
          </View>
          <View style={styles.rankingRow}>
            <Text style={styles.rankingLabel}>{rankingData?.college?.scope}에서</Text>
            <Text style={styles.rankingValue}>{getOrdinal(rankingData?.college?.rank ?? 1)} 리뷰</Text>
          </View>
          <View style={styles.rankingRow}>
            <Text style={styles.rankingLabel}>{rankingData?.school?.scope}에서</Text>
            <Text style={styles.rankingValue}>{getOrdinal(rankingData?.school?.rank ?? 1)} 리뷰</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderMiddleAction = () => {
    if (caseType === 3) {
      return (
        <View style={styles.middleActionContainer}>
          <Text style={styles.middleTitle}>캠어스를 100% 이용하는 법</Text>
          <Text style={styles.middleSubtitle}>
            다음에는 제휴 혜택을 이용해보세요!
          </Text>

          <BannerCard
            title="제휴 이용하고 스탬프 받아가세요!"
            subtitle="제휴만 이용해도 혜택이 팡팡"
            imageSource={require('../../../assets/images/home/banner_04.png')}
            style={styles.bannerCard}
          />

          <Button
            title="스탬프 채울 수 있는 제휴 보러가기"
            onPress={() => navigation.navigate('MainTab', { screen: 'Partnership' })}
            style={[styles.blueButton, styles.blueButtonAfterBanner]}
            textStyle={styles.blueButtonText}
          />
        </View>
      );
    } else if (caseType === 4) {
      return (
        <View
          style={[
            styles.middleActionContainer,
            styles.middleActionContainerTransparent,
          ]}
        >
          <LinearGradient
            colors={['#FFFFFF', '#E6F5FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.requestBoxWrapper}
          >
            <Text style={styles.middleTitle}>
              {placeName}{getJosa(placeName)}{'\n'}제휴를 진행하지 않아{'\n'}아쉽다면?
            </Text>
            <Text style={[styles.middleSubtitle, { marginTop: 8 }]}>
              캠퍼스가 학생회에 의견을 대신 전해드려요!
            </Text>

            <TouchableOpacity
              style={[
                styles.outlineButton,
                partnerRequested && styles.outlineButtonDone,
              ]}
              onPress={() => setPartnerRequested(true)}
              disabled={partnerRequested}
            >
              <Text
                style={[
                  styles.outlineButtonText,
                  partnerRequested && styles.outlineButtonTextDone,
                ]}
              >
                {partnerRequested ? '제휴 요청 완료' : '제휴 요청하기'}
              </Text>
              {!partnerRequested && (
                <ArrowRightIcon
                  width={5}
                  height={10}
                  color={colors.blue[600]}
                />
              )}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      );
    }
    return null;
  };

  const renderBottomList = () => {
    if (caseType === 3) return <View />;

    const isBlueBackground = caseType === 1 || caseType === 2;

    return (
      <View
        style={[
          styles.bottomListContainer,
          isBlueBackground && { backgroundColor: colors.blue['000'] },
        ]}
      >
        <View style={styles.bottomHeader}>
          <Text style={styles.bottomTitle}>
            {isBlueBackground ? '제휴 매장 둘러보기' : '제휴 매장 둘러보기'}
          </Text>
          <Text style={styles.bottomSubtitle}>
            {isBlueBackground
              ? '최근 한달 간 제휴 이용수가 많았던 매장을 살펴보세요.'
              : '다음에는 제휴 매장 이용하고\n스탬프를 모아보세요!'}
          </Text>
        </View>

        {partnerStores.map((store, index) => (
          <RecommendStoreCard
            key={store.id}
            item={store}
            variant="long"
            rank={index + 1}
          />
        ))}

        <Button
          title="제휴 더 보러가기"
          onPress={() => navigation.navigate('MainTab', { screen: 'Partnership' })}
          style={styles.blueButton}
          textStyle={styles.blueButtonText}
        />

        {/* 하단 여백 */}
        <View style={{ height: 40 }} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 닫기 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.gray[800]} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderTopSection()}
        {renderReviewCard()}
        {renderMiddleAction()}
        {renderBottomList()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButton: {
    padding: 4,
  },

  // === Top Section ===
  topMessageContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 60,
  },
  topTitle: {
    ...typography.heading2,
    color: theme.colors.text,
    marginBottom: 8,
  },
  topSubtitle: {
    ...typography.body3Regular,
    color: theme.colors.textDim,
    textAlign: 'center',
  },
  stampWrapper: {
    marginTop: 42,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  // === Review Card ===
  reviewSection: {
    paddingHorizontal: 20,
    marginVertical: 60,
  },
  reviewCompleteTitle: {
    ...typography.heading2,
    color: theme.colors.text,
    marginBottom: 8,
  },
  reviewCompleteSub: {
    ...typography.body3Regular,
    color: theme.colors.textDim,
    marginBottom: 42,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    padding: 16,
    ...theme.shadows.level1,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 2,
  },
  cardContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewMeta: {
    fontSize: 12,
    color: colors.gray[400],
  },
  reviewImage: {
    width: 60,
    height: 60,
    backgroundColor: colors.gray[200],
    borderRadius: 8,
  },

  // Ranking
  rankingContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  rankingHeader: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  rankingTitle: {
    ...typography.heading6,
    color: theme.colors.textDim,
  },
  rankingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rankingLabel: {
    ...typography.body4Regular,
    color: theme.colors.textDim,
  },
  rankingValue: {
    ...typography.body4Bold,
    color: theme.colors.primary1,
  },

  // === Middle Action (Case 3, 4) ===
  middleActionContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: colors.blue['000'],
  },
  middleActionContainerTransparent: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  middleTitle: {
    ...typography.heading4,
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  middleSubtitle: {
    ...typography.body4Regular,
    color: theme.colors.textDim,
    textAlign: 'center',
  },
  bannerCard: {
    marginTop: 32,
    marginBottom: 0,
  },
  blueButton: {
    width: '100%',
    height: 50,
    marginTop: 20,
    backgroundColor: colors.blue[400],
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueButtonText: {
    ...typography.heading6,
    color: colors.gray['000'],
  },
  // Case 4 Request Box
  requestBoxWrapper: {
    width: '100%',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
  },
  outlineButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.primary1,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  outlineButtonDone: {
    borderColor: colors.blue[300],
    backgroundColor: colors.blue[100],
  },
  outlineButtonText: {
    ...typography.body4Bold,
    color: colors.blue[600],
  },
  outlineButtonTextDone: {
    color: colors.blue[300],
  },
  outlineButtonIcon: {
    marginLeft: 4,
  },

  // === Bottom List (Case 1, 2, 4) ===
  bottomListContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  bottomHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bottomTitle: {
    ...typography.heading2,
    color: theme.colors.text,
    marginBottom: 8,
  },
  bottomSubtitle: {
    ...typography.body3Regular,
    color: theme.colors.textDim,
    textAlign: 'center',
  },
});

export default ReviewResultScreen;
