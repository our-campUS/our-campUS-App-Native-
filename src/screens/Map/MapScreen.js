import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { NaverMapView } from '@mj-studio/react-native-naver-map';
import SearchBar from '../../components/SearchBar';
import {
  request,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';

const MapScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'ios') {
          const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          if (result === RESULTS.BLOCKED) {
            console.log('iOS: 권한이 거부되었습니다.');
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
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('MapSearchScreen')}
        >
          <View pointerEvents="none">
            <SearchBar placeholder="원하는 제휴를 검색하세요" />
          </View>
        </TouchableOpacity>
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
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    zIndex: 10,
  },
});

export default MapScreen;
