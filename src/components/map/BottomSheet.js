import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  PanResponder,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StoreListItem from '../common/StoreListItem';
import EmptyResult from '../common/EmptyResult';
import theme from '../../style';
import colors from '../../style/colors';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const HEIGHT_LIST = SCREEN_HEIGHT * 0.45;
const HEIGHT_ITEM = 280;
const HEIGHT_HIDDEN = 0;
const HANDLE_BAR_HEIGHT = 36;

const BottomSheet = ({
  displayedMarkers,
  selectedMarkerId,
  onItemPress,
  maxHeight,
  sheetHeightAnimated,
  onEndReached,
  isLoading,
  onUpdateStore,
  userLocation,
  showToast,
}) => {
  const navigation = useNavigation();
  const HEIGHT_MAX = maxHeight * 0.75;
  const sheetHeight = sheetHeightAnimated;
  const isPinSelected = !!selectedMarkerId && displayedMarkers.length === 1;

  const startHeight = useRef(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const [pinItemHeight, setPinItemHeight] = useState(0);

  useEffect(() => {
    if (isPinSelected && pinItemHeight > 0) {
      Animated.spring(sheetHeight, {
        toValue: pinItemHeight + HANDLE_BAR_HEIGHT,
        useNativeDriver: false,
        friction: 8,
        tension: 40,
      }).start();
    }
  }, [isPinSelected, pinItemHeight, sheetHeight]);

  const SNAP_POINTS = {
    HIDDEN: HEIGHT_HIDDEN,
    MIN: HEIGHT_ITEM,
    MID: HEIGHT_LIST,
    MAX: HEIGHT_MAX,
  };

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
        startHeight.current = sheetHeight._value;
      },

      onPanResponderMove: (_, gestureState) => {
        let newHeight = startHeight.current - gestureState.dy;

        if (newHeight > HEIGHT_MAX) newHeight = HEIGHT_MAX;
        if (newHeight < HEIGHT_HIDDEN) newHeight = HEIGHT_HIDDEN;

        sheetHeight.setValue(newHeight);
      },

      onPanResponderRelease: (_, gestureState) => {
        const currentHeight = sheetHeight._value;
        const { dy } = gestureState;

        let target = SNAP_POINTS.HIDDEN;
        if (currentHeight > (SNAP_POINTS.MID + SNAP_POINTS.MAX) / 2) {
          target = SNAP_POINTS.MAX;
        } else if (currentHeight > (SNAP_POINTS.MIN + SNAP_POINTS.MID) / 2) {
          target = SNAP_POINTS.MID;
        } else if (currentHeight > SNAP_POINTS.MIN * 0.7) {
          target = SNAP_POINTS.MIN;
        } else {
          target = SNAP_POINTS.HIDDEN;
          Keyboard.dismiss();
        }

        Animated.spring(sheetHeight, {
          toValue: target,
          useNativeDriver: false,
          friction: 8,
          tension: 40,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View style={[styles.bottomSheet, { height: sheetHeight }]}>
      <View {...panResponder.panHandlers} style={styles.handleBarWrapper}>
        <View style={styles.handleBar} />
      </View>

      {isPinSelected ? (
        <View onLayout={(e) => setPinItemHeight(e.nativeEvent.layout.height)}>
          <StoreListItem
            item={displayedMarkers[0]}
            userLocation={userLocation}
            onPress={() => {
              onItemPress(displayedMarkers[0].placeId);
              navigation.navigate('StoreDetailScreen', {
                store: displayedMarkers[0],
                onUpdatePlace: (oldId, newData) => {
                  if (onUpdateStore) onUpdateStore(oldId, newData);
                },
              });
            }}
            onLikeToggle={(placeId, newData) => {
              if (onUpdateStore) onUpdateStore(placeId, newData);
            }}
            showToast={showToast}
          />
        </View>
      ) : (
        <FlatList
          data={displayedMarkers}
          keyExtractor={(item) => item.placeId.toString()}
          renderItem={({ item }) => (
            <StoreListItem
              item={item}
              userLocation={userLocation}
              onPress={() => {
                onItemPress(item.placeId);
                navigation.navigate('StoreDetailScreen', {
                  store: item,
                  onUpdatePlace: (oldId, newData) => {
                    if (onUpdateStore) onUpdateStore(oldId, newData);
                  },
                });
              }}
              onLikeToggle={(placeId, newData) => {
                if (onUpdateStore) onUpdateStore(placeId, newData);
              }}
              showToast={showToast}
            />
          )}
          ListEmptyComponent={!isLoading ? <EmptyResult paddingTop={60} /> : null}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.loaderStyle}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : null
          }
          scrollEnabled={true}
        />
      )}
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
    elevation: 10,
  },
  handleBarWrapper: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: theme.colors.background,
  },
  handleBar: {
    width: 50,
    height: 4,
    backgroundColor: colors.gray[300],
    borderRadius: 2,
  },
  loaderStyle: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default BottomSheet;
