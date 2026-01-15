import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import colors from '../../style/colors';
import typography from '../../style/typography';
import defaultProfileImage from '../../../assets/defaultProfileImage.png';
import EditIcon from '../../../assets/editIcon.svg';
import InterestedAffiliationIcon from '../../../assets/Vector3.svg';
import InterestedPlaceIcon from '../../../assets/Vector2.svg';
import WrittenReviewIcon from '../../../assets/ReviewIcon.svg';
import ArrowRightIcon from '../../../assets/ArrowRightIcon.svg';

import useAuthStore from '../../store/authStore';
import { getUserInfo } from '../../api/user';

const MyPageDefaultScreen = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchLatestInfo = async () => {
      await getUserInfo();
    };
    fetchLatestInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.mainProfileWrapper}>
        <View style={styles.mainProfileInfoWrapper}>
          <View style={styles.mainProfileImageWrapper}>
            <Image
              source={defaultProfileImage}
              style={styles.mainProfileImage}
            />
          </View>
          <Text style={styles.nickname}>{user?.name || '사용자'}</Text>
          <Pressable
            onPress={() => navigation.navigate('MyPageProfileEditScreen')}
          >
            <View style={styles.editIconWrapper} justifySelf="flex-end">
              <EditIcon width={18} height={18} />
            </View>
          </Pressable>
        </View>
        <View style={styles.interestedWrapper}>
          <Pressable
            onPress={() => navigation.navigate('InterestedAffiliateScreen')}
            style={styles.interestedItemWrapper}
          >
            <InterestedAffiliationIcon
              width={20}
              height={20}
              color={colors.blue[250]}
            />
            <Text style={styles.interestedItemText}>관심 게시글</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('InterestedPlaceScreen')}
            style={styles.interestedItemWrapper}
          >
            <InterestedPlaceIcon
              width={20}
              height={20}
              color={colors.blue[250]}
            />
            <Text style={styles.interestedItemText}>관심 장소</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('WrittenReviewScreen')}
            style={styles.interestedItemWrapper}
          >
            <WrittenReviewIcon width={20} height={20} />
            <Text style={styles.interestedItemText}>작성한 리뷰</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.customerServiceWrapper}>
        <Text style={{ ...typography.body4Bold, color: colors.gray[400] }}>
          고객센터
        </Text>
        <View style={styles.customerServiceItemWrapper}>
          <Pressable
            style={styles.customerServiceItem}
            onPress={() => navigation.navigate('AnnouncementScreen')}
          >
            <Text style={styles.customerServiceItemText}>공지사항</Text>
            <ArrowRightIcon width={10} height={10} color="#ADB3B8" />
          </Pressable>
          <Pressable
            style={styles.customerServiceItem}
            onPress={() => navigation.navigate('InqueryMainScreen')}
          >
            <Text style={styles.customerServiceItemText}>1:1 문의게시판</Text>
            <ArrowRightIcon width={10} height={10} color="#ADB3B8" />
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
  mainProfileWrapper: {
    ...(Platform.OS === 'ios' && {
      marginTop: 58,
    }),
    width: '100%',
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 26,
  },
  mainProfileInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 21,
  },
  mainProfileImageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[200],
  },
  mainProfileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  nickname: {
    ...typography.heading4,
    color: colors.gray[850],
    marginLeft: 16,
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
});

export default MyPageDefaultScreen;
