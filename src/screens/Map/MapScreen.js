import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import KakaoMapWebView from '../../components/map/KakaoMapWebView';

import SearchBar from '../../components/SearchBar';
import CategoryList from '../../components/map/CategoryList';
import { normalizeCategory } from '../../constants/MapData';
import BottomSheet from '../../components/map/BottomSheet';
import LocationIcon from '../../../assets/icons/location.svg';
import LocationTooltip from '../../components/map/LocationTooltip';
import CustomToast from '../../components/CustomToast';
import theme from '../../style';
import colors from '../../style/colors';

import { useMapLogic } from '../../hooks/useMapLogic';
import { DEFAULT_LOCATION } from '../../hooks/useLocation';
import useLocationStore from '../../store/locationStore';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const HEIGHT_LIST = SCREEN_HEIGHT * 0.45;
const HEIGHT_ITEM = 280;
const HEIGHT_HIDDEN = 0;

const MapScreen = () => {
  const mapRef = useRef(null);
  const insets = useSafeAreaInsets();
  const tooltipDismissed = useLocationStore((s) => s.locationTooltipDismissed);
  const dismissTooltip = useLocationStore((s) => s.dismissLocationTooltip);

  const { state, actions, displayedMarkers, navigation } = useMapLogic(mapRef);

  const {
    selectedMarkerId,
    selectedCategory,
    searchKeyword,
    currentAddress,
    mapMarkers,
    loading,
    userLocation,
  } = state;
  const {
    setSelectedMarkerId,
    setSelectedCategory,
    fetchPartnershipList,
    handleCameraIdle,
    handlePinPress,
    handleMapTap,
    handleReset,
    handleCurrentLocation,
  } = actions;

  const sheetHeightAnimated = useRef(new Animated.Value(HEIGHT_HIDDEN)).current;
  const topHeaderHeight = insets.top + 60 + 20;
  const sheetMaxHeight = SCREEN_HEIGHT - topHeaderHeight;

  const buttonBottom = sheetHeightAnimated.interpolate({
    inputRange: [HEIGHT_HIDDEN, HEIGHT_ITEM, HEIGHT_LIST],
    outputRange: [20, HEIGHT_ITEM + 12, HEIGHT_LIST + 12],
    extrapolate: 'clamp',
  });


  useEffect(() => {
    let targetHeight = HEIGHT_HIDDEN;
    if (selectedMarkerId) targetHeight = HEIGHT_ITEM;
    else if (searchKeyword || selectedCategory) targetHeight = HEIGHT_LIST;

    Animated.spring(sheetHeightAnimated, {
      toValue: targetHeight,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [selectedMarkerId, searchKeyword, selectedCategory, sheetHeightAnimated]);


  const uniqueMarkers = useMemo(() => {
    const seen = new Set();
    return mapMarkers.filter((item) => {
      if (seen.has(item.placeId)) return false;
      seen.add(item.placeId);
      return true;
    });
  }, [mapMarkers]);

  const markersWithPinType = useMemo(() => {
    return uniqueMarkers.map((item) => {
      const isSelected = item.placeId === selectedMarkerId;
      const pinType = isSelected
        ? 'SELECTED'
        : item.partnerTitle || item.type === 'PARTNER' || item.isPartner
        ? 'PARTNER'
        : 'DEFAULT';
      const category = selectedCategory
        ? selectedCategory.id
        : normalizeCategory(item.placeCategory || item.category);
      return { ...item, pinType, category };
    });
  }, [uniqueMarkers, selectedMarkerId, selectedCategory]);

  const handleMarkerTap = useCallback(
    ({ placeId }) => {
      const item = uniqueMarkers.find(
        (m) => String(m.placeId) === String(placeId)
      );
      if (item) handlePinPress(item);
    },
    [uniqueMarkers, handlePinPress]
  );

  return (
    <View style={styles.container}>
      <KakaoMapWebView
        ref={mapRef}
        style={{ flex: 1 }}
        initialCamera={{
          latitude: DEFAULT_LOCATION.latitude,
          longitude: DEFAULT_LOCATION.longitude,
          zoom: 16,
        }}
        markers={markersWithPinType}
        onCameraIdle={handleCameraIdle}
        onMarkerTap={handleMarkerTap}
        onMapTap={handleMapTap}
      />

      {/* 상단 검색바 영역 */}
      <View
        style={[
          styles.overlay,
          {
            paddingTop:
              Platform.OS === 'android' ? insets.top + 20 : insets.top + 10,
          },
        ]}
      >
        <View>
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
              onPress={() => navigation.navigate('MapSearchScreen')}
            >
              <View pointerEvents="none">
                <SearchBar
                  placeholder={currentAddress || '원하는 제휴를 검색하세요'}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {!selectedCategory && !searchKeyword && (
          <CategoryList
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setSelectedMarkerId(null);
            }}
          />
        )}
      </View>

      {/* 현위치 버튼 + 툴팁: 항상 노출, 바텀시트와 함께 이동 */}
      <Animated.View
        style={[styles.myLocationButtonWrapper, { bottom: buttonBottom }]}
        pointerEvents="box-none"
      >
        {!tooltipDismissed && (
          <LocationTooltip
            text="내 주변 제휴를 바로 볼 수 있어요"
            onClose={dismissTooltip}
          />
        )}
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={() => {
            dismissTooltip();
            handleCurrentLocation();
          }}
          activeOpacity={0.8}
        >
            <LocationIcon width={24} height={24} color={theme.colors.textDim} />
          </TouchableOpacity>
      </Animated.View>

      {/* 바텀시트 */}
      <BottomSheet
        displayedMarkers={displayedMarkers}
        selectedMarkerId={selectedMarkerId}
        onItemPress={(id) => setSelectedMarkerId(id)}
        maxHeight={sheetMaxHeight}
        sheetHeightAnimated={sheetHeightAnimated}
        onEndReached={() => fetchPartnershipList(true)}
        isLoading={loading}
        onUpdateStore={actions.updatePlaceState}
        userLocation={userLocation}
      />
      <CustomToast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    right: 20,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  myLocationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.common.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.level1,
    elevation: 5,
  },
});

export default MapScreen;
