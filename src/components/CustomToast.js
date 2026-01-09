import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';
import colors from '../style/colors';
import typography from '../style/typography';
import useToastStore from '../store/toastStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CustomToast = () => {
  const toast = useToastStore((state) => state.toast);
  const hideToast = useToastStore((state) => state.hideToast);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      // 토스트 표시 애니메이션
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // 2초 후 자동으로 숨김
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          hideToast();
        });
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // 토스트가 없으면 초기 상태로 리셋
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [toast]);

  if (!toast) return null;

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return colors.orange[500];
      case 'error':
        return colors.common.error;
      case 'info':
        return colors.blue[500];
      case 'black':
        return 'rgba(89, 95, 99, 0.80)';
      default:
        return colors.orange[500];
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ scale: scaleAnim }, { translateX: -150 }],
          opacity: opacityAnim,
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      <Text style={styles.toastText}>{toast.message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 300,
    marginTop: -20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    ...typography.caption1Bold,
    color: colors.common.white,
  },
});

export default CustomToast;
