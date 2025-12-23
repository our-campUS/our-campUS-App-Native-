import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import LabelTitle from '../components/LabelTitle';
import colors from '../style/colors';
import Input from '../components/Input';
import useForm from '../hooks/useForm';
import { useState, useRef, useEffect } from 'react';
import CheckMark from '../../assets/check.svg';
import typography from '../style/typography';
import Button from '../components/Button';
import { checkUserIdDuplicate } from '../api/signUp';

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
  inputFormContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 28,
    gap: 24,
  },
  passwordReminder: {
    marginTop: -10,
    gap: 4,
  },
  passwordReminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordReminderText: {
    ...typography.caption1Regular,
    color: colors.gray[600],
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 30,
    gap: 10,
  },
  alreadyHaveAccountText: {
    ...typography.caption1Bold,
    color: '#006beb',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 12,
  },
  userIdStatusText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

// 비밀번호 조건 검사 함수
const checkPasswordConditions = (password) => {
  if (!password) {
    return {
      hasMinLength: false,
      hasTwoTypes: false,
    };
  }

  // 8자리 이상 체크
  const hasMinLength = password.length >= 8;

  // 대문자, 소문자, 특수문자, 숫자 중 2개 이상 사용 체크
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const typeCount = [
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
  ].filter(Boolean).length;

  const hasTwoTypes = typeCount >= 2;

  return {
    hasMinLength,
    hasTwoTypes,
  };
};

// 비밀번호 유효성 검사 함수
const validatePassword = (password) => {
  if (!password) return null; // 빈 값은 에러 없음 (required로 처리)

  const conditions = checkPasswordConditions(password);

  // 8자리 이상 체크
  if (!conditions.hasMinLength) {
    return '비밀번호는 8자리 이상이어야 합니다.';
  }

  // 대문자, 소문자, 특수문자, 숫자 중 2개 이상 사용 체크
  if (!conditions.hasTwoTypes) {
    return '대문자, 소문자, 특수문자, 숫자 중 2개 이상을 사용해야 합니다.';
  }

  return null; // 유효함
};

// 이메일 유효성 검사 함수
const validateEmail = (email) => {
  if (!email) return null; // 빈 값은 에러 없음 (required로 처리)

  // 기본 이메일 형식 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '올바른 이메일 형식이 아닙니다.';
  }

  // 학교 이메일 도메인 검사 (선택사항 - 필요시 추가)
  // const schoolEmailRegex = /^[^\s@]+@(ac\.kr|edu)$/i;
  // if (!schoolEmailRegex.test(email)) {
  //   return '학교 이메일을 입력해주세요.';
  // }

  return null; // 유효함
};

const SignUpRepresentativeScreen = ({ navigation }) => {
  const { values, handleChange, errors, setError } = useForm({
    userId: '',
    password: '',
    email: '',
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [userIdStatus, setUserIdStatus] = useState(null);
  const [isCheckingUserId, setIsCheckingUserId] = useState(false);
  const passwordInputRef = useRef(null);
  const emailInputRef = useRef(null);

  // 비밀번호 조건 상태
  const passwordConditions = checkPasswordConditions(values.password);

  // 비밀번호 유효성 검사 핸들러 (blur 시 실행)
  const handlePasswordBlur = () => {
    if (values.password) {
      const error = validatePassword(values.password);
      if (error) {
        setError('password', error);
        // 유효성 검사 실패 시 포커스 유지
      } else {
        setError('password', null);
        // 유효성 검사 통과 시 이메일 필드로 포커스 이동
        if (emailInputRef.current) {
          emailInputRef.current.focus();
        }
      }
    } else {
      // 빈 값일 때는 에러 제거
      setError('password', null);
    }
  };

  // 이메일 유효성 검사 핸들러 (blur 시 실행)
  const handleEmailBlur = () => {
    if (values.email) {
      const error = validateEmail(values.email);
      if (error) {
        setError('email', error);
      } else {
        setError('email', null);
      }
    } else {
      // 빈 값일 때는 에러 제거
      setError('email', null);
    }
  };

  // 모든 필드 유효성 검사 및 버튼 활성화 체크
  useEffect(() => {
    const isUserIdValid =
      values.userId &&
      values.userId.trim() !== '' &&
      !errors.userId &&
      userIdStatus?.type === 'success';
    const isPasswordValid =
      values.password &&
      !errors.password &&
      validatePassword(values.password) === null;
    const isEmailValid =
      values.email && !errors.email && validateEmail(values.email) === null;

    setIsButtonDisabled(!(isUserIdValid && isPasswordValid && isEmailValid));
  }, [values.userId, values.password, values.email, errors, userIdStatus]);

  // 아이디 중복검사 핸들러
  const handleCheckUserId = async (shouldFocusNext = false) => {
    if (!values.userId || values.userId.trim() === '') {
      setError('userId', '아이디를 입력해주세요.');
      setUserIdStatus(null);
      return;
    }

    setIsCheckingUserId(true);
    setUserIdStatus(null);

    const result = await checkUserIdDuplicate(values.userId);

    setIsCheckingUserId(false);

    if (result.isValid) {
      setError('userId', null);
      setUserIdStatus({ type: 'success', message: result.message });
      // 중복검사 성공 시 다음 필드로 포커스 이동 (onSubmitEditing에서 호출된 경우만)
      if (shouldFocusNext && passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    } else {
      setError('userId', result.message);
      setUserIdStatus({ type: 'error', message: result.message });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <LabelTitle
        title="회원가입"
        useBackButton={true}
        onPressBack={() => navigation?.goBack()}
        navigation={navigation}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={[styles.statusBar]}>
          <View
            style={{ backgroundColor: colors.blue[400], width: '16.67%' }}
          ></View>
          <View
            style={{ backgroundColor: colors.white, width: '83.33%' }}
          ></View>
        </View>
        <View style={styles.inputFormContainer}>
          <View>
            <Input
              title="아이디"
              useTitle={true}
              placeholder="아이디를 입력해주세요"
              useMagnifyingGlass={false}
              value={values.userId}
              onChangeText={(text) => {
                handleChange('userId', text);
                setUserIdStatus(null); // 입력 시 상태 초기화
              }}
              onSubmitEditing={() => handleCheckUserId(true)}
              onBlur={() => handleCheckUserId(false)}
              returnKeyType="next"
              hasError={!!errors.userId}
            />
            {errors.userId && (
              <Text
                style={[
                  styles.userIdStatusText,
                  { color: colors.common.error },
                ]}
              >
                {errors.userId}
              </Text>
            )}
            {userIdStatus && !errors.userId && (
              <Text
                style={[
                  styles.userIdStatusText,
                  {
                    color:
                      userIdStatus.type === 'success'
                        ? colors.blue[500]
                        : colors.common.error,
                  },
                ]}
              >
                {userIdStatus.message}
              </Text>
            )}
            {isCheckingUserId && (
              <Text
                style={[styles.userIdStatusText, { color: colors.gray[600] }]}
              >
                확인 중...
              </Text>
            )}
          </View>
          <View>
            <Input
              ref={passwordInputRef}
              title="비밀번호"
              useTitle={true}
              placeholder="비밀번호를 입력해주세요"
              value={values.password}
              onChangeText={(text) => {
                handleChange('password', text);
                // 입력 중에는 에러 제거 (blur 시에만 검사)
                if (errors.password) {
                  setError('password', null);
                }
              }}
              onBlur={handlePasswordBlur}
              returnKeyType="next"
              secureTextEntry={true}
              hasError={!!errors.password}
            />
            {errors.password && (
              <Text
                style={{
                  color: colors.common.error,
                  fontSize: 12,
                  marginTop: 4,
                  marginLeft: 4,
                }}
              >
                {errors.password}
              </Text>
            )}
          </View>
          <View style={styles.passwordReminder}>
            <View style={styles.passwordReminderItem}>
              <CheckMark
                color={
                  passwordConditions.hasMinLength
                    ? colors.blue[400]
                    : colors.gray[300]
                }
              />
              <Text style={[styles.passwordReminderText, { marginLeft: 10 }]}>
                8자리 이상
              </Text>
            </View>
            <View style={styles.passwordReminderItem}>
              <CheckMark
                color={
                  passwordConditions.hasTwoTypes
                    ? colors.blue[400]
                    : colors.gray[300]
                }
              />
              <Text style={[styles.passwordReminderText, { marginLeft: 10 }]}>
                대문자,소문자,숫자,특수문자 중 2개 이상
              </Text>
            </View>
          </View>
          <View>
            <Input
              ref={emailInputRef}
              title="학교 이메일"
              useTitle={true}
              placeholder="메일주소를 입력해주세요"
              useMagnifyingGlass={false}
              keyboardType="email-address"
              value={values.email}
              onChangeText={(text) => {
                handleChange('email', text);
                // 입력 중에는 에러 제거 (blur 시에만 검사)
                if (errors.email) {
                  setError('email', null);
                }
              }}
              onBlur={handleEmailBlur}
              hasError={!!errors.email}
            />
            {errors.email && (
              <Text
                style={{
                  color: colors.common.error,
                  fontSize: 12,
                  marginTop: 4,
                  marginLeft: 4,
                }}
              >
                {errors.email}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.alreadyHaveAccountText}>
            이미 계정이 있으신가요?
          </Text>
          <Button
            disabled={isButtonDisabled}
            style={{
              width: '100%',
              height: 50,
              paddingHorizontal: 10,
              paddingVertical: 15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.blue[400],
              borderRadius: 10,
            }}
            textStyle={{
              color: colors.common.white,
              ...typography.heading6,
            }}
            title="인증번호 발송하기"
            onPress={() => {
              console.log('버튼 클릭됨, navigation:', navigation);
              console.log('isButtonDisabled:', isButtonDisabled);
              if (navigation) {
                navigation.navigate('ReceiveAuthCode');
              }
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpRepresentativeScreen;
