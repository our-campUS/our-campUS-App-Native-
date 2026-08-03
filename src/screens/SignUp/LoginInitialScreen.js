import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import Button from '../../components/Button';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { onKakaoLogin } from '../../api/signUp';
import { reviewerTestLogin } from '../../api/testLogin';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../store/authStore';
import { useState } from 'react';
import ReviewerLoginModal from '../../components/common/ReviewerLoginModal';

// 리뷰어 로그인 진입 조건: 로고를 이 시간(ms) 이상 길게 눌러야 함
const REVIEWER_TRIGGER_LONG_PRESS_MS = 5000;

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    gap: 10,
    // height: 138,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 3,
    // backgroundColor: 'red',
    ...(Platform.OS === 'ios' && {
      marginBottom: 3,
    }),
    ...(Platform.OS === 'android' && {
      marginBottom: 25,
    }),
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
  const [isReviewerModalVisible, setIsReviewerModalVisible] = useState(false);

  const handleReviewerLogin = async (email) => {
    const result = await reviewerTestLogin(email);
    if (result.isValid) {
      setIsReviewerModalVisible(false);
      if (result.isProfileNotCompleted) {
        navigation.navigate('SignUpStack', {
          screen: 'SignUpFirstScreen',
          params: {
            userName: result.nickname,
          },
        });
      } else {
        useAuthStore.getState().login();
      }
    }
    return result;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
      }}
    >
      <View style={{ alignItems: 'center', marginTop: 'auto' }}>
        <Pressable
          onLongPress={() => setIsReviewerModalVisible(true)}
          delayLongPress={REVIEWER_TRIGGER_LONG_PRESS_MS}
          testID="login-logo"
        >
          <Image
            source={require('../../../assets/logo.png')}
            style={{ width: 69.23, height: 82 }}
          />
        </Pressable>
        <Image
          source={require('../../../assets/mainLabel.png')}
          style={{ width: 148.86, height: 33, marginTop: 24 }}
        />
      </View>

      <ReviewerLoginModal
        visible={isReviewerModalVisible}
        onClose={() => setIsReviewerModalVisible(false)}
        onSubmit={handleReviewerLogin}
      />

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
            marginBottom: 26,
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
