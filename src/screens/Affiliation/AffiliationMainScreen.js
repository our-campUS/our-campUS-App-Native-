import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from '../../components/common/Toast';
import EmptyResult from '../../components/common/EmptyResult';
import useToast from '../../hooks/useToast';
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: colors.gray['000'],
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
  searchIconButton: {
    marginLeft: 'auto',
  },
  searchBarContainer: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.gray['000'],
  },
  searchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  searchChipText: {
    ...typography.caption2Regular,
    color: colors.gray[800],
  },
  searchInput: {
    flex: 1,
    ...typography.body4Regular,
    color: colors.gray[850],
    paddingVertical: 0,
  },
});

const AffiliationMainScreen = ({ navigation }) => {
  const [selectedActivityType, setSelectedActivityType] = useState('제휴');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
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
  const { toastVisible, toastMessage, showToast, hideToast } = useToast();

  // 특정 탭의 데이터를 fetch하는 함수
  const fetchTabData = async (tab) => {
    if (!accessToken) return;

    setIsLoading(true);
    try {
      if (tab === 'school') {
        const [fetched, fetchedEvents, fetchedUpcoming] = await Promise.all([
          getStudentSchoolAffiliateList(accessToken),
          getStudentSchoolEventList(accessToken),
          getStudentSchoolUpcomingEventList(accessToken),
        ]);
        setSchoolAffiliatePosts(fetched);
        setSchoolEventPosts(fetchedEvents);
        setUpcomingSchoolEvents(fetchedUpcoming);
        setAffiliatePosts(fetched);
        setEventPosts(fetchedEvents);
        setUpcomingEvents(fetchedUpcoming);
      } else if (tab === 'major') {
        const [fetched, fetchedEvents, fetchedUpcoming] = await Promise.all([
          getStudentMajorAffiliateList(accessToken),
          getStudentMajorEventList(accessToken),
          getStudentMajorUpcomingEventList(accessToken),
        ]);
        setMajorAffiliatePosts(fetched);
        setMajorEventPosts(fetchedEvents);
        setUpcomingMajorEvents(fetchedUpcoming);
        setAffiliatePosts(fetched);
        setEventPosts(fetchedEvents);
        setUpcomingEvents(fetchedUpcoming);
      } else if (tab === 'college') {
        const [fetched, fetchedEvents, fetchedUpcoming] = await Promise.all([
          getStudentCollegeAffiliateList(accessToken),
          getStudentCollegeEventList(accessToken),
          getStudentCollegeUpcomingEventList(accessToken),
        ]);
        setCollegeAffiliatePosts(fetched);
        setCollegeEventPosts(fetchedEvents);
        setUpcomingCollegeEvents(fetchedUpcoming);
        setAffiliatePosts(fetched);
        setEventPosts(fetchedEvents);
        setUpcomingEvents(fetchedUpcoming);
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
      const currentPost =
        affiliatePosts.find((p) => p.id === postId || p.postId === postId) ||
        eventPosts.find((p) => p.id === postId || p.postId === postId);
      const wasLiked = currentPost?.liked;

      const response = await toggleStudentAffiliateLike(accessToken, postId);
      console.log('handleLike response', response);

      showToast(
        wasLiked ? '관심 목록에서 삭제되었어요.' : '관심 목록에 추가되었어요!'
      );

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
      {isSearchMode ? (
        <View style={styles.searchBarContainer}>
          <View style={styles.searchChip}>
            <Text style={styles.searchChipText}>{selectedActivityType}</Text>
            <Pressable
              onPress={() => {
                setIsSearchMode(false);
                setSearchText('');
              }}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Ionicons name="close" size={13} color={colors.gray[800]} />
            </Pressable>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder={`어떤 ${selectedActivityType}를 찾으시나요?`}
            placeholderTextColor={colors.gray[400]}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
            returnKeyType="search"
          />
          <Ionicons name="search" size={16} color={colors.gray[400]} />
        </View>
      ) : (
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
          <Pressable
            style={styles.searchIconButton}
            onPress={() => setIsSearchMode(true)}
          >
            <Ionicons name="search" size={16} color={colors.gray[400]} />
          </Pressable>
        </View>
      )}
      {selectedActivityType === '제휴' && (
        <FlatList
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          data={
            isSearchMode && searchText
              ? affiliatePosts.filter(
                  (post) =>
                    post.title?.includes(searchText) ||
                    post.placeName?.includes(searchText)
                )
              : affiliatePosts
          }
          renderItem={({ item }) => (
            <AffiliationColumnListItem
              handleLike={handleLike}
              item={item}
              navigation={navigation}
              councilType={selectedTab}
            />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<EmptyResult paddingTop={100} />}
        />
      )}
      {selectedActivityType === '행사' && (
        <FlatList
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          data={
            isSearchMode && searchText
              ? eventPosts.filter(
                  (post) =>
                    post.title?.includes(searchText) ||
                    post.placeName?.includes(searchText)
                )
              : eventPosts
          }
          renderItem={({ item }) => (
            <AffiliationColumnListItem
              handleLike={handleLike}
              item={item}
              navigation={navigation}
              councilType={selectedTab}
            />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<EmptyResult paddingTop={100} />}
        />
      )}
      <Toast message={toastMessage} visible={toastVisible} onHide={hideToast} />
    </SafeAreaView>
  );
};

export default AffiliationMainScreen;
