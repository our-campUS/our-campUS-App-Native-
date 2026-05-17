import { View, StyleSheet } from 'react-native';
import RatingIcon from '@assets/icons/rating.svg';
import theme from '@style';
import colors from '@style/colors';

const PartialStar = ({ fill, size }) => {
  const clampedFill = Math.min(1, Math.max(0, fill));
  if (clampedFill >= 1) {
    return <RatingIcon width={size} height={size} color={theme.colors.primary2} />;
  }
  if (clampedFill <= 0) {
    return <RatingIcon width={size} height={size} color={colors.gray[200]} />;
  }
  return (
    <View style={{ width: size, height: size }}>
      <RatingIcon width={size} height={size} color={colors.gray[200]} />
      <View style={[styles.overlay, { width: size * clampedFill }]}>
        <RatingIcon width={size} height={size} color={theme.colors.primary2} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    overflow: 'hidden',
  },
});

export default PartialStar;