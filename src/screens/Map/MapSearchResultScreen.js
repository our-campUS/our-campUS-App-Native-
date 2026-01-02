import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import {
  NaverMapView,
  NaverMapMarkerOverlay,
} from '@mj-studio/react-native-naver-map';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SearchBar from '../../components/SearchBar';
import { SEARCH_RESULTS } from '../../constants/MapData';

import theme from '../../style';
import colors from '../../style/colors';

import MapPin from '../../components/common/MapPin';
import BottomSheet from '../../components/map/BottomSheet';

const MapSearchResultScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { keyword } = route.params || {};
  const screenHeight = Dimensions.get('window').height;
  const sheetMaxHeight = screenHeight;

  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  const getPinSize = (type) => {
    if (type === 'SELECTED') return 56;
    return 44;
  };

  const displayedMarkers = selectedMarkerId
    ? SEARCH_RESULTS.filter((item) => item.id === selectedMarkerId)
    : SEARCH_RESULTS;

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <NaverMapView
        style={styles.map}
        initialCamera={{
          latitude: 37.5665,
          longitude: 126.978,
          zoom: 15,
        }}
        isShowLocationButton={false}
        onTapMap={() => setSelectedMarkerId(null)}
      >
        {SEARCH_RESULTS.map((item) => {
          let pinType = 'DEFAULT';
          if (item.id === selectedMarkerId) {
            pinType = 'SELECTED';
          } else if (item.type === 'PARTNER') {
            pinType = 'PARTNER';
          }

          const pinSize = getPinSize(pinType);

          return (
            <NaverMapMarkerOverlay
              key={item.id}
              latitude={item.latitude}
              longitude={item.longitude}
              width={pinSize}
              height={pinSize}
              anchor={{ x: 0.5, y: pinType === 'SELECTED' ? 1 : 0.5 }}
              onTap={() => setSelectedMarkerId(item.id)}
              caption={{ text: item.name }}
            >
              <MapPin type={pinType} category={item.category} />
            </NaverMapMarkerOverlay>
          );
        })}
      </NaverMapView>

      <View
        style={[
          styles.topOverlay,
          {
            paddingTop:
              Platform.OS === 'android' ? insets.top + 10 : insets.top,
          },
        ]}
      >
        <SearchBar
          value={keyword}
          placeholder="검색어를 입력하세요"
          onBackPress={() => navigation.goBack()}
          onPress={() => navigation.goBack()}
        />
      </View>

      <BottomSheet
        displayedMarkers={displayedMarkers}
        selectedMarkerId={selectedMarkerId}
        onItemPress={(id) => setSelectedMarkerId(id)}
        maxHeight={sheetMaxHeight}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    ...theme.shadows.level2,
    overflow: 'hidden',
  },
  handleBarWrapper: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'transparent',
    width: '100%',
  },
  handleBar: {
    width: 50,
    height: 3,
    backgroundColor: colors.gray[300],
    borderRadius: 48,
  },
});

export default MapSearchResultScreen;
