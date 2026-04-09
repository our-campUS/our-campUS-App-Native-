import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

export const DEFAULT_LOCATION = {
  latitude: 37.5044,
  longitude: 126.9568,
};

const useLocation = () => {
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);

  // 내 위치 버튼 클릭 시 호출
  // 권한 동의 → 실제 위치 반환 (위치도 상태에 저장)
  // 권한 거부 → null 반환 (호출부에서 토스트 처리)
  const requestAndGetLocation = useCallback(async () => {
    const permission = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    });

    const result = await request(permission);
    if (result !== RESULTS.GRANTED) return null;

    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(location);
          resolve(location);
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  // 이미 권한이 있을 때 조용히 위치만 갱신 (화면 진입 시 사용)
  const getLocationIfPermitted = useCallback(() => {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(location);
          resolve(location);
        },
        () => {
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
      );
    });
  }, []);

  return { userLocation, requestAndGetLocation, getLocationIfPermitted };
};

export default useLocation;
