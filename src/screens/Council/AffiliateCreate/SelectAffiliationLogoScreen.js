import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../../../components/LabelTitle';
import { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import ChooseLogoBottomSheet from '../../../components/Council/ChooseLogoBottomSheet';
import useImagePicker from '../../../hooks/useImagePicker';
import {
  convertToPng,
  getCouncilImagePresignedUrl,
  uploadImageToPresignedUrl,
} from '../../../api/uploadImage';
import useAuthStore from '../../../store/authStore';
import { createCouncilPost } from '../../../api/councilAffiliate';
import Toast from 'react-native-toast-message';

const SelectAffiliationLogoScreen = ({ navigation, route }) => {
  const accessToken = useAuthStore((state) => state?.accessToken);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedLogoType, setSelectedLogoType] = useState(null);
  const isButtonDisabled = !selectedLogo;
  const [isChooseLogoBottomSheetVisible, setIsChooseLogoBottomSheetVisible] =
    useState(false);
  console.log(route.params);
  const [dataFromPreviousScreen, setDataFromPreviousScreen] = useState(null);
  useEffect(() => {
    if (route.params) {
      setDataFromPreviousScreen(route.params);
      console.log('dataFromPreviousScreen', dataFromPreviousScreen);
    }
  }, [route.params]);

  const { pickImage } = useImagePicker({
    onSelectImages: (images) => {
      if (images && images.length > 0) {
        setSelectedLogo(images[0]);
        setSelectedLogoType('CUSTOM');
      }
    },
    useGallery: true,
    useCamera: false,
    selectionLimit: 1,
  });

  const handleSelectLogo = (logo) => {
    if (logo.type === 'CUSTOM') {
      pickImage();
    } else {
      setSelectedLogo(logo);
      setSelectedLogoType(logo.type);
    }
  };

  const handleImagesBeforeSubmit = async () => {
    console.log('handleImagesBeforeSubmit');
    const images = route.params?.images || [];
    if (images.length === 0) {
      return [];
    }
    console.log('images', images);
    const pngConvertedImages = await Promise.all(
      images.map(async (image) => {
        const convertedResult = convertToPng(image);
        console.log('convertedResult', convertedResult);
        return convertedResult;
      })
    );
    console.log('pngConvertedImages', pngConvertedImages);
    const presignedUrls = await Promise.all(
      pngConvertedImages.map(async (image) => {
        const { uploadUrl, imageUrl } = await getCouncilImagePresignedUrl(
          image,
          accessToken
        );
        return { uploadUrl, imageUrl, image: image };
      })
    );
    console.log('presignedUrls', presignedUrls);
    await Promise.all(
      presignedUrls.map(async (presignedUrl) => {
        await uploadImageToPresignedUrl(
          presignedUrl.uploadUrl,
          presignedUrl.image
        );
      })
    );
    if (
      presignedUrls.some((presignedUrl) => presignedUrl.isSuccess === false)
    ) {
      Alert.alert('이미지 업로드에 실패했습니다.', '다시 시도해주세요.');
      return;
    }
    return presignedUrls.map((presignedUrl) => presignedUrl.imageUrl);
  };

  const handleSubmit = async () => {
    console.log('accessToken', accessToken);
    console.log('handleSubmit');
    console.log('dataFromPreviousScreen', dataFromPreviousScreen);
    const finalImages = await handleImagesBeforeSubmit();
    let finalData = {
      category:
        dataFromPreviousScreen.type === 'affiliate' ? 'PARTNERSHIP' : 'EVENT',
      place: dataFromPreviousScreen.placeInfo,
      title: dataFromPreviousScreen.title,
      content: dataFromPreviousScreen.content || '내용없음',
      startDateTime: dataFromPreviousScreen.startDate.slice(0, 10) + 'T00:00',
      endDateTime: dataFromPreviousScreen.endDate.slice(0, 10) + 'T00:00',
      thumbnailIcon: selectedLogo.type,
      imageUrls: finalImages,
    };
    console.log('finalData', finalData);
    let response = await createCouncilPost(finalData, accessToken);
    console.log('response at handleSubmit', response);
    if (response.data.code === 201) {
      Toast.show({
        type: 'success',
        text1: '제휴 글쓰기 성공',
        text2: '제휴 글이 성공적으로 등록되었습니다.',
        position: 'top',
        topOffset: 100,
        visibilityTime: 1000,
        autoHide: true,
      });
      setTimeout(() => {
        navigation?.reset({
          index: 0,
          routes: [{ name: 'CouncilAffiliateScreen' }],
        });
      }, 1000);
    } else {
      Alert.alert(result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LabelTitle
        title="제휴 글쓰기"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <Text style={styles.title}>제휴 업체 로고 등록하기</Text>
        <Text style={styles.description}>
          메인화면에 보여질 매장 로고를 추가해주세요.
        </Text>
        <View style={styles.previewContainer}>
          <View style={styles.previewImageContainer}>
            <Image
              source={
                selectedLogo
                  ? selectedLogoType === 'CUSTOM'
                    ? { uri: selectedLogo.uri }
                    : selectedLogo.image
                  : require('../../../../assets/LogoDefaultImage.png')
              }
              resizeMode="cover"
              style={styles.previewImage}
            />
          </View>
          <View style={styles.previewInfoContainer}>
            <Text style={styles.previewPlaceName}>
              {route.params.placeInfo?.placeName}
            </Text>
            <Text style={styles.previewTitle}>{route.params.title}</Text>
          </View>
        </View>
        <Text
          style={styles.applyLogoText}
          onPress={() => setIsChooseLogoBottomSheetVisible(true)}
        >
          로고 이미지 등록하기
        </Text>
        <Button
          title="게시하기"
          isOrange={true}
          disabled={isButtonDisabled}
          style={{
            width: '100%',
            height: 50,
            paddingHorizontal: 10,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.orange[400],
            borderRadius: 10,
            marginTop: 'auto',
          }}
          onPress={() => handleSubmit()}
        />
      </View>
      <Toast />
      <ChooseLogoBottomSheet
        isVisible={isChooseLogoBottomSheetVisible}
        onClose={() => setIsChooseLogoBottomSheetVisible(false)}
        onSelectCategory={(logo) => handleSelectLogo(logo)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  content: {
    marginTop: 20,
    flex: 1,
    padding: 20,
  },
  title: {
    ...typography.heading4,
    color: colors.gray[850],
  },
  description: {
    ...typography.body3Regular,
    color: colors.gray[800],
  },
  previewContainer: {
    width: '100%',
    marginTop: 24,
    padding: 20,
    flexDirection: 'row',
    gap: 21,
    borderRadius: 14,
    boxShadow: '0 0 6px 0 rgba(225, 228, 230, 0.70)',
  },
  previewImageContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    overflow: 'hidden',
  },
  previewImage: {
    width: 76,
    height: 76,
  },
  previewInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 4,
  },
  previewPlaceName: {
    ...typography.body3Bold,
    color: colors.common.black,
  },
  previewTitle: {
    ...typography.body3Regular,
    color: colors.common.black,
  },
  applyLogoText: {
    ...typography.body4Bold,
    color: colors.orange[500],
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});

export default SelectAffiliationLogoScreen;
