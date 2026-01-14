import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import LabelTitle from '../../components/LabelTitle';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnnouncementTypeSelector from '../../components/MyPage/AnnouncementTypeSelector';
import { ANNOUNCEMENT_DATA } from '../../constants/DummyData';
import NewDot from '../../../assets/RedDot.svg';

const AnnouncementScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="공지사항"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      {/* <View style={{ width: '100%', height: 20 }} /> */}
      <AnnouncementTypeSelector />
      <View style={{ width: '100%', height: 10 }} />
      <FlatList
        data={ANNOUNCEMENT_DATA}
        renderItem={({ item }) => (
          <Pressable
            style={styles.announcementItem}
            onPress={() =>
              navigation.navigate('AnnouncementDetailScreen', { item })
            }
          >
            <View style={styles.titleWrapper}>
              <Text style={styles.announcementTitle}>{item.title}</Text>
              {item.isNew && <NewDot />}
            </View>
            <Text style={styles.announcementDate}>{item.date}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  announcementItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray[200],
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  announcementTitle: {
    ...typography.body3Regular,
    color: colors.gray[850],
  },
  announcementDate: {
    ...typography.caption1Regular,
    color: colors.gray[600],
  },
});

export default AnnouncementScreen;
