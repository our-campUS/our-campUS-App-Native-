import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
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

import PinIcon from '../../../assets/icons/common/pin.svg';

const MapSearchResultScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { keyword } = route.params || {};

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
      >
        {/* 검색 결과 핀 */}
        {SEARCH_RESULTS.map((item) => (
          <NaverMapMarkerOverlay
            key={item.id}
            latitude={item.latitude}
            longitude={item.longitude}
            caption={{ text: item.name }}
            anchor={{ x: 0.5, y: 1 }}
            onTap={() => console.log(`${item.name} 클릭됨`)}
          />
        ))}
      </NaverMapView>

      <View style={[styles.topOverlay, { paddingTop: insets.top }]}>
        <SearchBar
          value={keyword}
          placeholder="검색어를 입력하세요"
          onBackPress={() => navigation.goBack()}
          onPress={() => navigation.goBack()}
        />
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.handleBarWrapper}>
          <View style={styles.handleBar} />
        </View>

        <FlatList
          data={SEARCH_RESULTS}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <StoreListItem
              item={item}
              onPress={() => console.log('가게 상세로 이동')}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    ...theme.shadows.level2,
  },
  handleBarWrapper: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  handleBar: {
    width: 50,
    height: 3,
    backgroundColor: colors.gray[300],
    borderRadius: 48,
  },
});

export default MapSearchResultScreen;
