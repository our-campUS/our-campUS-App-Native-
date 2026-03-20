import { View, Text, Pressable, StyleSheet } from 'react-native';
import colors from '@style/colors';
import typography from '@style/typography';
import ArrowRightIcon from '@assets/ArrowRightIcon.svg';

const ListItem = ({
  title,
  rightText,
  showArrow = true,
  onPress,
  containerStyle,
}) => {
  const Wrapper = onPress ? Pressable : View;
  const wrapperProps = onPress ? { onPress } : {};

  return (
    <Wrapper style={[styles.container, containerStyle]} {...wrapperProps}>
      <Text style={styles.title}>{title}</Text>
      {(rightText || showArrow) && (
        <View style={styles.rightWrapper}>
          {rightText && <Text style={styles.rightText}>{rightText}</Text>}
          {showArrow && (
            <ArrowRightIcon width={7} height={11} color={colors.gray[400]} />
          )}
        </View>
      )}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.body2Regular,
    color: colors.gray[850],
  },
  rightWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightText: {
    ...typography.body3Regular,
    color: colors.gray[400],
  },
});

export default ListItem;
