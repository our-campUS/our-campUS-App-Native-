import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import LabelTitle from '../../../components/LabelTitle';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
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
  contents: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 28,
    flex: 1,
  },
  inputWrapper: {
    marginTop: 56,
  },
  buttonWrapper: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 'auto',
  },
});

const FoundRepresentativeId = ({ navigation, route }) => {
  const loginId = route.params?.loginId;
  return (
    <SafeAreaView style={styles.container}>
      <LabelTitle
        title="학생대표자 아이디 찾기"
        useBackButton={true}
        onPressBack={() => navigation?.goBack()}
      />
      <View style={styles.statusBar}>
        <View
          style={{ backgroundColor: colors.gray[100], width: '100%' }}
         />
      </View>
      <View style={styles.contents}>
        <Text style={{ ...typography.body3Regular, color: colors.gray[800] }}>
          중앙대학교 통일공대 학생회의
        </Text>
        <Text
          style={{
            ...typography.heading4,
            color: colors.gray[850],
            marginTop: 4,
          }}
        >
          아이디를 찾았어요.
        </Text>
        <View style={styles.inputWrapper}>
          <Input
            useTitle={true}
            title="아이디"
            onlyRead={true}
            value={loginId}
            additionalStyle={{
              backgroundColor: colors.blue['050'],
            }}
          />
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          isOrange={true}
          title="로그인하러 가기"
          onPress={() => {
            navigation?.reset({
              index: 0,
              routes: [{ name: 'SignUpRepresentativeScreen' }],
            });
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
    </SafeAreaView>
  );
};

export default FoundRepresentativeId;
