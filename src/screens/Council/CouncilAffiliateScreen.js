import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../style/colors';
import typography from '../../style/typography';
import HostByTab from '../../components/Affiliation/HostByTab';
import AffiliationCarousel from '../../components/Affiliation/AffiliationCarousel';
import AffiliationColumnList from '../../components/Affiliation/AffiliationColumnList';
import WriteEventButton from '../../../assets/WriteEvent.svg';
import CancelButton from '../../../assets/cancelButton.svg';
import { useState, useEffect } from 'react';
import EventSelectIcon from '../../../assets/mdi_event.svg';
import AffiliateSelectIcon from '../../../assets/supportIcon.svg';
import CouncilDefaultImage from '../../../assets/councilDefaultImage.png';
import useAuthStore from '../../store/authStore';
import AffiliationColumnListItem from '../../components/Affiliation/AffiliationColumnListItem';
import {
  AFFILIATION_COLUMN_LIST_DATA_AFFILIATION,
  AFFILIATION_COLUMN_LIST_DATA_EVENT,
} from '../../constants/DummyData';
import { getCouncilAffiliatePosts } from '../../api/councilAffiliate';
import EditPostBottomSheet from '../../components/Council/EditPostBottomSheet';

const CouncilAffiliateScreen = ({ navigation }) => {
  const [selectedActivityType, setSelectedActivityType] = useState('제휴');
  const { user, accessToken } = useAuthStore();
  // console.log(user);
  // console.log('accessToken', accessToken);
  const [isWriteEventButtonPressed, setIsWriteEventButtonPressed] =
    useState(false);
  const [councilAffiliatePosts, setCouncilAffiliatePosts] = useState([]);
  const [isThreeDotIconPressed, setIsThreeDotIconPressed] = useState(false);
  const [threeDotIconItem, setThreeDotIconItem] = useState(null);
  useEffect(() => {
    const fetchCouncilAffiliatePosts = async () => {
      const response = await getCouncilAffiliatePosts(accessToken);
      // console.log('response at fetchCouncilAffiliatePosts', response);
      setCouncilAffiliatePosts(response.data.data.content);
    };
    fetchCouncilAffiliatePosts();
  }, []);

  const handleThreeDotIconPress = (item) => {
    setThreeDotIconItem(item);
    setIsThreeDotIconPressed(true);
    console.log('item', item);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginTop: 9.5, width: '100%' }}>
        {/* <HostByTab
          university={'중앙대학교'}
          college={'사회과학대'}
          department={'정치국제'}
          isOrange={true}
        /> */}
        <View style={styles.councilIdentityContainer}>
          <View style={styles.councilIdentityImageWrapper}>
            <Image
              source={CouncilDefaultImage}
              style={styles.councilIdentityImage}
            />
          </View>
          <View style={styles.textInfoContainer}>
            <Text style={styles.councilIdentityNickname}>일타</Text>
            <Text style={styles.councilIdentityText}>{user.councilName}</Text>
          </View>
        </View>
      </View>
      <AffiliationCarousel isOrange={true} />

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
          renderItem={({ item }) => (
            <AffiliationColumnListItem
              item={item}
              navigation={navigation}
              handleThreeDotIconPress={(item) => handleThreeDotIconPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      {selectedActivityType === '행사' && (
        <FlatList
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          data={AFFILIATION_COLUMN_LIST_DATA_EVENT}
          renderItem={({ item }) => (
            <AffiliationColumnListItem
              item={item}
              navigation={navigation}
              handleThreeDotIconPress={(item) => handleThreeDotIconPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* <AffiliationColumnList navigation={navigation} isOrange={true} /> */}
      {isWriteEventButtonPressed && (
        <View style={styles.writeEventTypeSelector}>
          <Pressable
            style={styles.writeEventTypeSelectorItem}
            onPress={() => {
              setIsWriteEventButtonPressed(false);
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
            console.log('onSelectEdit');
            navigation.navigate('AffiliateEditScreen', {
              type: 'affiliate',
              item: threeDotIconItem,
            });
            setIsThreeDotIconPressed(false);
          }}
          onSelectDelete={() => {
            console.log('onSelectDelete');
            setIsThreeDotIconPressed(false);
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
    width: '100%',
    padding: 20,
    flexDirection: 'row',
  },
  textInfoContainer: {
    gap: 10,
    flexDirection: 'column',
  },
  councilIdentityNickname: {
    ...typography.heading4,
    color: colors.gray[850],
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
