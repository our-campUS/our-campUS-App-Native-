import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  useWindowDimensions,
  Alert,
  Platform,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import LabelTitle from '../../../components/LabelTitle';
import { useState, useRef, useEffect } from 'react';
import CheckerboardPlaceholder from '../../../components/common/CheckerboardPlaceholder';
import { launchImageLibrary } from 'react-native-image-picker';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import useFormDraftStore from '../../../store/formDraftStore';
import { Appearance } from 'react-native';
import {
  formatDotDate,
  formatClockTime,
  createDateOnly,
  createTimeOnly,
  toISODateTimeString,
} from '../../../utils/dateTime';
import useAuthStore from '../../../store/authStore';
import {
  getCouncilAffiliatePostDetail,
  EditCouncilPost,
} from '../../../api/councilAffiliate';
import {
  convertToPng,
  getCouncilImagePresignedUrl,
  uploadImageToPresignedUrl,
} from '../../../api/uploadImage';
import Toast from 'react-native-toast-message';

const EventEditScreen = ({ navigation, route }) => {
  const { accessToken } = useAuthStore();
  const [placeInfo, setPlaceInfo] = useState(null);
  const colorScheme = Appearance.getColorScheme();
  const eventType = route.params?.type;
  const { formDraft, resetFormDraft } = useFormDraftStore();
  const [selectedImages, setSelectedImages] = useState([]);
  const isEmpty = selectedImages.length === 0;
  const { width } = useWindowDimensions();
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [previousPostData, setPreviousPostData] = useState(null);
  const [previousPostDataId, setPreviousPostDataId] = useState(null);
  const [isImageUnChanged, setIsImageUnChanged] = useState(true);
  const [detailedLocation, setDetailedLocation] = useState('');

  useEffect(() => {
    if (route.params?.item) {
      console.log('previousPostDataId', route.params?.item.postId);
      setPreviousPostDataId(route.params?.item.postId);
    }
  }, [route.params?.item]);

  //   useEffect(() => {
  //     handleImagePicker();
  //   }, []);
  useEffect(() => {
    if (formDraft?.placeInfo) {
      setPlace(formDraft?.placeInfo?.placeName);
      setPlaceInfo(formDraft?.placeInfo);
    }
  }, [formDraft?.placeInfo]);

  useEffect(() => {
    if (previousPostDataId) {
      const fetchPreviousPostData = async () => {
        const response = await getCouncilAffiliatePostDetail(
          previousPostDataId,
          accessToken
        );
        setPreviousPostData(response.data.data);
      };
      fetchPreviousPostData();
    }
  }, [previousPostDataId]);

  useEffect(() => {
    if (previousPostData) {
      console.log('previousPostData', previousPostData);
      setTitle(previousPostData?.title);
      setPlace(previousPostData?.place?.placeName);
      // startDateTime을 파싱하여 날짜와 시간 분리
      if (previousPostData?.startDateTime) {
        const dateTime = new Date(previousPostData.startDateTime);
        setStartDate(createDateOnly(dateTime));
        setStartTime(createTimeOnly(dateTime));
      }
      setSelectedImages(previousPostData?.images);
      setPlaceInfo(previousPostData?.place);
      setDetailedLocation(previousPostData?.detailedLocation);
      setIsImageUnChanged(true); // 초기 데이터 로드 시 이미지 변경되지 않음
    }
  }, [previousPostData]);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);

  // 빈 배열일 경우 5개 placeholder 이미지 생성
  const imagesToRender = isEmpty ? Array.from({ length: 5 }) : selectedImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempStartTime, setTempStartTime] = useState(new Date());

  const scrollViewRef = useRef(null);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  //   const checkChanged = () => {
  //     if (title !== previousPostData?.title) {
  //       return true;
  //     }
  //     if (placeInfo !== previousPostData?.place) {
  //       return true;
  //     }
  //     if (startDate?.slice(0, 10) !== previousPostData?.startDate?.slice(0, 10)) {
  //       return true;
  //     }
  //     if (endDate?.slice(0, 10) !== previousPostData?.endDate?.slice(0, 10)) {
  //       return true;
  //     }
  //     if (!isImageUnChanged) {
  //       return true;
  //     }
  //     return false;
  //   };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleImagePicker = () => {
    Alert.alert(
      '이미지 선택',
      '갤러리에서 이미지를 선택해주세요',
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
                selectionLimit: 0, // ⭐ 여러 장 선택 (0 = 무제한)
              },
              (response) => {
                if (response.didCancel) return;

                if (response.errorMessage) {
                  Alert.alert('오류', response.errorMessage);
                  return;
                }

                if (response.assets && response.assets.length > 0) {
                  setSelectedImages(response.assets); // 🔥 배열로 저장
                  setIsImageUnChanged(false); // 이미지 변경됨
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

  useEffect(() => {
    if (!previousPostData) {
      setIsButtonDisabled(true);
      return;
    }

    if (title && place && startDate && startTime && detailedLocation) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [
    title,
    place,
    startDate,
    startTime,
    detailedLocation,
    selectedImages,
    placeInfo,
    isImageUnChanged,
    previousPostData,
  ]);

  const handleImagesBeforeSubmit = async () => {
    console.log('handleImagesBeforeSubmit');
    if (isImageUnChanged) {
      // 이미지가 변경되지 않았으면 기존 이미지 URL 반환
      return previousPostData?.images || [];
    }
    const images = selectedImages || [];
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

  const handleSubmitEvent = async () => {
    const startDateTime = toISODateTimeString(startDate, startTime);
    console.log('startDate', startDate);
    console.log('startTime', startTime);
    console.log('startDateTime', startDateTime);

    const finalImages = await handleImagesBeforeSubmit();

    let finalSubmitEventData = {
      title: title,
      category: 'EVENT',
      content: '행사',
      place: placeInfo,
      detailedLocation: detailedLocation,
      thumbnailIcon: 'EVENT',
      startDateTime: startDateTime,
      imageUrls: finalImages,
      thumbnailImageUrl: finalImages[0],
    };
    console.log('finalSubmitEventData', finalSubmitEventData);
    let response = await EditCouncilPost(
      finalSubmitEventData,
      accessToken,
      previousPostDataId
    );
    console.log('response at handleSubmitEvent', response);
    if (response.data.code === 200) {
      Toast.show({
        type: 'success',
        text1: '행사 글 수정 성공',
        text2: '행사 글이 성공적으로 수정되었습니다.',
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
      Alert.alert('행사 글 수정에 실패했습니다.', response.data.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        navigation={navigation}
        title="행사 수정"
        useBackButton={true}
        useTitle={true}
        onPressBack={() => {
          navigation.goBack();
          resetFormDraft();
        }}
        useRightButton={true}
        onPressRight={() => {
          handleImagePicker();
        }}
        rightButtonText="이미지 변경"
      />
      {/* <View style={{ height: 20 }} /> */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={{ width: '100%' }}>
          <FlatList
            ref={flatListRef}
            data={imagesToRender}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            renderItem={({ item, index }) => (
              <View style={[styles.imageContainer, { width }]}>
                {isEmpty ? (
                  <CheckerboardPlaceholder
                    width={width}
                    height={375}
                  />
                ) : (
                  <Image
                    source={
                      isImageUnChanged ? { uri: item } : { uri: item.uri }
                    }
                    style={[styles.detailImage, { width }]}
                  />
                )}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={styles.dotContainer}>
          {imagesToRender.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.dotActive]}
            />
          ))}
        </View>
        <View style={styles.inputContainer}>
          <Input
            isOrange={true}
            useTitle={true}
            title="제목"
            placeholder="제목"
            value={title}
            onChangeText={setTitle}
            style={styles.titleInput}
          />
          <Input
            isOrange={true}
            useTitle={true}
            title="장소"
            placeholder="장소"
            value={place}
            usePopUPModal={true}
            onPressPopUPModal={() =>
              navigation.navigate('SelectPlaceAffiliateScreen')
            }
            style={styles.placeInput}
          />
          <Input
            isOrange={true}
            useTitle={true}
            title="상세 위치"
            placeholder="상세 위치"
            value={detailedLocation}
            onChangeText={setDetailedLocation}
          />
          <Text
            style={{
              ...typography.body3Bold,
              color: colors.gray[850],
              marginBottom: -10,
            }}
          >
            기간
          </Text>
          <View style={styles.dateInputContainer}>
            <View style={styles.dateInputWrapper}>
              <Input
                isOrange={true}
                placeholder="날짜"
                value={formatDotDate(startDate)}
                usePopUPModal={true}
                additionalStyle={styles.startDateInput}
                useDatePicker={true}
                onPressPopUPModal={() => {
                  if (Platform.OS === 'ios') {
                    setTempStartDate(startDate ?? new Date());
                    setShowStartPicker(true);
                  } else {
                    setShowStartPicker(true);
                  }
                }}
              />
            </View>

            <View style={styles.dateInputWrapper}>
              <Input
                placeholder="시간"
                value={formatClockTime(startTime)}
                usePopUPModal={true}
                additionalStyle={styles.endDateInput}
                useDatePicker={true}
                onPressPopUPModal={() => {
                  if (Platform.OS === 'ios') {
                    setTempStartTime(startTime ?? new Date());
                    setShowStartTimePicker(true);
                  } else {
                    setShowStartTimePicker(true);
                  }
                }}
              />
            </View>
          </View>

          <Button
            disabled={isButtonDisabled}
            isOrange={true}
            title="수정하기"
            onPress={() => handleSubmitEvent()}
            style={{
              width: '100%',
              height: 50,
              paddingHorizontal: 10,
              paddingVertical: 15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.orange[400],
              borderRadius: 10,
            }}
          />
        </View>
      </ScrollView>
      <Toast />
      {showStartPicker && Platform.OS === 'ios' && (
        <View style={styles.datePickerContainer}>
          <DateTimePicker
            customStyles={{
              datePicker: {
                backgroundColor: colorScheme === 'dark' ? '#222' : 'white',
              },
            }}
            value={startDate ?? new Date()}
            mode="date"
            minimumDate={new Date(2026, 0, 1)}
            maximumDate={new Date(2026, 11, 31)}
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (event.type === 'dismissed') return;
              if (selectedDate) setStartDate(createDateOnly(selectedDate));
            }}
          />
        </View>
      )}
      {showStartPicker && Platform.OS === 'ios' && (
        <>
          <View style={styles.datePickerOverlay} />
          <View
            style={[
              styles.pickerWrapper,
              {
                backgroundColor:
                  colorScheme === 'dark'
                    ? colors.gray[900]
                    : colors.common.white,
              },
            ]}
          >
            <View
              style={[
                styles.pickerHeader,
                {
                  borderBottomColor:
                    colorScheme === 'dark' ? colors.gray[800] : '#eee',
                },
              ]}
            >
              <Text
                style={styles.cancelText}
                onPress={() => setShowStartPicker(false)}
              >
                취소
              </Text>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color:
                      colorScheme === 'dark' ? colors.common.white : '#222',
                  },
                ]}
              >
                시작일
              </Text>
              <Text
                style={styles.confirmText}
                onPress={() => {
                  setStartDate(createDateOnly(tempStartDate));
                  setShowStartPicker(false);
                }}
              >
                저장
              </Text>
            </View>
            <View style={styles.pickerContent}>
              <DateTimePicker
                minimumDate={new Date(2026, 0, 1)}
                maximumDate={new Date(2026, 11, 31)}
                value={tempStartDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) setTempStartDate(date); // ⭐ 안 닫힘
                }}
              />
            </View>
          </View>
        </>
      )}
      {showStartTimePicker && Platform.OS === 'ios' && (
        <>
          <View style={styles.datePickerOverlay} />
          <View
            style={[
              styles.pickerWrapper,
              {
                backgroundColor:
                  colorScheme === 'dark'
                    ? colors.gray[900]
                    : colors.common.white,
              },
            ]}
          >
            <View
              style={[
                styles.pickerHeader,
                {
                  borderBottomColor:
                    colorScheme === 'dark' ? colors.gray[800] : '#eee',
                },
              ]}
            >
              <Text
                style={styles.cancelText}
                onPress={() => setShowStartTimePicker(false)}
              >
                취소
              </Text>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color:
                      colorScheme === 'dark' ? colors.common.white : '#222',
                  },
                ]}
              >
                시작 시간
              </Text>
              <Text
                style={styles.confirmText}
                onPress={() => {
                  setStartTime(createTimeOnly(tempStartTime));
                  setShowStartTimePicker(false);
                }}
              >
                저장
              </Text>
            </View>
            <View style={styles.pickerContent}>
              <DateTimePicker
                customStyles={{
                  datePicker: {
                    color: colors.common.black,
                  },
                }}
                value={tempStartTime}
                mode="time"
                display="spinner"
                onChange={(event, date) => {
                  if (date) setTempStartTime(date); // ⭐ 안 닫힘
                }}
              />
            </View>
          </View>
        </>
      )}
      {showStartPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={startDate ?? new Date()}
          mode="date"
          minimumDate={new Date(2026, 0, 1)}
          maximumDate={new Date(2026, 11, 31)}
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (event.type === 'dismissed') return;
            if (!selectedDate) return;
            setStartDate(createDateOnly(selectedDate));
          }}
        />
      )}
      {showStartTimePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={startTime ?? new Date()}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowStartTimePicker(false);
            if (event.type === 'dismissed') return;
            if (!selectedTime) return;
            setStartTime(createTimeOnly(selectedTime));
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gray[250],
  },
  dotActive: {
    backgroundColor: colors.gray[500],
  },
  detailImage: {
    width: '100%',
    height: 375,
  },
  inputContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  startDateInput: {
    width: 156,
    alignSelf: 'flex-start',
  },
  endDateInput: {
    width: 156,
    alignSelf: 'flex-end',
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  datePickerContainer: {
    width: '100%',
    alignItems: 'center', // ⭐ 핵심
    justifyContent: 'center',
    backgroundColor: 'white',
    zIndex: 1000,
  },
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 10,
    zIndex: 1001,
  },

  pickerHeader: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  cancelText: {
    fontSize: 16,
    color: colors.orange[400],
  },

  confirmText: {
    fontSize: 16,
    color: colors.orange[400],
    fontWeight: '600',
  },

  pickerContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EventEditScreen;
