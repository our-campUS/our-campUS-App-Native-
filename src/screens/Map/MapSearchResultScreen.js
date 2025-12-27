import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Platform,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import {
  NaverMapView,
  NaverMapMarkerOverlay,
} from '@mj-studio/react-native-naver-map';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StoreListItem from '../../components/common/StoreListItem';
import SearchBar from '../../components/SearchBar';
import { SEARCH_RESULTS } from '../../constants/MapData';

import theme from '../../style';
import colors from '../../style/colors';

import MapPin from '../../components/common/MapPin';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const HEIGHT_MAX = SCREEN_HEIGHT * 0.9;
const HEIGHT_LIST = SCREEN_HEIGHT * 0.55;
const HEIGHT_ITEM = 280;

const MapSearchResultScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { keyword } = route.params || {};

  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const sheetHeight = useRef(new Animated.Value(HEIGHT_LIST)).current;

  const getPinSize = (type) => {
    if (type === 'SELECTED') return 56;
    return 44;
  };

  const displayedMarkers = selectedMarkerId
    ? SEARCH_RESULTS.filter((item) => item.id === selectedMarkerId)
    : SEARCH_RESULTS;

  useEffect(() => {
    if (selectedMarkerId) {
      Animated.spring(sheetHeight, {
        toValue: HEIGHT_ITEM,
        useNativeDriver: false,
        friction: 8,
      }).start();
    } else {
      Animated.spring(sheetHeight, {
        toValue: HEIGHT_LIST,
        useNativeDriver: false,
      }).start();
    }
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (evt, gestureState) => {
        const baseHeight = selectedMarkerId ? HEIGHT_ITEM : HEIGHT_LIST;
        let newHeight = baseHeight - gestureState.dy;

        if (newHeight > HEIGHT_MAX) newHeight = HEIGHT_MAX;
        if (newHeight < HEIGHT_ITEM) newHeight = HEIGHT_ITEM;

        sheetHeight.setValue(newHeight);
      },

      onPanResponderRelease: (evt, gestureState) => {
        const dy = gestureState.dy;
        if (dy < -50) {
          Animated.spring(sheetHeight, {
            toValue: HEIGHT_MAX,
            useNativeDriver: false,
          }).start();
        } else if (dy > 50) {
          Animated.spring(sheetHeight, {
            toValue: selectedMarkerId ? HEIGHT_ITEM : HEIGHT_LIST,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(sheetHeight, {
            toValue: selectedMarkerId ? HEIGHT_ITEM : HEIGHT_LIST,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

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

      <Animated.View style={[styles.bottomSheet, { height: sheetHeight }]}>
        <View {...panResponder.panHandlers} style={styles.handleBarWrapper}>
          <View style={styles.handleBar} />
        </View>

        <FlatList
          data={displayedMarkers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <StoreListItem
              item={item}
              onPress={() => setSelectedMarkerId(item.id)}
            />
          )}
          scrollEnabled={true}
        />
      </Animated.View>
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
