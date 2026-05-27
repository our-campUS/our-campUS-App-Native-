import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Keyboard,
  Alert,
} from 'react-native';
import colors from '../../style/colors';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../../components/LabelTitle';
import Input from '../../components/Input';
import typography from '../../style/typography';
import { useState, useEffect } from 'react';
import { parseISODate } from '../../utils/dateTime';
import MajorInputModal from '../../components/majorInputModal';
import Button from '../../components/Button';
import { searchUniversity } from '../../api/signUp';
import { editAcademicInfo } from '../../api/user';
import ScholarChangeConfirmBottomSheet from '../../components/MyPage/ScholarChangeConfirmBottomSheet';
import Toast from '../../components/common/Toast';
import useToast from '../../hooks/useToast';
import useAuthStore from '../../store/authStore';

const ChangeScholarInfoScreen = ({ navigation, route }) => {
  const { user } = useAuthStore();
  const { toastVisible, toastMessage, showToast, hideToast } = useToast();
  const [isMajorInputModalVisible, setIsMajorInputModalVisible] =
    useState(false);
  const [major, setMajor] = useState(user?.majorName || null);
  const [majorId, setMajorId] = useState(null);
  const [university] = useState('중앙대학교');
  const [universityId, setUniversityId] = useState(null);
  const [department, setDepartment] = useState(user?.collegeName || null);
  const [departmentId, setDepartmentId] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isConfirmBottomSheetVisible, setIsConfirmBottomSheetVisible] =
    useState(false);
  useEffect(() => {
    const fetchUniversityId = async () => {
      try {
        const result = await searchUniversity('중앙대학교');
        if (result && result.length > 0) {
          setUniversityId(result[0].schoolId);
        }
      } catch (error) {
        // silent
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

  // const handleFinalSignUpSubmit = async () => {
  //   const result = await editAcademicInfo(universityId, majorId);
  //   console.log('✅ Final Sign Up Submit Response:', result);
  //   if (result) {
  //     showToast('학적정보 변경이 완료되었습니다.', 'success');
  //     navigation.goBack();
  //   } else {
  //     showToast('학적정보 변경에 실패하였습니다.', 'error');
  //   }
  // };

  const handleChangeScholarInfo = async () => {
    const result = await editAcademicInfo(universityId, majorId);
    if (result.success) {
      useAuthStore.getState().updateUser({
        schoolName: university,
        collegeName: department,
        majorName: major,
        nextUpdateAvailableDate: result.nextUpdateAvailableDate,
      });
      showToast('학적정보 변경이 완료되었습니다.');
      setTimeout(() => {
        hideToast();
        navigation.goBack();
      }, 1500);
    } else {
      showToast('학적정보 변경에 실패하였습니다.');
    }
    setIsConfirmBottomSheetVisible(false);
  };

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, width: '100%', backgroundColor: '#FFFFFF' }}
        edges={['left', 'right', 'bottom']}
      >
        {/* <StatusBar style="auto" /> */}

        <LabelTitle
          title="학적정보"
          useBackButton={true}
          onPressBack={() => navigation.goBack()}
          navigation={navigation}
        />
        {/* <View style={{ width: 100, height: 20 }}></View> */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* <View style={[styles.statusBar]}>
            <View
              style={{ backgroundColor: colors.blue[400], width: '50%' }}
            ></View>
            <View
              style={{ backgroundColor: colors.gray[100], width: '50%' }}
            ></View>
          </View> */}
          {/* <View style={styles.greetingContainer}>
            <Text style={styles.greetingTitle}>
              {route.params?.userName || '사용자'}님, 안녕하세요!
            </Text>
            <Text style={styles.greetingSubtitle}>
              학교 및 전공 정보를 입력해주세요
            </Text>
          </View> */}
          <View style={styles.inputWrapper}>
            <Input
              title="대학교"
              useTitle={true}
              placeholder="학교 이름을 입력해주세요"
              value={university}
              disabled={true}
              additionalStyle={{ backgroundColor: colors.gray[250] }}
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
              disabled={university === '' || universityId === null}
              additionalStyle={
                university === '' || universityId === null
                  ? { backgroundColor: colors.gray[250] }
                  : {}
              }
            />
          </View>
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              * 학적정보는 3개월에 1회만 변경 할 수 있어요.
            </Text>
            {user.nextUpdateAvailableDate && (
              <Text style={styles.noteText}>
                * 다음 변경 가능일 :{' '}
                {(() => {
                  const p = parseISODate(user.nextUpdateAvailableDate);
                  return p ? `${p.year}년 ${p.month}월 ${p.day}일` : '';
                })()}{' '}
                이후
              </Text>
            )}
          </View>
          <View
            style={[
              styles.buttonContainer,
              isKeyboardVisible && styles.buttonContainerHidden,
            ]}
          >
            <Button
              title="완료"
              disabled={!university || !major || !department}
              onPress={
                () => setIsConfirmBottomSheetVisible(true)
                // navigation.navigate('SignUpSecondScreen', {
                //   userName: route.params?.userName,
                //   university: university,
                //   department: department,
                //   major: major,
                //   universityId: universityId,
                //   majorId: majorId,
                // })
              }
              style={styles.button}
            />
          </View>
        </ScrollView>
        <Toast
          message={toastMessage}
          visible={toastVisible}
          onHide={hideToast}
          hasNavBar={false}
        />
      </SafeAreaView>
      {isMajorInputModalVisible && (
        <MajorInputModal
          universityId={universityId}
          onClose={() => setIsMajorInputModalVisible(false)}
          onSelect={async (selectedMajor) => {
            setMajor(selectedMajor.majorName);
            setMajorId(selectedMajor.majorId);
            setDepartment(selectedMajor.collegeName);
            setDepartmentId(selectedMajor.collegeId);
            setIsMajorInputModalVisible(false);
          }}
        />
      )}
      {isConfirmBottomSheetVisible && (
        <ScholarChangeConfirmBottomSheet
          isVisible={isConfirmBottomSheetVisible}
          onClose={() => setIsConfirmBottomSheetVisible(false)}
          onSelectCategory={handleChangeScholarInfo}
        />
      )}
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
    marginTop: 28,
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
  noteContainer: {
    paddingHorizontal: 20,
    width: '100%',
    marginTop: 24,
  },
  noteText: {
    ...typography.caption2Regular,
    color: colors.gray[500],
  },
});

export default ChangeScholarInfoScreen;
