import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import defaultProfileImage from '../../../../assets/defaultProfileImage.png';
import EditIcon from '../../../../assets/editIcon.svg';
import InterestedAffiliationIcon from '../../../../assets/Vector3.svg';
import InterestedPlaceIcon from '../../../../assets/Vector2.svg';
import WrittenReviewIcon from '../../../../assets/ReviewIcon.svg';
import ArrowRightIcon from '../../../../assets/ArrowRightIcon.svg';
import CouncilDefaultImage from '../../../../assets/councilDefaultImage.png';
import useAuthStore from '../../../store/authStore';

const CouncilMyPageDefaultScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  return (
    <SafeAreaView style={styles.container}>
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
      <View style={styles.customerServiceWrapper}>
        <Text style={{ ...typography.body4Bold, color: colors.gray[400] }}>
          계정관리
        </Text>
        <View style={styles.customerServiceItemWrapper}>
          <Pressable
            style={styles.customerServiceItem}
            onPress={() => navigation.navigate('CouncilProfileScreen')}
          >
            <Text style={styles.customerServiceItemText}>내 계정</Text>
            <ArrowRightIcon width={10} height={10} />
          </Pressable>
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
          <Pressable
            style={styles.customerServiceItem}
            onPress={() => navigation.navigate('AnnouncementScreen')}
          >
            <Text style={styles.customerServiceItemText}>공지사항</Text>
            <ArrowRightIcon width={10} height={10} />
          </Pressable>
          <Pressable
            style={styles.customerServiceItem}
            onPress={() => navigation.navigate('InqueryMainScreen')}
          >
            <Text style={styles.customerServiceItemText}>1:1 문의게시판</Text>
            <ArrowRightIcon width={10} height={10} />
          </Pressable>
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
  customerServiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerServiceItemText: {
    ...typography.body2Regular,
    color: colors.gray[850],
  },
  councilIdentityContainer: {
    width: '100%',
    paddingHorizontal: 41,
    paddingVertical: 32,
    flexDirection: 'row',
  },
  textInfoContainer: {
    flexDirection: 'column',
    gap: 10,
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

export default CouncilMyPageDefaultScreen;
