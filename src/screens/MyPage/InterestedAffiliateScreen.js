import { View, Text, StyleSheet, Pressable } from 'react-native';
import LabelTitle from '../../components/LabelTitle';
import colors from '../../style/colors';
import typography from '../../style/typography';
import AffiliationColumnListItem from '../../components/Affiliation/AffiliationColumnListItem';
import EmptyResult from '../../components/common/EmptyResult';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Toast from '../../components/common/Toast';
import useToast from '../../hooks/useToast';
import {
  AFFILIATION_COLUMN_LIST_DATA_AFFILIATION,
  AFFILIATION_COLUMN_LIST_DATA_EVENT,
} from '../../constants/DummyData';
import {
  getUserInterestedAffiliatePosts,
  getUserInterestedEventPosts,
} from '../../api/user';
import { toggleStudentAffiliateLike } from '../../api/studentAffiliate';

const InterestedAffiliateScreen = ({ navigation }) => {
  const { toastVisible, toastMessage, showToast, hideToast } = useToast();
  const [selectedActivityType, setSelectedActivityType] = useState('제휴');
  const [isOrange, setIsOrange] = useState(false);
  const [interestedAffiliatePosts, setInterestedAffiliatePosts] = useState([]);
  const [interestedEventPosts, setInterestedEventPosts] = useState([]);

  // 데이터를 다시 fetch하는 함수
  const fetchInterestedPosts = useCallback(() => {
    getUserInterestedAffiliatePosts().then((data) => {
      setInterestedAffiliatePosts((data || []).map((item) => ({ ...item, liked: true })));
    });
    getUserInterestedEventPosts().then((data) => {
      setInterestedEventPosts((data || []).map((item) => ({ ...item, liked: true })));
    });
  }, []);

  const handleAffiliateLike = useCallback(async (postId) => {
    await toggleStudentAffiliateLike(postId);
    setInterestedAffiliatePosts((prev) =>
      prev.filter((item) => (item.id || item.postId) !== postId)
    );
    showToast('관심 목록에서 삭제되었어요');
  }, [showToast]);

  const handleEventLike = useCallback(async (postId) => {
    await toggleStudentAffiliateLike(postId);
    setInterestedEventPosts((prev) =>
      prev.filter((item) => (item.id || item.postId) !== postId)
    );
    showToast('관심 목록에서 삭제되었어요');
  }, [showToast]);

  // 초기 로드
  useEffect(() => {
    fetchInterestedPosts();
  }, [fetchInterestedPosts]);

  // 화면이 포커스될 때마다 데이터를 다시 fetch (좋아요 상태 변경 반영)
  useFocusEffect(
    useCallback(() => {
      fetchInterestedPosts();
    }, [fetchInterestedPosts])
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="관심 게시글"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      {/* <AffiliationColumnList navigation={navigation} /> */}
      <View style={styles.activityTypeSelector}>
        <Pressable
          style={[
            styles.activityTypeSelectorButton,
            selectedActivityType === '제휴'
              ? isOrange
                ? styles.activityTypeSelectorOrangeButtonPressed
                : styles.activityTypeSelectorButtonPressed
              : styles.activityTypeSelectorButton,
          ]}
          onPress={() => setSelectedActivityType('제휴')}
        >
          <Text
            style={
              selectedActivityType === '제휴'
                ? isOrange
                  ? styles.activityTypeSelectorOrangeButtonTextPressed
                  : styles.activityTypeSelectorButtonTextPressed
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
              ? isOrange
                ? styles.activityTypeSelectorOrangeButtonPressed
                : styles.activityTypeSelectorButtonPressed
              : styles.activityTypeSelectorButton,
          ]}
          onPress={() => setSelectedActivityType('행사')}
        >
          <Text
            style={
              selectedActivityType === '행사'
                ? isOrange
                  ? styles.activityTypeSelectorOrangeButtonTextPressed
                  : styles.activityTypeSelectorButtonTextPressed
                : styles.activityTypeSelectorButtonText
            }
          >
            행사
          </Text>
        </Pressable>
      </View>
      <View style={{ width: '100%', height: 18 }} />
      {selectedActivityType === '제휴' && (
        <FlatList
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          data={interestedAffiliatePosts}
          renderItem={({ item }) => (
            <AffiliationColumnListItem
              item={item}
              navigation={navigation}
              isLikedScreen={true}
              handleLike={handleAffiliateLike}
            />
          )}
          keyExtractor={(item) => String(item?.id || item?.postId)}
          ListEmptyComponent={
            <EmptyResult message="관심 게시글이 없습니다." paddingTop={100} />
          }
        />
      )}
      {selectedActivityType === '행사' && (
        <FlatList
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          data={interestedEventPosts}
          renderItem={({ item }) => (
            <AffiliationColumnListItem
              item={item}
              navigation={navigation}
              isLikedScreen={true}
              handleLike={handleEventLike}
            />
          )}
          keyExtractor={(item) => String(item?.id || item?.postId)}
          ListEmptyComponent={
            <EmptyResult message="관심 게시글이 없습니다." paddingTop={100} />
          }
        />
      )}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={hideToast}
        hasNavBar={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 20,
    flex: 1,
    backgroundColor: colors.common.white,
    // backgroundColor: 'green',
  },
  activityTypeSelector: {
    paddingHorizontal: 20,
    marginTop: 18,
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

export default InterestedAffiliateScreen;
