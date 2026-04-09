import {
  View,
  Text,
  StyleSheet,
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
import AffiliationColumnListItem from '../../components/Affiliation/AffiliationColumnListItem';
import LoadingFooter from '../../components/common/LoadingFooter';
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

const AFFILIATE_FETCH_MAP = {
  school: getStudentSchoolAffiliateList,
  major: getStudentMajorAffiliateList,
  college: getStudentCollegeAffiliateList,
};

const EVENT_FETCH_MAP = {
  school: getStudentSchoolEventList,
  major: getStudentMajorEventList,
  college: getStudentCollegeEventList,
};

const UPCOMING_FETCH_MAP = {
  school: getStudentSchoolUpcomingEventList,
  major: getStudentMajorUpcomingEventList,
  college: getStudentCollegeUpcomingEventList,
};

const AffiliationMainScreen = ({ navigation }) => {
  const [selectedActivityType, setSelectedActivityType] = useState('제휴');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { accessToken } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState('school');
  const { toastVisible, toastMessage, showToast, hideToast } = useToast();

  // 제휴 페이지네이션
  const [affiliatePosts, setAffiliatePosts] = useState([]);
  const [affiliatePage, setAffiliatePage] = useState(1);
  const [affiliateHasMore, setAffiliateHasMore] = useState(true);
  const [affiliateLoading, setAffiliateLoading] = useState(false);
  const [affiliateRefreshing, setAffiliateRefreshing] = useState(false);

  // 행사 페이지네이션
  const [eventPosts, setEventPosts] = useState([]);
  const [eventPage, setEventPage] = useState(1);
  const [eventHasMore, setEventHasMore] = useState(true);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventRefreshing, setEventRefreshing] = useState(false);

  // 다가오는 행사 (캐러셀용, 페이지네이션 불필요)
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const fetchAffiliatePosts = useCallback(
    async (pageNum = 1, isRefresh = false) => {
      if (!accessToken) return;
      if (isRefresh) {
        setAffiliateRefreshing(true);
      } else {
        setAffiliateLoading(true);
      }

      const fetchFn = AFFILIATE_FETCH_MAP[selectedTab];
      const result = await fetchFn(accessToken, pageNum);

      if (result) {
        const newItems = result.content || [];
        if (isRefresh || pageNum === 1) {
          setAffiliatePosts(newItems);
        } else {
          setAffiliatePosts((prev) => [...prev, ...newItems]);
        }
        setAffiliatePage(pageNum);
        setAffiliateHasMore(pageNum < (result.totalPages || 1));
      }

      setAffiliateLoading(false);
      setAffiliateRefreshing(false);
    },
    [accessToken, selectedTab]
  );

  const fetchEventPosts = useCallback(
    async (pageNum = 1, isRefresh = false) => {
      if (!accessToken) return;
      if (isRefresh) {
        setEventRefreshing(true);
      } else {
        setEventLoading(true);
      }

      const fetchFn = EVENT_FETCH_MAP[selectedTab];
      const result = await fetchFn(accessToken, pageNum);

      if (result) {
        const newItems = result.content || [];
        if (isRefresh || pageNum === 1) {
          setEventPosts(newItems);
        } else {
          setEventPosts((prev) => [...prev, ...newItems]);
        }
        setEventPage(pageNum);
        setEventHasMore(pageNum < (result.totalPages || 1));
      }

      setEventLoading(false);
      setEventRefreshing(false);
    },
    [accessToken, selectedTab]
  );

  const fetchUpcomingEvents = useCallback(async () => {
    if (!accessToken) return;
    const fetchFn = UPCOMING_FETCH_MAP[selectedTab];
    const result = await fetchFn(accessToken);
    setUpcomingEvents(result || []);
  }, [accessToken, selectedTab]);

  // 초기 로드 + 탭 변경 시 리셋
  useEffect(() => {
    if (!accessToken) return;
    setAffiliatePosts([]);
    setEventPosts([]);
    setAffiliatePage(1);
    setEventPage(1);
    setAffiliateHasMore(true);
    setEventHasMore(true);
    fetchAffiliatePosts(1, true);
    fetchEventPosts(1, true);
    fetchUpcomingEvents();
  }, [
    selectedTab,
    accessToken,
    fetchAffiliatePosts,
    fetchEventPosts,
    fetchUpcomingEvents,
  ]);

  // 화면 포커스 시 새로고침 (좋아요 변경 반영)
  useFocusEffect(
    useCallback(() => {
      if (!accessToken) return;
      fetchAffiliatePosts(1, true);
      fetchEventPosts(1, true);
      fetchUpcomingEvents();
    }, [accessToken, fetchAffiliatePosts, fetchEventPosts, fetchUpcomingEvents])
  );

  const handleSelectTab = (tab) => {
    setSelectedTab(tab);
  };

  const handleAffiliateLoadMore = useCallback(() => {
    if (!affiliateLoading && affiliateHasMore) {
      fetchAffiliatePosts(affiliatePage + 1);
    }
  }, [affiliateLoading, affiliateHasMore, affiliatePage, fetchAffiliatePosts]);

  const handleEventLoadMore = useCallback(() => {
    if (!eventLoading && eventHasMore) {
      fetchEventPosts(eventPage + 1);
    }
  }, [eventLoading, eventHasMore, eventPage, fetchEventPosts]);

  const handleLike = async (postId) => {
    try {
      const currentPost =
        affiliatePosts.find((p) => p.id === postId || p.postId === postId) ||
        eventPosts.find((p) => p.id === postId || p.postId === postId);
      const wasLiked = currentPost?.liked;

      await toggleStudentAffiliateLike(accessToken, postId);

      showToast(
        wasLiked ? '관심 목록에서 삭제되었어요.' : '관심 목록에 추가되었어요!'
      );

      const updateLikeStatus = (setPosts) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId || post.postId === postId
              ? { ...post, liked: !post.liked }
              : post
          )
        );
      };

      updateLikeStatus(setAffiliatePosts);
      updateLikeStatus(setEventPosts);
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
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            !affiliateLoading ? <EmptyResult paddingTop={100} /> : null
          }
          ListFooterComponent={<LoadingFooter loading={affiliateLoading} />}
          onEndReached={handleAffiliateLoadMore}
          onEndReachedThreshold={0.4}
          onRefresh={() => fetchAffiliatePosts(1, true)}
          refreshing={affiliateRefreshing}
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
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            !eventLoading ? <EmptyResult paddingTop={100} /> : null
          }
          ListFooterComponent={<LoadingFooter loading={eventLoading} />}
          onEndReached={handleEventLoadMore}
          onEndReachedThreshold={0.4}
          onRefresh={() => fetchEventPosts(1, true)}
          refreshing={eventRefreshing}
        />
      )}
      <Toast message={toastMessage} visible={toastVisible} onHide={hideToast} />
    </SafeAreaView>
  );
};

export default AffiliationMainScreen;
