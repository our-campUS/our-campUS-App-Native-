import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import theme from '../../style';
import colors from '../../style/colors';

// 앱 심사(리뷰어)용 숨김 로그인 모달 — 로그인 화면 로고 5초 롱프레스로 진입
const ReviewerLoginModal = ({ visible, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);
    const result = await onSubmit(trimmedEmail);
    setIsSubmitting(false);
    if (!result?.isValid) {
      setErrorMessage('Login failed. Please check the email.');
    }
  };

  const handleClose = () => {
    setEmail('');
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Reviewer Login</Text>
          <TextInput
            testID="reviewer-email-input"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={theme.colors.textDisabled}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
          <Pressable
            testID="reviewer-login-submit"
            style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitText}>
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </Text>
          </Pressable>
          <Pressable testID="reviewer-login-close" onPress={handleClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 300,
    padding: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    gap: 12,
    ...theme.shadows.level2,
  },
  title: {
    ...theme.typography.heading6,
    color: theme.colors.text,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    backgroundColor: theme.colors.backgroundSub,
    paddingHorizontal: 16,
    ...theme.typography.body3Regular,
    color: theme.colors.text,
  },
  error: {
    ...theme.typography.body4Regular,
    color: theme.colors.error,
  },
  submitButton: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary1,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.textDisabled,
  },
  submitText: {
    ...theme.typography.heading6,
    color: theme.colors.textWhite,
  },
  closeText: {
    ...theme.typography.body4Regular,
    color: theme.colors.textDim,
  },
});

export default ReviewerLoginModal;
