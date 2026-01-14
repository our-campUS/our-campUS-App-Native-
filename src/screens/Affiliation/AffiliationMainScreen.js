import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import HostByTab from '../../components/Affiliation/HostByTab';
import AffiliationCarousel from '../../components/Affiliation/AffiliationCarousel';
import AffiliationColumnList from '../../components/Affiliation/AffiliationColumnList';
import {
  AFFILIATION_COLUMN_LIST_DATA_AFFILIATION,
  AFFILIATION_COLUMN_LIST_DATA_EVENT,
} from '../../constants/DummyData';
import AffiliationColumnListItem from '../../components/Affiliation/AffiliationColumnListItem';
import {
  getStudentSchoolAffiliateList,
  getStudentSchoolEventList,
  getStudentMajorAffiliateList,
  getStudentMajorEventList,
  getStudentCollegeAffiliateList,
  getStudentCollegeEventList,
  getStudentSchoolUpcomingEventList,
  getStudentMajorUpcomingEventList,
  getStudentCollegeUpcomingEventList,
  toggleStudentAffiliateLike,
} from '../../api/studentAffiliate';
import useAuthStore from '../../store/authStore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
    alignItems: 'center',
  },
  activityTypeSelector: {
    width: '100%',
    padding: 20,
    flexDirection: 'row',
    gap: 9,
  },
  activityTypeSelectorButton: {
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: colors.gray[250],
    width: 47,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTypeSelectorButtonText: {
    ...typography.body4Regular,
    color: colors.gray[700],
  },
  activityTypeSelectorButtonPressed: {
    borderColor: colors.blue[400],
  },
  activityTypeSelectorOrangeButtonPressed: {
    borderColor: colors.orange[400],
  },
  activityTypeSelectorOrangeButtonTextPressed: {
    ...typography.body4Regular,
    color: colors.orange[600],
  },
  activityTypeSelectorButtonTextPressed: {
    ...typography.body4Regular,
    color: colors.blue[600],
  },
});

const AffiliationMainScreen = ({ navigation }) => {
  const [selectedActivityType, setSelectedActivityType] = useState('제휴');
  const { accessToken } = useAuthStore();
  const [affiliatePosts, setAffiliatePosts] = useState([]);
  const [eventPosts, setEventPosts] = useState([]);
  const [majorAffiliatePosts, setMajorAffiliatePosts] = useState([]);
  const [majorEventPosts, setMajorEventPosts] = useState([]);
  const [schoolAffiliatePosts, setSchoolAffiliatePosts] = useState([]);
  const [schoolEventPosts, setSchoolEventPosts] = useState([]);
  const [collegeAffiliatePosts, setCollegeAffiliatePosts] = useState([]);
  const [collegeEventPosts, setCollegeEventPosts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('school');
  const [upcomingSchoolEvents, setUpcomingSchoolEvents] = useState([]);
  const [upcomingMajorEvents, setUpcomingMajorEvents] = useState([]);
  const [upcomingCollegeEvents, setUpcomingCollegeEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadedTabs, setLoadedTabs] = useState(new Set()); // 이미 로드된 탭 추적
  const [isLoading, setIsLoading] = useState(false);

  // 특정 탭의 데이터를 fetch하는 함수
  const fetchTabData = async (tab) => {
    if (!accessToken) return;

    setIsLoading(true);
    try {
      if (tab === 'school') {
        const [affiliatePosts, eventPosts, upcomingEvents] = await Promise.all([
          getStudentSchoolAffiliateList(accessToken),
          getStudentSchoolEventList(accessToken),
          getStudentSchoolUpcomingEventList(accessToken),
        ]);
        setSchoolAffiliatePosts(affiliatePosts);
        setSchoolEventPosts(eventPosts);
        setUpcomingSchoolEvents(upcomingEvents);
        setAffiliatePosts(affiliatePosts);
        setEventPosts(eventPosts);
        setUpcomingEvents(upcomingEvents);
      } else if (tab === 'major') {
        const [affiliatePosts, eventPosts, upcomingEvents] = await Promise.all([
          getStudentMajorAffiliateList(accessToken),
          getStudentMajorEventList(accessToken),
          getStudentMajorUpcomingEventList(accessToken),
        ]);
        setMajorAffiliatePosts(affiliatePosts);
        setMajorEventPosts(eventPosts);
        setUpcomingMajorEvents(upcomingEvents);
        setAffiliatePosts(affiliatePosts);
        setEventPosts(eventPosts);
        setUpcomingEvents(upcomingEvents);
      } else if (tab === 'college') {
        const [affiliatePosts, eventPosts, upcomingEvents] = await Promise.all([
          getStudentCollegeAffiliateList(accessToken),
          getStudentCollegeEventList(accessToken),
          getStudentCollegeUpcomingEventList(accessToken),
        ]);
        setCollegeAffiliatePosts(affiliatePosts);
        setCollegeEventPosts(eventPosts);
        setUpcomingCollegeEvents(upcomingEvents);
        setAffiliatePosts(affiliatePosts);
        setEventPosts(eventPosts);
        setUpcomingEvents(upcomingEvents);
      }
      // 로드된 탭 추가
      setLoadedTabs((prev) => new Set([...prev, tab]));
    } catch (error) {
      console.error(`fetchTabData error for ${tab}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 시 기본 탭(school) 데이터만 fetch
  useEffect(() => {
    if (accessToken) {
      fetchTabData('school');
    }
  }, [accessToken]);

  const handleSelectTab = (tab) => {
    console.log('tab', tab);
    setSelectedTab(tab);
  };

  // 탭 변경 시 해당 탭의 데이터 fetch (이미 로드된 경우는 재사용)
  useEffect(() => {
    if (!accessToken) return;

    // 이미 로드된 탭이면 캐시된 데이터 사용
    if (loadedTabs.has(selectedTab)) {
      if (selectedTab === 'school') {
        setAffiliatePosts(schoolAffiliatePosts);
        setEventPosts(schoolEventPosts);
        setUpcomingEvents(upcomingSchoolEvents);
      } else if (selectedTab === 'major') {
        setAffiliatePosts(majorAffiliatePosts);
        setEventPosts(majorEventPosts);
        setUpcomingEvents(upcomingMajorEvents);
      } else if (selectedTab === 'college') {
        setAffiliatePosts(collegeAffiliatePosts);
        setEventPosts(collegeEventPosts);
        setUpcomingEvents(upcomingCollegeEvents);
      }
    } else {
      // 아직 로드되지 않은 탭이면 fetch
      fetchTabData(selectedTab);
    }
  }, [selectedTab]);

  // 화면이 포커스될 때마다 현재 탭의 데이터를 새로고침 (DetailScreen에서 좋아요 변경 반영)
  useFocusEffect(
    useCallback(() => {
      if (!accessToken) return;

      // 현재 탭의 데이터를 다시 fetch하여 최신 상태 유지
      fetchTabData(selectedTab);
    }, [selectedTab, accessToken])
  );

  const handleLike = async (postId) => {
    try {
      const response = await toggleStudentAffiliateLike(accessToken, postId);
      console.log('handleLike response', response);

      // 좋아요 상태 업데이트 함수
      const updateLikeStatus = (posts, setPosts) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId || post.postId === postId
              ? { ...post, liked: !post.liked }
              : post
          )
        );
      };

      // 현재 선택된 탭의 데이터 업데이트
      updateLikeStatus(affiliatePosts, setAffiliatePosts);
      updateLikeStatus(eventPosts, setEventPosts);

      // 캐시된 데이터도 업데이트
      if (selectedTab === 'school') {
        updateLikeStatus(schoolAffiliatePosts, setSchoolAffiliatePosts);
        updateLikeStatus(schoolEventPosts, setSchoolEventPosts);
      } else if (selectedTab === 'major') {
        updateLikeStatus(majorAffiliatePosts, setMajorAffiliatePosts);
        updateLikeStatus(majorEventPosts, setMajorEventPosts);
      } else if (selectedTab === 'college') {
        updateLikeStatus(collegeAffiliatePosts, setCollegeAffiliatePosts);
        updateLikeStatus(collegeEventPosts, setCollegeEventPosts);
      }
    } catch (error) {
      console.error('handleLike error', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={{ marginTop: 9.5 }}>
        <HostByTab
          // school={'중앙대학교'}
          // college={'사회과학대'}
          // major={'정치국제'}
          onSelectTab={handleSelectTab}
        />
      </View>
      {upcomingEvents.length > 0 && (
        <AffiliationCarousel
          isOrange={false}
          councilType={selectedTab}
          data={upcomingEvents}
          navigation={navigation}
        />
      )}
      {/* <AffiliationCarousel /> */}
      {/* <AffiliationColumnList navigation={navigation} /> */}
      <View style={styles.activityTypeSelector}>
        <Pressable
          style={[
            styles.activityTypeSelectorButton,
            selectedActivityType === '제휴'
              ? styles.activityTypeSelectorButtonPressed
              : styles.activityTypeSelectorButton,
          ]}
          onPress={() => setSelectedActivityType('제휴')}
        >
          <Text
            style={
              selectedActivityType === '제휴'
                ? styles.activityTypeSelectorButtonTextPressed
                : styles.activityTypeSelectorButtonText
            }
          >
            제휴
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.activityTypeSelectorButton,
            selectedActivityType === '행사'
              ? styles.activityTypeSelectorButtonPressed
              : styles.activityTypeSelectorButton,
          ]}
          onPress={() => setSelectedActivityType('행사')}
        >
          <Text
            style={
              selectedActivityType === '행사'
                ? styles.activityTypeSelectorButtonTextPressed
                : styles.activityTypeSelectorButtonText
            }
          >
            행사
          </Text>
        </Pressable>
      </View>
      {selectedActivityType === '제휴' && (
        <FlatList
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          data={affiliatePosts}
          renderItem={({ item }) => (
            <AffiliationColumnListItem
              handleLike={handleLike}
              item={item}
              navigation={navigation}
              councilType={selectedTab}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      {selectedActivityType === '행사' && (
        <FlatList
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          data={eventPosts}
          renderItem={({ item }) => (
            <AffiliationColumnListItem
              handleLike={handleLike}
              item={item}
              navigation={navigation}
              councilType={selectedTab}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
};

export default AffiliationMainScreen;
