import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import colors from '@style/colors';
import typography from '@style/typography';
import shadows from '@style/shadow';
import { useEffect, useState } from 'react';
import Button from '@components/Button';
import { createInquiry, createCouncilInquiry } from '../../api/inquiry';
import useToastStore from '../../store/toastStore';

const CreateNewQueryView = ({ handleCreateQuery, isCouncil }) => {
  const [inqueryTitle, setInqueryTitle] = useState('');
  const [inqueryContent, setInqueryContent] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setIsButtonDisabled(
      inqueryContent.length < 10 ||
        inqueryTitle.trim().length === 0 ||
        submitting
    );
  }, [inqueryContent, inqueryTitle, submitting]);

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    const submitFn = isCouncil ? createCouncilInquiry : createInquiry;
    const result = await submitFn(inqueryTitle.trim(), inqueryContent);
    setSubmitting(false);

    if (result) {
      useToastStore.getState().showToast('문의가 등록되었습니다.', 'success');
      setInqueryTitle('');
      setInqueryContent('');
      setTimeout(() => {
        handleCreateQuery();
      }, 800);
    } else {
      useToastStore
        .getState()
        .showToast('문의 등록에 실패하였습니다.', 'error');
    }
  };

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
            onPress={handleSubmit}
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
    ...shadows.level2,
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
    ...shadows.level2,
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
