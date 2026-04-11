import { View, Text, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import LabelTitle from '../../../components/LabelTitle';
import CheckerboardPlaceholder from '../../../components/common/CheckerboardPlaceholder';
import UploadButton from '../../../components/common/UploadButton';
import { useState } from 'react';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Button from '../../../components/Button';
import { changeCouncilEmail } from '../../../api/councilMyPage';
import {
  getCommonImagePresignedUrl,
  convertToPng,
  uploadImageToPresignedUrl,
} from '../../../api/uploadImage';

const CouncilSendProof = ({ navigation, route }) => {
  const email = route.params?.email;
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePicker = () => {
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

  const handleFinalSubmit = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const convertedImage = await convertToPng(selectedImage);
      const { uploadUrl, imageUrl } = await getCommonImagePresignedUrl(
        convertedImage
      );
      await uploadImageToPresignedUrl(uploadUrl, convertedImage);

      const isSuccess = await changeCouncilEmail(email, imageUrl);

      if (isSuccess) {
        navigation.navigate('CouncilProfileScreen', {
          showToast: true,
          toastType: 'black',
          toastMessage: '변경사항 확인 후 자동으로 변경됩니다',
        });
      } else {
        Alert.alert('실패', '이메일 변경 요청에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="학생회 인증하기"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
        navigation={navigation}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.subtitleText}>
          학생회 구성원을 인증하는 단계에요
        </Text>
        <Text style={styles.titleText}>
          당선 여부를 확인할 수 있는 자료를{'\n'}업로드 해주세요.
        </Text>
        <Pressable
          style={styles.imageUploadWrapper}
          onPress={handleImagePicker}
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.uploadedImage}
            />
          ) : (
            <>
              <CheckerboardPlaceholder
                width={'100%'}
                height={150}
                borderRadius={12}
              />
              <View style={styles.uploadFileButton}>
                <UploadButton variant="orange" />
              </View>
            </>
          )}
        </Pressable>
        <Text style={styles.captionText}>
          학과,학번,실명이 포함된 공식자료를 첨부해 주세요.{'\n'}예시:
          실물/모바일 학생증
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          isOrange={true}
          disabled={!selectedImage || isLoading}
          title={isLoading ? '처리 중...' : '다음'}
          onPress={handleFinalSubmit}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  subtitleText: {
    ...typography.body3Regular,
    color: colors.gray[800],
  },
  titleText: {
    ...typography.heading4,
    color: colors.gray[850],
    marginTop: 4,
  },
  captionText: {
    ...typography.caption1Regular,
    color: colors.gray[600],
    marginTop: 8,
  },
  imageUploadWrapper: {
    width: '100%',
    marginTop: 32,
    position: 'relative',
  },
  uploadFileButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -60 }, { translateY: -20 }],
    zIndex: 1,
  },
  uploadedImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  button: {
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.orange[400],
    borderRadius: 10,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 30,
  },
});

export default CouncilSendProof;
