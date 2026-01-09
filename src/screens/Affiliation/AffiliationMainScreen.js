import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../style/colors';
import typography from '../../style/typography';
import HostByTab from '../../components/Affiliation/HostByTab';
import AffiliationCarousel from '../../components/Affiliation/AffiliationCarousel';
import AffiliationColumnList from '../../components/Affiliation/AffiliationColumnList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
    alignItems: 'center',
  },
});

const AffiliationMainScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={{ marginTop: 9.5 }}>
        <HostByTab
          university={'중앙대학교'}
          college={'사회과학대'}
          department={'정치국제'}
        />
      </View>
      <AffiliationCarousel />
      <AffiliationColumnList navigation={navigation} />
    </SafeAreaView>
  );
};

export default AffiliationMainScreen;
