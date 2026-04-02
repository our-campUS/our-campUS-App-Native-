import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import LabelTitle from '../../components/LabelTitle';
import colors from '../../style/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import StoreListItem from '../../components/common/StoreListItem';
import EmptyResult from '../../components/common/EmptyResult';
import { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getLikedPlaces } from '../../api/place';

const USER_LAT = 37.505;
const USER_LNG = 126.957;

const mapToStoreItem = (item) => ({
  ...item,
  name: item.placeName,
  star: item.averageStar,
  imgUrls: item.imageUrls,
  partnerTitle: item.partnershipTitle,
  distance: item.distanceMeter,
  isLiked: true,
});

const InterestedPlaceScreen = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const fetchPlaces = useCallback(async (cursor = null) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const data = await getLikedPlaces({
        lat: USER_LAT,
        lng: USER_LNG,
        cursor,
        size: 5,
      });
      if (data) {
        const mapped = (data.content ?? []).map(mapToStoreItem);
        setPlaces((prev) => (cursor ? [...prev, ...mapped] : mapped));
        setNextCursor(data.nextCursor);
        setHasNext(data.hasNext);
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setPlaces([]);
      setNextCursor(null);
      setHasNext(true);
      fetchPlaces(null);
    }, [])
  );

  const handleEndReached = () => {
    if (hasNext && !loading && nextCursor) {
      fetchPlaces(nextCursor);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="관심 장소"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <FlatList
        data={places}
        keyExtractor={(item) => item.likedPlaceId.toString()}
        renderItem={({ item }) => (
          <StoreListItem
            item={item}
            userLocation={{ latitude: USER_LAT, longitude: USER_LNG }}
            onPress={() =>
              navigation.navigate('StoreDetailScreen', { store: item })
            }
          />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          !loading ? <EmptyResult message="관심 장소가 없습니다." /> : null
        }
        ListFooterComponent={
          loading ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.blue[400]} />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default InterestedPlaceScreen;
