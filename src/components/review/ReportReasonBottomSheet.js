import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@style/colors';
import typography from '@style/typography';
import theme from '@style';
import { reportReview } from '@api/review';

const REPORT_REASONS = [
  '스팸/광고',
  '욕설/비방',
  '부적절한 내용',
  '허위/조작',
  '개인정보 노출',
  '기타',
];

const ReportReasonBottomSheet = ({ isVisible, onClose, reviewId, showToast }) => {
  const insets = useSafeAreaInsets();
  const [selectedReason, setSelectedReason] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setSelectedReason(null);
      setIsSubmitting(false);
    }
  }, [isVisible]);

  const handleSubmit = async () => {
    if (!selectedReason || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await reportReview(reviewId, selectedReason);
      showToast('신고가 접수되었어요');
      onClose();
    } catch (error) {
      if (error?.response?.status === 409) {
        showToast('이미 신고한 리뷰예요');
      } else {
        showToast('신고 접수에 실패했어요. 다시 시도해주세요.');
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={[styles.card, { marginBottom: 16 + insets.bottom }]}>
          <View style={styles.optionList}>
            {REPORT_REASONS.map((reason, index) => {
              const isSelected = selectedReason === reason;
              const isLast = index === REPORT_REASONS.length - 1;
              return (
                <Pressable
                  key={reason}
                  style={[styles.optionItem, !isLast && styles.optionDivider]}
                  onPress={() => setSelectedReason(reason)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {reason}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            style={[
              styles.submitButton,
              selectedReason
                ? styles.submitButtonActive
                : styles.submitButtonDisabled,
            ]}
            disabled={!selectedReason || isSubmitting}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? '제출 중...' : '신고하기'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
  },
  card: {
    marginHorizontal: 16,
    gap: 16,
  },
  optionList: {
    backgroundColor: colors.gray['000'],
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionItem: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  optionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  optionText: {
    ...typography.body3Regular,
    color: theme.colors.text,
    textAlign: 'center',
  },
  optionTextSelected: {
    ...typography.heading6,
    color: theme.colors.primary1,
  },
  submitButton: {
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonActive: {
    backgroundColor: colors.blue[400],
  },
  submitButtonDisabled: {
    backgroundColor: colors.blue[100],
  },
  submitButtonText: {
    ...typography.heading6,
    color: theme.colors.textWhite,
  },
});

export default ReportReasonBottomSheet;
