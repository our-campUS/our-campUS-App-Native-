import { View, Text, StyleSheet, ScrollView } from 'react-native';
import colors from '../style/colors';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../components/LabelTitle';
import Input from '../components/Input';
import typography from '../style/typography';
import { useState } from 'react';
import MajorInputModal from '../components/majorInputModal';
import Button from '../components/Button';

const styles = StyleSheet.create({
  statusBar: {
    height: 5,
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
  },
  inputWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 56,
    gap: 24,
  },
  greetingContainer: {
    width: '100%',
    marginLeft: 20,
    marginTop: 50,
    gap: 4,
    // alignSelf: 'center',
  },
  greetingTitle: {
    ...typography.body3Regular,
  },
  greetingSubtitle: {
    ...typography.heading4,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 'auto',
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.blue[400],
    ...typography.heading6,
  },
});

const SignUpFirstScreen = ({ navigation }) => {
  const [isMajorInputModalVisible, setIsMajorInputModalVisible] =
    useState(false);
  const [major, setMajor] = useState(null);
  const [university, setUniversity] = useState('');
  const [department, setDepartment] = useState(null);

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, width: '100%', backgroundColor: '#FFFFFF' }}
      >
        <StatusBar style="auto" />
        <LabelTitle
          title="회원가입"
          // useBackButton={}
          onPressBack={() => navigation.goBack()}
          navigation={navigation}
        />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={[styles.statusBar]}>
            <View
              style={{ backgroundColor: colors.blue[400], width: '50%' }}
            ></View>
            <View
              style={{ backgroundColor: colors.white, width: '50%' }}
            ></View>
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingTitle}>xxx님, 안녕하세요!</Text>
            <Text style={styles.greetingSubtitle}>
              학교 및 전공 정보를 입력해주세요
            </Text>
          </View>
          <View style={styles.inputWrapper}>
            <Input
              title="학교"
              useTitle={true}
              placeholder="학교 이름을 입력해주세요"
              useMagnifyingGlass={true}
              value={university}
              onChangeText={setUniversity}
            />
            <Input
              title="단과 대학"
              useTitle={true}
              placeholder="학과 선택시 자동으로 입력됩니다"
              value={department || ''}
              disabled={true}
              additionalStyle={{ backgroundColor: colors.gray[250] }}
            />
            <Input
              title="학과"
              useTitle={true}
              placeholder="학과를 입력해주세요"
              useMagnifyingGlass={true}
              value={major || ''}
              usePopUPModal={true}
              onPressPopUPModal={() => {
                setIsMajorInputModalVisible(true);
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="다음"
              disabled={!university.trim() || !department || !major}
              onPress={() => navigation.navigate('SignUpSecondScreen')}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      {isMajorInputModalVisible && (
        <MajorInputModal
          onClose={() => setIsMajorInputModalVisible(false)}
          onSelect={(selectedMajor, selectedCollege) => {
            setMajor(selectedMajor);
            setDepartment(selectedCollege);
            setIsMajorInputModalVisible(false);
          }}
        />
      )}
    </>
  );
};
export default SignUpFirstScreen;
