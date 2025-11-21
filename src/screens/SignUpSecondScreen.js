import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import LabelTitle from '../components/LabelTitle';
import colors from '../style/colors';
import typography from '../style/typography';
import Button from '../components/Button';

const styles = StyleSheet.create({
  statusBar: {
    height: 5,
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
  },
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 55,
    height: 65.15,
    boxShadow: '0px 0px 12.84px 0px #0000001A',
  },
  congratulationsTitle: {
    ...typography.heading2,
    color: colors.gray[850],
    marginTop: 30,
    textAlign: 'center',
  },
  congratulationsSubtitle: {
    ...typography.body1Regular,
    color: colors.gray[800],
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
});

const SignUpSecondScreen = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{ flex: 1, width: '100%', backgroundColor: '#FFFFFF' }}
    >
      <StatusBar style="auto" />
      <LabelTitle
        title="가입 완료"
        onPressBack={() => navigation.goBack()}
        navigation={navigation}
      />
      <View style={[styles.statusBar]}>
        <View
          style={{ backgroundColor: colors.blue[400], width: '100%' }}
        ></View>
      </View>
      <View style={styles.container}>
        <View style={styles.mainContent}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.congratulationsTitle}>
            회원가입을 축하드려요!
          </Text>
          <Text style={styles.congratulationsSubtitle}>
            캠어스에서 xx님이 받을 수 있는 {'\n'}
            제휴 혜택들을 확인해보세요!
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={{
            backgroundColor: colors.blue[400],
          }}
          title="홈으로"
          onPress={() => navigation.navigate('MainTab')}
        />
      </View>
    </SafeAreaView>
  );
};
export default SignUpSecondScreen;
