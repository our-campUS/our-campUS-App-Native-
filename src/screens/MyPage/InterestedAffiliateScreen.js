import { View, Text, StyleSheet } from 'react-native';
import LabelTitle from '../../components/LabelTitle';
import colors from '../../style/colors';
import typography from '../../style/typography';
import AffiliationColumnList from '../../components/Affiliation/AffiliationColumnList';
import { SafeAreaView } from 'react-native-safe-area-context';

const InterestedAffiliateScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LabelTitle
        title="관심 제휴글"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <AffiliationColumnList navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
});

export default InterestedAffiliateScreen;
