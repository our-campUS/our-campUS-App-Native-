import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../../components/LabelTitle';
import typography from '../../style/typography';
import colors from '../../style/colors';

const AnnouncementDetailScreen = ({ route, navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="공지사항"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.contentContainer}>
        <View style={styles.topLayer}>
          <Text style={styles.title}>{route.params.item.title}</Text>
          <Text style={styles.date}>{route.params.item.date}</Text>
        </View>
        <Text style={styles.content}>{route.params.item.content}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    // marginTop: 20,
    paddingHorizontal: 20,
  },
  topLayer: {
    paddingVertical: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  title: {
    ...typography.heading5,
    color: colors.gray[850],
  },
  date: {
    ...typography.body4Regular,
    color: colors.gray[600],
  },
  content: {
    ...typography.body3Regular,
    color: colors.gray[850],
    marginTop: 23,
  },
});

export default AnnouncementDetailScreen;
