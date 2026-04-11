import { useCallback } from 'react';
import { Platform } from 'react-native';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import useLocationStore, { DEFAULT_LOCATION } from '../store/locationStore';

export { DEFAULT_LOCATION };

const LOCATION_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
});

const getCurrentPosition = (options) =>
  new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => resolve(null),
      options
    );
  });

const useLocation = () => {
  const userLocation = useLocationStore((state) => state.userLocation);
  const setUserLocation = useLocationStore((state) => state.setUserLocation);

  // 내 위치 버튼 클릭 시 호출
  // 권한 동의 → 실제 위치 반환 / 거부 → null 반환 (호출부에서 토스트 처리)
  const requestAndGetLocation = useCallback(async () => {
    const result = await request(LOCATION_PERMISSION);
    if (result !== RESULTS.GRANTED) return null;

    const location = await getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    });

    if (location) setUserLocation(location);
    return location;
  }, [setUserLocation]);

  // 화면 진입 시 권한이 이미 있을 때만 조용히 위치 갱신
  const getLocationIfPermitted = useCallback(async () => {
    const status = await check(LOCATION_PERMISSION);
    if (status !== RESULTS.GRANTED) return null;

    const location = await getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 60000,
    });

    if (location) setUserLocation(location);
    return location;
  }, [setUserLocation]);

  return { userLocation, requestAndGetLocation, getLocationIfPermitted };
};

export default useLocation;
