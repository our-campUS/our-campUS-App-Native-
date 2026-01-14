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
    // paddingHorizontal: 20,
  },
  activeOrangeContainer: {
    backgroundColor: colors.orange['050'],
  },
});

const AffiliationCarousel = ({
  isOrange = false,
  councilType = null,
  data,
  navigation = null,
}) => {
  return (
    <View style={[styles.container, isOrange && styles.activeOrangeContainer]}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <View
            style={[
              index === 0 && { marginLeft: 20 },
              index === AFFILIATION_CAROUSEL_DATA.length - 1 && {
                marginRight: 20,
              },
            ]}
          >
            <AffiliationCarouselItem
              item={item}
              isOrange={isOrange}
              councilType={councilType}
              navigation={navigation}
            />
          </View>
        )}
        keyExtractor={(item) => item.postId || item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      />
    </View>
  );
};

export default AffiliationCarousel;
