import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../../../components/LabelTitle';
import colors from '../../../style/colors';
import Input from '../../../components/Input';
import { useState, useEffect, useRef } from 'react';
import typography from '../../../style/typography';
import Button from '../../../components/Button';
import {
  verifyCouncilSignUpAuthCode,
  resendCouncilSignUpAuthCode,
} from '../../../api/councilSignUp';

const ReceiveAuthCode = ({ navigation, route }) => {
  const email = route.params?.email;
  const password = route.params?.password;
  const loginId = route.params?.loginId;
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5분 = 300초
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [verificationClicked, setVerificationClicked] = useState(false);
  const [isValid, setIsValid] = useState(null); // null: 검증 전, true: 성공, false: 실패
  const [loadingSpinnerVisible, setLoadingSpinnerVisible] = useState(false);

  // 인증번호가 6자리이고 만료되지 않았는지 확인하여 버튼 활성화
  useEffect(() => {
    setIsButtonDisabled(code.length !== 6 || isExpired);
  }, [code, isExpired]);

  useEffect(() => {
    // 타이머 시작
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 시간을 MM:SS 형식으로 변환
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  // 인증하기 버튼 클릭 핸들러
  const handleVerify = async () => {
    if (code.length !== 6) {
      return;
    }

    setVerificationClicked(true);
    const result = await verifyCouncilSignUpAuthCode(email, code);
    console.log('verifyCouncilSignUpAuthCode result', result);
    setIsValid(result.isValid);

    if (result.isValid) {
      // 인증 성공 시 키보드 먼저 해제 후 다음 화면으로 이동
      Keyboard.dismiss();
      setTimeout(() => {
        navigation?.navigate('WriteRepresentativeInfo1', {
          email: email,
          password: password,
          loginId: loginId,
        });
      }, 100);
    } else {
      // 인증 실패 시 코드 초기화
      setCode('');
    }
  };

  // 인증번호 입력 시 에러 상태 초기화
  useEffect(() => {
    if (code.length > 0 && verificationClicked) {
      setVerificationClicked(false);
      setIsValid(null);
    }
  }, [code]);

  const handleResendAuthCode = async () => {
    setIsValid(null);
    setLoadingSpinnerVisible(true);
    const result = await resendCouncilSignUpAuthCode(email);
    console.log('resendCouncilSignUpAuthCode result', result);
    if (result.isSuccess) {
      // 기존 타이머 정리
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setLoadingSpinnerVisible(false);
      // 타이머 재시작
      setTimeLeft(300);
      setIsExpired(false);
      setCode('');
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsExpired(true);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setLoadingSpinnerVisible(false);
      Alert.alert('인증번호 재전송에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <LabelTitle
        title="본인 인증"
        useBackButton={true}
        onPressBack={() => navigation?.goBack()}
        navigation={navigation}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ width: '100%', height: 20 }} />
        <View style={[styles.statusBar]}>
          <View
            style={{ backgroundColor: colors.orange[400], width: '33.33%' }}
           />
          <View
            style={{ backgroundColor: colors.gray[100], width: '66.67%' }}
           />
        </View>
        <View style={styles.contents}>
          <View style={styles.inputWrapper}>
            <Input
              isOrange={true}
              title="인증 번호"
              placeholder="인증번호를 입력해주세요"
              useTitle={true}
              useMagnifyingGlass={false}
              value={code}
              onChangeText={setCode}
              useOnlyNumber={true}
              maxLength={6}
              hasError={verificationClicked && isValid === false}
            />
            <View style={styles.timerContainer}>
              <Text
                style={[styles.timerText, isExpired && styles.timerExpired]}
              >
                {isExpired ? '' : formatTime(timeLeft)}
              </Text>
            </View>
          </View>
          {verificationClicked && isValid === false && (
            <Text style={styles.errorText}>인증번호가 올바르지 않습니다.</Text>
          )}
          <Text style={styles.resendText} onPress={handleResendAuthCode}>
            인증번호 재요청
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              disabled={isButtonDisabled}
              isOrange={true}
              style={{
                width: '100%',
                height: 50,
                paddingHorizontal: 10,
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.orange[400],
                borderRadius: 10,
              }}
              textStyle={{
                color: colors.common.white,
                ...typography.heading6,
              }}
              title="인증하기"
              onPress={handleVerify}
            />
          </View>
        </View>
      </ScrollView>
      {loadingSpinnerVisible && (
        <View style={styles.loadingSpinnerContainer}>
          <ActivityIndicator size="large" color={colors.orange[400]} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  statusBar: {
    height: 5,
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
  },
  contents: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 8,
    flex: 1,
  },
  inputWrapper: {
    position: 'relative',
  },
  timerContainer: {
    position: 'absolute',
    right: 20,
    top: 52, // Input title(약 20px) + Input 필드 중앙(24px) = 34px
    alignItems: 'flex-end',
    justifyContent: 'center',
    transform: [{ translateY: -8 }], // 텍스트 높이의 절반 정도로 조정하여 정확한 중앙 정렬
  },
  timerText: {
    ...typography.body3Regular,
    color: colors.gray[600],
  },
  timerExpired: {
    color: colors.common.error,
  },
  resendText: {
    ...typography.caption1Regular,
    color: colors.gray[600],
    textAlign: 'left',
    textDecorationLine: 'underline',
  },
  errorText: {
    ...typography.caption1Regular,
    color: colors.common.error,
    marginTop: 4,
    marginBottom: -4,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 30,
  },
  loadingSpinnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
});

export default ReceiveAuthCode;
