import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  PanResponder,
} from 'react-native';
import { useRef, useEffect, useState } from 'react';
import colors from '@style/colors';
import typography from '@style/typography';
import EditIcon from '@assets/darkPencilIcon.svg';
import DeleteIcon from '@assets/trashIcon.svg';

const DRAG_THRESHOLD = 100;
const OVERLAY_BG = 'rgba(0, 0, 0, 0.6)';

const ReviewEditBottomSheet = ({
  isVisible,
  onClose,
  onSelectEdit,
  onSelectDelete,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const isClosingRef = useRef(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (isVisible) {
      isClosingRef.current = false;
      setRendered(true);
      translateY.setValue(0);
      overlayOpacity.setValue(1);
    }
  }, [isVisible, overlayOpacity, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DRAG_THRESHOLD) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const closeSheet = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 1000,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setRendered(false);
      isClosingRef.current = false;
      onClose();
    });
  };

  return (
    <Modal
      visible={rendered}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable style={styles.overlayPressable} onPress={closeSheet} />
        </Animated.View>
        <Animated.View
          style={[styles.bottomSheet, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handleBarContainer}>
            <View style={styles.handleBar} />
          </View>
          <View style={styles.content}>
            <Pressable
              style={styles.actionItem}
              onPress={() => {
                closeSheet();
                onSelectEdit();
              }}
            >
              <EditIcon width={24} height={24} />
              <Text style={styles.editText}>리뷰 수정하기</Text>
            </Pressable>
            <Pressable
              style={styles.actionItem}
              onPress={() => {
                closeSheet();
                onSelectDelete();
              }}
            >
              <DeleteIcon width={24} height={24} />
              <Text style={styles.deleteText}>삭제하기</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayPressable: {
    flex: 1,
    backgroundColor: OVERLAY_BG,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.common.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 48,
  },
  handleBarContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  handleBar: {
    width: 50,
    height: 3,
    backgroundColor: colors.gray[300],
    borderRadius: 48,
  },
  content: {
    paddingHorizontal: 20,
    gap: 32,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editText: {
    ...typography.heading5,
    color: colors.gray[850],
  },
  deleteText: {
    ...typography.heading5,
    color: colors.common.error,
  },
});

export default ReviewEditBottomSheet;
