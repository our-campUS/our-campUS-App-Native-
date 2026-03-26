import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
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

import Toast from 'react-native-toast-message';
import LabelTitle from '@components/LabelTitle';
import { editReview, createReview, createPartnershipReview } from '@api/review';
import useImagePicker from '@/hooks/useImagePicker';
import {
  convertToPng,
  getCommonImagePresignedUrl,
  uploadImageToPresignedUrl,
} from '@api/uploadImage';
import theme from '@style';
import typography from '@style/typography';
import shadow from '@style/shadow';
import colors from '@style/colors';
import RatingIcon from '@assets/icons/rating.svg';

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

  const editMode = route.params?.editMode || false;
  const existingReview = route.params?.review || null;
  const storeName =
    route.params?.store?.name ||
    existingReview?.place ||
    existingReview?.name ||
    '스타벅스 상도역점';

  const [rating, setRating] = useState(
    editMode && existingReview ? existingReview.star || existingReview.rating || 0 : 0
  );
  const [reviewText, setReviewText] = useState(
    editMode && existingReview
      ? existingReview.comment || existingReview.content || ''
      : ''
  );
  const [photos, setPhotos] = useState(
    editMode && existingReview?.imageUrls?.length
      ? existingReview.imageUrls
      : []
  );
  const [uploading, setUploading] = useState(false);
  const [selection, setSelection] = useState(
    editMode ? { start: 0, end: 0 } : undefined
  );

  const { pickImage } = useImagePicker({
    onSelectImages: (assets) => {
      setPhotos((prev) => [...prev, ...assets].slice(0, 10));
    },
    selectionLimit: 10 - photos.length,
    useGallery: true,
    useCamera: true,
  });

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const isValid = reviewText.length >= 20 && rating > 0;

  const handleImagesBeforeSubmit = async () => {
    const newAssets = photos.filter((p) => typeof p !== 'string');
    if (newAssets.length === 0) return [];

    const pngImages = await Promise.all(
      newAssets.map((asset) => convertToPng(asset)),
    );
    const presignedResults = await Promise.all(
      pngImages.map(async (image) => {
        const result = await getCommonImagePresignedUrl(image);
        return { ...result, image };
      }),
    );
    if (presignedResults.some((r) => r.isSuccess === false)) {
      throw new Error('이미지 업로드 URL 발급에 실패했습니다.');
    }
    await Promise.all(
      presignedResults.map(({ uploadUrl, image }) =>
        uploadImageToPresignedUrl(uploadUrl, image),
      ),
    );
    return presignedResults.map(({ imageUrl }) => imageUrl);
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    setUploading(true);
    let uploadedUrls = [];
    try {
      uploadedUrls = await handleImagesBeforeSubmit();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '이미지 업로드에 실패하였습니다.',
      });
      setUploading(false);
      return;
    }

    if (editMode && existingReview) {
      try {
        const existingUrls = photos.filter((p) => typeof p === 'string');
        await editReview(existingReview.reviewId || existingReview.id, {
          content: reviewText,
          star: rating,
          imageUrls: [...existingUrls, ...uploadedUrls],
        });
        Toast.show({
          type: 'success',
          text1: '리뷰가 수정되었습니다.',
        });
        navigation.goBack();
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: '리뷰 수정에 실패하였습니다.',
        });
      }
      setUploading(false);
      return;
    }

    try {
      const store = route.params?.store;
      const placeId = route.params?.placeId;
      const isPartnership = store?.isPartnership || store?.isPartner;

      let result;
      if (isPartnership && placeId) {
        result = await createPartnershipReview(placeId, {
          content: reviewText,
          star: rating,
          isVerified: false,
          imageUrls: uploadedUrls,
        });
      } else {
        result = await createReview({
          content: reviewText,
          star: rating,
          imageUrls: uploadedUrls,
          place: store
            ? {
                placeName: store.name || store.placeName || '',
                placeKey: store.placeKey || '',
                address: store.address || '',
                category: store.category || '',
                link: store.link || '',
                telephone: store.telephone || store.phone || '',
                coordinate: {
                  latitude: store.latitude || store.coordinate?.latitude || 0,
                  longitude: store.longitude || store.coordinate?.longitude || 0,
                },
                imgUrls: store.imgUrls || [],
              }
            : {
                placeName: route.params?.storeName || '',
                placeKey: route.params?.placeKey || '',
                address: '',
                category: '',
                link: '',
                telephone: '',
                coordinate: { latitude: 0, longitude: 0 },
                imgUrls: [],
              },
        });
      }

      navigation.navigate('ReviewResultScreen', { reviewResult: result });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '리뷰 등록에 실패하였습니다.',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LabelTitle
        title={editMode ? '리뷰 수정' : '리뷰 작성'}
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
              selection={selection}
              onSelectionChange={() => {
                if (selection) setSelection(undefined);
              }}
            />

            <Text style={[styles.charCount, reviewText.length >= 20]}>
              {reviewText.length === 0
                ? '최소 20자 이상'
                : `${reviewText.length}/1000`}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photoScroll}
            contentContainerStyle={styles.photoContainer}
          >
            {photos.length < 10 && (
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={pickImage}
              >
                <Ionicons
                  name="camera"
                  size={23}
                  color={theme.colors.primary1}
                />
                <Text style={styles.addPhotoText}>사진 촬영하기</Text>
              </TouchableOpacity>
            )}

            {photos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <Image
                  source={{
                    uri: typeof photo === 'string' ? photo : photo.uri,
                  }}
                  style={styles.photoImage}
                />
                <TouchableOpacity
                  style={styles.photoBadge}
                  onPress={() => handleRemovePhoto(index)}
                >
                  <Text style={styles.photoBadgeText}>{index + 1}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </ScrollView>

        <View style={styles.bottomButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isValid && !uploading
                ? styles.activeButton
                : styles.disabledButton,
            ]}
            disabled={!isValid || uploading}
            onPress={handleSubmit}
          >
            {uploading ? (
              <ActivityIndicator color={colors.gray[100]} />
            ) : (
              <Text
                style={[
                  styles.submitButtonText,
                  isValid
                    ? { color: colors.gray[100] }
                    : { color: theme.colors.background },
                ]}
              >
                {editMode ? '수정하기' : '작성하기'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    gap: 8,
  },
  addPhotoButton: {
    width: 90,
    height: 90,
    backgroundColor: theme.colors.primary1Light,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    padding: 10,
  },
  addPhotoText: {
    ...typography.caption2Regular,
    color: colors.gray[600],
  },
  photoItem: {
    width: 90,
    height: 90,
    borderRadius: 8,
    position: 'relative',
  },
  photoImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  photoBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: theme.colors.primary1,
    borderWidth: 1,
    borderColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoBadgeText: {
    ...typography.caption1Regular,
    fontSize: 12,
    color: colors.gray[100],
    lineHeight: 15,
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
