import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import LabelTitle from '../../../components/LabelTitle';
import Input from '../../../components/Input';
import { findRepresentativeEmailExist } from '../../../api/signUp';
import { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import {
  findCouncilPasswordValidateEmail,
  sendCouncilPasswordFindEmailCode,
} from '../../../api/councilLogin';

const UseEmailForPassword = ({ navigation, route }) => {
  const loginId = route.params?.loginId;
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (email.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email]);

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError(false);
  };

  const handleCheckEmailExistAndSendCode = async () => {
    const result = await findCouncilPasswordValidateEmail({ loginId, email });
    if (result && result.isValid) {
      setEmailError(false);
      setIsLoading(true);
      const sendResult = await sendCouncilPasswordFindEmailCode(email);
      setIsLoading(false);
      if (sendResult && sendResult.isSuccess) {
        navigation.navigate('ReceiveAuthCodeForPassword', {
          email: email,
          loginId: loginId,
        });
      } else {
        setEmailError(true);
        Alert.alert(sendResult.message);
      }
    } else {
      setEmailError(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LabelTitle
        title="학생대표자 비밀번호 찾기"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.statusBar}>
        <View style={{ backgroundColor: colors.gray[100], width: '100%' }} />
      </View>
      <KeyboardAvoidingView behavior="padding" style={styles.contentContainer}>
        <ScrollView>
          <Text style={{ ...typography.body3Regular, color: colors.gray[800] }}>
            회원가입시 입력한
          </Text>
          <Text
            style={{
              ...typography.heading4,
              color: colors.gray[850],
              marginTop: 4,
            }}
          >
            메일주소를 입력해주세요.
          </Text>
          <View style={{ marginTop: 56 }} />
          <Input
            useEmail={true}
            isOrange={true}
            placeholder="메일주소를 입력해주세요."
            useTitle={true}
            title="메일 주소"
            value={email}
            onChangeText={handleEmailChange}
            hasError={emailError}
          />
          {emailError && (
            <Text
              style={{
                ...typography.caption1Regular,
                color: colors.common.error,
                marginTop: 8,
              }}
            >
              아이디에 해당하는 학생회 이메일이 아닙니다
            </Text>
          )}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            disabled={isButtonDisabled}
            isOrange={true}
            title="인증번호 발송하기"
            onPress={async () => {
              if (!email.trim()) {
                setEmailError(true);
                return;
              }
              handleCheckEmailExistAndSendCode();
            }}
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
      </KeyboardAvoidingView>
      {isLoading && (
        <View style={styles.activityIndicatorContainer}>
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
  statusBar: {
    width: '100%',
    height: 5,
    marginTop: 10,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: 28,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 'auto',
    // paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  activityIndicatorContainer: {
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

export default UseEmailForPassword;
