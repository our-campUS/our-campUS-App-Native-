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
import { findRepresentativeEmailExist } from '../../../api/signUp';
import { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import { sendCouncilEmailCode } from '../../../api/councilLogin';

const FindRepresentativeId = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isEmailFormatError, setIsEmailFormatError] = useState(false);
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
    setIsEmailFormatError(false);
  };

  const checkEmailFormat = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(ac\.kr|edu)$/;
    return emailRegex.test(email);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="학생대표자 아이디 찾기"
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
          {isEmailFormatError && (
            <Text
              style={{
                ...typography.caption1Regular,
                color: colors.common.error,
                marginTop: 8,
              }}
            >
              학교 이메일(.ac.kr 또는 .edu)로 입력해주세요.
            </Text>
          )}
          {emailError && (
            <Text
              style={{
                ...typography.caption1Regular,
                color: colors.common.error,
                marginTop: 8,
              }}
            >
              해당 이메일로 가입된 아이디가 없습니다.
            </Text>
          )}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            isOrange={true}
            disabled={isButtonDisabled}
            title="인증번호 발송하기"
            onPress={async () => {
              if (!checkEmailFormat()) {
                setIsEmailFormatError(true);
                return;
              } else {
                setIsLoading(true);
                const result = await sendCouncilEmailCode(email);
                setIsLoading(false);
                console.log('result API 호출 결과 : ', result);
                if (result.code === 200) {
                  navigation.navigate('VerifyRepresentativeIdCode', {
                    email: email,
                  });
                } else {
                  setEmailError(true);
                }
              }
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

export default FindRepresentativeId;
