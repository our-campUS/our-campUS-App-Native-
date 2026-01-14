import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Dimensions,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {
  NaverMapView,
  NaverMapMarkerOverlay,
} from '@mj-studio/react-native-naver-map';
import Geolocation from '@react-native-community/geolocation';
import SearchBar from '../../components/SearchBar';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SEARCH_RESULTS } from '../../constants/MapData';
import BottomSheet from '../../components/map/BottomSheet';
import MapPin from '../../components/common/MapPin';
import theme from '../../style';

import CategoryList from '../../components/map/CategoryList';
import LocationIcon from '../../../assets/icons/location.svg';
import { getAddressFromCoords, getPartnerships } from '../../api/place';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const HEIGHT_LIST = SCREEN_HEIGHT * 0.45;
const HEIGHT_ITEM = 280;

const MapScreen = ({ route }) => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const insets = useSafeAreaInsets();

  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [partnerships, setPartnerships] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListEnd, setIsListEnd] = useState(false);

  const isCategoryVisible = !searchKeyword && !selectedCategory;
  const categoryBarHeight = isCategoryVisible ? 60 : 0;

  const screenHeight = Dimensions.get('window').height;
  const topHeaderHeight = insets.top + 60 + 20;
  const sheetMaxHeight = screenHeight - topHeaderHeight - categoryBarHeight;
  const sheetHeightAnimated = useRef(new Animated.Value(HEIGHT_LIST)).current;

  useEffect(() => {
    if (route.params) {
      const { searchType, keyword, selectedLocation } = route.params;

      if (searchType === 'KEYWORD' && keyword) {
        setSearchKeyword(keyword);
        setSelectedCategory(null);
        setSelectedMarkerId(null);
        const firstResult = SEARCH_RESULTS.find(
          (item) =>
            item.name.includes(keyword) || item.address.includes(keyword)
        );
        if (firstResult) {
          mapRef.current?.animateCameraTo({
            latitude: firstResult.latitude,
            longitude: firstResult.longitude,
            zoom: 15,
            duration: 500,
          });
        }
      } else if (searchType === 'LOCATION' && selectedLocation) {
        setSearchKeyword(selectedLocation.name);
        setSelectedCategory(null);
        setSelectedMarkerId(selectedLocation.id);

        mapRef.current?.animateCameraTo({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          zoom: 16,
          duration: 500,
        });
      }
    }
  }, [route.params]);

  const fetchPartnershipList = async (isLoadMore = false) => {
    if (loading) return;
    if (isLoadMore && isListEnd) return;

    setLoading(true);

    const currentLat = 37.5665;
    const currentLng = 126.978;

    const cursorToSend = isLoadMore ? nextCursor : null;

    const response = await getPartnerships({
      lat: currentLat,
      lng: currentLng,
      cursor: cursorToSend,
      size: 5,
    });

    if (response && response.code === 200) {
      const newData = response.data;

      if (newData.length === 0) {
        setIsListEnd(true);
      } else {
        const lastItem = newData[newData.length - 1];
        const newCursor = lastItem.placeId;

        setNextCursor(newCursor);

        if (isLoadMore) {
          setPartnerships((prev) => [...prev, ...newData]);
        } else {
          setPartnerships(newData);
          setIsListEnd(false);
        }
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPartnershipList(false);
  }, []);

  const getPinSize = (type) => (type === 'SELECTED' ? 56 : 44);

  const displayedMarkers = useMemo(() => {
    let sourceData = partnerships;

    if (selectedMarkerId) {
      return sourceData.filter((item) => item.placeId === selectedMarkerId);
    }

    if (searchKeyword) {
      return sourceData.filter(
        (item) =>
          item.name.includes(searchKeyword) ||
          (item.address && item.address.includes(searchKeyword))
      );
    }

    if (selectedCategory) {
      return sourceData.filter(
        (item) =>
          item.category && item.category.includes(selectedCategory.label)
      );
    }

    return sourceData;
  }, [selectedMarkerId, selectedCategory, searchKeyword, partnerships]);

  const handleReset = () => {
    setSelectedMarkerId(null);
    setSelectedCategory(null);
    setSearchKeyword(null);
  };

  const handleCurrentLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            '권한 거부',
            '위치 권한을 허용해야 현재 위치를 찾을 수 있습니다.'
          );
          return;
        }
      }
      mapRef.current?.setLocationTrackingMode('Follow');
    } catch (e) {
      console.error(e);
      Alert.alert('오류', '현위치로 이동할 수 없습니다.');
    }
  };

  const handleCameraIdle = async (e) => {
    const { latitude, longitude } = e;

    const addressData = await getAddressFromCoords(latitude, longitude);

    if (addressData) {
      setCurrentAddress(addressData.text);
      console.log('현재 주소:', addressData.text);
    }
  };

  const buttonOpacity = sheetHeightAnimated.interpolate({
    inputRange: [HEIGHT_LIST, HEIGHT_LIST + 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const buttonTranslateY = sheetHeightAnimated.interpolate({
    inputRange: [HEIGHT_LIST, sheetMaxHeight],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <NaverMapView
        ref={mapRef}
        style={{ flex: 1 }}
        onCameraIdle={handleCameraIdle}
        initialCamera={{ latitude: 37.5665, longitude: 126.978, zoom: 16 }}
        isShowLocationButton={false}
        isShowZoomControls={false}
        onTapMap={handleReset}
      >
        {displayedMarkers.map((item) => {
          const isVisible = displayedMarkers.some(
            (marker) => marker.id === item.id
          );
          let pinType = 'DEFAULT';
          if (item.placeId === selectedMarkerId) pinType = 'SELECTED';
          else if (item.type === 'PARTNER') pinType = 'PARTNER';

          const pinSize = getPinSize(pinType);

          return (
            <NaverMapMarkerOverlay
              key={item.placeId}
              latitude={item.latitude}
              longitude={item.longitude}
              width={pinSize}
              height={pinSize}
              anchor={{ x: 0.5, y: pinType === 'SELECTED' ? 1 : 0.5 }}
              onTap={() => setSelectedMarkerId(item.placeId)}
              caption={{ text: item.name }}
              isHidden={!isVisible}
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
              Platform.OS === 'android' ? insets.top + 20 : insets.top + 10,
          },
        ]}
      >
        {searchKeyword ? (
          <SearchBar
            value={searchKeyword}
            onPress={() => navigation.navigate('MapSearchScreen')}
            placeholder={currentAddress || '원하는 제휴를 검색하세요'}
            onBackPress={handleReset}
            onClearPress={handleReset}
            showSoftInputOnFocus={false}
          />
        ) : selectedCategory ? (
          <SearchBar
            value={selectedCategory.label}
            placeholder={currentAddress || '원하는 제휴를 검색하세요'}
            onBackPress={handleReset}
            onClearPress={handleReset}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              navigation.navigate('MapSearchScreen');
            }}
          >
            <View pointerEvents="none">
              <SearchBar placeholder="원하는 제휴를 검색하세요" />
            </View>
          </TouchableOpacity>
        )}

        {!selectedCategory && !searchKeyword && (
          <CategoryList
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setSelectedMarkerId(null);
            }}
          />
        )}
      </View>

      <Animated.View
        style={[
          styles.myLocationButtonWrapper,
          {
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
          },
        ]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={handleCurrentLocation}
          activeOpacity={0.8}
        >
          <LocationIcon width={24} height={24} color={theme.colors.textDim} />
        </TouchableOpacity>
      </Animated.View>

      <BottomSheet
        displayedMarkers={displayedMarkers}
        selectedMarkerId={selectedMarkerId}
        onItemPress={(id) => setSelectedMarkerId(id)}
        maxHeight={sheetMaxHeight}
        sheetHeightAnimated={sheetHeightAnimated}
        onEndReached={() => fetchPartnershipList(true)}
        isLoading={loading}
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
    zIndex: 999,
    paddingBottom: 10,
  },
  myLocationButtonWrapper: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    right: 20,
    zIndex: 2,
  },
  myLocationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.level1,
    elevation: 5,
  },
});

export default MapScreen;
