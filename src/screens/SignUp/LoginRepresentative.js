import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import LabelTitle from '../../components/LabelTitle';
import colors from '../../style/colors';
import Input from '../../components/Input';
import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import typography from '../../style/typography';
import { representativeLogin } from '../../api/signUp';

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
  const [idError, setIdError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.common.white }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.common.white }}
      >
        <LabelTitle
          title="학생 대표자 로그인"
          useBackButton={true}
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.statusBar}>
          <View
            style={{ backgroundColor: colors.gray[100], width: '100%' }}
          ></View>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.contentContainer}>
            <Input
              placeholder="아이디를 입력해주세요"
              title="아이디"
              useTitle={true}
              useMagnifyingGlass={false}
              value={userId}
              onChangeText={(text) => {
                setUserId(text);
                if (idError) setIdError(false);
              }}
              hasError={idError}
            />
            {idError && (
              <Text style={styles.errorText}>존재하지 않는 아이디입니다.</Text>
            )}
            <Input
              placeholder="비밀번호를 입력해주세요"
              title="비밀번호"
              useMagnifyingGlass={false}
              usePassword={true}
              usePassWordIcon={true}
              useTitle={true}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError(false);
              }}
              hasError={passwordError}
            />
            {passwordError && (
              <Text style={styles.errorText}>
                비밀번호가 일치하지 않습니다.
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
            title="로그인하기"
            onPress={() => {
              // 입력값 검증
              if (!userId.trim()) {
                setIdError(true);
                setPasswordError(false);
                return;
              }
              if (!password.trim()) {
                setIdError(false);
                setPasswordError(true);
                return;
              }

              representativeLogin(userId, password)
                .then((res) => {
                  if (res.isValid) {
                    setIdError(false);
                    setPasswordError(false);
                    navigation.navigate('MainTab');
                  } else {
                    if (res.idmatch && !res.passwordmatch) {
                      setIdError(false);
                      setPasswordError(true);
                    } else if (!res.idmatch) {
                      setIdError(true);
                      setPasswordError(true);
                    } else {
                      // 기타 에러 경우
                      setIdError(true);
                      setPasswordError(true);
                    }
                  }
                })
                .catch((error) => {
                  console.error('로그인 오류:', error);
                  setIdError(true);
                  setPasswordError(true);
                });
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

export default LoginRepresentative;
