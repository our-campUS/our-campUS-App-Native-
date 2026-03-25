import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import LabelTitle from '../../components/LabelTitle';
import colors from '../../style/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import StoreListItem from '../../components/common/StoreListItem';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getLikedPlaces } from '../../api/place';

const USER_LAT = 37.5050;
const USER_LNG = 126.9570;

const mapToStoreItem = (item) => ({
  ...item,
  name: item.placeName,
  star: item.averageStar,
  imgUrls: item.imageUrls,
  partnerTitle: item.partnershipTitle,
  distance: item.distanceMeter,
});

const InterestedPlaceScreen = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPlaces = useCallback(async (cursor = null) => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getLikedPlaces({
        lat: USER_LAT,
        lng: USER_LNG,
        cursor,
        size: 5,
      });
      if (data) {
        const mapped = data.content.map(mapToStoreItem);
        setPlaces((prev) => (cursor ? [...prev, ...mapped] : mapped));
        setNextCursor(data.nextCursor);
        setHasNext(data.hasNext);
      }
    } finally {
      setLoading(false);
    }
  }, [loading]);

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
