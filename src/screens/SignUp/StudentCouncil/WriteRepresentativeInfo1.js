import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
  Pressable,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../../../components/LabelTitle';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import typography from '../../../style/typography';
import colors from '../../../style/colors';
import UnselectedRadioButton from '../../../../assets/unselected_Radio_Button.svg';
import { useState, useEffect } from 'react';
import { Image } from 'react-native';
import MajorInputModal from '../../../components/majorInputModal';
import CollegeInputModal from '../../../components/CollegeInputModal';
import { searchUniversity } from '../../../api/signUp';
import { searchMajor } from '../../../api/signUp';
import { searchCollege } from '../../../api/signUp';
import UniversityInputModal from '../../../components/UniversityInputModal';

const WriteRepresentativeInfo1 = ({ navigation, route }) => {
  const email = route.params?.email;
  const password = route.params?.password;
  const loginId = route.params?.loginId;
  const [selectedValue, setSelectedValue] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isCollegeSelected, setIsCollegeSelected] = useState(false);
  const [isMajorSelected, setIsMajorSelected] = useState(false);
  const [isMajorInputModalVisible, setIsMajorInputModalVisible] =
    useState(false);
  const [isCollegeInputModalVisible, setIsCollegeInputModalVisible] =
    useState(false);
  const [isUniversityInputModalVisible, setIsUniversityInputModalVisible] =
    useState(false);
  const [major, setMajor] = useState(null); // 학과
  const [majorId, setMajorId] = useState(null); // 학과 ID
  const [college, setCollege] = useState(null); // 단과대학
  const [collegeId, setCollegeId] = useState(null); // 단과대학 ID
  const [university, setUniversity] = useState(null); // 학교명
  const [universityId, setUniversityId] = useState(null); // 학교 ID
  const [finalData, setFinalData] = useState(null); // 최종 데이터

  useEffect(() => {
    if (selectedValue == 'total' && university) {
      setIsButtonDisabled(false);
    } else if (selectedValue == 'college' && college && university) {
      setIsButtonDisabled(false);
    } else if (selectedValue == 'major' && major && college && university) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [selectedValue, major, college, university]);

  const handleNextButtonPress = () => {
    let councilType = '';
    let schoolId = universityId;
    let collegeIdValue = null;
    let majorIdValue = null;
    if (selectedValue === 'total') {
      councilType = 'SCHOOL_COUNCIL';
    } else if (selectedValue === 'college') {
      councilType = 'COLLEGE_COUNCIL';
      collegeIdValue = collegeId;
    } else if (selectedValue === 'major') {
      councilType = 'MAJOR_COUNCIL';
      majorIdValue = majorId;
      collegeIdValue = collegeId;
    }
    let finalData = {
      councilType: councilType,
      schoolId: schoolId,
      collegeId: collegeId,
      majorId: majorId,
      email: email,
      password: password,
      loginId: loginId,
    };
    console.log(finalData);
    setFinalData(finalData);
    return finalData;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <StatusBar style="auto" />
        <LabelTitle
          title="회원가입"
          useBackButton={true}
          onPressBack={() => navigation?.goBack()}
          navigation={navigation}
        />
        <View style={{ width: '100%', height: 20 }}></View>
        <View style={[styles.statusBar]}>
          <View
            style={{ backgroundColor: colors.orange[400], width: '50%' }}
          ></View>
          <View
            style={{ backgroundColor: colors.gray[100], width: '50%' }}
          ></View>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contents}>
            <View style={styles.inputFormContainer}>
              <Input
                isOrange={true}
                title="학교"
                placeholder="학교 이름을 입력해주세요"
                useTitle={true}
                useMagnifyingGlass={true}
                usePopUPModal={true}
                value={university || ''}
                onPressPopUPModal={() => {
                  setIsUniversityInputModalVisible(true);
                }}
              />
              <Text style={styles.toggleTitle}>소속 단위</Text>
              <View style={styles.toggleContainer}>
                <View style={styles.toggleItem}>
                  <Pressable
                    onPress={() => {
                      setSelectedValue('total');
                      setIsCollegeSelected(false);
                      setIsMajorSelected(false);
                    }}
                  >
                    {selectedValue === 'total' ? (
                      <Image
                        source={require('../../../../assets/RadioButton.png')}
                        style={{
                          width: 18,
                          height: 18,
                          tintColor: colors.orange[400],
                        }}
                      />
                    ) : (
                      <UnselectedRadioButton width={18} height={18} />
                    )}
                  </Pressable>
                  <Text style={styles.toggleItemText}>총학생회</Text>
                </View>
                <View style={styles.toggleItem}>
                  <Pressable
                    onPress={() => {
                      setMajorId(null);
                      setMajor(null);
                      setSelectedValue('college');
                      setIsCollegeSelected(true);
                      setIsMajorSelected(false);
                    }}
                  >
                    {selectedValue === 'college' ? (
                      <Image
                        source={require('../../../../assets/RadioButton.png')}
                        style={{
                          width: 18,
                          height: 18,
                          tintColor: colors.orange[400],
                        }}
                      />
                    ) : (
                      <UnselectedRadioButton width={18} height={18} />
                    )}
                  </Pressable>
                  <Text style={styles.toggleItemText}>단과대학 총학생회</Text>
                </View>
                <View style={styles.toggleItem}>
                  <Pressable
                    onPress={() => {
                      setCollegeId(null);
                      setCollege(null);
                      setSelectedValue('major');
                      setIsMajorSelected(true);
                      setIsCollegeSelected(false);
                    }}
                  >
                    {selectedValue === 'major' ? (
                      <Image
                        source={require('../../../../assets/RadioButton.png')}
                        style={{
                          width: 18,
                          height: 18,
                          tintColor: colors.orange[400],
                        }}
                      />
                    ) : (
                      <UnselectedRadioButton width={18} height={18} />
                    )}
                  </Pressable>
                  <Text style={styles.toggleItemText}>학과 학생회</Text>
                </View>
              </View>
              {isMajorSelected && (
                <>
                  <Input
                    isOrange={true}
                    title="학과"
                    placeholder="학과를 입력해주세요"
                    useTitle={true}
                    useMagnifyingGlass={true}
                    value={major || ''}
                    usePopUPModal={true}
                    onPressPopUPModal={() => {
                      setIsMajorInputModalVisible(true);
                    }}
                  />
                </>
              )}
              {isCollegeSelected && (
                <Input
                  isOrange={true}
                  title="단과대학"
                  placeholder="단과대학을 입력해주세요"
                  useTitle={true}
                  useMagnifyingGlass={true}
                  value={college || ''}
                  usePopUPModal={true}
                  onPressPopUPModal={() => {
                    setIsCollegeInputModalVisible(true);
                  }}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                isOrange={true}
                disabled={isButtonDisabled}
                title="다음"
                onPress={() => {
                  Keyboard.dismiss();
                  const data = handleNextButtonPress();
                  navigation.navigate('RepresentativeProof', {
                    finalData: data,
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {isMajorInputModalVisible && (
        <MajorInputModal
          isOrange={true}
          universityId={universityId}
          onClose={() => setIsMajorInputModalVisible(false)}
          onSelect={(selectedMajor, selectedCollege) => {
            setMajor(selectedMajor.majorName);
            setMajorId(selectedMajor.majorId);
            setCollegeId(selectedMajor.collegeId);
            setCollege(selectedMajor.collegeName);
            setIsMajorInputModalVisible(false);
          }}
        />
      )}
      {isCollegeInputModalVisible && (
        <CollegeInputModal
          isOrange={true}
          universityId={universityId}
          onClose={() => setIsCollegeInputModalVisible(false)}
          onSelect={(selectedCollege) => {
            setCollege(selectedCollege.collegeName);
            console.log('collegeId', selectedCollege.collegeId);
            console.log('collegeName', selectedCollege.collegeName);
            setCollegeId(selectedCollege.collegeId);
            setIsCollegeInputModalVisible(false);
          }}
        />
      )}
      {isUniversityInputModalVisible && (
        <UniversityInputModal
          isOrange={true}
          onClose={() => setIsUniversityInputModalVisible(false)}
          onSelect={(selectedUniversity) => {
            setUniversity(selectedUniversity.schoolName);
            setUniversityId(selectedUniversity.schoolId);
            setIsUniversityInputModalVisible(false);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  statusBar: {
    height: 5,
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
  },
  contents: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 24,
    flex: 1,
  },
  inputFormContainer: {
    width: '100%',
    // gap: 24,
  },
  toggleContainer: {
    width: '100%',
    gap: 8,
    marginBottom: 24,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  toggleItemText: {
    marginTop: -2,
    ...typography.body2Regular,
    color: colors.gray[850],
  },
  toggleTitle: {
    marginTop: 24,
    ...typography.body3Bold,
    color: colors.gray[850],
    marginBottom: 12,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 30,
  },
});

export default WriteRepresentativeInfo1;
