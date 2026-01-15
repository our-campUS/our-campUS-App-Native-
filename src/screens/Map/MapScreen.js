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
  Keyboard,
} from 'react-native';
import {
  NaverMapView,
  NaverMapMarkerOverlay,
} from '@mj-studio/react-native-naver-map';
import Geolocation from '@react-native-community/geolocation';
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { SEARCH_RESULTS } from '../../constants/MapData'; // (안쓰면 삭제)
import BottomSheet from '../../components/map/BottomSheet';
import MapPin from '../../components/common/MapPin';
import theme from '../../style';

import CategoryList from '../../components/map/CategoryList';
import LocationIcon from '../../../assets/icons/location.svg';
import {
  getAddressFromCoords,
  getPartnerships,
  getMapMarkers,
  getPartnershipDetail,
  getPlacesByKeyword,
  getPlacesSearch,
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
  const [selectedStoreDetail, setSelectedStoreDetail] = useState(null);

  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListEnd, setIsListEnd] = useState(false);

  // 초기값: 서울시청 (에러 방지용)
  const lastCameraRef = useRef({ latitude: 37.5665, longitude: 126.978 });

  const isCategoryVisible = !searchKeyword && !selectedCategory;

  const sheetHeightAnimated = useRef(new Animated.Value(HEIGHT_HIDDEN)).current;
  const screenHeight = Dimensions.get('window').height;
  const topHeaderHeight = insets.top + 60 + 20;
  const sheetMaxHeight = screenHeight - topHeaderHeight;

  // 초기 파라미터 진입 처리
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

  // 바텀시트 데이터 계산
  const displayedMarkers = useMemo(() => {
    if (selectedStoreDetail && selectedMarkerId) {
      return [selectedStoreDetail];
    }
    if (searchKeyword || selectedCategory) {
      return partnerships;
    }
    if (selectedMarkerId) {
      const found = mapMarkers.find((m) => m.placeId === selectedMarkerId);
      return found ? [found] : [];
    }
    return [];
  }, [
    selectedStoreDetail,
    selectedMarkerId,
    searchKeyword,
    selectedCategory,
    partnerships,
    mapMarkers,
  ]);

  // 바텀시트 애니메이션
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

  // 데이터 가공 헬퍼 함수 (중복 제거)
  const processSearchData = (rawData) => {
    if (!rawData) return [];
    return rawData.map((item) => {
      const targetId = item.placeKey || item.placeId || item.id;
      const existingPartner = mapMarkers.find((m) => m.placeId == targetId);

      return {
        ...item,
        placeId: targetId || `temp_${Math.random()}`,
        name: item.placeName || item.name || '이름 없음',
        address: item.address || '',
        category: item.category || '기타',
        imgUrls: item.imgUrls || [],

        latitude: item.coordinate?.latitude || item.latitude || 0,
        longitude: item.coordinate?.longitude || item.longitude || 0,

        type: existingPartner || item.partnerTitle ? 'PARTNER' : 'DEFAULT',

        ...existingPartner,
      };
    });
  };

  // 데이터 조회 함수
  const fetchPartnershipList = async (isLoadMore = false) => {
    // 검색어나 카테고리가 없으면 조회하지 않음
    if (!searchKeyword && !selectedCategory) return;

    if (loading) return;
    if (isLoadMore && isListEnd) return;

    setLoading(true);

    try {
      const { latitude: lat, longitude: lng } = lastCameraRef.current;
      let newData = [];

      // 1) 카테고리 검색
      if (selectedCategory) {
        if (isLoadMore) {
          setLoading(false);
          return;
        }

        const rawData = await getPlacesSearch(selectedCategory.label, lat, lng);
        newData = processSearchData(rawData);
      }
      // 2) 키워드 검색
      else if (searchKeyword) {
        if (isLoadMore) {
          setLoading(false);
          return;
        }

        const rawData = await getPlacesSearch(searchKeyword, lat, lng);
        newData = processSearchData(rawData);
      }
      // 3) (예외) 일반 리스트 조회
      else {
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
          newData = response.data.map((item) => ({ ...item, type: 'PARTNER' }));
        }
      }

      // 상태 업데이트 (여기가 빠져서 렌더링이 안 됐던 것!)
      // 1) 지도 핀 업데이트
      if (!isLoadMore) {
        setMapMarkers(newData);
      }

      // 2) 바텀시트 리스트 업데이트
      if (newData.length === 0) {
        if (!isLoadMore) setPartnerships([]);
        setIsListEnd(true);
      } else {
        if (isLoadMore) {
          setPartnerships((prev) => [...prev, ...newData]);
          if (!selectedCategory && !searchKeyword) {
            setNextCursor(newData[newData.length - 1].placeId);
          } else {
            setIsListEnd(true);
          }
        } else {
          setPartnerships(newData);
          if (selectedCategory || searchKeyword) {
            setIsListEnd(true);
          } else {
            setIsListEnd(false);
          }
        }
      }

      // 카메라 이동
      if (!isLoadMore && newData.length > 0) {
        mapRef.current?.animateCameraTo({
          latitude: newData[0].latitude,
          longitude: newData[0].longitude,
          zoom: 15,
          duration: 500,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 기타 핸들러 및 유틸
  useEffect(() => {
    if (searchKeyword || selectedCategory) {
      // 검색 조건 변경 시 리스트 초기화 후 새로 조회
      setPartnerships([]);
      setIsListEnd(false);
      setNextCursor(null);
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
    lastCameraRef.current = { latitude, longitude }; // 좌표 저장

    // 주소 업데이트
    const addressData = await getAddressFromCoords(latitude, longitude);
    if (addressData) setCurrentAddress(addressData.text);

    // 검색 중이면 자동 핀 로딩 중단
    if (searchKeyword || selectedCategory) return;

    if (mapRef.current) {
      try {
        const currentZoom = zoom || 16;
        const { latitudeDelta, longitudeDelta } = getDeltas(currentZoom);

        const minLat = latitude - latitudeDelta;
        const maxLat = latitude + latitudeDelta;
        const minLng = longitude - longitudeDelta;
        const maxLng = longitude + longitudeDelta;

        if (minLat && maxLat && minLng && maxLng) {
          const markers = await getMapMarkers(minLat, maxLat, minLng, maxLng);
          if (markers) {
            const partnersWithType = markers.map((item) => ({
              ...item,
              type: 'PARTNER',
            }));
            setMapMarkers(partnersWithType);
            console.log(`${markers.length}개의 핀 로드 완료`);
          }
        }
      } catch (err) {
        console.error('영역 계산 로직 에러:', err);
      }
    }
  };

  const handlePinPress = async (item) => {
    setSelectedMarkerId(item.placeId);
    setSearchKeyword(null);
    setSelectedCategory(null);
    setPartnerships([]);

    const { latitude, longitude } = lastCameraRef.current;

    if (item.postId) {
      const detailData = await getPartnershipDetail(
        item.postId,
        latitude,
        longitude
      );
      if (detailData) {
        setSelectedStoreDetail(detailData);
      }
    } else {
      setSelectedStoreDetail(item);
    }
  };

  const handleReset = () => {
    Keyboard.dismiss();
    setSelectedMarkerId(null);
    setSelectedCategory(null);
    setSearchKeyword(null);
    setSelectedStoreDetail(null);
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
          let pinType = 'DEFAULT';
          if (isSelected) {
            pinType = 'SELECTED';
          } else if (item.partnerTitle || item.type === 'PARTNER') {
            pinType = 'PARTNER';
          }
          const pinSize = getPinSize(pinType);

          return (
            <NaverMapMarkerOverlay
              key={item.placeId}
              latitude={item.latitude}
              longitude={item.longitude}
              width={pinSize}
              height={pinSize}
              anchor={{ x: 0.5, y: isSelected ? 1 : 0.5 }}
              onTap={() => handlePinPress(item)}
              caption={{ text: item.name }}
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
