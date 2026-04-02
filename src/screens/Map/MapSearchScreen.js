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
import { CATEGORIES } from '../../constants/MapData';
import typography from '../../style/typography';
import SearchingPinIcon from '../../../assets/icons/common/pin.svg';
import SearchingShakeIcon from '../../../assets/icons/search-list/searchingShake.svg';
import SearchIcon from '../../../assets/icons/search-list/search.svg';
import EmptyResult from '../../components/common/EmptyResult';

import { getPlacesSearchInfo } from '../../api/place';
import {
  addSearchHistory,
  getSearchHistory,
  removeSearchHistory,
} from '../../utils/searchHistoryUtils';

const MapSearchScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    const history = await getSearchHistory();
    setSearchHistory(history);
  };

  // NOTE: 검색 중 연관 검색어
  // useEffect(() => {
  //   if (!keyword.trim()) {
  //     setSearchResults([]);
  //     return;
  //   }

  //   const timer = setTimeout(async () => {
  //     setLoading(true);
  //     try {
  //       const lat = 37.55703;
  //       const lng = 126.9602;
  //       const data = await getPlacesSearchInfo(keyword, lat, lng);

  //       if (data) {
  //         setSearchResults(data);
  //       } else {
  //         setSearchResults([]);
  //       }
  //     } catch (error) {
  //       console.error('검색 실패:', error);
  //       setSearchResults([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [keyword]);

  const renderEmptyComponent = () => <EmptyResult />;

  const onSubmit = async () => {
    if (!keyword.trim()) return;

    await addSearchHistory({
      type: 'KEYWORD',
      text: keyword,
    });
    await loadSearchHistory();

    navigation.navigate('MapScreen', {
      searchType: 'KEYWORD',
      keyword: keyword,
    });
  };

  const renderHistoryItem = ({ item }) => {
    let IconComponent;
    let iconColor;

    let iconBgColor;
    if (item.type === 'KEYWORD') {
      IconComponent = SearchIcon;
      iconColor = theme.colors.textDim;
      iconBgColor = 'transparent';
    } else if (item.type === 'LOCATION') {
      IconComponent = SearchingPinIcon;
      iconColor = theme.colors.primary;
      iconBgColor = iconColor + '20';
    }

    return (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => {
          if (item.type === 'KEYWORD') {
            setKeyword(item.text);
            navigation.navigate('MapScreen', {
              searchType: 'KEYWORD',
              keyword: item.text,
            });
          } else if (item.type === 'LOCATION' && item.data) {
            navigation.navigate('MapScreen', {
              searchType: 'LOCATION',
              selectedLocation: item.data,
            });
          }
        }}
      >
        <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
          <IconComponent width={22} height={22} color={iconColor} />
        </View>
        <Text style={styles.historyText}>{item.text}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={async () => {
            await removeSearchHistory(item.id);
            await loadSearchHistory();
          }}
        >
          <Ionicons name="close" size={16} color={theme.colors.textDisabled} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const handleResultItemPress = async (item) => {
    const isPartnership = item.partnerships && item.partnerships.length > 0;
    const postId = isPartnership ? item.partnerships[0]?.postId : undefined;

    const selectedLocation = {
      placeId: item.placeKey,
      name: item.placeName,
      address: item.address,
      category: item.category || '기타',
      imgUrls: item.imgUrls || [],
      latitude: item.coordinate?.latitude,
      longitude: item.coordinate?.longitude,
      isPartner: isPartnership,
      partnerTag: isPartnership ? item.partnerships[0]?.councilName : undefined,
      partnerTitle: isPartnership
        ? item.partnerships[0]?.partnershipTitle
        : undefined,
      partnerships: item.partnerships || [],
      postId: postId,
    };

    await addSearchHistory({
      type: 'LOCATION',
      text: item.placeName,
      placeId: item.placeKey,
      data: selectedLocation,
    });
    await loadSearchHistory();

    navigation.navigate('MapScreen', {
      searchType: 'LOCATION',
      selectedLocation,
    });
  };

  const renderResultItem = ({ item }) => {
    const isPartnership = item.partnerships && item.partnerships.length > 0;
    const IconComponent = isPartnership ? SearchingShakeIcon : SearchingPinIcon;

    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => handleResultItemPress(item)}
      >
        <View style={styles.resultIconWrapper}>
          <IconComponent width={26} height={26} />
        </View>

        <View style={styles.resultTextWrapper}>
          <Text style={styles.resultTitle}>{item.placeName}</Text>
          <View style={styles.resultSubRow}>
            <Text style={styles.resultAddress}>{item.address}</Text>
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
      {keyword.length > 0 ? //   renderItem={renderResultItem} //   } //     item.placeKey ? String(item.placeKey) : String(index) //   keyExtractor={(item, index) => //   data={searchResults} // <FlatList
      //   contentContainerStyle={styles.listContent}
      //   keyboardShouldPersistTaps="handled"
      //   ListEmptyComponent={renderEmptyComponent}
      // />
      null : (
        <>
          <View style={styles.categoryWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {CATEGORIES.map((cat, index) => (
                <TouchableOpacity
                  key={`${cat.id}-${index}`}
                  style={styles.categoryChip}
                  onPress={() =>
                    navigation.navigate('MapScreen', {
                      searchType: 'CATEGORY',
                      category: { id: cat.id, label: cat.label },
                    })
                  }
                >
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

          {/* ✅ 검색 기록 */}
          {searchHistory.length > 0 ? (
            <FlatList
              data={searchHistory}
              keyExtractor={(item) => item.id}
              renderItem={renderHistoryItem}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <View style={styles.emptyHistoryContainer}>
              <Text style={styles.emptyHistoryText}>
                최근 검색 기록이 없습니다
              </Text>
            </View>
          )}
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

  emptyHistoryContainer: {
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyHistoryText: {
    color: theme.colors.textDisabled,
    ...typography.body3Regular,
  },
});

export default MapSearchScreen;
