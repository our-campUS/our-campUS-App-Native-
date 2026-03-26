import React, { useState } from 'react';
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
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Toast from 'react-native-toast-message';
import LabelTitle from '@components/LabelTitle';
import { editReview, createReview, createPartnershipReview } from '@api/review';
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
  const [selection, setSelection] = useState(
    editMode ? { start: 0, end: 0 } : undefined
  );

  const handleOpenGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 });
    if (!result.didCancel && result.assets?.length) {
      setPhotos(result.assets.map(a => ({
        uri: a.uri,
        width: a.width,
        height: a.height,
        type: a.type,
      })));
    }
  };

  const uploadPhotos = async () => {
    if (photos.length === 0) return [];
    const pngImages = await Promise.all(photos.map(convertToPng));
    const presignedUrls = await Promise.all(
      pngImages.map(async (image) => {
        const { uploadUrl, imageUrl } = await getCommonImagePresignedUrl(image);
        return { uploadUrl, imageUrl, image };
      }),
    );
    await Promise.all(
      presignedUrls.map(({ uploadUrl, image }) =>
        uploadImageToPresignedUrl(uploadUrl, image),
      ),
    );
    return presignedUrls.map((p) => p.imageUrl);
  };

  const isValid = reviewText.length >= 20 && rating > 0;

  const handleSubmit = async () => {
    if (!isValid) return;

    if (editMode && existingReview) {
      try {
        await editReview(existingReview.reviewId || existingReview.id, {
          content: reviewText,
          star: rating,
          imageUrls: existingReview.imageUrls || [],
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
      return;
    }

    try {
      const store = route.params?.store;
      const placeId = route.params?.placeId;
      const isPartnership = store?.isPartnership || store?.isPartner;

      const imageUrls = await uploadPhotos();

      let result;
      if (isPartnership && placeId) {
        result = await createPartnershipReview(placeId, {
          content: reviewText,
          star: rating,
          isVerified: false,
          imageUrls,
        });
      } else {
        result = await createReview({
          content: reviewText,
          star: rating,
          imageUrls,
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

      const reviewCaseType = isPartnership && placeId ? 3 : 4;
      const storePlaceName =
        store?.name || store?.placeName || route.params?.storeName || '';
      navigation.navigate('ReviewResultScreen', {
        reviewResult: result,
        caseType: reviewCaseType,
        placeName: storePlaceName,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: '리뷰 등록에 실패하였습니다.',
      });
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
            <TouchableOpacity style={styles.addPhotoButton} onPress={handleOpenGallery}>
              <View>
                <Ionicons
                  name="camera"
                  size={24}
                  color={theme.colors.primary1}
                />
              </View>
              <Text style={styles.addPhotoText}>사진 촬영하기</Text>
            </TouchableOpacity>

            {photos.map((photo, index) => (
              <View key={index} style={styles.photoItemPlaceholder}>
                <Image source={{ uri: photo.uri }} style={styles.photoItemImage} />
                <TouchableOpacity
                  style={styles.photoDeleteButton}
                  onPress={() => setPhotos(prev => prev.filter((_, i) => i !== index))}
                >
                  <Ionicons name="close-circle" size={20} color={colors.gray[800]} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </ScrollView>

        <View style={styles.bottomButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isValid ? styles.activeButton : styles.disabledButton,
            ]}
            disabled={!isValid}
            onPress={handleSubmit}
          >
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
  photoItemPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: colors.gray[200],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  photoItemImage: {
    width: '100%',
    height: '100%',
  },
  photoDeleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
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
