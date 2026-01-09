import { View, Text, StyleSheet, Image, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import colors from '../../../style/colors';
import LabelTitle from '../../../components/LabelTitle';
import typography from '../../../style/typography';
import CouncilDefaultImage from '../../../../assets/councilDefaultImage.png';
import EditIcon from '../../../../assets/EditImage.svg';
import CouncilEditIcon from '../../../../assets/CouncilEditIcon.svg';
import ArrowRightIcon from '../../../../assets/ArrowRightIcon.svg';
import { useState } from 'react';
import Button from '../../../components/Button';
import CustomToast from '../../../components/CustomToast';
import useToastStore from '../../../store/toastStore';

const CouncilProfileScreen = ({ navigation, route }) => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const showToast = useToastStore((state) => state.showToast);
  const {
    showToast: shouldShowToast,
    toastMessage,
    toastType,
  } = route.params || {};

  useFocusEffect(
    useCallback(() => {
      if (shouldShowToast && toastMessage) {
        // 화면 포커스 후 약간의 딜레이를 주고 토스트 표시
        setTimeout(() => {
          showToast(toastMessage, toastType || 'success');
        }, 300);
      }
    }, [shouldShowToast, toastMessage, toastType, showToast])
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <LabelTitle
          title="내 계정"
          navigation={navigation}
          useBackButton={true}
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.profileImageWrapper}>
          <Image source={CouncilDefaultImage} style={styles.profileImage} />
          <Pressable
            style={styles.editIcon}
            onPress={() => navigation.navigate('CouncilEditProfileScreen')}
          >
            <CouncilEditIcon
              width={24}
              height={24}
              color={colors.orange[500]}
            />
          </Pressable>
        </View>
        <Text style={styles.nickname}>일타</Text>
        <View style={styles.profileInfoWrapper}>
          <Text style={{ ...typography.body4Bold, color: colors.gray[400] }}>
            회원 정보
          </Text>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoItemTitle}>인증자 성함</Text>
            <View style={styles.profileInfoItemRightWrapper}>
              <Text style={styles.profileInfoItemRightText}>최서연</Text>
            </View>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoItemTitle}>아이디</Text>
            <View style={styles.profileInfoItemRightWrapper}>
              <Text style={styles.profileInfoItemRightText}>qwer1234</Text>
            </View>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoItemTitle}>이메일</Text>
            <View style={styles.profileInfoItemRightWrapper}>
              <Text style={styles.profileInfoItemRightText}>
                qwer1234@cau.ac.kr
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.logoutButtonWrapper}>
          <Text style={{ ...typography.body4Bold, color: colors.gray[400] }}>
            계정 보안
          </Text>
          <Pressable
            style={styles.profileInfoItem}
            onPress={() => navigation.navigate('CouncilChangePasswordEmail')}
          >
            <Text style={styles.profileInfoItemTitle}>비밀번호 변경</Text>
            <ArrowRightIcon width={10} height={10} />
          </Pressable>
          <Pressable
            style={styles.profileInfoItem}
            onPress={() => setIsLogoutModalVisible(true)}
          >
            <Text style={styles.profileInfoItemTitle}>로그아웃</Text>
            <ArrowRightIcon width={10} height={10} />
          </Pressable>
          <Pressable
            style={styles.profileInfoItem}
            onPress={() => navigation.navigate('CouncilCancelMembershipScreen')}
          >
            <Text style={styles.profileInfoItemTitle}>탈퇴하기</Text>
            <ArrowRightIcon width={10} height={10} />
          </Pressable>
        </View>
      </SafeAreaView>
      <Modal
        visible={isLogoutModalVisible}
        onRequestClose={() => setIsLogoutModalVisible(false)}
        transparent={true}
      >
        <View style={styles.logoutModalOverlay}>
          <View style={styles.logoutModalContent}>
            <Text style={styles.logoutModalTitle}>로그아웃</Text>
            <Text style={styles.logoutConfirmMessage}>
              정말로 로그아웃하시겠어요?
            </Text>
            <Button
              isOrange={true}
              title="로그아웃"
              onPress={() => setIsLogoutModalVisible(false)}
              style={{
                width: '100%',
                height: 50,
                paddingHorizontal: 10,
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.orange[400],
                borderRadius: 10,
                marginTop: 16,
              }}
            />
            <View style={styles.logoutModalCancelTextWrapper}>
              <Text
                style={styles.logoutModalCancelText}
                onPress={() => setIsLogoutModalVisible(false)}
              >
                뒤로 가기
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <CustomToast />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  profileImageWrapper: {
    alignSelf: 'center',
    marginTop: 56,
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    alignSelf: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  nickname: {
    ...typography.heading4,
    color: colors.gray[850],
    textAlign: 'center',
    marginTop: 18,
  },
  profileInfoWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 14,
    marginTop: 36,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  profileInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfoItemTitle: {
    ...typography.body2Regular,
    color: colors.gray[850],
  },
  profileInfoItemRightWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileInfoItemRightText: {
    ...typography.body3Regular,
    color: colors.gray[400],
  },
  logoutButtonWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    gap: 14,
  },
  logoutModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  logoutModalContent: {
    width: '100%',
    marginHorizontal: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: colors.common.white,
    borderRadius: 18,
    alignItems: 'center',
  },

  logoutModalTitle: {
    ...typography.heading4,
    color: colors.gray[850],
  },
  logoutConfirmMessage: {
    ...typography.body3Regular,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: 8,
  },
  logoutModalCancelTextWrapper: {
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  logoutModalCancelText: {
    ...typography.heading6,
    color: colors.gray[700],
  },
});

export default CouncilProfileScreen;
