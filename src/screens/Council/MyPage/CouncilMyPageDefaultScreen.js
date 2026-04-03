import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import defaultProfileImage from '../../../../assets/defaultProfileImage.png';
import EditIcon from '../../../../assets/editIcon.svg';
import InterestedAffiliationIcon from '../../../../assets/Vector3.svg';
import InterestedPlaceIcon from '../../../../assets/Vector2.svg';
import WrittenReviewIcon from '../../../../assets/ReviewIcon.svg';
import ListItem from '../../../components/common/ListItem';
import CouncilDefaultImage from '../../../../assets/councilDefaultImage.png';
import MY_PAGE_MENU_LINKS from '../../../constants/myPageMenuLinks';
import useAuthStore from '../../../store/authStore';
import { getCouncilProfile } from '../../../api/councilMyPage';
import { useEffect } from 'react';

const CouncilMyPageDefaultScreen = ({ navigation }) => {
  const { user } = useAuthStore();

  useEffect(() => {
    getCouncilProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
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
          {user?.councilNickname ? (
            <Text style={styles.councilIdentityNickname}>
              {user.councilNickname}
            </Text>
          ) : (
            <Text style={styles.noNickname}>미지정(등록필요)</Text>
          )}
          <Text style={styles.councilIdentityText}>{user.councilName}</Text>
        </View>
      </View>
      <View style={styles.customerServiceWrapper}>
        <Text style={{ ...typography.body4Bold, color: colors.gray[400] }}>
          계정관리
        </Text>
        <View style={styles.customerServiceItemWrapper}>
          <ListItem
            title="내 계정"
            onPress={() => navigation.navigate('CouncilProfileScreen')}
          />
        </View>
        <Text
          style={{
            ...typography.body4Bold,
            color: colors.gray[400],
            marginTop: 24,
          }}
        >
          고객 센터
        </Text>
        <View style={styles.customerServiceItemWrapper}>
          <ListItem
            title="공지사항"
            onPress={() => navigation.navigate('AnnouncementScreen')}
          />
          <ListItem
            title="1:1 문의게시판"
            onPress={() => navigation.navigate('InqueryMainScreen')}
          />
          <ListItem
            title="서비스 이용안내"
            onPress={() => {
              if (MY_PAGE_MENU_LINKS.SERVICE_GUIDE) {
                navigation.navigate('WebViewScreen', {
                  uri: MY_PAGE_MENU_LINKS.SERVICE_GUIDE,
                  title: '서비스 이용안내',
                });
              }
            }}
          />
          <ListItem
            title="개인정보 처리방침"
            onPress={() => {
              if (MY_PAGE_MENU_LINKS.PRIVACY_POLICY) {
                navigation.navigate('WebViewScreen', {
                  uri: MY_PAGE_MENU_LINKS.PRIVACY_POLICY,
                  title: '개인정보 처리방침',
                });
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  nickname: {
    ...typography.heading4,
    color: colors.gray[850],
    marginLeft: 16,
  },
  councilName: {
    ...typography.body4Regular,
    color: colors.gray[600],
  },
  editIconWrapper: {
    justifySelf: 'flex-end',
    marginLeft: 5,
    marginTop: 6,
  },
  interestedWrapper: {
    marginTop: 26,
    height: '84px',
    borderRadius: 14,
    backgroundColor: colors.gray['000'],
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  interestedItemWrapper: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 15,
  },
  interestedItemText: {
    ...typography.body4Regular,
    color: colors.gray[800],
  },
  customerServiceWrapper: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  customerServiceItemWrapper: {
    gap: 14,
    marginTop: 18,
  },
  councilIdentityContainer: {
    width: '100%',
    // paddingHorizontal: 41,
    // paddingVertical: 32,
    paddingHorizontal: 41,
    paddingVertical: 32,
    flexDirection: 'row',
    // backgroundColor: 'green',
    ...(Platform.OS === 'ios' && {
      marginTop: 58,
    }),
  },
  textInfoContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  councilIdentityNickname: {
    ...typography.heading4,
    color: colors.gray[850],
  },
  noNickname: {
    ...typography.heading4,
    color: colors.gray[400],
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

export default CouncilMyPageDefaultScreen;
