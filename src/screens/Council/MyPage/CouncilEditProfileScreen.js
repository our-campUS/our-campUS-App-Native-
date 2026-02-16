import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import LabelTitle from '../../../components/LabelTitle';
import Input from '../../../components/Input';
import { useState } from 'react';
import { editNickname } from '../../../api/profile';
import Button from '../../../components/Button';
import CheckIcon from '../../../../assets/check.svg';
import useAuthStore from '../../../store/authStore';
import { changeCouncilNickname } from '../../../api/councilMyPage';
import { getUserInfo } from '../../../api/user';

const CouncilEditProfileScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const [nickname, setNickname] = useState('');
  const [councilInfo, setCouncilInfo] = useState('');
  const [nicknameError, setNicknameError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // const handleSave = async () => {
  //   const response = await editNickname(nickname, accessToken);
  //   if (response) {
  //     await getUserInfo();
  //     navigation.goBack();
  //   } else {
  //     setNicknameError(true);
  //     setErrorMessage('닉네임 수정 실패');
  //   }
  // };

  const handleChangeNickname = async () => {
    const result = await changeCouncilNickname(nickname);
    if (result) {
      // await getUserInfo();
      navigation.goBack();
    } else {
      setNicknameError(true);
      setErrorMessage('학생회 이름 수정 실패');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <LabelTitle
          title="이메일 수정"
          navigation={navigation}
          useBackButton={true}
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.inputWrapper}>
          <Input
            isOrange={true}
            placeholder={user?.councilNickname || '미지정(등록필요)'}
            value={nickname}
            onChangeText={(text) => {
              setNickname(text);
            }}
            useTitle={true}
            title="학생회 이름"
          />
          {/* <Input
            disabled={true}
            isOrange={true}
            placeholder={user?.councilName || '미지정(등록필요)'}
            value={user?.councilName}
            useTitle={true}
            title="학생회 정보"
          /> */}
        </View>
      </KeyboardAvoidingView>
      <View style={styles.buttonWrapper}>
        <Button
          isOrange={true}
          title="다음"
          disabled={!nickname}
          style={{
            width: '100%',
            height: 50,
            paddingHorizontal: 10,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.orange[500],
            borderRadius: 10,
          }}
          onPress={() => handleChangeNickname()}
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
    gap: 24,
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

export default CouncilEditProfileScreen;
