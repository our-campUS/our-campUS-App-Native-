import { View, Text, StyleSheet } from 'react-native';
import colors from '../style/colors';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../components/LabelTitle';

const styles = StyleSheet.create({
  statusBar: {
    height: 5,
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
  },
});

const SignUpFirstScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, width: '100%' }}>
      <StatusBar style="auto" />
      <View style={[styles.statusBar]}>
        <View
          style={{ backgroundColor: colors.orange[500], width: '50' }}
        ></View>
        <View style={{ backgroundColor: colors.white, width: '50' }}></View>
      </View>
      <LabelTitle
        title="회원가입"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};
export default SignUpFirstScreen;
