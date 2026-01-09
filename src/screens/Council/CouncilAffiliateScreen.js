import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../style/colors';
import typography from '../../style/typography';
import HostByTab from '../../components/Affiliation/HostByTab';
import AffiliationCarousel from '../../components/Affiliation/AffiliationCarousel';
import AffiliationColumnList from '../../components/Affiliation/AffiliationColumnList';
import WriteEventButton from '../../../assets/WriteEvent.svg';
import CancelButton from '../../../assets/cancelButton.svg';
import { useState } from 'react';
import EventSelectIcon from '../../../assets/mdi_event.svg';
import AffiliateSelectIcon from '../../../assets/supportIcon.svg';
import CouncilDefaultImage from '../../../assets/councilDefaultImage.png';
import useAuthStore from '../../store/authStore';

const CouncilAffiliateScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  console.log(user);
  const [isWriteEventButtonPressed, setIsWriteEventButtonPressed] =
    useState(false);
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
      <AffiliationColumnList navigation={navigation} isOrange={true} />
      {isWriteEventButtonPressed && (
        <View style={styles.writeEventTypeSelector}>
          <Pressable
            style={styles.writeEventTypeSelectorItem}
            onPress={() => {
              setIsWriteEventButtonPressed(false);
              navigation.navigate('WriteAffiliatePostScreen', {
                type: 'event',
              });
            }}
          >
            <EventSelectIcon
              width={25}
              height={25}
              color={colors.orange[500]}
            />
            <Text style={styles.writeEventTypeSelectorItemText}>
              행사 글쓰기
            </Text>
          </Pressable>
          <Pressable
            style={styles.writeEventTypeSelectorItem}
            onPress={() => {
              setIsWriteEventButtonPressed(false);
              navigation.navigate('WriteAffiliatePostScreen', {
                type: 'affiliate',
              });
            }}
          >
            <AffiliateSelectIcon width={25} height={25} />
            <Text style={styles.writeEventTypeSelectorItemText}>
              제휴 글쓰기
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
    width: '100%',
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
});

export default CouncilAffiliateScreen;
