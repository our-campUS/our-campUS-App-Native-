import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import useAuthStore from '../../store/authStore';

const CreateNewQueryView = ({ handleCreateQuery }) => {
  const isCouncil = useAuthStore((state) => state.user.role === 'COUNCIL');
  const [inqueryTitle, setInqueryTitle] = useState('');
  const [inqueryContent, setInqueryContent] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(
      inqueryContent.length < 10 || inqueryTitle.trim().length === 0
    );
  }, [inqueryContent, inqueryTitle]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.titleInputWrapper}>
          <TextInput
            placeholder="문의 제목을 입력해주세요."
            style={styles.titleInput}
            value={inqueryTitle}
            onChangeText={setInqueryTitle}
            placeholderTextColor={colors.gray[400]}
          />
        </View>
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
              ? '최소 10자 이상'
              : `${inqueryContent.length}/1000`}
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            isOrange={isCouncil}
            disabled={isButtonDisabled}
            title="등록하기"
            style={{
              width: '100%',
              height: 50,
              paddingHorizontal: 10,
              paddingVertical: 15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isCouncil
                ? colors.orange[400]
                : colors.blue[400],
              borderRadius: 16,
            }}
            onPress={handleCreateQuery}
          />
        </View>
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
  titleInputWrapper: {
    borderRadius: 14,
    boxShadow: '0 0 6px 0 rgba(225, 228, 230, 0.70)',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  titleInput: {
    ...typography.body3Regular,
    color: colors.gray[850],
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
