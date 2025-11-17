import { View, Text, Image, StyleSheet } from 'react-native';
import Button from '../components/Button';
import colors from '../style/colors';
import typography from '../style/typography';
import { onKakaoLogin } from '../api/signUp';

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    gap: 10,
    height: 138,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 49,
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const LoginInitialScreen = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
      }}
    >
      <View style={{ alignItems: 'center', marginTop: 'auto' }}>
        <Image
          source={require('../../assets/logo.png')}
          style={{ width: 69.23, height: 82 }}
        />
        <Image
          source={require('../../assets/mainLabel.png')}
          style={{ width: 148.86, height: 33, marginTop: 24 }}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Apple 시작하기"
          onPress={() => {
            navigation.navigate('SignUpFirstScreen');
          }}
          style={{
            width: 335,
            height: 49,
            paddingHorizontal: 10,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.gray[900],
            borderRadius: 10,
          }}
          textStyle={{
            color: 'white',
            ...typography.heading6,
          }}
        >
          <Image
            source={require('../../assets/appleLogo.png')}
            style={{ width: 15.69, height: 18.93 }}
          />
        </Button>
        <Button
          title="카카오 시작하기"
          onPress={() => {
            console.log('✅ 버튼 눌림');
            onKakaoLogin();
          }}
          style={{
            width: 335,
            height: 49,
            paddingHorizontal: 10,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FEE500',
            borderRadius: 10,
          }}
          textStyle={{
            color: colors.gray[850],
            ...typography.heading6,
          }}
        >
          <Image
            source={require('../../assets/kakaoLogo.png')}
            style={{ width: 20.1, height: 18.76 }}
          />
        </Button>
        <View
          style={{ height: 20, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text
            style={{ color: colors.gray[600], ...typography.body4Regular }}
            onPress={() => {
              // navigation.navigate('SignUpFirstScreen');
            }}
          >
            학생회로 대표자로 시작하기 {'>'}
          </Text>
        </View>
      </View>
    </View>
  );
};
export default LoginInitialScreen;
