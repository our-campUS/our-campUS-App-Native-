import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../style/colors';
import LabelTitle from '../../components/LabelTitle';
import typography from '../../style/typography';
import defaultProfileImage from '../../../assets/defaultProfileImage.png';
import EditIcon from '../../../assets/EditImage.svg';
import ArrowRightIcon from '../../../assets/ArrowRightIcon.svg';
import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import useAuthStore from '../../store/authStore';
import { getUserInfo, editProfileImage } from '../../api/user';
import { requestLogout } from '../../api/user';

import {
  getCommonImagePresignedUrl,
  convertToPng,
  uploadImageToPresignedUrl,
} from '../../api/uploadImage';

const MyPageProfileEditScreen = ({ navigation }) => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [iosProfileImage, setIosProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchLatestInfo = async () => {
      await getUserInfo();
    };
    fetchLatestInfo();
  }, []);

  useEffect(() => {
    console.log('user', user);
  }, [user]);

  useEffect(() => {
    if (user?.profileImage && user.profileImage.includes('http://')) {
      setIosProfileImage(user.profileImage.replace('http', 'https'));
    } else if (user?.profileImage && user.profileImage.includes('https://')) {
      setIosProfileImage(user.profileImage);
    }
  }, [user?.profileImage]);

  // selectedImage가 변경될 때 이미지 업로드 처리
  useEffect(() => {
    const uploadProfileImage = async () => {
      if (!selectedImage) return;

      try {
        console.log('selectedImage detected, starting upload process');
        let convertedImage = await convertToPng(selectedImage);
        console.log('convertedImage', convertedImage);
        let { uploadUrl, imageUrl } = await getCommonImagePresignedUrl(
          convertedImage
        );
        console.log('imageUrl', imageUrl);
        console.log('uploadUrl', uploadUrl);
        await uploadImageToPresignedUrl(uploadUrl, convertedImage);
        console.log('Image uploaded to presigned URL');
        const result = await editProfileImage(imageUrl);
        console.log('editProfileImage result', result);
        if (result) {
          await getUserInfo();
          console.log('Profile image updated successfully');
          setSelectedImage(null); // 업로드 완료 후 초기화
        } else {
          Alert.alert('프로필 이미지 변경 실패', '다시 시도해주세요');
          setSelectedImage(null); // 실패 시에도 초기화
        }
      } catch (error) {
        console.error('Profile image upload error:', error);
        Alert.alert('프로필 이미지 변경 실패', '다시 시도해주세요');
        setSelectedImage(null); // 에러 시에도 초기화
      }
    };

    uploadProfileImage();
  }, [selectedImage]);

  const handleLogout = async () => {
    try {
      setIsLogoutModalVisible(false);

      await requestLogout();
    } catch (error) {
      console.log('로그아웃 처리 중 에러 발생');
    } finally {
      logout();
    }
  };

  const handleEditProfileImage = () => {
    console.log('handleEditProfileImage');
    Alert.alert(
      '이미지 선택',
      '이미지를 선택하는 방법을 선택해주세요',
      [
        {
          text: '갤러리에서 선택',
          onPress: () => {
            launchImageLibrary(
              {
                mediaType: 'photo',
                quality: 0.8,
                maxWidth: 1000,
                maxHeight: 1000,
              },
              (response) => {
                if (response.didCancel) {
                  return;
                }
                if (response.errorMessage) {
                  Alert.alert('오류', response.errorMessage);
                  return;
                }
                if (response.assets && response.assets[0]) {
                  setSelectedImage(response.assets[0]);
                }
              }
            );
          },
        },
        {
          text: '카메라로 촬영',
          onPress: () => {
            launchCamera(
              {
                mediaType: 'photo',
                saveToPhotos: true,
                quality: 0.8,
                maxWidth: 1000,
                maxHeight: 1000,
                includeBase64: false,
                cameraType: 'back',
              },
              (response) => {
                if (response.didCancel) {
                  return;
                }
                if (response.errorMessage) {
                  Alert.alert('오류', response.errorMessage);
                  return;
                }
                if (response.assets && response.assets[0]) {
                  setSelectedImage(response.assets[0]);
                }
              }
            );
          },
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <SafeAreaView
        style={styles.container}
        edges={['left', 'right', 'bottom']}
      >
        <LabelTitle
          title="프로필 설정"
          navigation={navigation}
          useBackButton={true}
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.profileImageWrapper}>
          <Image
            source={
              user?.profileImage
                ? { uri: iosProfileImage }
                : defaultProfileImage
            }
            style={styles.profileImage}
            // resizeMode="contain"
          />
          <Pressable
            style={styles.editIcon}
            onPress={() => handleEditProfileImage()}
          >
            <EditIcon width={24} height={24} />
          </Pressable>
        </View>
        <Text style={styles.nickname}>{user?.name || '사용자'}</Text>
        <View style={styles.profileInfoWrapper}>
          <Pressable
            style={styles.profileInfoItem}
            onPress={() => navigation.navigate('EditNicknameScreen')}
          >
            <Text style={styles.profileInfoItemTitle}>닉네임</Text>
            <ArrowRightIcon width={10} height={10} color="#ADB3B8" />
          </Pressable>
          <Pressable
            style={styles.profileInfoItem}
            onPress={() => navigation.navigate('ChangeScholarInfoScreen')}
          >
            <Text style={styles.profileInfoItemTitle}>학적정보</Text>
            <ArrowRightIcon width={10} height={10} color="#ADB3B8" />
          </Pressable>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoItemTitle}>학적정보</Text>
            <View style={styles.profileInfoItemRightWrapper}>
              <Text style={styles.profileInfoItemRightText}>미인증</Text>
              <ArrowRightIcon width={10} height={10} color="#ADB3B8" />
            </View>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoItemTitle}>연결된 계정</Text>
            <Text style={styles.profileInfoItemRightText}>카카오</Text>
          </View>
        </View>
        <View style={styles.logoutButtonWrapper}>
          <Pressable
            style={styles.profileInfoItem}
            onPress={() => setIsLogoutModalVisible(true)}
          >
            <Text style={styles.profileInfoItemTitle}>로그아웃</Text>
            <ArrowRightIcon width={10} height={10} color="#ADB3B8" />
          </Pressable>
          <Pressable
            style={styles.profileInfoItem}
            onPress={() => navigation.navigate('CancelMembershipScreen')}
          >
            <Text style={styles.profileInfoItemTitle}>회원 탈퇴</Text>
            <ArrowRightIcon width={10} height={10} color="#ADB3B8" />
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
              title="로그아웃"
              onPress={handleLogout}
              style={{
                width: '100%',
                height: 50,
                paddingHorizontal: 10,
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.blue[400],
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
    marginTop: 30,
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

export default MyPageProfileEditScreen;
