import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  NaverMapView,
  NaverMapMarkerOverlay,
} from '@mj-studio/react-native-naver-map';
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SEARCH_RESULTS } from '../../constants/MapData';
import BottomSheet from '../../components/map/BottomSheet';
import MapPin from '../../components/common/MapPin';

const MapScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  const screenHeight = Dimensions.get('window').height;
  const sheetMaxHeight = screenHeight * 0.9;

  const getPinSize = (type) => (type === 'SELECTED' ? 56 : 44);

  const displayedMarkers = selectedMarkerId
    ? SEARCH_RESULTS.filter((item) => item.id === selectedMarkerId)
    : SEARCH_RESULTS;

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <NaverMapView
        style={{ flex: 1 }}
        initialCamera={{ latitude: 37.5665, longitude: 126.978, zoom: 16 }}
        isShowLocationButton={true}
        onTapMap={() => setSelectedMarkerId(null)}
      >
        {SEARCH_RESULTS.map((item) => {
          let pinType = 'DEFAULT';
          if (item.id === selectedMarkerId) pinType = 'SELECTED';
          else if (item.type === 'PARTNER') pinType = 'PARTNER';

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
          styles.overlay,
          {
            paddingTop:
              Platform.OS === 'android' ? insets.top + 10 : insets.top,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('MapSearchScreen')}
        >
          <View pointerEvents="none">
            <SearchBar placeholder="원하는 제휴를 검색하세요" />
          </View>
        </TouchableOpacity>
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
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
  },
});

export default MapScreen;
