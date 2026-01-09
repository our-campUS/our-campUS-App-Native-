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
import PlaceHolderImage from '../../../../assets/blankImage.svg';
import { launchImageLibrary } from 'react-native-image-picker';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import useFormDraftStore from '../../../store/formDraftStore';
import { Appearance } from 'react-native';

const WriteAffiliatePostScreen = ({ navigation, route }) => {
  const colorScheme = Appearance.getColorScheme();
  const eventType = route.params?.type;
  const { formDraft, resetFormDraft } = useFormDraftStore();
  const [selectedImages, setSelectedImages] = useState([]);
  const isEmpty = selectedImages.length === 0;
  const { width } = useWindowDimensions();
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);

  useEffect(() => {
    handleImagePicker();
  }, []);
  useEffect(() => {
    if (formDraft?.place) {
      setPlace(formDraft.place);
    }
  }, [formDraft?.place]);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // 빈 배열일 경우 5개 placeholder 이미지 생성
  const imagesToRender = isEmpty ? Array.from({ length: 5 }) : selectedImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());

  const scrollViewRef = useRef(null);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

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

  const formatDate = (date) => {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };

  useEffect(() => {
    if (title && place && startDate && endDate) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [title, place, startDate, endDate]);

  const handleSubmit = () => {
    if (eventType === 'affiliate') {
      navigation.navigate('SelectAffiliationLogoScreen', {
        type: 'affiliate',
        title: title,
        place: place,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        images: selectedImages,
      });
    } else {
      // navigation.navigate('PostFinishScreen', { type: 'affiliate' , title, place, startDate, endDate });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LabelTitle
        navigation={navigation}
        title="제휴 글쓰기"
        useBackButton={true}
        useTitle={true}
        onPressBack={() => {
          navigation.goBack();
          resetFormDraft();
        }}
      />
      <View style={{ height: 20 }} />
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
                  <PlaceHolderImage
                    width={width}
                    height={375}
                    preserveAspectRatio="none"
                  />
                ) : (
                  <Image
                    source={{ uri: item.uri }}
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
                placeholder="시작일"
                value={formatDate(startDate)}
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
            <Text>-</Text>
            <View style={styles.dateInputWrapper}>
              <Input
                placeholder="종료일"
                value={formatDate(endDate)}
                usePopUPModal={true}
                additionalStyle={styles.endDateInput}
                useDatePicker={true}
                onPressPopUPModal={() => {
                  if (Platform.OS === 'ios') {
                    setTempEndDate(endDate ?? startDate ?? new Date());
                    setShowEndPicker(true);
                  } else {
                    setShowEndPicker(true);
                  }
                }}
              />
            </View>
          </View>
          <Button
            disabled={isButtonDisabled}
            isOrange={true}
            title="게시하기"
            onPress={() => handleSubmit()}
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
              if (selectedDate) setStartDate(selectedDate);
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
                  setStartDate(tempStartDate);
                  setShowStartPicker(false);

                  if (endDate && tempStartDate > endDate) {
                    setEndDate(null);
                  }
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
      {showEndPicker && Platform.OS === 'ios' && (
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
                onPress={() => setShowEndPicker(false)}
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
                종료일
              </Text>
              <Text
                style={styles.confirmText}
                onPress={() => {
                  setEndDate(tempEndDate);
                  setShowEndPicker(false);
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
                maximumDate={new Date(2026, 11, 31)}
                value={tempEndDate}
                mode="date"
                display="spinner"
                minimumDate={startDate ?? undefined}
                onChange={(event, date) => {
                  if (date) setTempEndDate(date); // ⭐ 안 닫힘
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
            setStartDate(selectedDate);
            if (endDate && selectedDate > endDate) {
              setEndDate(null);
            }
          }}
        />
      )}
      {showEndPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={endDate ?? startDate ?? new Date()}
          mode="date"
          maximumDate={new Date(2026, 11, 31)}
          minimumDate={startDate ?? undefined}
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (event.type === 'dismissed') return;
            if (!selectedDate) return;
            setEndDate(selectedDate);
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

export default WriteAffiliatePostScreen;
