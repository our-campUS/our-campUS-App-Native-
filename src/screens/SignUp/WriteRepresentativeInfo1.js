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
import LabelTitle from '../../components/LabelTitle';
import Input from '../../components/Input';
import Button from '../../components/Button';
import typography from '../../style/typography';
import colors from '../../style/colors';
import UnselectedRadioButton from '../../../assets/unselected_Radio_Button.svg';
import { useState, useEffect } from 'react';
import { Image } from 'react-native';
import MajorInputModal from '../../components/majorInputModal';
import CollegeInputModal from '../../components/CollegeInputModal';

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
const WriteRepresentativeInfo1 = ({ navigation }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isDepartmentSelected, setIsDepartmentSelected] = useState(false);
  const [isCollegeSelected, setIsCollegeSelected] = useState(false);
  const [isMajorInputModalVisible, setIsMajorInputModalVisible] =
    useState(false);
  const [isCollegeInputModalVisible, setIsCollegeInputModalVisible] =
    useState(false);

  const [department, setDepartment] = useState(null); // 학과
  const [college, setCollege] = useState(null); // 단과대학
  const [school, setSchool] = useState(null); // 학교명

  useEffect(() => {
    if (selectedValue == 'total' && school) {
      setIsButtonDisabled(false);
    } else if (selectedValue == 'college' && college && school) {
      setIsButtonDisabled(false);
    } else if (selectedValue == 'department' && department && school) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [selectedValue, college, department, school]);

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
        <View style={[styles.statusBar]}>
          <View
            style={{ backgroundColor: colors.blue[400], width: '50%' }}
          ></View>
          <View style={{ backgroundColor: colors.white, width: '50%' }}></View>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contents}>
            <View style={styles.inputFormContainer}>
              <Input
                title="학교"
                placeholder="학교 이름을 입력해주세요"
                useTitle={true}
                useMagnifyingGlass={true}
                value={school || ''}
                onChangeText={setSchool}
              />
              <Text style={styles.toggleTitle}>소속 단위</Text>
              <View style={styles.toggleContainer}>
                <View style={styles.toggleItem}>
                  <Pressable
                    onPress={() => {
                      setSelectedValue('total');
                      setIsDepartmentSelected(false);
                      setIsCollegeSelected(false);
                    }}
                  >
                    {selectedValue === 'total' ? (
                      <Image
                        source={require('../../../assets/RadioButton.png')}
                        style={{ width: 18, height: 18 }}
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
                      setSelectedValue('college');
                      setIsDepartmentSelected(false);
                      setIsCollegeSelected(true);
                    }}
                  >
                    {selectedValue === 'college' ? (
                      <Image
                        source={require('../../../assets/RadioButton.png')}
                        style={{ width: 18, height: 18 }}
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
                      setSelectedValue('department');
                      setIsDepartmentSelected(true);
                      setIsCollegeSelected(false);
                    }}
                  >
                    {selectedValue === 'department' ? (
                      <Image
                        source={require('../../../assets/RadioButton.png')}
                        style={{ width: 18, height: 18 }}
                      />
                    ) : (
                      <UnselectedRadioButton width={18} height={18} />
                    )}
                  </Pressable>
                  <Text style={styles.toggleItemText}>학과 학생회</Text>
                </View>
              </View>
              {isDepartmentSelected && (
                <>
                  <Input
                    title="학과"
                    placeholder="학과를 입력해주세요"
                    useTitle={true}
                    useMagnifyingGlass={true}
                    value={department || ''}
                    usePopUPModal={true}
                    onPressPopUPModal={() => {
                      setIsMajorInputModalVisible(true);
                    }}
                  />
                </>
              )}
              {isCollegeSelected && (
                <Input
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
                disabled={isButtonDisabled}
                title="다음"
                onPress={() => {
                  Keyboard.dismiss();
                  navigation.navigate('RepresentativeProof');
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {isMajorInputModalVisible && (
        <MajorInputModal
          onClose={() => setIsMajorInputModalVisible(false)}
          onSelect={(selectedMajor, selectedCollege) => {
            setDepartment(selectedMajor);
            setIsMajorInputModalVisible(false);
          }}
        />
      )}
      {isCollegeInputModalVisible && (
        <CollegeInputModal
          onClose={() => setIsCollegeInputModalVisible(false)}
          onSelect={(selectedCollege) => {
            setCollege(selectedCollege);
            setIsCollegeInputModalVisible(false);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default WriteRepresentativeInfo1;
