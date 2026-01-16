import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../../components/LabelTitle';
import theme from '../../style';
import typography from '../../style/typography';
import shadow from '../../style/shadow';
import colors from '../../style/colors';
import RatingIcon from '../../../assets/icons/rating.svg';
import useImagePicker from '../../hooks/useImagePicker';
import { DUMMY_PLACE } from '../../constants/DummyPlaceData';
import {
  convertToPng,
  getCommonImagePresignedUrl,
  uploadImageToPresignedUrl,
} from '../../api/uploadImage';
import { createReview, createNoPartnerReview } from '../../api/review';
import useToastStore from '../../store/toastStore';
import CustomToast from '../../components/CustomToast';

const StarItem = ({ filled, onPress, size = 28 }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <RatingIcon
      name="star"
      width={size}
      height={size}
      color={filled ? theme.colors.primary2 : colors.gray[250]}
      style={{ marginHorizontal: 4 }}
    />
  </TouchableOpacity>
);

const WriteReviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const storeName = route.params?.store?.name || '스타벅스 상도역점';
  const [isNoPartner, setIsNoPartner] = useState(false);

  useEffect(() => {
    setIsNoPartner(route.params?.isNoPartner || false);
  }, [route.params]);

  useEffect(() => {
    console.log('isNoPartner', isNoPartner);
  }, [isNoPartner]);

  useEffect(() => {
    console.log('route.params', route.params);
  }, [route.params]);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [selectedPhotoIndices, setSelectedPhotoIndices] = useState(new Set());
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  // 기존 배열에 새로운 이미지들을 추가하는 핸들러
  const handleSelectImages = (newImages) => {
    setPhotos((prevPhotos) => [...prevPhotos, ...newImages]);
  };

  const handleImagesBeforeSubmit = async () => {
    console.log('handleImagesBeforeSubmit');
    // const images = route.params?.images || [];
    const images = selectedPhotos || [];
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
        const { uploadUrl, imageUrl } = await getCommonImagePresignedUrl(image);
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

  // 사진 선택/해제 핸들러
  const handleTogglePhotoSelection = (index) => {
    setSelectedPhotoIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // 선택된 사진의 순서 번호 가져오기
  const getSelectedOrder = (index) => {
    const sortedIndices = Array.from(selectedPhotoIndices).sort(
      (a, b) => a - b
    );
    const order = sortedIndices.indexOf(index);
    return order !== -1 ? order + 1 : null;
  };

  const { pickImage } = useImagePicker({
    useCamera: true,
    useGallery: false,
    onSelectImages: handleSelectImages,
  });

  const isValid = reviewText.length >= 10 && rating > 0;

  useEffect(() => {
    const selectedPhotos = photos.filter((_, index) =>
      selectedPhotoIndices.has(index)
    );
    setSelectedPhotos(selectedPhotos);
  }, [photos, selectedPhotoIndices]);

  const handleSubmitNoPartnerReview = async () => {
    console.log('handleSubmitNoPartnerReview');
    const finalImages = await handleImagesBeforeSubmit();
    let place = {
      placeName: route.params?.store?.name,
      placeKey: route.params?.store?.placeKey,
      address: route.params?.store?.address,
      category: route.params?.store?.category,
      link: route.params?.store?.link,
      coordinate: route.params?.store?.coordinate,
      imgUrls: route.params?.store?.imgUrls,
    };

    let finalSubmitReviewData = {
      star: rating,
      content: reviewText,
      imageUrls: finalImages,
      isVerified: true,
      place: place,
    };
    console.log('finalSubmitReviewData', finalSubmitReviewData);
    const reviewResult = await createNoPartnerReview(finalSubmitReviewData);
    if (reviewResult.success) {
      useToastStore.getState().showToast('리뷰 작성 완료', 'blue');
      setTimeout(() => {
        useToastStore.getState().hideToast();
        navigation.navigate('ReviewResultScreen', {
          reviewResult: reviewResult.data,
          reviewPartnerStatus: 2,
          storeData: route.params?.store,
        });
      }, 1000);
    } else {
      useToastStore.getState().showToast('리뷰 작성 실패', 'error');
    }
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    // 선택된 사진들만 필터링 (파란색 토글된 것들)
    console.log('현재 사용자가 선택한 사진들', selectedPhotos);
    const finalImages = await handleImagesBeforeSubmit();
    let finalSubmitReviewData = {
      star: rating,
      content: reviewText,
      imageUrls: finalImages,
      isVerified: route.params?.isStrange ? false : true,
    };
    console.log('finalSubmitReviewData', finalSubmitReviewData);
    const reviewResult = await createReview(
      route.params?.store?.placeId,
      finalSubmitReviewData
    );
    if (reviewResult.success) {
      useToastStore.getState().showToast('리뷰 작성 완료', 'blue');
      setTimeout(() => {
        useToastStore.getState().hideToast();
        navigation.navigate('ReviewResultScreen', {
          reviewResult: reviewResult.data,
          reviewPartnerStatus: route.params?.isStrange ? 3 : 1,
          storeData: route.params?.store,
        });
      }, 1000);
    } else {
      useToastStore.getState().showToast('리뷰 작성 실패', 'error');
    }
  };

  const handleAddPhoto = () => {
    console.log('사진 촬영하기');
    pickImage();
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="리뷰 작성"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.storeName}>{storeName}</Text>

          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((score) => (
              <StarItem
                key={score}
                filled={score <= rating}
                onPress={() => setRating(score)}
              />
            ))}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="매장에 대한 솔직한 리뷰를 작성해 주세요."
              placeholderTextColor={colors.gray[400]}
              multiline={true}
              textAlignVertical="top"
              value={reviewText}
              onChangeText={setReviewText}
              maxLength={1000}
            />

            <Text style={[styles.charCount, reviewText.length >= 10]}>
              {reviewText.length === 0
                ? '최소 10자 이상'
                : `${reviewText.length}/1000`}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photoScroll}
            contentContainerStyle={styles.photoContainer}
          >
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={handleAddPhoto}
            >
              <View>
                <Ionicons
                  name="camera"
                  size={24}
                  color={theme.colors.primary1}
                />
              </View>
              <Text style={styles.addPhotoText}>사진 촬영하기</Text>
            </TouchableOpacity>

            {photos.map((photo, index) => {
              const isSelected = selectedPhotoIndices.has(index);
              const selectedOrder = getSelectedOrder(index);

              return (
                <View key={index} style={styles.photoItemWrapper}>
                  <TouchableOpacity
                    style={styles.photoItem}
                    onPress={() => handleTogglePhotoSelection(index)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: photo.uri }}
                      style={styles.photoItemPlaceholder}
                    />
                    {/* 라디오 버튼 오버레이 */}
                    <View style={styles.radioButtonOverlay}>
                      {isSelected ? (
                        <View style={styles.radioButtonSelected}>
                          <Text style={styles.radioButtonNumber}>
                            {selectedOrder}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.radioButtonUnselected}>
                          <Ionicons
                            name="radio-button-off"
                            size={32}
                            color={colors.common.white}
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </ScrollView>

        <View style={styles.bottomButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isValid ? styles.activeButton : styles.disabledButton,
            ]}
            disabled={!isValid}
            onPress={isNoPartner ? handleSubmitNoPartnerReview : handleSubmit}
          >
            <Text
              style={[
                styles.submitButtonText,
                isValid
                  ? { color: colors.gray[100] }
                  : { color: theme.colors.background },
              ]}
            >
              작성하기
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <CustomToast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },

  storeName: {
    ...typography.heading4,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },

  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },

  inputWrapper: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    ...theme.shadows.level2,
    padding: 16,
    height: 180,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    ...typography.body3Regular,
    color: theme.colors.text,
  },
  charCount: {
    ...typography.caption1Regular,
    color: theme.colors.textDisabled,
    textAlign: 'right',
    marginTop: 8,
  },

  photoScroll: {
    flexGrow: 0,
    marginBottom: 20,
  },
  photoContainer: {
    paddingRight: 20,
    gap: 12,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    backgroundColor: theme.colors.primary1Light,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    ...typography.caption2Regular,
    color: colors.gray[500],
  },
  photoItemWrapper: {
    position: 'relative',
  },
  photoItem: {
    position: 'relative',
  },
  photoItemPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: colors.gray[200],
    borderRadius: 8,
    resizeMode: 'cover',
  },
  radioButtonOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonUnselected: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.blue[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.common.white,
  },
  radioButtonNumber: {
    ...typography.caption2Bold,
    color: colors.common.white,
    fontSize: 14,
  },

  bottomButtonWrapper: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    backgroundColor: theme.colors.background,
  },
  submitButton: {
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: colors.blue[400],
  },
  disabledButton: {
    backgroundColor: colors.blue[100],
  },
  submitButtonText: {
    ...typography.heading6,
  },
});

export default WriteReviewScreen;
