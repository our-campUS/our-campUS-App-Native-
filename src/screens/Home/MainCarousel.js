import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

const MainCarousel = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = useWindowDimensions();

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={{ width }}>
            {' '}
            <Image source={item.image} style={styles.image} />
          </View>
        )}
      />
      {/* 페이지 번호 배지 */}
      <View style={styles.pageBadge}>
        <Text style={styles.pageText}>
          {currentIndex + 1} / {data.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 200,
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  pageBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  pageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MainCarousel;
