import { Pressable, StyleSheet } from 'react-native';
import BackIcon from '@assets/back.svg';
import colors from '@style/colors';

const BackButton = ({ onPress, color = colors.gray[800], style }) => {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={[styles.container, style]}
    >
      <BackIcon width={10} height={16} color={color} />
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
