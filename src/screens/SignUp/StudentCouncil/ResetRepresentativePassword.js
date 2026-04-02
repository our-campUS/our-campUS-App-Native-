import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import LabelTitle from '../../../components/LabelTitle';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useState, useRef, useEffect } from 'react';
import CheckMark from '../../../../assets/check.svg';
import { resetCouncilPassword } from '../../../api/councilLogin';
import Toast from 'react-native-toast-message';

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

const ResetRepresentativePassword = ({ navigation, route }) => {
  const email = route.params?.email;
  const loginId = route.params?.loginId;
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const passwordInputRef = useRef(null);

  // 비밀번호 조건 상태
  const passwordConditions = checkPasswordConditions(newPassword);

  // 비밀번호 유효성 검사 핸들러 (blur 시 실행)
  const handlePasswordBlur = () => {
    if (newPassword) {
      const error = validatePassword(newPassword);
      if (error) {
        setPasswordError(error);
      } else {
        setPasswordError(null);
      }
    } else {
      // 빈 값일 때는 에러 제거
      setPasswordError(null);
    }
  };

  // 버튼 활성화/비활성화 체크
  useEffect(() => {
    const isPasswordValid =
      newPassword && !passwordError && validatePassword(newPassword) === null;
    setIsButtonDisabled(!isPasswordValid);
  }, [newPassword, passwordError]);

  const handleResetPassword = async () => {
    console.log(' api 호출 전 email', email);
    console.log(' api 호출 전 loginId', loginId);
    console.log(' api 호출 전 newPassword', newPassword);
    const result = await resetCouncilPassword(email, loginId, newPassword);
    console.log('resetCouncilPassword result', result);
    if (result.isSuccess) {
      Toast.show({
        type: 'success',
        text1: '비밀번호 재설정 성공',
        text2: '비밀번호가 성공적으로 재설정되었습니다.',
        position: 'top',
        visibilityTime: 1000,
        autoHide: true,
      });
      Keyboard.dismiss();
      setTimeout(() => {
        navigation?.reset({
          index: 0,
          routes: [{ name: 'LoginRepresentative' }],
        });
      }, 1000);
    } else {
      Alert.alert(result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LabelTitle
        title="학생대표자 비밀번호 찾기"
        useBackButton={true}
        onPressBack={() => navigation?.goBack()}
      />
      <View style={styles.statusBar}>
        <View
          style={{ backgroundColor: colors.gray[100], width: '100%' }}
         />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.contents}>
          <Text style={{ ...typography.body3Regular, color: colors.gray[800] }}>
            학생회계정의
          </Text>
          <Text
            style={{
              ...typography.heading4,
              color: colors.gray[850],
              marginTop: 4,
            }}
          >
            새로운 비밀번호를 입력해주세요.
          </Text>
          <View style={styles.inputWrapper}>
            <Input
              isOrange={true}
              ref={passwordInputRef}
              useTitle={true}
              title="새로운 비밀번호"
              placeholder="비밀번호를 입력해주세요"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                // 입력 중에는 에러 제거 (blur 시에만 검사)
                if (passwordError) {
                  setPasswordError(null);
                }
              }}
              onBlur={handlePasswordBlur}
              returnKeyType="done"
              usePassword={true}
              usePassWordIcon={true}
              hasError={!!passwordError}
            />
            {passwordError && (
              <Text
                style={{
                  color: colors.common.error,
                  fontSize: 12,
                  marginTop: 4,
                  marginLeft: 4,
                }}
              >
                {passwordError}
              </Text>
            )}
          </View>
          <View style={styles.passwordReminder}>
            <View style={styles.passwordReminderItem}>
              <CheckMark
                color={
                  passwordConditions.hasMinLength
                    ? colors.orange[400]
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
                    ? colors.orange[400]
                    : colors.gray[300]
                }
              />
              <Text style={[styles.passwordReminderText, { marginLeft: 10 }]}>
                대문자,소문자,숫자,특수문자 중 2개 이상
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <Button
          isOrange={true}
          title="비밀번호 재설정"
          disabled={isButtonDisabled}
          onPress={() => handleResetPassword()}
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
        />
      </View>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  statusBar: {
    width: '100%',
    height: 5,
    marginTop: 10,
  },
  contents: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 28,
    flex: 1,
  },
  inputWrapper: {
    marginTop: 56,
  },
  passwordReminder: {
    marginTop: 8,
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
  buttonWrapper: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 'auto',
  },
});

export default ResetRepresentativePassword;
