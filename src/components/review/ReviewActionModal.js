import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import colors from '../../style/colors';
import theme from '../../style';
import typography from '../../style/typography';

const ReviewActionModal = ({
  isVisible,
  onClose,
  onConfirmScan,
  storeName,
}) => {
  const [step, setStep] = useState(1);

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleYesPartnership = () => {
    setStep(2);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.sheetContainer} onPress={() => {}}>
          <View style={styles.handleBarWrapper}>
            <View style={styles.handleBar} />
          </View>

          {step === 1 ? (
            <View style={styles.content}>
              <Text style={styles.title}>
                <Text style={{ fontWeight: 'bold' }}>{storeName}</Text>에서 제휴
                이용 하셨나요?
              </Text>
              <Text style={styles.subtitle}>
                제휴 인증 리뷰 작성 시 스탬프를 받을 수 있어요!
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonSecondary]}
                  onPress={handleClose}
                >
                  <Text style={styles.textSecondary}>아니요</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.buttonPrimary]}
                  onPress={handleYesPartnership}
                >
                  <Text style={styles.textPrimary}>네</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.content}>
              <Text style={styles.title}>영수증 스캔을 진행하시겠어요?</Text>
              <Text style={styles.subtitle}>
                이용한 제휴 영수증을 촬영하면{'\n'}스탬프를 받을 수 있어요!
              </Text>

              <TouchableOpacity
                style={[styles.buttonFull, styles.buttonPrimary]}
                onPress={() => {
                  handleClose();
                  onConfirmScan();
                }}
              >
                <Text style={styles.textPrimary}>
                  네, 스캔하고 스탬프 받을래요!
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleClose} style={{ marginTop: 16 }}>
                <Text style={styles.textLink}>
                  영수증이 없어요. 다음에 작성할게요.
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingBottom: 50,
    alignItems: 'center',
  },
  handleBarWrapper: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  handleBar: {
    width: 50,
    height: 3,
    backgroundColor: colors.gray[300],
    borderRadius: 48,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    marginTop: 30,
    ...typography.heading4,
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body3Regular,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: 45,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonFull: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.blue[400],
  },
  buttonSecondary: {
    backgroundColor: colors.blue[100],
  },
  textPrimary: {
    color: colors.gray[100],
    ...typography.heading6,
  },
  textSecondary: {
    color: colors.blue[600],
    ...typography.heading6,
  },
  textLink: {
    color: theme.colors.textDim,
    ...typography.heading6,
  },
});

export default ReviewActionModal;
