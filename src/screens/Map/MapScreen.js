import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Dimensions,
  Alert,
  PermissionsAndroid,
  Keyboard, // 키보드 내리기용
} from 'react-native';
import {
  NaverMapView,
  NaverMapMarkerOverlay,
} from '@mj-studio/react-native-naver-map';
import Geolocation from '@react-native-community/geolocation';
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SEARCH_RESULTS } from '../../constants/MapData';
import BottomSheet from '../../components/map/BottomSheet';
import MapPin from '../../components/common/MapPin';
import theme from '../../style';

import CategoryList from '../../components/map/CategoryList';
import LocationIcon from '../../../assets/icons/location.svg';
import {
  getAddressFromCoords,
  getPartnerships,
  getMapMarkers,
} from '../../api/place';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const HEIGHT_LIST = SCREEN_HEIGHT * 0.45;
const HEIGHT_ITEM = 280;
const HEIGHT_HIDDEN = 0;

const MapScreen = ({ route }) => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const insets = useSafeAreaInsets();

  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');

  const [partnerships, setPartnerships] = useState([]);
  const [mapMarkers, setMapMarkers] = useState([]);

  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListEnd, setIsListEnd] = useState(false);

  const isCategoryVisible = !searchKeyword && !selectedCategory;

  const sheetHeightAnimated = useRef(new Animated.Value(HEIGHT_HIDDEN)).current;
  const screenHeight = Dimensions.get('window').height;
  const topHeaderHeight = insets.top + 60 + 20;
  const sheetMaxHeight = screenHeight - topHeaderHeight;

  useEffect(() => {
    if (route.params) {
      const { searchType, keyword, selectedLocation } = route.params;

      if (searchType === 'KEYWORD' && keyword) {
        setSearchKeyword(keyword);
        setSelectedCategory(null);
        setSelectedMarkerId(null);
      } else if (searchType === 'LOCATION' && selectedLocation) {
        setSearchKeyword(selectedLocation.name);
        setSelectedMarkerId(selectedLocation.placeId);

        mapRef.current?.animateCameraTo({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          zoom: 16,
          duration: 500,
        });
      }
    }
  }, [route.params]);

  const displayedMarkers = useMemo(() => {
    if (searchKeyword || selectedCategory) {
      return partnerships;
    }

    if (selectedMarkerId) {
      const foundInMap = mapMarkers.find(
        (item) => item.placeId === selectedMarkerId
      );
      if (foundInMap) return [foundInMap];

      const foundInList = partnerships.find(
        (item) => item.placeId === selectedMarkerId
      );
      if (foundInList) return [foundInList];

      return [];
    }

    return [];
  }, [
    searchKeyword,
    selectedCategory,
    selectedMarkerId,
    partnerships,
    mapMarkers,
  ]);

  useEffect(() => {
    let targetHeight = HEIGHT_HIDDEN;

    if (selectedMarkerId) {
      targetHeight = HEIGHT_ITEM;
    } else if (searchKeyword || selectedCategory) {
      targetHeight = HEIGHT_LIST;
    } else {
      targetHeight = HEIGHT_HIDDEN;
    }

    Animated.spring(sheetHeightAnimated, {
      toValue: targetHeight,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [selectedMarkerId, searchKeyword, selectedCategory]);

  const fetchPartnershipList = async (isLoadMore = false) => {
    if (!searchKeyword && !selectedCategory) return;

    if (loading) return;
    if (isLoadMore && isListEnd) return;

    setLoading(true);

    const currentLat = 37.5665;
    const currentLng = 126.978;
    const cursorToSend = isLoadMore ? nextCursor : null;

    const response = await getPartnerships({
      lat: currentLat,
      lng: currentLng,
      cursor: cursorToSend,
      size: 5,
    });

    if (response && response.code === 200) {
      const newData = response.data;
      if (newData.length === 0) {
        setIsListEnd(true);
      } else {
        const lastItem = newData[newData.length - 1];
        setNextCursor(lastItem.placeId);

        if (isLoadMore) {
          setPartnerships((prev) => [...prev, ...newData]);
        } else {
          setPartnerships(newData);
          setIsListEnd(false);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchKeyword || selectedCategory) {
      fetchPartnershipList(false);
    } else {
      setPartnerships([]);
    }
  }, [searchKeyword, selectedCategory]);

  const getDeltas = (zoom) => {
    const zoomFactor = Math.pow(2, 16 - zoom);

    return {
      latitudeDelta: 0.01 * zoomFactor,
      longitudeDelta: 0.01 * zoomFactor,
    };
  };

  const handleCameraIdle = async (e) => {
    const { latitude, longitude, zoom } = e;

    const addressData = await getAddressFromCoords(latitude, longitude);
    if (addressData) setCurrentAddress(addressData.text);

    if (mapRef.current) {
      try {
        let minLat, maxLat, minLng, maxLng;

        const currentZoom = zoom || 16;
        const { latitudeDelta, longitudeDelta } = getDeltas(currentZoom);

        minLat = latitude - latitudeDelta;
        maxLat = latitude + latitudeDelta;
        minLng = longitude - longitudeDelta;
        maxLng = longitude + longitudeDelta;

        console.log(`lat: ${minLat} ~ ${maxLat}, lng: ${minLng} ~ ${maxLng}`);

        if (minLat && maxLat && minLng && maxLng) {
          const markers = await getMapMarkers(minLat, maxLat, minLng, maxLng);
          if (markers) {
            setMapMarkers(markers);
            console.log(`${markers.length}개의 핀 로드 완료`);
          }
        }
      } catch (err) {
        console.error('영역 계산 로직 에러:', err);
      }
    }
  };

  const handleReset = () => {
    Keyboard.dismiss();
    setSelectedMarkerId(null);
    setSelectedCategory(null);
    setSearchKeyword(null);
  };

  const handleCurrentLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
      }
      mapRef.current?.setLocationTrackingMode('Follow');
    } catch (e) {
      console.error(e);
    }
  };

  const getPinSize = (type) => (type === 'SELECTED' ? 56 : 44);

  const buttonTranslateY = sheetHeightAnimated.interpolate({
    inputRange: [HEIGHT_HIDDEN, HEIGHT_ITEM, HEIGHT_LIST],
    outputRange: [0, -20, -20],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <NaverMapView
        ref={mapRef}
        style={{ flex: 1 }}
        onCameraIdle={handleCameraIdle}
        initialCamera={{ latitude: 37.5665, longitude: 126.978, zoom: 16 }}
        isShowLocationButton={false}
        isShowZoomControls={false}
        onTapMap={handleReset}
      >
        {mapMarkers.map((item) => {
          const isSelected = item.placeId === selectedMarkerId;
          const pinType = isSelected ? 'SELECTED' : 'PARTNER';
          const pinSize = getPinSize(pinType);

          return (
            <NaverMapMarkerOverlay
              key={item.placeId}
              latitude={item.latitude}
              longitude={item.longitude}
              width={pinSize}
              height={pinSize}
              anchor={{ x: 0.5, y: isSelected ? 1 : 0.5 }}
              onTap={() => {
                setSelectedMarkerId(item.placeId);
              }}
              caption={{ text: item.placeName }}
            >
              <MapPin type={pinType} category={item.category} />
            </NaverMapMarkerOverlay>
          );
        })}
      </NaverMapView>

      {/* 상단 검색바 영역 */}
      <View
        style={[
          styles.overlay,
          {
            paddingTop:
              Platform.OS === 'android' ? insets.top + 20 : insets.top + 10,
          },
        ]}
      >
        <View>
          {searchKeyword ? (
            <SearchBar
              value={searchKeyword}
              onPress={() => navigation.navigate('MapSearchScreen')}
              placeholder={currentAddress || '원하는 제휴를 검색하세요'}
              onBackPress={handleReset}
              onClearPress={handleReset}
              showSoftInputOnFocus={false}
            />
          ) : selectedCategory ? (
            <SearchBar
              value={selectedCategory.label}
              placeholder={currentAddress || '원하는 제휴를 검색하세요'}
              onBackPress={handleReset}
              onClearPress={handleReset}
            />
          ) : (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate('MapSearchScreen')}
            >
              <View pointerEvents="none">
                <SearchBar
                  placeholder={currentAddress || '원하는 제휴를 검색하세요'}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {!selectedCategory && !searchKeyword && (
          <CategoryList
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setSelectedMarkerId(null);
            }}
          />
        )}
      </View>

      <Animated.View
        style={[
          styles.myLocationButtonWrapper,
          { transform: [{ translateY: buttonTranslateY }] },
        ]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={handleCurrentLocation}
          activeOpacity={0.8}
        >
          <LocationIcon width={24} height={24} color={theme.colors.textDim} />
        </TouchableOpacity>
      </Animated.View>

      <BottomSheet
        displayedMarkers={displayedMarkers}
        selectedMarkerId={selectedMarkerId}
        onItemPress={(id) => setSelectedMarkerId(id)}
        maxHeight={sheetMaxHeight}
        sheetHeightAnimated={sheetHeightAnimated}
        onEndReached={() => fetchPartnershipList(true)}
        isLoading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    paddingBottom: 10,
  },
  myLocationButtonWrapper: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 2,
  },
  myLocationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.level1,
    elevation: 5,
  },
});

export default MapScreen;
