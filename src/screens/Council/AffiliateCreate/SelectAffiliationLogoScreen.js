import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../../../components/LabelTitle';
import { useState, useEffect, useMemo } from 'react';
import Button from '../../../components/Button';
import ChooseLogoBottomSheet from '../../../components/Council/ChooseLogoBottomSheet';
import useImagePicker from '../../../hooks/useImagePicker';
import {
  convertToPng,
  getCouncilImagePresignedUrl,
  uploadImageToPresignedUrl,
} from '../../../api/uploadImage';
import {
  createCouncilPost,
  EditCouncilPost,
} from '../../../api/councilAffiliate';
import Toast from '../../../components/common/Toast';
import useToast from '../../../hooks/useToast';

const LOGO_CATEGORIES = [
  {
    id: 1,
    name: '직접 등록',
    image: require('../../../../assets/addLogo.png'),
    type: 'CUSTOM',
  },
  {
    id: 2,
    name: '음식점',
    image: require('../../../../assets/foodLogo.png'),
    type: 'FOOD',
  },
  {
    id: 3,
    name: '카페',
    image: require('../../../../assets/cafeLogo.png'),
    type: 'CAFE',
  },
  {
    id: 4,
    name: '술집',
    image: require('../../../../assets/alcoholLogo.png'),
    type: 'BAR',
  },
  {
    id: 5,
    name: '편의시설',
    image: require('../../../../assets/convenientLogo.png'),
    type: 'CONVENIENCE',
  },
  {
    id: 6,
    name: '운동시설',
    image: require('../../../../assets/gymLogo.png'),
    type: 'SPORTS',
  },
  {
    id: 7,
    name: '교육시설',
    image: require('../../../../assets/studyLogo.png'),
    type: 'EDUCATION',
  },
  {
    id: 8,
    name: '병원',
    image: require('../../../../assets/hospitalLogo.png'),
    type: 'HOSPITAL',
  },
];

const SelectAffiliationLogoScreen = ({ navigation, route }) => {
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedLogoType, setSelectedLogoType] = useState(null);
  const isButtonDisabled = !selectedLogo;
  const [isChooseLogoBottomSheetVisible, setIsChooseLogoBottomSheetVisible] =
    useState(false);
  console.log(route.params);
  const [dataFromPreviousScreen, setDataFromPreviousScreen] = useState(null);
  const { toastVisible, toastMessage, showToast, hideToast } = useToast();

  // route.params가 변경될 때마다 즉시 로고를 찾기
  const initialLogo = useMemo(() => {
    if (route.params?.thumbnailIcon) {
      return LOGO_CATEGORIES.find(
        (logo) => logo.type === route.params.thumbnailIcon
      );
    }
    return null;
  }, [route.params?.thumbnailIcon]);

  useEffect(() => {
    if (route.params) {
      setDataFromPreviousScreen(route.params);
      console.log('dataFromPreviousScreen', route.params);
    }
  }, [route.params]);

  useEffect(() => {
    if (initialLogo) {
      setSelectedLogoType(initialLogo.type);
      setSelectedLogo(initialLogo);
    }
  }, [initialLogo]);

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
          image
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
    console.log('handleSubmit');
    console.log('dataFromPreviousScreen', dataFromPreviousScreen);
    const finalImages = await handleImagesBeforeSubmit();
    const finalData = {
      category:
        dataFromPreviousScreen.type === 'affiliate' ? 'PARTNERSHIP' : 'EVENT',
      place: dataFromPreviousScreen.placeInfo,
      title: dataFromPreviousScreen.title,
      content: dataFromPreviousScreen.content || '내용없음',
      startDateTime: dataFromPreviousScreen.startDate.slice(0, 10) + 'T00:00',
      endDateTime: dataFromPreviousScreen.endDate.slice(0, 10) + 'T00:00',
      thumbnailIcon: selectedLogo.type,
      imageUrls: finalImages,
      thumbnailImageUrl: finalImages[0],
    };
    console.log('finalData', finalData);
    const response = await createCouncilPost(finalData);
    console.log('response at handleSubmit', response);
    if (response.data.code === 201) {
      showToast('게시글이 등록되었어요!');
      setTimeout(() => {
        navigation?.reset({
          index: 0,
          routes: [{ name: 'CouncilAffiliateScreen' }],
        });
      }, 1000);
    } else {
      Alert.alert('제휴 글 등록에 실패했습니다.', response.data.message);
    }
  };

  const handleEditSubmit = async () => {
    console.log('handleEditSubmit');
    console.log('dataFromPreviousScreen', dataFromPreviousScreen);
    let finalImages = null;
    if (dataFromPreviousScreen?.isImageUnChanged) {
      finalImages = dataFromPreviousScreen?.images;
    } else {
      finalImages = await handleImagesBeforeSubmit();
    }
    const finalData = {
      category:
        dataFromPreviousScreen.type === 'affiliate' ? 'PARTNERSHIP' : 'EVENT',
      place: dataFromPreviousScreen.placeInfo,
      title: dataFromPreviousScreen.title,
      content: dataFromPreviousScreen.content || '내용없음',
      startDateTime: dataFromPreviousScreen.startDate.slice(0, 10) + 'T00:00',
      endDateTime: dataFromPreviousScreen.endDate.slice(0, 10) + 'T00:00',
      thumbnailIcon: selectedLogo.type,
      imageUrls: finalImages,
      thumbnailImageUrl: finalImages[0],
    };
    console.log('finalDataEdit', finalData);
    const response = await EditCouncilPost(
      finalData,
      dataFromPreviousScreen?.postId
    );
    console.log('response at handleEditSubmit', response);
    if (response.data.code === 200) {
      showToast('게시글이 수정되었어요!');
      setTimeout(() => {
        navigation?.reset({
          index: 0,
          routes: [{ name: 'CouncilAffiliateScreen' }],
        });
      }, 1000);
    } else {
      Alert.alert('제휴 글 수정에 실패했습니다.', response.data.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title={route.params?.isEdit ? '제휴 글 수정하기' : '제휴 글쓰기'}
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
            <Text
              style={styles.previewTitle}
              numberOfLines={2}
              ellipsizeMode="tail"
              textBreakStrategy="balanced"
            >
              {route.params.title}
            </Text>
          </View>
        </View>
        <Text
          style={styles.applyLogoText}
          onPress={() => setIsChooseLogoBottomSheetVisible(true)}
        >
          로고 이미지 등록하기
        </Text>
        <Button
          title={route.params?.isEdit ? '수정하기' : '게시하기'}
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
          onPress={() =>
            route.params?.isEdit ? handleEditSubmit() : handleSubmit()
          }
        />
      </View>
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={hideToast}
        duration={1000}
        hasNavBar={false}
      />
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
    // marginTop: 20,
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
    maxWidth: 198,
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 4,
  },
  previewPlaceName: {
    ...typography.body3Bold,
    color: colors.common.black,
  },
  previewTitle: {
    maxWidth: '100%',
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
