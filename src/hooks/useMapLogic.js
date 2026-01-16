import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getAddressFromCoords,
  getPartnerships,
  getMapMarkers,
  getPartnershipDetail,
  getPlacesByKeyword,
  getPlacesSearch,
} from '../api/place';

export const useMapLogic = (mapRef) => {
  const navigation = useNavigation();
  const route = useRoute();

  // --- 상태 관리 (State) ---
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

  const lastCameraRef = useRef({
    latitude: 37.5570389272802,
    longitude: 126.960204232592,
  });

  // --- 데이터 가공 헬퍼 ---
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

  // --- API 호출 로직 ---
  const fetchPartnershipList = async (isLoadMore = false) => {
    if (!searchKeyword && !selectedCategory) return;
    if (loading) return;
    if (isLoadMore && isListEnd) return;

    setLoading(true);

    try {
      const { latitude: lat, longitude: lng } = lastCameraRef.current;
      let newData = [];

      // A. 카테고리 검색
      if (selectedCategory) {
        if (isLoadMore) {
          setLoading(false);
          return;
        }

        if (selectedCategory.id === 'PARTNER') {
          const response = await getPartnerships({
            lat,
            lng,
            cursor: isLoadMore ? nextCursor : null,
            size: 20,
          });

          if (response?.code === 200) {
            newData = processSearchData(response.data).map((item) => ({
              ...item,
              type: 'PARTNER',
            }));
          }
        } else {
          const rawData = await getPlacesSearch(
            selectedCategory.label,
            lat,
            lng
          );
          newData = processSearchData(rawData);
        }
      }
      // B. 키워드 검색
      else if (searchKeyword) {
        if (isLoadMore) {
          setLoading(false);
          return;
        }
        const rawData = await getPlacesSearch(searchKeyword, lat, lng);
        newData = processSearchData(rawData);
      }
      // C. 일반 리스트
      else {
        const response = await getPartnerships({
          lat: 37.5570389272802,
          lng: 126.960204232592,
          cursor: isLoadMore ? nextCursor : null,
          size: 5,
        });
        if (response?.code === 200) {
          newData = response.data.map((item) => ({ ...item, type: 'PARTNER' }));
        }
      }

      // 상태 업데이트
      if (!isLoadMore) setMapMarkers(newData);

      if (newData.length === 0) {
        if (!isLoadMore) setPartnerships([]);
        setIsListEnd(true);
      } else {
        if (isLoadMore) {
          setPartnerships((prev) => [...prev, ...newData]);
          if (!selectedCategory && !searchKeyword)
            setNextCursor(newData[newData.length - 1].placeId);
          else setIsListEnd(true);
        } else {
          setPartnerships(newData);
          setIsListEnd(!!(selectedCategory || searchKeyword));
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

  // --- 이벤트 핸들러 ---

  // 파라미터(다른 화면에서 넘어왔을 때) 처리
  useEffect(() => {
    if (route.params) {
      const { searchType, keyword, selectedLocation } = route.params;
      if (searchType === 'KEYWORD' && keyword) {
        setSearchKeyword(keyword);
        setSelectedCategory(null);
        setSelectedMarkerId(null);
      } else if (searchType === 'LOCATION' && selectedLocation) {
        const locationData = {
          placeId: selectedLocation.placeId,
          name: selectedLocation.name,
          address: selectedLocation.address || '',
          category: selectedLocation.category || '기타',
          imgUrls: selectedLocation.imgUrls || [],
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          type: selectedLocation.isPartner ? 'PARTNER' : 'DEFAULT',
          partnerTitle: selectedLocation.isPartner
            ? selectedLocation.partnerTag
            : undefined,

          partnerships: selectedLocation.partnerships || [],
          postId: selectedLocation.postId,
        };

        setMapMarkers((prev) => {
          const exists = prev.find((m) => m.placeId === locationData.placeId);
          if (exists) return prev;
          return [locationData, ...prev];
        });
        setSearchKeyword(selectedLocation.name);
        setSelectedMarkerId(selectedLocation.placeId);
        setSelectedStoreDetail(selectedLocation);

        const fetchDetailIfNeeded = async () => {
          if (selectedLocation.postId) {
            const detail = await getPartnershipDetail(
              selectedLocation.postId,
              selectedLocation.latitude,
              selectedLocation.longitude
            );
            if (detail) {
              setSelectedStoreDetail(detail);
            }
          } else if (selectedLocation.partnerships?.length > 0) {
            setSelectedStoreDetail(locationData);
          } else {
            setSelectedStoreDetail(locationData);
          }
        };

        fetchDetailIfNeeded();

        mapRef.current?.animateCameraTo({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          zoom: 16,
          duration: 500,
        });
      }
    }
  }, [route.params]);

  // 검색 조건 변경 시 리셋
  useEffect(() => {
    if (searchKeyword || selectedCategory) {
      setPartnerships([]);
      setIsListEnd(false);
      setNextCursor(null);
      fetchPartnershipList(false);
    } else {
      setPartnerships([]);
    }
  }, [searchKeyword, selectedCategory]);

  const handleCameraIdle = async (e) => {
    const { latitude, longitude, zoom } = e;
    lastCameraRef.current = { latitude, longitude };

    const addressData = await getAddressFromCoords(latitude, longitude);
    if (addressData) setCurrentAddress(addressData.text);

    if (searchKeyword || selectedCategory) return;

    if (mapRef.current) {
      try {
        const zoomFactor = Math.pow(2, 16 - (zoom || 16));
        const delta = 0.01 * zoomFactor;
        const markers = await getMapMarkers(
          latitude - delta,
          latitude + delta,
          longitude - delta,
          longitude + delta
        );
        if (markers) {
          setMapMarkers(markers.map((item) => ({ ...item, type: 'PARTNER' })));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePinPress = async (item) => {
    setSelectedMarkerId(item.placeId);
    setSearchKeyword(null);
    setSelectedCategory(null);
    setPartnerships([]);

    if (item.postId) {
      const { latitude, longitude } = lastCameraRef.current;
      const detail = await getPartnershipDetail(
        item.postId,
        latitude,
        longitude
      );
      if (detail) setSelectedStoreDetail(detail);
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

  // const handleCurrentLocation = async () => {
  //   try {
  //     // 1. [Android] 권한 요청 로직 강화
  //     if (Platform.OS === 'android') {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //       );
  //       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //         Alert.alert('알림', '위치 권한을 허용해주세요.');
  //         return;
  //       }
  //     }

  //     // 2. [iOS/Android 공통] MapRef 유효성 체크
  //     if (!mapRef.current) {
  //         console.log("Map ref is not ready");
  //         return;
  //     }

  //     // 3. 트래킹 모드 설정 ('Follow'로 설정하면 현위치로 이동하며 따라다님)
  //     // @mj-studio/react-native-naver-map 라이브러리 방식
  //     mapRef.current.setLocationTrackingMode('Follow');

  //   } catch (e) {
  //     console.error('handleCurrentLocation Error:', e);
  //   }
  // };

  const handleCurrentLocation = () => {
    const TARGET_LAT = 37.5570389272802;
    const TARGET_LNG = 126.960204232592;

    mapRef.current?.animateCameraTo({
      latitude: TARGET_LAT,
      longitude: TARGET_LNG,
      zoom: 16,
      duration: 500,
    });

    console.log('📍 임의 설정한 위치로 이동했습니다.');
  };

  // --- 5. 계산된 데이터 (Displayed Data) ---
  const displayedMarkers = useMemo(() => {
    if (selectedStoreDetail && selectedMarkerId) return [selectedStoreDetail];
    if (searchKeyword || selectedCategory) return partnerships;
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

  return {
    state: {
      selectedMarkerId,
      selectedCategory,
      searchKeyword,
      currentAddress,
      partnerships,
      mapMarkers,
      loading,
    },
    actions: {
      setSelectedMarkerId,
      setSelectedCategory,
      setSearchKeyword,
      fetchPartnershipList,
      handleCameraIdle,
      handlePinPress,
      handleReset,
      handleCurrentLocation,
    },
    displayedMarkers,
    navigation,
  };
};
