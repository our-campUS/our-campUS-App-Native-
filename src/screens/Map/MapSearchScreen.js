import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SearchBar from '../../components/SearchBar';
import theme from '../../style';
import colors from '../../style/colors';
import {
  CATEGORIES,
  RECENT_SEARCHES,
  SEARCH_ICON_CONFIG,
  SEARCH_RESULTS,
} from '../../constants/MapData';
import typography from '../../style/typography';
import SearchingPinIcon from '../../../assets/icons/common/pin.svg';
import SearchingShakeIcon from '../../../assets/icons/search-list/searchingShake.svg';
import WarningIcon from '../../../assets/icons/warning-line.svg';
import filterDropdownItems from '../../utils/searchLogic';

import { getPlacesSearchInfo } from '../../api/place';

const MapSearchScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredData = useMemo(() => {
    return filterDropdownItems(SEARCH_RESULTS, keyword, 'name');
  }, [keyword]);

  useEffect(() => {
    // 키워드가 비어있으면 초기화
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const lat = 37.55703;
        const lng = 126.9602;

        const data = await getPlacesSearchInfo(keyword, lat, lng);

        if (data) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('검색 실패:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <WarningIcon width={56} height={56} />
      <Text style={styles.emptyText}>검색 결과가 존재하지 않습니다</Text>
    </View>
  );
  const onSubmit = () => {
    navigation.navigate('MapScreen', {
      searchType: 'KEYWORD',
      keyword: keyword,
    });
  };

  const renderHistoryItem = ({ item }) => {
    const config = SEARCH_ICON_CONFIG[item.type];
    if (!config) return null;
    const { Component, color } = config;

    return (
      <TouchableOpacity style={styles.historyItem}>
        <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
          <Component width={22} height={22} color={color} />
        </View>
        <Text style={styles.historyText}>{item.text}</Text>
        <TouchableOpacity style={styles.deleteButton}>
          <Ionicons name="close" size={16} color={theme.colors.textDisabled} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderResultItem = ({ item }) => {
    const isPartnership = item.partnerships && item.partnerships.length > 0;

    const IconComponent = isPartnership ? SearchingShakeIcon : SearchingPinIcon;
    const postId = isPartnership ? item.partnerships[0]?.postId : undefined;

    console.log('🔍 검색 결과:', {
      name: item.placeName,
      isPartnership,
      postId,
    });

    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => {
          const selectedLocation = {
            placeId: item.placeKey,
            name: item.placeName,
            address: item.address,
            category: item.category || '스터디카페',
            imgUrls: item.imgUrls || [],
            latitude: item.coordinate?.latitude,
            longitude: item.coordinate?.longitude,

            isPartner: isPartnership,
            partnerTag: isPartnership
              ? item.partnerships[0]?.councilName
              : undefined,
            partnerTitle: isPartnership
              ? item.partnerships[0]?.partnershipTitle
              : undefined,
            partnerships: item.partnerships || [],

            postId: postId,
          };

          console.log('📍 네비게이션 전달 데이터:', selectedLocation);

          navigation.navigate('MapScreen', {
            searchType: 'LOCATION',
            selectedLocation,
          });
        }}
      >
        <View style={styles.resultIconWrapper}>
          <IconComponent width={26} height={26} />
        </View>

        <View style={styles.resultTextWrapper}>
          <Text style={styles.resultTitle}>{item.placeName}</Text>
          <View style={styles.resultSubRow}>
            <Text style={styles.resultAddress}>{item.address}</Text>
            {/* <Text style={styles.resultDistance}>0.0km</Text> */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.searchBarWrapper}>
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          placeholder="원하는 제휴를 검색하세요"
          autoFocus={true}
          onBackPress={() => navigation.goBack()}
          onClearPress={() => setKeyword('')}
          onSubmit={onSubmit}
        />
      </View>

      {/* 조건부 렌더링 */}
      {keyword.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) =>
            item.placeKey ? String(item.placeKey) : String(index)
          }
          renderItem={renderResultItem}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={renderEmptyComponent}
        />
      ) : (
        <>
          <View style={styles.categoryWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity key={cat.id} style={styles.categoryChip}>
                  <View>
                    <cat.IconComponent
                      width={20}
                      height={20}
                      color={theme.colors.textDim}
                    />
                  </View>
                  <Text style={styles.categoryText}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.divider} />

          <FlatList
            data={RECENT_SEARCHES}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderHistoryItem}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchBarWrapper: {
    paddingBottom: 10,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
  },
  categoryWrapper: {
    paddingVertical: 12,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginRight: 8,
  },
  categoryText: {
    color: theme.colors.text,
    ...typography.body4Regular,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyText: {
    flex: 1,
    color: theme.colors.text,
    ...typography.body3Regular,
  },
  deleteButton: {
    padding: 4,
  },

  resultItem: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  resultIconWrapper: {
    marginRight: 12,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  resultTextWrapper: {
    flex: 1,
  },
  resultTitle: {
    color: theme.colors.text,
    ...typography.body3Regular,
  },
  resultSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultAddress: {
    color: theme.colors.textDim,
    ...typography.caption1Regular,
    marginRight: 8,
  },
  resultDistance: {
    color: theme.colors.textDisabled,
    ...typography.caption2Regular,
  },
  emptyContainer: {
    paddingTop: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 20,
    color: colors.gray[300],
    ...typography.body2Bold,
  },
});

export default MapSearchScreen;
