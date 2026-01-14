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

  const fetchAllPosts = async () => {
    const schoolAffiliatePosts = await getStudentSchoolAffiliateList(
      accessToken
    );
    setSchoolAffiliatePosts(schoolAffiliatePosts);
    const schoolEventPosts = await getStudentSchoolEventList(accessToken);
    setSchoolEventPosts(schoolEventPosts);
    const majorAffiliatePosts = await getStudentMajorAffiliateList(accessToken);
    setMajorAffiliatePosts(majorAffiliatePosts);
    const majorEventPosts = await getStudentMajorEventList(accessToken);
    setMajorEventPosts(majorEventPosts);
    const collegeAffiliatePosts = await getStudentCollegeAffiliateList(
      accessToken
    );
    setCollegeAffiliatePosts(collegeAffiliatePosts);
    const collegeEventPosts = await getStudentCollegeEventList(accessToken);
    setCollegeEventPosts(collegeEventPosts);
  };

  useEffect(() => {
    fetchAllPosts();
    setAffiliatePosts(schoolAffiliatePosts);
    setEventPosts(schoolEventPosts);
  }, [accessToken]);

  const handleSelectTab = (tab) => {
    console.log('tab', tab);
    setSelectedTab(tab);
  };

  useEffect(() => {
    if (selectedTab === 'school') {
      setAffiliatePosts(schoolAffiliatePosts);
      setEventPosts(schoolEventPosts);
    } else if (selectedTab === 'major') {
      setAffiliatePosts(majorAffiliatePosts);
      setEventPosts(majorEventPosts);
    } else if (selectedTab === 'college') {
      setAffiliatePosts(collegeAffiliatePosts);
      setEventPosts(collegeEventPosts);
    }
  }, [selectedTab]);

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
      <AffiliationCarousel />
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
