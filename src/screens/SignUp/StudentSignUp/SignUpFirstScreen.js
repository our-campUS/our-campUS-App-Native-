import { View, Text, StyleSheet, ScrollView, Keyboard } from 'react-native';
import colors from '@style/colors';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '@components/LabelTitle';
import Input from '@components/Input';
import typography from '@style/typography';
import { useState, useEffect } from 'react';
import MajorInputModal from '@components/majorInputModal';
import Button from '@components/Button';
// TODO: 학교 선택 기능 재오픈 시 주석 해제
// import UniversityInputModal from '@components/UniversityInputModal';
import { searchUniversity, sendUserProfile } from '@api/signUp';

const FIXED_UNIVERSITY_NAME = '중앙대학교 서울캠퍼스';

const SignUpFirstScreen = ({ navigation, route }) => {
  const [isMajorInputModalVisible, setIsMajorInputModalVisible] =
    useState(false);
  // TODO: 학교 선택 기능 재오픈 시 주석 해제
  // const [isUniversityInputModalVisible, setIsUniversityInputModalVisible] =
  //   useState(false);
  const [major, setMajor] = useState(null);
  const [majorId, setMajorId] = useState(null);
  // TODO: 학교 선택 기능 재오픈 시 주석 해제 후 고정값 제거
  // const [university, setUniversity] = useState(null);
  const [universityId, setUniversityId] = useState(null);
  const [department, setDepartment] = useState(null);
  // const [departmentId, setDepartmentId] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // 마운트 시 중앙대학교 schoolId 자동 조회
  useEffect(() => {
    const fetchUniversityId = async () => {
      try {
        const result = await searchUniversity('중앙대학교');
        if (result && result.length > 0) {
          setUniversityId(result[0].schoolId);
        }
      } catch (error) {
        console.error('학교 ID 조회 실패:', error);
      }
    };
    fetchUniversityId();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleFinalSignUpSubmit = async () => {
    const result = await sendUserProfile(universityId, majorId);
    console.log('✅ Final Sign Up Submit Response:', result);
    if (result) {
      navigation.navigate('SignUpSecondScreen', {
        userName: route.params?.userName,
        university: FIXED_UNIVERSITY_NAME,
        department: department,
        major: major,
      });
    } else {
      Alert.alert('오류', '회원가입에 실패하였습니다.');
    }
  };

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, width: '100%', backgroundColor: '#FFFFFF' }}
      >
        <StatusBar style="auto" />

        <LabelTitle
          title="회원가입"
          useBackButton={true}
          onPressBack={() => navigation.goBack()}
          navigation={navigation}
        />
        <View style={{ width: 100, height: 20 }} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={[styles.statusBar]}>
            <View
              style={{ backgroundColor: colors.blue[400], width: '50%' }}
             />
            <View
              style={{ backgroundColor: colors.gray[100], width: '50%' }}
             />
          </View>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingTitle}>
              {route.params?.userName || '사용자'}님, 안녕하세요!
            </Text>
            <Text style={styles.greetingSubtitle}>
              학교 및 전공 정보를 입력해주세요
            </Text>
          </View>
          <View style={styles.inputWrapper}>
            <Input
              title="학교"
              useTitle={true}
              placeholder="학교 이름을 입력해주세요"
              value={FIXED_UNIVERSITY_NAME}
              onlyRead={true}
              // TODO: 학교 선택 기능 재오픈 시 아래 주석 해제 + onlyRead 제거 + value={university}
              // useMagnifyingGlass={true}
              // usePopUPModal={true}
              // onPressPopUPModal={() => {
              //   setIsUniversityInputModalVisible(true);
              // }}
            />
            {/* TODO: 학교 선택 기능 재오픈 시 단과대 필드 주석 해제 */}
            {/* <Input
              title="단과 대학"
              useTitle={true}
              placeholder="학과 선택시 자동으로 입력됩니다"
              value={department || ''}
              disabled={true}
              additionalStyle={{ backgroundColor: colors.gray[250] }}
            /> */}
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
              disabled={universityId === null}
              additionalStyle={
                universityId === null
                  ? { backgroundColor: colors.gray[250] }
                  : {}
              }
            />
          </View>
          <View
            style={[
              styles.buttonContainer,
              isKeyboardVisible && styles.buttonContainerHidden,
            ]}
          >
            <Button
              title="다음"
              disabled={!major || !universityId}
              onPress={() => handleFinalSignUpSubmit()}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      {isMajorInputModalVisible && (
        <MajorInputModal
          universityId={universityId}
          onClose={() => setIsMajorInputModalVisible(false)}
          onSelect={async (selectedMajor) => {
            setMajor(selectedMajor.majorName);
            setMajorId(selectedMajor.majorId);
            setDepartment(selectedMajor.collegeName);
            // setDepartmentId(selectedMajor.collegeId);
            setIsMajorInputModalVisible(false);
          }}
        />
      )}
      {/* TODO: 학교 선택 기능 재오픈 시 주석 해제 */}
      {/* {isUniversityInputModalVisible && (
        <UniversityInputModal
          onClose={() => setIsUniversityInputModalVisible(false)}
          onSelect={(selectedUniversity) => {
            console.log('✅ Selected University:', selectedUniversity);
            setUniversity(selectedUniversity.schoolName);
            setUniversityId(selectedUniversity.schoolId);
            setIsUniversityInputModalVisible(false);
          }}
        />
      )} */}
    </>
  );
};

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
  buttonContainerHidden: {
    height: 0,
    marginBottom: 0,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: colors.blue[400],
    ...typography.heading6,
  },
});

export default SignUpFirstScreen;
