import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import LabelTitle from '../../../components/LabelTitle';
import Input from '../../../components/Input';
import { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import { sendCouncilPasswordFindEmailCode } from '../../../api/councilLogin';

const CouncilChangePasswordEmail = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isEmailFormatError, setIsEmailFormatError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsButtonDisabled(!email.trim() || isLoading);
  }, [email, isLoading]);

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError(false);
    setIsEmailFormatError(false);
  };

  const checkEmailFormat = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(ac\.kr|edu)$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async () => {
    if (!checkEmailFormat()) {
      setIsEmailFormatError(true);
      return;
    }

    setIsLoading(true);
    const result = await sendCouncilPasswordFindEmailCode(email);
    setIsLoading(false);

    if (result.isSuccess) {
      navigation.navigate('CouncilChangePasswordVerifyCode', {
        email: email,
      });
    } else {
      setEmailError(true);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="비밀번호 변경"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView behavior="padding" style={styles.contentContainer}>
        <ScrollView>
          <Input
            useEmail={true}
            isOrange={true}
            placeholder="qwer1234@cau.ac.kr"
            useTitle={true}
            title="이메일 주소"
            value={email}
            onChangeText={handleEmailChange}
          />
          {isEmailFormatError && (
            <Text style={styles.errorText}>
              학교 이메일(.ac.kr 또는 .edu)로 입력해주세요.
            </Text>
          )}
          {emailError && (
            <Text style={styles.errorText}>
              해당 이메일로 가입된 아이디가 없습니다.
            </Text>
          )}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            isOrange={true}
            disabled={isButtonDisabled}
            title="인증번호 발송하기"
            onPress={handleSendCode}
            style={styles.button}
          />
        </View>
      </KeyboardAvoidingView>
      {isLoading && (
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
    backgroundColor: colors.common.white,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    flex: 1,
  },
  errorText: {
    ...typography.caption1Regular,
    color: colors.common.error,
    marginTop: 8,
  },
  button: {
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.orange[400],
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 30,
    alignItems: 'center',
  },
  loadingSpinnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default CouncilChangePasswordEmail;
