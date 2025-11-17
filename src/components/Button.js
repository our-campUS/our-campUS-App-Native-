import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import colors from '../style/colors';

const Button = ({
  title,
  onPress,
  disabled = false,
  isLoading = false,
  useIsLoading = false,
  style,
  textStyle,
  indicatorColor = colors.common.white,
  children,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        style,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      {isLoading && useIsLoading ? (
        <ActivityIndicator color={indicatorColor} size="small" />
      ) : (
        <View style={styles.content}>
          {children}
          {title ? (
            <Text style={[styles.title, textStyle]}>{title}</Text>
          ) : null}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 49,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.gray[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    backgroundColor: colors.gray[400],
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    color: colors.common.white,
  },
});

export default Button;
