import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';

const ConfirmModal = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
          <Pressable style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmText}>{confirmText}</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>{cancelText}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    backgroundColor: colors.common.white,
    borderRadius: 20,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    ...typography.heading5,
    color: colors.gray[850],
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    ...typography.body3Regular,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: 24,
  },
  confirmButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.blue[400],
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmText: {
    ...typography.heading6,
    color: colors.common.white,
  },
  cancelButton: {
    paddingVertical: 4,
    alignItems: 'center',
  },
  cancelText: {
    ...typography.body3Regular,
    color: colors.gray[500],
  },
});

export default ConfirmModal;
