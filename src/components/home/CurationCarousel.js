import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import theme from '../../style';
import { CURATION_DATA } from '../../constants/DummyData';
import colors from '../../style/colors';

const CurationCard = ({ item, width, backgroundColor }) => {
  return (
    <View
      style={[styles.card, { width: width, backgroundColor: backgroundColor }]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.count}개의 매장</Text>
      </View>

      <View style={styles.gridContainer}>
        {item.images.map((img, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: img }} style={styles.image} />
          </View>
        ))}
      </View>
    </View>
  );
};

const CurationCarousel = () => {
  const CARD_WIDTH = 212;
  const CARD_GAP = 13;

  return (
    <View style={styles.container}>
      <FlatList
        data={CURATION_DATA}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
        renderItem={({ item, index }) => {
          const isOddItem = index % 2 === 0;

          const cardColor = isOddItem ? colors.blue[100] : colors.orange[100];

          return (
            <CurationCard
              item={item}
              width={CARD_WIDTH}
              backgroundColor={cardColor}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 314,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  textContainer: {
    marginBottom: 24,
  },
  title: {
    ...theme.typography.heading5,
    marginBottom: 7,
  },
  subtitle: {
    ...theme.typography.body3,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  imageWrapper: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default CurationCarousel;
