import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';
import LocationIcon from '../../../assets/Vector2.svg';

const AffiliatePlaceItem = ({ item, onPress }) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <LocationIcon width={26} height={26} color={colors.gray[300]} />
      <View style={styles.content}>
        <Text style={styles.placeName}>{item.placeName}</Text>
        <View style={styles.placeAddressWrapper}>
          {/* <Text style={styles.placeAddress}>{item.placeAddress}</Text> */}
          <Text style={styles.placeAddress}>{item.address}</Text>
          <Text style={styles.distance}>{item.distance}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    gap: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  placeName: {
    ...typography.body3Regular,
    color: colors.gray[850],
  },
  placeAddress: {
    ...typography.caption1Regular,
    color: colors.gray[700],
  },
  distance: {
    ...typography.caption2Regular,
    color: colors.gray[400],
  },
  placeAddressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default AffiliatePlaceItem;
