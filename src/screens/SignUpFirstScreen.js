import { View, Text, StyleSheet } from 'react-native';
import colors from '../style/colors';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../components/LabelTitle';
import Input from '../components/Input';

const styles = StyleSheet.create({
  statusBar: {
    height: 5,
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
  },
  inputWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 56,
  },
});

const SignUpFirstScreen = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{ flex: 1, width: '100%', backgroundColor: '#FFFFFF' }}
    >
      <StatusBar style="auto" />
      <LabelTitle
        title="회원가입"
        // useBackButton={}
        onPressBack={() => navigation.goBack()}
        navigation={navigation}
      />
      <View style={[styles.statusBar]}>
        <View
          style={{ backgroundColor: colors.blue[400], width: '50%' }}
        ></View>
        <View style={{ backgroundColor: colors.white, width: '50%' }}></View>
      </View>
      <View style={styles.inputWrapper}>
        <Input
          title="학교"
          useTitle={true}
          placeholder="학교 이름을 입력해주세요"
          useMagnifyingGlass={true}
        />
      </View>
    </SafeAreaView>
  );
};
export default SignUpFirstScreen;
