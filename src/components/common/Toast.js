import typography from '@/style/typography';
import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT = 49;

const Toast = ({
  message,
  visible,
  duration = 2000,
  onHide,
  hasNavBar = true,
  tabBarHeight = TAB_BAR_HEIGHT,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const bottomPosition = hasNavBar
    ? insets.bottom + tabBarHeight + 22
    : screenHeight - 736;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide && onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, transform: [{ translateY }], bottom: bottomPosition },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#595F63CC',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 50,
  },
  text: {
    color: 'white',
    ...typography.body4Regular,
  },
});

export default Toast;
