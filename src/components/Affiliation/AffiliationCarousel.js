import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';
import AffiliationCarouselItem from './AffiliationCarouselItem';
import { AFFILIATION_CAROUSEL_DATA } from '../../constants/DummyData';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 208,
    backgroundColor: colors.blue['000'],
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
});

const AffiliationCarousel = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={AFFILIATION_CAROUSEL_DATA}
        renderItem={({ item }) => <AffiliationCarouselItem item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      />
    </View>
  );
};

export default AffiliationCarousel;
