import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

const RECOMMEND_STORES = [
  {
    id: 1,
    name: '수아르떼 중앙대점',
    benefit: '첫방문 20% 할인',
    dist: '0.0km',
  },
  {
    id: 2,
    name: '스타벅스 상도역점',
    benefit: '첫방문 20% 할인',
    dist: '0.1km',
  },
  { id: 3, name: '투썸플레이스', benefit: '첫방문 10% 할인', dist: '0.2km' },
];

const ReviewResultScreen = () => {
  const navigation = useNavigation();

  // [개발용 state]
  const [caseType, setCaseType] = useState(1);

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
    const showHeader = caseType === 3 || caseType === 4;

    // ReviewItem에 전달할 데이터 포맷
    const reviewItemData = {
      star: 5,
      comment: '떡볶이 정말 양 많아요. 아 근데 스벅이네...',
      name: '최서*',
      date: '25.02.14',
    };

    return (
      <View style={styles.reviewSection}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={styles.reviewCompleteTitle}>
            <Text style={{ color: '#6BAAF9' }}>첫번째</Text> 리뷰 작성 완료!
          </Text>
          <Text style={styles.reviewCompleteSub}>
            스타벅스 상도역점의 첫번째 리뷰 작성 완료
          </Text>
        </View>

        <ReviewItemCompact item={reviewItemData} variant="card" />

        <View style={styles.rankingContainer}>
          <View style={styles.rankingHeader}>
            <RankingIcon width={18} height={18} />
            <Text style={styles.rankingTitle}>서연님의 리뷰 랭킹</Text>
          </View>
          <View style={styles.rankingRow}>
            <Text style={styles.rankingLabel}>정치국제학과에서</Text>
            <Text style={styles.rankingValue}>첫번째 리뷰</Text>
          </View>
          <View style={styles.rankingRow}>
            <Text style={styles.rankingLabel}>사회과학대에서</Text>
            <Text style={styles.rankingValue}>4번째 리뷰</Text>
          </View>
          <View style={styles.rankingRow}>
            <Text style={styles.rankingLabel}>중앙대 전체에서</Text>
            <Text style={styles.rankingValue}>9번째 리뷰</Text>
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
            // onPress={() => }
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
              스타벅스 상도점이{'\n'}제휴를 진행하지 않아{'\n'}아쉽다면?
            </Text>
            <Text style={[styles.middleSubtitle, { marginTop: 8 }]}>
              캠퍼스가 학생회에 의견을 대신 전해드려요!
            </Text>

            <TouchableOpacity style={styles.outlineButton}>
              <Text style={styles.outlineButtonText}>제휴 요청하기 {'>'}</Text>
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

        {RECOMMEND_STORES.map((store, index) => (
          <View key={store.id} style={styles.storeRow}>
            <View style={styles.storeImage} />
            <View style={styles.storeInfo}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color="#6BAAF9"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.storeName}>{store.name}</Text>
                <Text style={styles.storeCategory}>카페</Text>
              </View>
              <Text style={styles.storeBenefit}>{store.benefit}</Text>
              <Text style={styles.storeDist}>걸어서 4분 {store.dist}</Text>
            </View>
            {/* 순위 배지 (1, 2, 3) */}
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
          </View>
        ))}

        <Button
          title="제휴 더 보러가기"
          // onPress={() => }
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

      {/* 개발용 토글 */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 10,
          marginBottom: 10,
        }}
      >
        {[1, 2, 3, 4].map((num) => (
          <TouchableOpacity
            key={num}
            onPress={() => setCaseType(num)}
            style={{
              padding: 8,
              backgroundColor: caseType === num ? 'black' : '#ddd',
              borderRadius: 4,
            }}
          >
            <Text style={{ color: caseType === num ? 'white' : 'black' }}>
              Case {num}
            </Text>
          </TouchableOpacity>
        ))}
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
  },
  outlineButtonText: {
    ...typography.body4Bold,
    color: colors.blue[600],
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
  storeRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    ...theme.shadows.level1,
  },
  storeImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.gray[200],
    marginRight: 12,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginRight: 6,
  },
  storeCategory: {
    fontSize: 11,
    color: colors.gray[400],
  },
  storeBenefit: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 2,
    marginBottom: 2,
  },
  storeDist: {
    fontSize: 11,
    color: colors.gray[400],
  },
  rankBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    backgroundColor: theme.colors.primary1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.background,
  },
});

export default ReviewResultScreen;
