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

const CouncilEditProfileScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [councilInfo, setCouncilInfo] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <LabelTitle
          title="프로필 수정"
          navigation={navigation}
          useBackButton={true}
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.inputWrapper}>
          <Input
            isOrange={true}
            placeholder="일타"
            value={nickname}
            onChangeText={(text) => {
              setNickname(text);
            }}
            useTitle={true}
            title="학생회 이름"
          />
          <Input
            isOrange={true}
            placeholder="중앙대학교 경영경제대학 제12대 학생회"
            value={councilInfo}
            onChangeText={(text) => {
              setCouncilInfo(text);
            }}
            useTitle={true}
            title="학생회 정보"
          />
        </View>
      </KeyboardAvoidingView>
      <View style={styles.buttonWrapper}>
        <Button
          isOrange={true}
          title="다음"
          disabled={!nickname || !councilInfo}
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
          onPress={() => navigation.navigate('CouncilSendEmailCode')}
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
    marginTop: 20.5,
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
