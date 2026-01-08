import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Input from '../../components/Input';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { useEffect, useState } from 'react';
import CreateQueryBottomSheet from '../../components/MyPage/CreateQueryBottomSheet';
import Button from '../../components/Button';

const CreateNewQueryView = ({ handleCreateQuery }) => {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [inqueryContent, setInqueryContent] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(
      inqueryContent.length < 20 || selectedCategory === null
    );
  }, [inqueryContent, selectedCategory]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Pressable
          onPress={() => setIsBottomSheetVisible(true)}
          style={styles.inputWrapper}
        >
          <Input
            placeholder="문의 유형을 선택해주세요"
            useToggleIcon={true}
            value={selectedCategory?.name || ''}
            onlyRead={true}
            additionalStyle={styles.input}
          />
        </Pressable>
        <View style={styles.textInputWrapper}>
          <TextInput
            placeholder="문의 내용을 작성해주세요"
            style={styles.inqueryInput}
            value={inqueryContent}
            onChangeText={setInqueryContent}
            placeholderTextColor={colors.gray[400]}
            placeholderStyle={{
              ...typography.body3Regular,
              color: colors.gray[400],
            }}
            maxLength={1000}
            multiline={true}
            numberOfLines={10}
            textAlignVertical="top"
            keyboardType="default"
          />
          <Text style={styles.inqueryContentLength}>
            {inqueryContent.length === 0
              ? '최소 20자 이상'
              : `${inqueryContent.length}/1000`}
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            disabled={isButtonDisabled}
            title="등록하기"
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
            onPress={handleCreateQuery}
          />
        </View>
        <CreateQueryBottomSheet
          isVisible={isBottomSheetVisible}
          onClose={() => setIsBottomSheetVisible(false)}
          onSelectCategory={handleSelectCategory}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: colors.common.white,
  },
  inputWrapper: {
    boxShadow: '0 0 6px 0 rgba(225, 228, 230, 0.70)',
  },
  inqueryInput: {
    ...typography.body3Regular,
    color: colors.gray[850],
    height: 100,
    width: '100%',
  },
  textInputWrapper: {
    width: '100%',
    height: 166,
    padding: 20,
    borderRadius: 16,
    boxShadow: '0 0 6px 0 rgba(225, 228, 230, 0.70)',
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  input: {
    backgroundColor: colors.common.white,
  },
  inqueryContentLength: {
    ...typography.body3Regular,
    color: colors.gray[400],
    textAlign: 'right',
    marginTop: 'auto',
    justifyContent: 'flex-end',
  },
  buttonWrapper: {
    marginTop: 'auto',
    marginBottom: 17,
  },
});

export default CreateNewQueryView;
