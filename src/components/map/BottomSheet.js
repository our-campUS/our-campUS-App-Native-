import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import StoreListItem from '../common/StoreListItem';
import theme from '../../style';
import colors from '../../style/colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const HEIGHT_LIST = SCREEN_HEIGHT * 0.45;
const HEIGHT_ITEM = 280;

const BottomSheet = ({
  displayedMarkers,
  selectedMarkerId,
  onItemPress,
  maxHeight,
}) => {
  const HEIGHT_MAX = maxHeight * 0.85;

  const sheetHeight = useRef(new Animated.Value(HEIGHT_LIST)).current;
  const startHeight = useRef(HEIGHT_LIST);
  const selectedMarkerIdRef = useRef(selectedMarkerId);

  const [isScrollable, setIsScrollable] = useState(false);

  const SNAP_POINTS = {
    MIN: HEIGHT_ITEM,
    MID: HEIGHT_LIST,
    MAX: HEIGHT_MAX,
  };

  useEffect(() => {
    selectedMarkerIdRef.current = selectedMarkerId;

    Animated.spring(sheetHeight, {
      toValue: selectedMarkerId ? HEIGHT_ITEM : HEIGHT_LIST,
      useNativeDriver: false,
      friction: 8,
    }).start();
  }, [selectedMarkerId]);

  useEffect(() => {
    const id = sheetHeight.addListener(({ value }) => {
      setIsScrollable(value >= HEIGHT_MAX - 20);
    });

    return () => sheetHeight.removeListener(id);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        startHeight.current = sheetHeight.__getValue();
      },

      onPanResponderMove: (_, gestureState) => {
        let newHeight = startHeight.current - gestureState.dy;

        if (newHeight > HEIGHT_MAX) newHeight = HEIGHT_MAX;
        if (newHeight < HEIGHT_ITEM) newHeight = HEIGHT_ITEM;

        sheetHeight.setValue(newHeight);
      },

      onPanResponderRelease: () => {
        const currentHeight = sheetHeight.__getValue();

        let target = SNAP_POINTS.MID;

        if (currentHeight > (SNAP_POINTS.MID + SNAP_POINTS.MAX) / 2) {
          target = SNAP_POINTS.MAX;
        } else if (currentHeight < (SNAP_POINTS.MIN + SNAP_POINTS.MID) / 2) {
          target = SNAP_POINTS.MIN;
        }

        Animated.spring(sheetHeight, {
          toValue: target,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.bottomSheet, { height: sheetHeight }]}>
      <View {...panResponder.panHandlers} style={styles.handleBarWrapper}>
        <View style={styles.handleBar} />
      </View>

      <FlatList
        data={displayedMarkers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <StoreListItem item={item} onPress={() => onItemPress(item.id)} />
        )}
        scrollEnabled={true}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    ...theme.shadows.level2,
    overflow: 'hidden',
  },
  handleBarWrapper: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  handleBar: {
    width: 50,
    height: 3,
    backgroundColor: colors.gray[300],
    borderRadius: 48,
  },
});

export default BottomSheet;
