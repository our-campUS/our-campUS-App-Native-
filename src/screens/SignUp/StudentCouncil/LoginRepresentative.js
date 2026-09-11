import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import LabelTitle from '../../../components/LabelTitle';
import colors from '../../../style/colors';
import Input from '../../../components/Input';
import { useState } from 'react';
import Button from '../../../components/Button';
import typography from '../../../style/typography';
import { councilLogin, COUNCIL_LOGIN_ERROR } from '../../../api/councilLogin';

const LOGIN_ERROR_MESSAGE = {
  [COUNCIL_LOGIN_ERROR.INVALID_CREDENTIALS]:
    '아이디 또는 비밀번호가 일치하지 않습니다.',
  [COUNCIL_LOGIN_ERROR.INVALID_INPUT]: '입력값을 다시 확인해주세요.',
  [COUNCIL_LOGIN_ERROR.NETWORK]: '네트워크 연결을 확인해주세요.',
  [COUNCIL_LOGIN_ERROR.UNKNOWN]:
    '로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
};

// 입력값이 원인일 때만 테두리를 경고색으로 바꾼다
const FIELD_ERRORS = [
  COUNCIL_LOGIN_ERROR.INVALID_CREDENTIALS,
  COUNCIL_LOGIN_ERROR.INVALID_INPUT,
];

const styles = StyleSheet.create({
  statusBar: {
    flexDirection: 'row',
    width: '100%',
    height: 5,
    marginTop: 10,
  },
  contentContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginTop: 28,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 30,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: 170,
  },
  searchText: {
    ...typography.caption1Bold,
    color: colors.gray[400],
  },
  errorText: {
    ...typography.caption1Regular,
    color: colors.common.error,
    marginTop: -8,
  },
});

const LoginRepresentative = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  const isButtonDisabled = !userId.trim() || !password.trim();
  const hasFieldError = FIELD_ERRORS.includes(loginError);

  const handleLoginPress = async () => {
    const result = await councilLogin({ loginId: userId, password: password });
    if (!result.success) {
      setLoginError(result.error);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.common.white }}
      edges={['left', 'right', 'bottom']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.common.white }}
      >
        <LabelTitle
          title="학생 대표자 로그인"
          useBackButton={true}
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.statusBar}>
          <View style={{ backgroundColor: colors.gray[100], width: '100%' }} />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.contentContainer}>
            <Input
              useId={true}
              isOrange={true}
              placeholder="아이디를 입력해주세요"
              title="아이디"
              useTitle={true}
              useMagnifyingGlass={false}
              value={userId}
              onChangeText={(text) => {
                setUserId(text);
                setLoginError(null);
              }}
              hasError={hasFieldError}
            />
            <Input
              isOrange={true}
              placeholder="비밀번호를 입력해주세요"
              title="비밀번호"
              useMagnifyingGlass={false}
              usePassword={true}
              usePassWordIcon={true}
              useTitle={true}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setLoginError(null);
              }}
              hasError={hasFieldError}
            />
            {loginError && (
              <Text style={styles.errorText}>
                {LOGIN_ERROR_MESSAGE[loginError]}
              </Text>
            )}
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <View style={styles.searchContainer}>
            <Text
              style={styles.searchText}
              onPress={() => navigation.navigate('FindRepresentativeId')}
            >
              아이디 찾기
            </Text>
            <Text style={styles.searchText}>|</Text>
            <Text
              style={styles.searchText}
              onPress={() => navigation.navigate('FindRepresentativePassword')}
            >
              비밀번호 찾기
            </Text>
          </View>
          <Button
            disabled={isButtonDisabled}
            isOrange={true}
            title="로그인하기"
            onPress={handleLoginPress}
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

export default LoginRepresentative;
