import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../style/colors';
import typography from '../../style/typography';
import LabelTitle from '../../components/LabelTitle';
import Input from '../../components/Input';
import { findRepresentativeEmailExist } from '../../api/signUp';
import { useState } from 'react';
import Button from '../../components/Button';

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
});

const UseEmailForPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <LabelTitle
        title="학생대표자 비밀번호 찾기"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.statusBar}>
        <View
          style={{ backgroundColor: colors.gray[100], width: '100%' }}
        ></View>
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
          <View style={{ marginTop: 56 }}></View>
          <Input
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
              해당 이메일로 가입된 아이디가 없습니다.
            </Text>
          )}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            title="인증번호 발송하기"
            onPress={async () => {
              if (!email.trim()) {
                setEmailError(true);
                return;
              }
              try {
                const result = await findRepresentativeEmailExist(email);
                if (result && result.isValid) {
                  setEmailError(false);
                  navigation.navigate('ReceiveAuthCodeForPassword');
                } else {
                  setEmailError(true);
                }
              } catch (error) {
                console.error('이메일 확인 오류:', error);
                setEmailError(true);
              }
            }}
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
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UseEmailForPassword;
