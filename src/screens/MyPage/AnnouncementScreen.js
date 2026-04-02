import { View, StyleSheet, FlatList } from 'react-native';
import LabelTitle from '../../components/LabelTitle';
import colors from '../../style/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnnouncementTypeSelector from '../../components/MyPage/AnnouncementTypeSelector';
import EmptyResult from '../../components/common/EmptyResult';

const AnnouncementScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="공지사항"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <AnnouncementTypeSelector />
      <View style={{ width: '100%', height: 10 }} />
      <FlatList
        data={[]}
        renderItem={() => null}
        ListEmptyComponent={
          <EmptyResult message={'등록된 공지사항이 없습니다.'} />
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
});

export default AnnouncementScreen;
