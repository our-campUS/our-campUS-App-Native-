import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  PanResponder,
  Image,
} from 'react-native';
import { useRef, useEffect, useState } from 'react';
import colors from '../../style/colors';
import typography from '../../style/typography';
import EditIcon from '../../../assets/darkPencilIcon.svg';
import DeleteIcon from '../../../assets/trashIcon.svg';
const DRAG_THRESHOLD = 200; // 드래그 임계값

const EditPostBottomSheet = ({
  isVisible,
  onClose,
  onSelectEdit,
  onSelectDelete,
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
            <Pressable style={styles.editPostItem} onPress={onSelectEdit}>
              <EditIcon width={20} height={20} />
              <Text style={styles.editPostText}>게시글 수정하기</Text>
            </Pressable>
            <Pressable style={styles.editPostItem} onPress={onSelectDelete}>
              <DeleteIcon width={20} height={20} />
              <Text style={styles.deletePostText}>삭제하기</Text>
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
    paddingTop: 16,
    flexDirection: 'column',
    gap: 32,
    width: '100%',
    // backgroundColor: 'red',
  },
  title: {
    ...typography.heading5,
    color: colors.gray[850],
    marginBottom: 22,
  },
  categoryList: {
    gap: 16,
  },
  categoryItem: {},
  categoryText: {
    ...typography.body3Regular,
    color: colors.gray[850],
  },
  logoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 26,
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  logoItemContainer: {
    alignItems: 'center',
  },
  logoItem: {
    width: 76,
    height: 76,
    borderRadius: 100,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  logoText: {
    ...typography.caption1Regular,
    color: colors.gray[800],
    marginTop: 12,
  },
  editPostText: {
    ...typography.heading5,
    color: colors.gray[800],
  },
  deletePostText: {
    ...typography.heading5,
    color: colors.common.error,
  },
  editPostItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

export default EditPostBottomSheet;
