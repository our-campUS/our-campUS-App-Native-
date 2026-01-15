import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../style/colors';
import typography from '../../style/typography';
import HostByTab from '../../components/Affiliation/HostByTab';
import AffiliationCarousel from '../../components/Affiliation/AffiliationCarousel';
import AffiliationColumnList from '../../components/Affiliation/AffiliationColumnList';
import WriteEventButton from '../../../assets/WriteEvent.svg';
import CancelButton from '../../../assets/cancelButton.svg';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import EventSelectIcon from '../../../assets/mdi_event.svg';
import AffiliateSelectIcon from '../../../assets/supportIcon.svg';
import CouncilDefaultImage from '../../../assets/councilDefaultImage.png';
import useAuthStore from '../../store/authStore';
import AffiliationColumnListItem from '../../components/Affiliation/AffiliationColumnListItem';
import AffiliationCouncilColumnListItem from '../../components/Affiliation/AffiliationCouncilColumnListItem';
import {
  AFFILIATION_COLUMN_LIST_DATA_AFFILIATION,
  AFFILIATION_COLUMN_LIST_DATA_EVENT,
} from '../../constants/DummyData';
import {
  getCouncilAffiliatePosts,
  deleteCouncilPost,
  getCouncilEventPosts,
  getAvailableEvents,
} from '../../api/councilAffiliate';
import EditPostBottomSheet from '../../components/Council/EditPostBottomSheet';
import useFormDraftStore from '../../store/formDraftStore';

const CouncilAffiliateScreen = ({ navigation }) => {
  const [selectedActivityType, setSelectedActivityType] = useState('제휴');
  const { user, accessToken } = useAuthStore();
  // console.log(user);
  // console.log('accessToken', accessToken);
  const [isWriteEventButtonPressed, setIsWriteEventButtonPressed] =
    useState(false);
  const [councilAffiliatePosts, setCouncilAffiliatePosts] = useState([]);
  const [councilEventPosts, setCouncilEventPosts] = useState([]);
  const [isThreeDotIconPressed, setIsThreeDotIconPressed] = useState(false);
  const [threeDotIconItem, setThreeDotIconItem] = useState(null);
  const [availabeEvents, setAvailabeEvents] = useState([]);
  const { formDraft, resetFormDraft } = useFormDraftStore();
  const [loadedActivityTypes, setLoadedActivityTypes] = useState(new Set()); // 이미 로드된 활동 타입 추적
  const [isLoading, setIsLoading] = useState(false);

  // 특정 활동 타입의 데이터를 fetch하는 함수
  const fetchActivityTypeData = useCallback(
    async (activityType) => {
      if (!accessToken) return;

      setIsLoading(true);
      try {
        if (activityType === '제휴') {
          const response = await getCouncilAffiliatePosts(accessToken);
          setCouncilAffiliatePosts(response.data.data.content);
        } else if (activityType === '행사') {
          const responseEvent = await getCouncilEventPosts(accessToken);
          setCouncilEventPosts(responseEvent.data.data.content);
        }
        // 로드된 활동 타입 추가
        setLoadedActivityTypes((prev) => new Set([...prev, activityType]));
      } catch (error) {
        console.error(
          `fetchActivityTypeData error for ${activityType}:`,
          error
        );
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken]
  );

  // Available Events를 fetch하는 함수 (초기 로드 시에만)
  const fetchAvailableEvents = useCallback(async () => {
    if (!accessToken) return;
    try {
      const responseAvailableEvents = await getAvailableEvents(accessToken);
      setAvailabeEvents(responseAvailableEvents.data.data.content);
    } catch (error) {
      console.error('fetchAvailableEvents error:', error);
    }
  }, [accessToken]);

  // 초기 로드 시 기본 활동 타입('제휴')과 available events만 fetch
  useEffect(() => {
    if (accessToken) {
      fetchActivityTypeData('제휴');
      fetchAvailableEvents();
    }
  }, [accessToken, fetchActivityTypeData, fetchAvailableEvents]);

  // 활동 타입 변경 시 해당 타입의 데이터 fetch (이미 로드된 경우는 재사용)
  useEffect(() => {
    if (!accessToken) return;

    // 이미 로드된 활동 타입이면 fetch하지 않음 (데이터는 이미 state에 있음)
    if (!loadedActivityTypes.has(selectedActivityType)) {
      fetchActivityTypeData(selectedActivityType);
    }
  }, [
    selectedActivityType,
    accessToken,
    loadedActivityTypes,
    fetchActivityTypeData,
  ]);

  // 화면이 포커스될 때마다 현재 활동 타입의 데이터를 새로고침
  useFocusEffect(
    useCallback(() => {
      if (!accessToken) return;

      // 현재 활동 타입의 데이터를 다시 fetch하여 최신 상태 유지
      fetchActivityTypeData(selectedActivityType);
      fetchAvailableEvents();
    }, [
      selectedActivityType,
      accessToken,
      fetchActivityTypeData,
      fetchAvailableEvents,
    ])
  );

  const handleThreeDotIconPress = (item) => {
    setThreeDotIconItem(item);
    setIsThreeDotIconPressed(true);
    console.log('item', item);
  };
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={{ width: '100%' }}>
        {/* <HostByTab
          university={'중앙대학교'}
          college={'사회과학대'}
          department={'정치국제'}
          isOrange={true}
        /> */}
        <View style={styles.councilIdentityContainer}>
          <View style={styles.councilIdentityImageWrapper}>
            <Image
              source={
                user?.councilProfileImageUrl
                  ? { uri: user.councilProfileImageUrl }
                  : CouncilDefaultImage
              }
              style={styles.councilIdentityImage}
            />
          </View>
          <View style={styles.textInfoContainer}>
            {user.councilNickname ? (
              <Text style={styles.councilIdentityNickname}>
                {user.councilNickname}
              </Text>
            ) : (
              <Text style={styles.councilIdentityNoNickname}>
                미지정(등록필요)
              </Text>
            )}
            <Text style={styles.councilIdentityText}>{user.councilName}</Text>
          </View>
        </View>
      </View>
      {availabeEvents.length > 0 && (
        <AffiliationCarousel
          isOrange={true}
          data={availabeEvents}
          navigation={navigation}
        />
      )}

      <View style={styles.activityTypeSelector}>
        <Pressable
          style={[
            styles.activityTypeSelectorButton,
            selectedActivityType === '제휴'
              ? styles.activityTypeSelectorOrangeButtonPressed
              : styles.activityTypeSelectorButton,
          ]}
          onPress={() => setSelectedActivityType('제휴')}
        >
          <Text
            style={
              selectedActivityType === '제휴'
                ? styles.activityTypeSelectorOrangeButtonTextPressed
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
              ? styles.activityTypeSelectorOrangeButtonPressed
              : styles.activityTypeSelectorButton,
          ]}
          onPress={() => setSelectedActivityType('행사')}
        >
          <Text
            style={
              selectedActivityType === '행사'
                ? styles.activityTypeSelectorOrangeButtonTextPressed
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
          // data={AFFILIATION_COLUMN_LIST_DATA_AFFILIATION}
          data={councilAffiliatePosts}
          keyExtractor={(item) => `affiliate-${item.postId}`}
          renderItem={({ item }) => (
            <AffiliationCouncilColumnListItem
              item={item}
              navigation={navigation}
              handleThreeDotIconPress={(item) => handleThreeDotIconPress(item)}
            />
          )}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}
      {selectedActivityType === '행사' && (
        <FlatList
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          // data={AFFILIATION_COLUMN_LIST_DATA_EVENT}
          data={councilEventPosts}
          keyExtractor={(item) => `event-${item.postId}`}
          renderItem={({ item }) => (
            <AffiliationCouncilColumnListItem
              item={item}
              navigation={navigation}
              handleThreeDotIconPress={(item) => handleThreeDotIconPress(item)}
            />
          )}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}

      {/* <AffiliationColumnList navigation={navigation} isOrange={true} /> */}
      {isWriteEventButtonPressed && (
        <View style={styles.writeEventTypeSelector}>
          <Pressable
            style={styles.writeEventTypeSelectorItem}
            onPress={() => {
              setIsWriteEventButtonPressed(false);
              resetFormDraft();
              navigation.navigate('WriteAffiliatePostScreen', {
                type: 'affiliate',
              });
            }}
          >
            <View style={{ marginTop: -3 }}>
              <AffiliateSelectIcon width={25} height={25} />
            </View>
            <Text style={styles.writeEventTypeSelectorItemText}>
              제휴 글쓰기
            </Text>
          </Pressable>
          <Pressable
            style={styles.writeEventTypeSelectorItem}
            onPress={() => {
              setIsWriteEventButtonPressed(false);
              resetFormDraft();
              navigation.navigate('WriteEventPostScreen', {
                type: 'event',
              });
            }}
          >
            <View style={{ marginTop: -3 }}>
              <EventSelectIcon
                width={25}
                height={25}
                color={colors.orange[500]}
              />
            </View>

            <Text style={styles.writeEventTypeSelectorItemText}>
              행사 글쓰기
            </Text>
          </Pressable>
        </View>
      )}
      <Pressable
        style={styles.writeEventButton}
        onPress={() => setIsWriteEventButtonPressed(!isWriteEventButtonPressed)}
      >
        {isWriteEventButtonPressed ? <CancelButton /> : <WriteEventButton />}
      </Pressable>
      {isWriteEventButtonPressed && (
        <View style={styles.writeEventTypeSelectorBackground} />
      )}
      {isThreeDotIconPressed && (
        <EditPostBottomSheet
          isVisible={isThreeDotIconPressed}
          onClose={() => setIsThreeDotIconPressed(false)}
          onSelectEdit={() => {
            if (threeDotIconItem?.category === 'EVENT') {
              navigation.navigate('EventEditScreen', {
                type: 'event',
                item: threeDotIconItem,
              });
            } else {
              navigation.navigate('AffiliateEditScreen', {
                type: 'affiliate',
                item: threeDotIconItem,
              });
            }
            console.log('onSelectEdit');
            setIsThreeDotIconPressed(false);
          }}
          onSelectDelete={async () => {
            console.log('onSelectDelete');
            setIsThreeDotIconPressed(false);
            const response = await deleteCouncilPost(
              threeDotIconItem.postId,
              accessToken
            );
            console.log('response at onSelectDelete', response);
            // 현재 선택된 활동 타입의 데이터를 다시 불러오기
            await fetchActivityTypeData(selectedActivityType);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
    alignItems: 'center',
    position: 'relative',
  },
  writeEventButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  writeEventTypeSelector: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 1000,
    backgroundColor: colors.common.white,
    flexDirection: 'column',
    borderRadius: 12,
    padding: 10,
    gap: 9,
  },
  writeEventTypeSelectorBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  writeEventTypeSelectorItem: {
    width: 163,
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 2,
  },
  writeEventTypeSelectorItemText: {
    ...typography.body3Regular,
    color: colors.gray[850],
  },
  councilIdentityContainer: {
    // backgroundColor: 'green',
    width: '100%',
    padding: 20,
    flexDirection: 'row',
    ...(Platform.OS === 'ios' && {
      marginTop: 58,
    }),
  },
  textInfoContainer: {
    gap: 10,
    flexDirection: 'column',
  },
  councilIdentityNickname: {
    ...typography.heading4,
    color: colors.gray[850],
  },
  councilIdentityNoNickname: {
    ...typography.heading4,
    color: colors.gray[500],
  },
  councilIdentityText: {
    ...typography.body4Bold,
    color: colors.gray[600],
  },
  councilIdentityImageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 100,
    overflow: 'hidden',
    marginRight: 16,
  },
  councilIdentityImage: {
    width: '100%',
    height: '100%',
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

export default CouncilAffiliateScreen;
