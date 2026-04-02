import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import LabelTitle from '../../../components/LabelTitle';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useState } from 'react';
import CheckMark from '../../../../assets/check.svg';
import { changeCouncilPassword } from '../../../api/councilMyPage';
import CustomToast from '../../../components/CustomToast';
import useToastStore from '../../../store/toastStore';

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

const CouncilChangePasswordCode = ({ navigation }) => {
  const [prevPassword, setPrevPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [prevPasswordError, setPrevPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [newPasswordConfirmError, setNewPasswordConfirmError] = useState(false);
  const { showToast, hideToast } = useToastStore();

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

  const handleChangePasswordButtonPress = async () => {
    setPrevPasswordError(false);
    setNewPasswordError(false);
    setNewPasswordConfirmError(false);
    const result = await changeCouncilPassword(
      prevPassword,
      newPassword,
      newPasswordConfirm
    );
    if (result.success) {
      showToast('비밀번호 변경 성공', 'success');
      setTimeout(() => {
        hideToast();
        navigation.goBack();
      }, 1000);
    } else {
      if (result.message === '비밀번호가 틀렸습니다.') {
        setPrevPasswordError(true);
      } else if (result.message === '새 비밀번호가 틀렸습니다.') {
        setNewPasswordError(true);
      } else if (result.message === '비밀번호 재입력이 일치하지 않습니다.') {
        setNewPasswordConfirmError(true);
      }
    }
  };
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.wrapper}>
        <LabelTitle
          title="비밀번호 변경"
          useBackButton={true}
          onPressBack={() => navigation.goBack()}
          navigation={navigation}
        />
        <View style={{ width: '100%', height: 28 }} />
        <View style={styles.inputWrapper}>
          <Input
            useTitle={true}
            title="기존 비밀번호"
            isOrange={true}
            placeholder="기존 비밀번호를 입력하세요"
            usePassword={true}
            usePassWordIcon={true}
            value={prevPassword}
            onChangeText={(text) => {
              setPrevPassword(text);
              setPrevPasswordError(false);
              setNewPasswordError(false);
              setNewPasswordConfirmError(false);
            }}
            hasError={prevPasswordError}
          />
          {prevPasswordError && (
            <Text
              style={{
                color: colors.common.error,
                ...typography.caption1Regular,
                marginTop: -16,
                marginLeft: 4,
              }}
            >
              기존 비밀번호가 틀렸습니다.
            </Text>
          )}
          <View>
            <Input
              disabled={prevPassword.length === 0}
              useTitle={true}
              title="새 비밀번호"
              isOrange={true}
              placeholder="새 비밀번호를 입력하세요"
              usePassword={true}
              usePassWordIcon={true}
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                // 입력 중에는 에러 제거 (blur 시에만 검사)
                setPrevPasswordError(false);
                setNewPasswordError(false);
                setNewPasswordConfirmError(false);
              }}
              onBlur={handlePasswordBlur}
              returnKeyType="done"
              hasError={!!passwordError || newPasswordError}
            />
            {passwordError && (
              <Text
                style={{
                  color: colors.common.error,
                  ...typography.caption1Regular,
                  marginTop: 8,
                  marginLeft: 4,
                }}
              >
                {passwordError}
              </Text>
            )}
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

          <Input
            disabled={
              newPassword.length === 0 || validatePassword(newPassword) !== null
            }
            useTitle={true}
            title="새 비밀번호 확인"
            isOrange={true}
            placeholder="새 비밀번호 확인"
            usePassword={true}
            usePassWordIcon={true}
            value={newPasswordConfirm}
            onChangeText={(text) => {
              setNewPasswordConfirm(text);
              setNewPasswordConfirmError(false);
              setPrevPasswordError(false);
              setNewPasswordError(false);
            }}
            hasError={newPasswordConfirmError}
          />
          {newPasswordConfirmError && (
            <Text
              style={{
                color: colors.common.error,
                ...typography.caption1Regular,
                marginTop: -16,
                marginLeft: 4,
              }}
            >
              비밀번호 재입력이 일치하지 않습니다.
            </Text>
          )}
        </View>

        <Button
          disabled={
            prevPassword.length === 0 ||
            newPassword.length === 0 ||
            newPasswordConfirm.length === 0 ||
            !!passwordError ||
            validatePassword(newPassword) !== null
          }
          title="인증하기"
          onPress={handleChangePasswordButtonPress}
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
            marginTop: 'auto',
            marginBottom: 28,
          }}
          textStyle={{
            color: colors.common.white,
            ...typography.heading6,
          }}
        />
      </View>
      <CustomToast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  wrapper: {
    paddingHorizontal: 20,
    flex: 1,
  },
  inputWrapper: {
    gap: 24,
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
  button: {
    marginTop: 'auto',
    marginBottom: 28,
  },
});

export default CouncilChangePasswordCode;
