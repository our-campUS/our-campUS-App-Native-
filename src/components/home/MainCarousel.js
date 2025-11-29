import React, { useState, useCallback } from 'react';
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

  const PARENT_PADDING_TOTAL = 40;

  const ITEM_WIDTH = width - PARENT_PADDING_TOTAL;

  const ITEM_GAP = 5;

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
        keyExtractor={(item) => String(item.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View style={{ width: ITEM_WIDTH, paddingHorizontal: ITEM_GAP }}>
            <View style={styles.imageWrapper}>
              <Image source={item.image} style={styles.image} />
            </View>
          </View>
        )}
      />

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
    height: 200,
  },
  imageWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pageBadge: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  pageText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default MainCarousel;
