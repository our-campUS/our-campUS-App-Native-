import { View, Text, StyleSheet, FlatList } from 'react-native';
import LabelTitle from '../../components/LabelTitle';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import StoreListItem from '../../components/common/StoreListItem';
import { SEARCH_RESULTS } from '../../constants/MapData';
import { INTERESTED_PLACE_DATA } from '../../constants/DummyData';
const InterestedPlaceScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="관심 장소"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <FlatList
        data={INTERESTED_PLACE_DATA}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <StoreListItem item={item} />}
        scrollEnabled={true}
        // style={{ marginVertical: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
});

export default InterestedPlaceScreen;
