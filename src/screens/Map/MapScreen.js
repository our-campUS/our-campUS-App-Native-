import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { NaverMapView } from '@mj-studio/react-native-naver-map';

import {
  request,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';

const MapScreen = () => {
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'ios') {
          const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          if (result === RESULTS.BLOCKED) {
            console.log('iOS: 권한이 거부되었습니다. 설정에서 허용해주세요.');
          }
        } else if (Platform.OS === 'android') {
          const result = await requestMultiple([
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
          ]);

          console.log('Android Permissions:', result);
        }
      } catch (e) {
        console.error('권한 요청 실패:', e);
      }
    };

    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <NaverMapView
        style={{ flex: 1 }}
        initialCamera={{
          latitude: 37.5665,
          longitude: 126.978,
          zoom: 16,
        }}
        isShowLocationButton={true}
      />

      <View style={styles.overlay}>
        <Text style={styles.text}>네이버 지도 테스트</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 5,
  },
  text: {
    fontWeight: 'bold',
  },
});

export default MapScreen;
