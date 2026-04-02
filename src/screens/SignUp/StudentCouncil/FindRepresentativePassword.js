import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import LabelTitle from '../../../components/LabelTitle';
import Input from '../../../components/Input';
import { checkRepresentativeIdExist } from '../../../api/signUp';
import { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import { findCouncilPasswordValidateLoginId } from '../../../api/councilLogin';

const FindRepresentativePassword = ({ navigation }) => {
  const [loginId, setLoginId] = useState('');
  const [loginIdError, setLoginIdError] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (loginId.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [loginId]);

  const handleLoginIdChange = (text) => {
    setLoginId(text);
    setLoginIdError(false);
  };

  const handleValidateLoginId = async () => {
    const result = await findCouncilPasswordValidateLoginId(loginId);
    if (result && result.isValid) {
      setLoginIdError(false);
      navigation.navigate('UseEmailForPassword', { loginId: loginId });
    } else {
      setLoginIdError(true);
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
        <View
          style={{ backgroundColor: colors.gray[100], width: '100%' }}
         />
      </View>
      <KeyboardAvoidingView behavior="padding" style={styles.contentContainer}>
        <ScrollView>
          <Text style={{ ...typography.body3Regular, color: colors.gray[800] }}>
            비밀번호 재설정을 위해
          </Text>
          <Text
            style={{
              ...typography.heading4,
              color: colors.gray[850],
              marginTop: 4,
            }}
          >
            아이디를 입력해주세요.
          </Text>
          <View style={{ marginTop: 56 }} />
          <Input
            useId={true}
            isOrange={true}
            placeholder="아이디를 입력해주세요."
            useTitle={true}
            title="아이디"
            value={loginId}
            onChangeText={handleLoginIdChange}
            hasError={loginIdError}
          />
          {loginIdError && (
            <Text
              style={{
                ...typography.caption1Regular,
                color: colors.common.error,
                marginTop: 8,
              }}
            >
              존재하지 않는 아이디입니다.
            </Text>
          )}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            disabled={isButtonDisabled}
            isOrange={true}
            title="다음"
            onPress={async () => {
              if (!loginId.trim()) {
                setLoginIdError(true);
                return;
              }
              handleValidateLoginId();
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
});

export default FindRepresentativePassword;
