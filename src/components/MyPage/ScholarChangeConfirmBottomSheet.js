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
import colors from '../../style/colors';
import typography from '../../style/typography';
import Button from '../Button';

const QUERY_CATEGORIES = [
  { id: 1, name: '카테고리 1' },
  { id: 2, name: '카테고리 2' },
  { id: 3, name: '카테고리 3' },
  { id: 4, name: '카테고리 4' },
  { id: 5, name: '카테고리 5' },
];

const DRAG_THRESHOLD = 100; // 드래그 임계값

const ScholarChangeConfirmBottomSheet = ({
  isVisible,
  onClose,
  onSelectCategory,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const startY = useRef(0);
  const isClosingRef = useRef(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (isVisible) {
      isClosingRef.current = false;
      setRendered(true);
      translateY.setValue(0);
      overlayOpacity.setValue(1);
    }
  }, [isVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        startY.current = translateY.__getValue();
      },
      onPanResponderMove: (_, gestureState) => {
        // 아래로만 드래그 가능
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

  const handleSelect = (category) => {
    onSelectCategory?.(category);
    closeSheet();
  };

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

  const handleOverlayPress = closeSheet;

  return (
    <Modal
      visible={rendered}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
        >
          <Pressable
            style={styles.overlayPressable}
            onPress={handleOverlayPress}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handleBarContainer}>
            <View style={styles.handleBar} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>학적 정보를 변경할까요?</Text>
            <Text style={styles.description}>
              학적 정보는 120일에 한번만 변경할 수 있어요.
            </Text>
            <Button
              title="네, 변경할게요 "
              onPress={onSelectCategory}
              style={styles.changeButton}
              textStyle={styles.changeButtonText}
            />
            <View style={styles.cancelButtonContainer}>
              <Text style={styles.cancelButtonText} onPress={onClose}>
                아니요, 변경하지 않을게요
              </Text>
            </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    paddingTop: 16,
    paddingBottom: 32,
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
    alignItems: 'center',
  },
  title: {
    ...typography.heading4,
    color: colors.gray[850],
    marginBottom: 22,
  },
  description: {
    ...typography.body3Regular,
    color: colors.gray[500],
    textAlign: 'center',
  },
  categoryList: {
    gap: 16,
  },
  categoryItem: {},
  categoryText: {
    ...typography.body3Regular,
    color: colors.gray[850],
  },
  changeButton: {
    width: '100%',
    marginTop: 36,
    backgroundColor: colors.blue[400],
    borderRadius: 16,
    marginBottom: 8,
    paddingVertical: 15,
  },
  changeButtonText: {
    ...typography.heading6,
    color: colors.gray['000'],
  },
  cancelButton: {
    width: '100%',
  },
  cancelButtonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  cancelButtonText: {
    ...typography.heading6,
    color: colors.gray[700],
  },
});

export default ScholarChangeConfirmBottomSheet;
