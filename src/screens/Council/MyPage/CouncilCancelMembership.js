import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
} from 'react-native';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import LabelTitle from '../../../components/LabelTitle';
import { SafeAreaView } from 'react-native-safe-area-context';
import CheckIcon from '../../../../assets/check.svg';
import { useState } from 'react';
import Button from '../../../components/Button';
import useAuthStore from '../../../store/authStore';
import { withdrawCouncil } from '../../../api/councilMyPage';

const CouncilCancelMembershipScreen = ({ navigation }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      const isSuccess = await withdrawCouncil(password);

      if (isSuccess) {
        Alert.alert('알림', '회원 탈퇴가 완료되었습니다.', [
          {
            text: '확인',
            onPress: () => {
              logout();
            },
          },
        ]);
      } else {
        Alert.alert(
          '실패',
          '회원 탈퇴에 실패했습니다. 비밀번호를 확인해주세요.'
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="회원 탈퇴"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.mainContentWrapper}>
          <Text style={styles.mainContentTitle}>회원 탈퇴 전</Text>
          <Text style={styles.mainContentDescription}>
            아래 유의사항을 확인해주세요.
          </Text>
          <View style={styles.noticeItemWrapper}>
            <View style={styles.noticeItem}>
              <Text style={styles.noticeItemBullet}>•</Text>
              <Text style={styles.noticeItemText}>
                작성한 리뷰는 삭제 되지 않으며 닉네임은 (알 수 없음)으로
                표시됩니다.
              </Text>
            </View>
            <View style={styles.noticeItem}>
              <Text style={styles.noticeItemBullet}>•</Text>
              <Text style={styles.noticeItemText}>
                계정이 삭제된 이후에는 복구할 수 없습니다.
              </Text>
            </View>
            <View style={styles.noticeItem}>
              <Text style={styles.noticeItemBullet}>•</Text>
              <Text style={styles.noticeItemText}>
                탈퇴 즉시 7일 이내에는 동일 계정으로 다시 가입할 수 없습니다.
              </Text>
            </View>
            <View style={styles.noticeItem}>
              <Text style={styles.noticeItemBullet}>•</Text>
              <Text style={styles.noticeItemText}>스탬프 소멸됩니다.</Text>
            </View>
          </View>
          <View style={styles.noticCheckWrapper}>
            <Pressable
              style={[styles.checkBoxWrapper, isChecked && styles.checked]}
              onPress={() => setIsChecked(!isChecked)}
            >
              <View style={[styles.checkBox]}>
                {isChecked && <CheckIcon width={20} height={20} />}
              </View>
            </Pressable>
            <Text style={styles.noticCheckText}>
              탈퇴 시 유의사항을 모두 확인하였습니다.
            </Text>
          </View>
          <TextInput
            style={styles.passwordInput}
            placeholder="비밀번호를 입력해주세요"
            placeholderTextColor={colors.gray[400]}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            isOrange={true}
            title={isLoading ? '처리 중...' : '탈퇴하기'}
            onPress={handleWithdraw}
            disabled={!isChecked || !password || isLoading}
            style={{
              width: '100%',
              height: 50,
              paddingHorizontal: 10,
              paddingVertical: 15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor:
                !isChecked || !password || isLoading
                  ? colors.gray[400]
                  : colors.orange[400],
              borderRadius: 10,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
  mainContentWrapper: {
    marginTop: 20,
  },
  mainContentTitle: {
    ...typography.body3Regular,
    color: colors.gray[800],
    marginTop: 28,
  },
  mainContentDescription: {
    ...typography.heading4,
    color: colors.gray[850],
    marginTop: 4,
  },
  noticeItemWrapper: {
    marginTop: 16,
    padding: 20,
    borderRadius: 15,
    gap: 4,
    backgroundColor: colors.orange['000'],
  },
  noticeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noticeItemBullet: {
    ...typography.body4Bold,
    color: colors.gray[850],
    marginRight: 8,
  },
  noticeItemText: {
    ...typography.body4Regular,
    color: colors.gray[850],
  },
  noticCheckWrapper: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 12,
  },
  checkBoxWrapper: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: colors.orange[500],
    borderColor: colors.orange[500],
  },
  noticCheckText: {
    ...typography.body4Bold,
    color: colors.gray[850],
  },
  passwordInput: {
    ...typography.body3Regular,
    color: colors.gray[850],
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[250],
  },
  buttonWrapper: {
    marginTop: 'auto',
    marginBottom: 28,
  },
});

export default CouncilCancelMembershipScreen;
