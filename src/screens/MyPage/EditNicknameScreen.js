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

const NICKNAME_REGEX = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]*$/;

const EditNicknameScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [nicknameError, setNicknameError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    const fetchLatestInfo = async () => {
      await getUserInfo();
    };
    fetchLatestInfo();
  }, []);

  const handleChangeNickname = (text) => {
    setNickname(text);
    if (!NICKNAME_REGEX.test(text)) {
      setNicknameError(true);
      setErrorMessage('영문, 한글, 숫자만 사용 가능해요');
    } else {
      setNicknameError(false);
      setErrorMessage('');
    }
  };

  const handleSave = async () => {
    const result = await editNickname(nickname);
    if (result.success) {
      await getUserInfo();
      navigation.goBack();
    } else if (result.errorType === 'DUPLICATE') {
      setNicknameError(true);
      setErrorMessage('이미 사용 중인 닉네임이예요');
    } else {
      setNicknameError(true);
      setErrorMessage('닉네임 수정에 실패했어요');
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
            onChangeText={handleChangeNickname}
            useTitle={true}
            title="닉네임"
            hasError={nicknameError}
            maxLength={15}
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
          disabled={!nickname || nickname.length < 2 || nicknameError}
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
