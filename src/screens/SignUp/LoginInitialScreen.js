import { View, Text, Image, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { onKakaoLogin } from '../../api/signUp';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../store/authStore';
import { useState } from 'react';

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    gap: 10,
    height: 138,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 3,
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
  const setAuthFromKakao = useAuthStore((state) => state.setAuthFromKakao);
  const [userName, setUserName] = useState(null);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
      }}
    >
      <View style={{ alignItems: 'center', marginTop: 'auto' }}>
        <Image
          source={require('../../../assets/logo.png')}
          style={{ width: 69.23, height: 82 }}
        />
        <Image
          source={require('../../../assets/mainLabel.png')}
          style={{ width: 148.86, height: 33, marginTop: 24 }}
        />
      </View>

      <View style={styles.buttonContainer}>
        {Platform.OS === 'ios' && (
          <Button
            title="Apple 시작하기"
            onPress={() => {
              navigation.navigate('SignUpStack');
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
              source={require('../../../assets/appleLogo.png')}
              style={{ width: 15.69, height: 18.93 }}
            />
          </Button>
        )}
        <Button
          title="카카오 시작하기"
          onPress={async () => {
            console.log('✅ 버튼 눌림');
            const result = await onKakaoLogin();
            if (result.isValid) {
              if (result.isProfileNotCompleted) {
                console.log('✅ 프로필 미완료');
                navigation.navigate('SignUpStack', {
                  screen: 'SignUpFirstScreen',
                  params: {
                    userName: result.nickname,
                  },
                });
              } else {
                console.log('✅ 프로필 완료');
                useAuthStore.getState().login();
              }
            }
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
            source={require('../../../assets/kakaoLogo.png')}
            style={{ width: 20.1, height: 18.76 }}
          />
        </Button>
        <View
          style={{ height: 20, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text
            style={{ color: colors.gray[600], ...typography.body4Regular }}
            onPress={() => {
              navigation.navigate('SignUpRepresentativStack');
            }}
          >
            학생회로 대표자로 시작하기 {'>'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default LoginInitialScreen;
