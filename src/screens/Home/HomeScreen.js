import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import theme from '../../style';
import colors from '../../style/colors';
import MainCarousel from './MainCarousel';
import AffiliateSection from './AffiliateSection';
import RecommendSection from './RecommendSection';
import CurationCarousel from './CurationCarousel';
import BannerCard from './BannerCard';
import { CAROUSEL_DATA } from './DummyData';

const HomeSection = ({ title, children, hasDivider = false }) => {
  return (
    <View style={styles.sectionContainer}>
      {hasDivider && <View style={styles.divider} />}

      {title && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      )}

      {children}
    </View>
  );
};

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* 행사 안내 */}
      <View style={styles.topArea}>
        <View style={styles.header}>
          <Text style={styles.greeting}>사용자님, 안녕하세요</Text>
          <TouchableOpacity style={styles.eventBox}>
            <Text
              style={styles.eventText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              <Text style={styles.boldText}>오늘의 행사</Text> 310관 1층
              ‘경영경제대학 간식행사’가 18시에 있습니다 🎉
            </Text>
          </TouchableOpacity>
        </View>

        {/* 캐러셀 */}
        <View style={styles.carouselWrapper}>
          <MainCarousel data={CAROUSEL_DATA} />
        </View>
      </View>

      {/* 이용 가능한 제휴 */}
      <HomeSection title="🧐 이용 가능한 제휴" hasDivider={false}>
        <AffiliateSection />
      </HomeSection>

      {/* 공간 추천 */}
      <HomeSection title="🚀 3시간 공강, 이런 공간은 어때요?" hasDivider={true}>
        <RecommendSection />
      </HomeSection>

      {/* 큐레이션 */}
      <HomeSection title="💕 추천 큐레이션" hasDivider={true}>
        <CurationCarousel />
      </HomeSection>

      <HomeSection title="💯 캠어스를 100% 이용하는 법" hasDivider={true}>
        <View>
          <BannerCard
            title="좋은 제휴 아이디어 공유해주실래요?"
            subtitle="원하는 제휴 혜택을 학생회에게 직접 제안해요."
            onPress={() => console.log('제안하기 클릭')}
          />
          <BannerCard
            title="제휴 이용하고 스탬프 받아가세요!"
            subtitle="제휴만 이용해도 혜택이 팡팡"
            onPress={() => console.log('스탬프 클릭')}
          />
        </View>
      </HomeSection>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topArea: {
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 30,
  },
  greeting: { ...theme.typography.heading6, marginBottom: 15 },
  eventBox: {
    backgroundColor: theme.colors.primary1Light,
    padding: 10,
    borderRadius: 8,
  },
  eventText: { ...theme.typography.body4Regular, color: theme.colors.text },
  boldText: {
    ...theme.typography.body4Bold,
    marginRight: 8,
    color: theme.colors.text,
  },
  carouselWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },

  sectionContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  divider: {
    height: 8,
    backgroundColor: colors.gray[100],
    marginBottom: 24,
    marginHorizontal: -20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...theme.typography.heading4,
  },
});

export default HomeScreen;
