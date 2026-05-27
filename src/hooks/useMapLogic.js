import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Keyboard } from 'react-native';
import useLocation, { DEFAULT_LOCATION } from './useLocation';
import useToastStore from '../store/toastStore';

const LAT_OFFSET_LIST = 0.0025;
const LAT_OFFSET_ITEM = 0.001;

import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getAddressFromCoords,
  getPartnerships,
  getMapMarkers,
  getPartnershipDetail,
  getPlacesSearchInfo,
  getPlaceStatus,
} from '../api/place';
import { useFocusEffect } from '@react-navigation/native';

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
  const { userLocation, requestAndGetLocation } = useLocation();
  const showToast = useToastStore((state) => state.showToast);

  const lastCameraRef = useRef({
    latitude: DEFAULT_LOCATION.latitude,
    longitude: DEFAULT_LOCATION.longitude,
  });
  useFocusEffect(
    useCallback(() => {
      if (searchKeyword || selectedCategory) {
        fetchPartnershipList(false);
      }
    }, [searchKeyword, selectedCategory]) // 의존성 배열 확인
  );

  // --- 데이터 가공 헬퍼 ---
  const processSearchData = async (rawData) => {
    if (!rawData) return [];

    const processedData = rawData.map((item) => {
      const targetId = item.placeId || item.id;
      const existingPartner = mapMarkers.find((m) => m.placeId === targetId);

      const hasPartnership = item.partnerships && item.partnerships.length > 0;
      const extractedPostId = hasPartnership
        ? item.partnerships[0]?.postId
        : item.postId;

      return {
        ...item,

        backendPlaceId: item.placeId || null,
        placeId: targetId || `temp_${Date.now()}_${Math.random()}`,
        name: item.placeName || item.name || '이름 없음',
        address: item.address || '',
        category: item.placeCategory || item.category || '기타',
        imgUrls: item.imgUrls || [],
        latitude: item.coordinate?.latitude || item.latitude || 0,
        longitude: item.coordinate?.longitude || item.longitude || 0,
        type: existingPartner || item.partnerTitle ? 'PARTNER' : 'DEFAULT',
        partnerTitle: item.partnerTitle,
        postId: extractedPostId,
        partnerships: item.partnerships || [],
        ...existingPartner,
        isLiked: item.isLiked,
      };
    });

    const enrichedData = await Promise.all(
      processedData.map(async (item) => {
        try {
          const status = await getPlaceStatus(
            item.placeId,
            item.latitude,
            item.longitude
          );

          return {
            ...item,
            isLiked:
              item.isLiked !== undefined
                ? item.isLiked
                : status
                ? status.isLiked
                : false,
            isPartner: status ? status.isPartnership : item.isPartner,
          };
        } catch (err) {
          console.warn(`아이템 처리 중 에러: ${item.name}`);
          return item; // 에러나면 기본 정보만 반환
        }
      })
    );

    return enrichedData;
  };

  const updatePlaceState = (oldPlaceId, newPlaceData) => {
    setPartnerships((prev) =>
      prev.map((item) => {
        if (item.placeId === oldPlaceId) {
          return { ...item, ...newPlaceData }; // 덮어쓰기
        }
        return item;
      })
    );

    setMapMarkers((prev) =>
      prev.map((item) => {
        if (item.placeId === oldPlaceId) {
          return { ...item, ...newPlaceData };
        }
        return item;
      })
    );

    if (selectedStoreDetail && selectedStoreDetail.placeId === oldPlaceId) {
      setSelectedStoreDetail((prev) => ({ ...prev, ...newPlaceData }));
    }
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
              response.data.map((item) => ({ ...item, type: 'PARTNER' }))
            );
          }
        } else {
          const rawData = await getPlacesSearchInfo(
            selectedCategory.label,
            lat,
            lng
          );

          newData = await processSearchData(rawData);
        }
      }
      // B. 키워드 검색
      else if (searchKeyword) {
        if (isLoadMore) {
          setLoading(false);
          return;
        }

        const rawData = await getPlacesSearchInfo(searchKeyword, lat, lng);
        newData = await processSearchData(rawData);
      }

      // 거리순 정렬
      newData.sort((a, b) => {
        const distA = (a.latitude - lat) ** 2 + (a.longitude - lng) ** 2;
        const distB = (b.latitude - lat) ** 2 + (b.longitude - lng) ** 2;
        return distA - distB;
      });

      // 상태 업데이트
      if (!isLoadMore) {
        const uniqueMarkers = Array.from(
          new Map(newData.map((item) => [item.placeId, item])).values()
        );
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
          latitude: newData[0].latitude - LAT_OFFSET_LIST,
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
      const { searchType, keyword, selectedLocation, category } = route.params;
      if (searchType === 'CATEGORY' && category) {
        setSelectedCategory(category);
        setSearchKeyword(null);
        setSelectedMarkerId(null);
      } else if (searchType === 'KEYWORD' && keyword) {
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
          partnerTitle: selectedLocation.partnerTitle,
          partnerships: selectedLocation.partnerships || [],
          postId: selectedLocation.postId,
        };

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
            const detail = await getPartnershipDetail(
              selectedLocation.postId,
              selectedLocation.latitude,
              selectedLocation.longitude
            );

            if (detail) {
              setSelectedStoreDetail({
                ...detail,
                placeId: locationData.placeId,
              });
            } else {
              setSelectedStoreDetail(locationData);
            }
          } else {
            setSelectedStoreDetail(locationData);
          }
        };

        fetchDetailIfNeeded();

        mapRef.current?.animateCameraTo({
          latitude: selectedLocation.latitude - LAT_OFFSET_ITEM,
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
    const { latitude, longitude, minLat, maxLat, minLng, maxLng } = e;
    lastCameraRef.current = { latitude, longitude };

    const addressData = await getAddressFromCoords(latitude, longitude);
    if (addressData) setCurrentAddress(addressData.text);

    if (searchKeyword || selectedCategory) return;

    try {
      const markers = await getMapMarkers(minLat, maxLat, minLng, maxLng);
      if (markers?.length > 0) {
        setMapMarkers(
          markers.map((item) => ({
            ...item,
            type: 'PARTNER',
            backendPlaceId: item.placeId || null,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePinPress = async (item) => {
    setSelectedMarkerId(item.placeId);

    if (item.postId) {
      const { latitude, longitude } = lastCameraRef.current;
      const detail = await getPartnershipDetail(
        item.postId,
        latitude,
        longitude
      );
      if (detail) {
        setSelectedStoreDetail({
          backendPlaceId: item.backendPlaceId || item.placeId || null,
          isLiked: item.isLiked,
          ...detail,
          placeId: item.placeId,
          partnerships: item.partnerships,
        });
      }
    } else {
      setSelectedStoreDetail(item);
    }
  };

  const handleMapTap = () => {
    setSelectedMarkerId(null);
    setSelectedStoreDetail(null);
  };

  const handleReset = () => {
    Keyboard.dismiss();
    setSelectedMarkerId(null);
    setSelectedCategory(null);
    setSearchKeyword(null);
    setSelectedStoreDetail(null);
    setPartnerships([]);
  };

  const handleCurrentLocation = async () => {
    const location = await requestAndGetLocation();

    if (!location) {
      showToast('위치 권한이 없어 현재 위치 기준으로 볼 수 없어요', 'black');
      return;
    }

    mapRef.current?.animateCameraTo({
      latitude: location.latitude,
      longitude: location.longitude,
      zoom: 16,
      duration: 500,
    });
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
      userLocation,
    },
    actions: {
      setSelectedMarkerId,
      setSelectedCategory,
      setSearchKeyword,
      fetchPartnershipList,
      handleCameraIdle,
      handlePinPress,
      handleMapTap,
      handleReset,
      handleCurrentLocation,
      updatePlaceState,
    },
    displayedMarkers,
    navigation,
  };
};
