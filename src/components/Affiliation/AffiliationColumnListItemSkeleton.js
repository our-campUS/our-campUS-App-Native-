import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import colors from '../../style/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    height: 108,
    backgroundColor: colors.common.white,
    alignItems: 'center',
    position: 'relative',
  },
  imageContainer: {
    width: 108,
    height: 108,
    borderRadius: 10,
    backgroundColor: colors.gray[200],
  },
  content: {
    flexDirection: 'column',
    maxWidth: 240,
    flex: 1,
  },
  titleSkeleton: {
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.gray[200],
    marginBottom: 4,
  },
  titleSkeletonSecond: {
    height: 20,
    width: '60%',
    borderRadius: 4,
    backgroundColor: colors.gray[200],
  },
  placeAndDate: {
    marginTop: 12,
  },
  placeAndDateItem: {
    flexDirection: 'row',
    gap: 6,
    height: 30,
    alignItems: 'center',
  },
  placeSkeleton: {
    height: 16,
    width: 80,
    borderRadius: 4,
    backgroundColor: colors.gray[200],
  },
  dateSkeleton: {
    height: 16,
    width: 120,
    borderRadius: 4,
    backgroundColor: colors.gray[200],
  },
});

const AffiliationColumnListItemSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, { opacity }]} />
      <View style={styles.content}>
        <Animated.View style={[styles.titleSkeleton, { opacity }]} />
        <Animated.View
          style={[styles.titleSkeletonSecond, { opacity, marginTop: 4 }]}
        />
        <View style={styles.placeAndDate}>
          <View style={styles.placeAndDateItem}>
            <Animated.View style={[styles.placeSkeleton, { opacity }]} />
          </View>
          <View style={styles.placeAndDateItem}>
            <Animated.View style={[styles.dateSkeleton, { opacity }]} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default AffiliationColumnListItemSkeleton;
