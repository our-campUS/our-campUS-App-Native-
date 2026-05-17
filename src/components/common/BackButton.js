import { Pressable, StyleSheet } from 'react-native';
import BackIcon from '@assets/back.svg';
import theme from '@style';

const BackButton = ({ onPress, color = theme.colors.textDim, style, width = 10, height = 16 }) => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={[styles.container, style]}
    >
      <BackIcon width={width} height={height} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    zIndex: 1,
  },
});

export default BackButton;
