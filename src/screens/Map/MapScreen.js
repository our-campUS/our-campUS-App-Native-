import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NaverMapView } from '@mj-studio/react-native-naver-map';

const MapScreen = () => {
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
