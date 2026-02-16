import { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import LabelTitle from '../../components/LabelTitle';
import colors from '../../style/colors';
import typography from '../../style/typography';

const PAGE_SIZE = 60;

const ProfileImageScreen = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedUri, setSelectedUri] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // 권한 요청 후 사진 로드
  useEffect(() => {
    const requestPermissionAndLoad = async () => {
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        android:
          Platform.Version >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      });

      const result = await request(permission);
      if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
        loadPhotos();
      }
    };

    requestPermissionAndLoad();
  }, []);

  const loadPhotos = useCallback(async () => {
    try {
      const params = {
        first: PAGE_SIZE,
        assetType: 'Photos',
      };
      if (endCursor) {
        params.after = endCursor;
      }

      const result = await CameraRoll.getPhotos(params);
      const newPhotos = result.edges.map((edge) => ({
        uri: edge.node.image.uri,
        width: edge.node.image.width,
        height: edge.node.image.height,
        type: edge.node.type,
      }));

      setPhotos((prev) => (endCursor ? [...prev, ...newPhotos] : newPhotos));
      setEndCursor(result.page_info.end_cursor);
      setHasNextPage(result.page_info.has_next_page);
    } catch (error) {
      console.error('사진 로드 실패:', error);
    }
  }, [endCursor]);

  const handleEndReached = () => {
    if (hasNextPage) {
      loadPhotos();
    }
  };

  const handleSelect = (photo) => {
    if (selectedUri === photo.uri) {
      setSelectedUri(null);
      setSelectedAsset(null);
    } else {
      setSelectedUri(photo.uri);
      setSelectedAsset(photo);
    }
  };

  const handleNext = () => {
    if (!selectedAsset) return;
    navigation.navigate('MyPageProfileEditScreen', {
      selectedPhoto: selectedAsset,
    });
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedUri === item.uri;
    return (
      <Pressable style={styles.imageItem} onPress={() => handleSelect(item)}>
        <Image source={{ uri: item.uri }} style={styles.image} />
        <View style={styles.indicatorWrapper}>
          <View
            style={[
              styles.indicator,
              isSelected ? styles.indicatorSelected : styles.indicatorDefault,
            ]}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="프로필 이미지"
        navigation={navigation}
        useBackButton
        useRightButton
        rightButtonText="다음"
        onPressRight={handleNext}
        rightButtonTextStyle={{
          ...typography.body4Bold,
          color: selectedUri ? colors.gray[700] : colors.gray[400],
        }}
      />
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.uri + index}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  listContent: {
    gap: 6,
  },
  row: {
    gap: 6,
  },
  imageItem: {
    flex: 1,
    height: 121,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  indicatorWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.common.white,
  },
  indicatorDefault: {
    backgroundColor: colors.gray[250],
  },
  indicatorSelected: {
    backgroundColor: colors.blue[400],
  },
});

export default ProfileImageScreen;
