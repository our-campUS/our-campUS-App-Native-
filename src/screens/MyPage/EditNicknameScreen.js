import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../style/colors';
import typography from '../../style/typography';
import LabelTitle from '../../components/LabelTitle';
import Input from '../../components/Input';
import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import CheckIcon from '../../../assets/check.svg';
import useAuthStore from '../../store/authStore';
import { getUserInfo, editNickname } from '../../api/user';

const EditNicknameScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const user = useAuthStore((state) => state.user);
  const { accessToken } = useAuthStore();
  useEffect(() => {
    const fetchLatestInfo = async () => {
      await getUserInfo();
    };
    fetchLatestInfo();
  }, []);

  // const handleSave = async () => {
  //   const response = await editNickname(nickname);
  //   if (response.isValid) {
  //     navigation.goBack();
  //   } else {
  //     if (response.errorType === 'NICKNAME_ALREADY_EXISTS') {
  //       setNicknameError(true);
  //       setErrorMessage('이미 존재하는 닉네임입니다.');
  //     }
  //     if (response.errorType === 'NICKNAME_LENGTH_INVALID') {
  //       setNicknameError(true);
  //       setErrorMessage('닉네임은 2~15자 이내로 작성해주세요.');
  //     }
  //   }
  // };

  const handleSave = async () => {
    const response = await editNickname(nickname, accessToken);
    if (response) {
      await getUserInfo();
      navigation.goBack();
    } else {
      setNicknameError(true);
      setErrorMessage('닉네임 수정 실패');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <LabelTitle
          title="닉네임"
          navigation={navigation}
          useBackButton={true}
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.inputWrapper}>
          <Input
            placeholder={user?.name || '사용자'}
            value={nickname}
            onChangeText={(text) => {
              setNickname(text);
              if (nicknameError) {
                setNicknameError(false);
                setErrorMessage('');
              }
            }}
            useTitle={true}
            title="닉네임"
            hasError={nicknameError}
          />
          {nicknameError && errorMessage && (
            <View style={styles.errorMessageWrapper}>
              <CheckIcon
                width={11}
                height={15}
                style={{ marginRight: 8 }}
                color={colors.common.error}
              />
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
      <View style={styles.buttonWrapper}>
        <Button
          title="저장"
          disabled={!nickname}
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
          onPress={handleSave}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  inputWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    // marginTop: 20.5,
  },
  errorMessage: {
    ...typography.caption1Regular,
    color: colors.common.error,
  },
  errorMessageWrapper: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonWrapper: {
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 28,
  },
});

export default EditNicknameScreen;
