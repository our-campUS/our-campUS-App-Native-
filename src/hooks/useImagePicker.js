import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Alert } from 'react-native';
import { useCallback } from 'react';

const useImagePicker = ({
  onSelectImages,
  selectionLimit = 0,
  useGallery = true,
  useCamera = false,
}) => {
  const pickImage = useCallback(() => {
    // 둘 다 사용 가능하면 Alert로 선택
    if (useGallery && useCamera) {
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
                  selectionLimit: selectionLimit > 0 ? selectionLimit : 0,
                },
                (response) => {
                  if (response.didCancel) {
                    return;
                  }
                  if (response.errorMessage) {
                    Alert.alert('오류', response.errorMessage);
                    return;
                  }
                  if (response.assets && response.assets.length > 0) {
                    onSelectImages?.(response.assets);
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
                  if (response.assets && response.assets.length > 0) {
                    onSelectImages?.(response.assets);
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
    }
    // 갤러리만 사용 가능하면 Alert로 선택
    else if (useGallery) {
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
                  selectionLimit: selectionLimit > 0 ? selectionLimit : 0,
                },
                (response) => {
                  if (response.didCancel) {
                    return;
                  }
                  if (response.errorMessage) {
                    Alert.alert('오류', response.errorMessage);
                    return;
                  }
                  if (response.assets && response.assets.length > 0) {
                    onSelectImages?.(response.assets);
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
    }
    // 카메라만 사용 가능하면 Alert로 선택
    else if (useCamera) {
      Alert.alert(
        '이미지 선택',
        '카메라로 사진을 촬영해주세요',
        [
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
                  if (response.assets && response.assets.length > 0) {
                    onSelectImages?.(response.assets);
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
    }
  }, [useGallery, useCamera, selectionLimit, onSelectImages]);

  return { pickImage };
};

export default useImagePicker;
