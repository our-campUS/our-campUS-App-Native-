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
  getPlacesSearchInfo,
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
  const processSearchData = async (rawData, shouldFetchDetails = false) => {
    if (!rawData) return [];

    const processedData = rawData.map((item) => {
      const targetId = item.placeKey || item.placeId || item.id;
      const existingPartner = mapMarkers.find((m) => m.placeId == targetId);

      const hasPartnership = item.partnerships && item.partnerships.length > 0;
      const extractedPostId = hasPartnership
        ? item.partnerships[0]?.postId
        : item.postId;

      return {
        ...item,
        placeId: targetId || `temp_${Date.now()}_${Math.random()}`,
        name: item.placeName || item.name || '이름 없음',
        address: item.address || '',
        category: item.category || '기타',
        imgUrls: item.imgUrls || [],
        latitude: item.coordinate?.latitude || item.latitude || 0,
        longitude: item.coordinate?.longitude || item.longitude || 0,
        type: existingPartner || item.partnerTitle ? 'PARTNER' : 'DEFAULT',
        partnerTitle: item.partnerTitle,
        postId: extractedPostId,
        partnerships: item.partnerships || [],
        ...existingPartner,
      };
    });
    if (shouldFetchDetails) {
      const detailedData = await Promise.all(
        processedData.map(async (item) => {
          if (item.postId) {
            try {
              console.log(
                `🔍 제휴 상세 조회: ${item.name} (postId: ${item.postId})`
              );
              const detail = await getPartnershipDetail(
                item.postId,
                item.latitude,
                item.longitude
              );

              if (detail) {
                console.log(`✅ 상세 정보 조회 성공: ${item.name}`);
                return {
                  ...detail,
                  placeId: detail.placeId,
                };
              }
            } catch (error) {
              console.error(`상세 정보 조회 실패: ${item.name}`, error);
            }
          }
          return item;
        })
      );
      return detailedData;
    }

    return processedData;
  };

  // --- API 호출 로직 수정 ---
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
            newData = await processSearchData(
              response.data.map((item) => ({ ...item, type: 'PARTNER' })),
              true
            );
          }
        } else {
          const rawData = await getPlacesSearch(
            selectedCategory.label,
            lat,
            lng
          );

          newData = await processSearchData(rawData, true);
        }
      }
      // B. 키워드 검색
      else if (searchKeyword) {
        if (isLoadMore) {
          setLoading(false);
          return;
        }

        console.log('🔎 키워드 검색 시작:', searchKeyword);
        const rawData = await getPlacesSearchInfo(searchKeyword, lat, lng);

        console.log('📦 원본 검색 결과:', rawData);
        console.log('📦 첫 번째 항목:', rawData?.[0]);

        newData = await processSearchData(rawData, true);

        console.log('📦 처리된 결과:', newData);
        console.log('📦 첫 번째 처리된 항목:', newData?.[0]);
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
          newData = await processSearchData(
            response.data.map((item) => ({ ...item, type: 'PARTNER' })),
            true
          );
        }
      }

      // 상태 업데이트
      if (!isLoadMore) {
        // 중복 제거
        const uniqueMarkers = Array.from(
          new Map(newData.map((item) => [item.placeId, item])).values()
        );

        console.log('📍 새 마커 설정:', uniqueMarkers.length, '개');
        setMapMarkers(uniqueMarkers);
      }

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
        console.log('1️⃣ 이전 화면에서 넘겨온 데이터:', selectedLocation);

        const locationData = {
          placeId: selectedLocation.placeId,
          name: selectedLocation.name,
          address: selectedLocation.address || '',
          category: selectedLocation.category || '기타',
          imgUrls: selectedLocation.imgUrls || [],
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          type: selectedLocation.isPartner ? 'PARTNER' : 'DEFAULT',
          partnerTitle: selectedLocation.partnerTitle,
          partnerships: selectedLocation.partnerships || [],
          postId: selectedLocation.postId,
        };

        console.log('2️⃣ 생성된 locationData:', locationData);

        setMapMarkers((prev) => {
          const filtered = prev.filter(
            (m) => m.placeId !== locationData.placeId
          );
          return [locationData, ...filtered];
        });
        setSearchKeyword(selectedLocation.name);
        setSelectedMarkerId(selectedLocation.placeId);
        setSelectedStoreDetail(selectedLocation);

        const fetchDetailIfNeeded = async () => {
          if (selectedLocation.postId) {
            console.log(
              '📍 제휴글 상세 정보 조회 중...',
              selectedLocation.postId
            );

            const detail = await getPartnershipDetail(
              selectedLocation.postId,
              selectedLocation.latitude,
              selectedLocation.longitude
            );

            if (detail) {
              console.log('✅ 상세 정보 조회 성공:', detail);
              setSelectedStoreDetail({
                ...detail,
                placeId: detail.placeId, // 원본 placeId 명시적 유지
              });
            } else {
              console.log('⚠️ 상세 정보 조회 실패, 기본 데이터 사용');
              setSelectedStoreDetail(locationData);
            }
          } else if (selectedLocation.partnerships?.length > 0) {
            console.log('⚠️ postId 없음, 검색 결과의 기본 이미지 사용');
            setSelectedStoreDetail(locationData);
          } else {
            console.log('📌 일반 장소');
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
      setMapMarkers([]);
      setIsListEnd(false);
      setNextCursor(null);
      setSelectedMarkerId(null);
      fetchPartnershipList(false);
    } else {
      setPartnerships([]);
      setMapMarkers([]);
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
      if (detail) {
        setSelectedStoreDetail({
          ...detail,
          placeId: detail.placeId,
        });
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
    setMapMarkers([]);
    setPartnerships([]);
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
    let markers = [];

    if (selectedStoreDetail && selectedMarkerId) {
      markers = [selectedStoreDetail];
    } else if (searchKeyword || selectedCategory) {
      markers = partnerships;
    } else if (selectedMarkerId) {
      const found = mapMarkers.find((m) => m.placeId === selectedMarkerId);
      markers = found ? [found] : [];
    }

    return Array.from(
      new Map(markers.map((item) => [item.placeId, item])).values()
    );
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
