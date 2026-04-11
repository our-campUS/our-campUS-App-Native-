import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import theme from '../../style';
import colors from '../../style/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainCarousel from '../../components/home/MainCarousel';
import AffiliateSection from '../../components/home/AffiliateSection';
import RecommendSection from '../../components/home/RecommendSection';
import CurationCarousel from '../../components/home/CurationCarousel';
import BannerCard from '../../components/common/BannerCard';
import { CAROUSEL_DATA } from '../../constants/DummyData';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../store/authStore';
import { getUserInfo } from '../../api/user';
import { useNavigation } from '@react-navigation/native';
import { getUpcomingEventsAll } from '../../api/studentAffiliate';
import { checkUnreadNotification } from '../../api/notification';
import VerticalEventTicker from '../../components/home/VerticalEventTicker';

const HomeSection = ({
  title,
  children,
  hasDivider = false,
  fullWidthContent = false, // ★ 추가: 컨텐츠를 화면 꽉 차게 쓸지 여부
}) => {
  return (
    <View style={styles.sectionContainer}>
      {hasDivider && <View style={styles.divider} />}

      {title && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      )}

      <View style={fullWidthContent ? {} : styles.contentPadding}>
        {children}
      </View>
    </View>
  );
};

const HomeScreen = () => {
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchUnread = async () => {
      if (!accessToken) return;
      const hasUnread = await checkUnreadNotification();
      setHasNewNotification(hasUnread);
    };
    fetchUnread();
  }, [accessToken]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      if (!accessToken) return;
      const events = await getUpcomingEventsAll();
      setUpcomingEvents(events);
    };

    fetchUpcomingEvents();
  }, [accessToken]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('유저 정보 로딩');
      await getUserInfo();
    };

    fetchData();
  }, []);

  const handleEventPress = (event) => {
    navigation.navigate('AffiliationDetailScreen', {
      item: event,
      councilType: event.councilType,
    });
  };

  const handleCarouselPress = (item) => {
    if (item.id === '1' || item.id === '2') {
      navigation.navigate('Partnership', {
        screen: 'AffiliationMainScreen',
      });
    }
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container}>
        {/* 행사 안내 */}
        <View style={styles.topArea}>
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <Text style={styles.greeting}>{user.name}님, 안녕하세요</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('NotificationScreen')}
                style={styles.notificationBtn}
              >
                <Ionicons
                  name="notifications"
                  size={24}
                  color={colors.gray[300]}
                />

                {hasNewNotification && <View style={styles.badge} />}
              </TouchableOpacity>
            </View>

            <VerticalEventTicker
              events={upcomingEvents}
              onEventPress={handleEventPress}
            />
          </View>

          {/* 캐러셀 */}
          <View style={styles.carouselWrapper}>
            <MainCarousel
              data={CAROUSEL_DATA}
              onItemPress={handleCarouselPress}
            />
          </View>
        </View>

        {/* 이용 가능한 제휴 */}
        <HomeSection title="🧐 이용 가능한 제휴" hasDivider={false}>
          <AffiliateSection />
        </HomeSection>

        {/* 공간 추천 */}
        <HomeSection
          title="🚀 3시간 공강, 이런 공간은 어때요?"
          hasDivider={true}
          fullWidthContent={true}
        >
          <RecommendSection />
        </HomeSection>

        {/* 큐레이션 */}
        {/* <HomeSection
          title="💕 추천 큐레이션"
          hasDivider={true}
          fullWidthContent={true}
        >
          <CurationCarousel />
        </HomeSection> */}

        <HomeSection title="💯 캠어스를 100% 이용하는 법" hasDivider={true}>
          <View>
            <BannerCard
              title="좋은 제휴 아이디어 공유해주실래요?"
              subtitle="원하는 제휴 혜택을 학생회에게 직접 제안해요"
              imageSource={require('../../../assets/images/home/banner_03.webp')}
              onPress={() => navigation.navigate('Map')}
            />
            <BannerCard
              title="제휴 이용하고 혜택 받아가세요!"
              subtitle="리뷰만 작성해도 혜택이 팡팡"
              imageSource={require('../../../assets/images/home/banner_04.webp')}
              onPress={() =>
                navigation.navigate('Partnership', {
                  screen: 'AffiliationMainScreen',
                })
              }
            />
          </View>
        </HomeSection>
      </ScrollView>
    </SafeAreaView>
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
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  greeting: {
    ...theme.typography.heading6,
  },

  notificationBtn: {
    position: 'relative',
    padding: 4,
  },

  badge: {
    position: 'absolute',
    top: 5,
    right: 6,
    width: 4,
    height: 4,
    borderRadius: 3,
    backgroundColor: theme.colors.primary2,
  },
  carouselWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },

  sectionTitle: {
    ...theme.typography.heading4,
  },

  sectionContainer: {
    marginBottom: 30,
  },

  sectionHeader: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  contentPadding: {
    paddingHorizontal: 20,
  },

  divider: {
    height: 8,
    backgroundColor: colors.gray[100],
    marginBottom: 24,
  },
});

export default HomeScreen;
