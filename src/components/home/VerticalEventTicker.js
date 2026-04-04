import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import theme from '../../style';
import colors from '../../style/colors';
const ITEM_HEIGHT = 40;
const CYCLE_MS = 3000;
const ANIM_MS = 400;

const EventItem = ({ event, index, onPress }) => (
  <TouchableOpacity
    testID={`event-item-${index}`}
    activeOpacity={0.7}
    style={styles.item}
    onPress={() => onPress(event)}
  >
    <Text style={styles.eventText} numberOfLines={1} ellipsizeMode="tail">
      <Text style={styles.boldText}>다가오는 행사 </Text>
      {event.placeName} &apos;{event.title}&apos;
    </Text>
  </TouchableOpacity>
);

const VerticalEventTicker = ({ events, onEventPress }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const indexRef = useRef(0);

  const displayEvents = useMemo(() => {
    if (events.length <= 1) return events;
    return [...events, events[0]];
  }, [events]);

  useEffect(() => {
    if (events.length <= 1) return;

    let active = true;
    let timeoutId = null;

    const animate = () => {
      if (!active) return;

      timeoutId = setTimeout(() => {
        if (!active) return;

        const nextIndex = indexRef.current + 1;

        if (nextIndex >= displayEvents.length) {
          translateY.setValue(0);
          indexRef.current = 0;
          animate();
          return;
        }

        indexRef.current = nextIndex;
        Animated.timing(translateY, {
          toValue: -nextIndex * ITEM_HEIGHT,
          duration: ANIM_MS,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished && active) {
            animate();
          }
        });
      }, CYCLE_MS);
    };

    translateY.setValue(0);
    indexRef.current = 0;
    animate();

    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
      translateY.stopAnimation();
    };
  }, [events.length, displayEvents, translateY]);

  if (events.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>오늘은 예정된 행사가 없습니다 😴</Text>
      </View>
    );
  }

  if (events.length === 1) {
    return <EventItem event={events[0]} index={0} onPress={onEventPress} />;
  }

  return (
    <View style={styles.tickerContainer}>
      <Animated.View
        style={[styles.tickerColumn, { transform: [{ translateY }] }]}
      >
        {displayEvents.map((event, index) => (
          <EventItem
            key={`${event.id}-${index}`}
            event={event}
            index={index}
            onPress={onEventPress}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  tickerContainer: {
    height: ITEM_HEIGHT,
    overflow: 'hidden',
    borderRadius: 8,
  },
  tickerColumn: {
    flexDirection: 'column',
  },
  item: {
    height: ITEM_HEIGHT,
    backgroundColor: theme.colors.primary1Light,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 8,
  },
  emptyBox: {
    height: ITEM_HEIGHT,
    backgroundColor: colors.gray[100],
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 8,
  },
  eventText: {
    ...theme.typography.body4Regular,
    color: theme.colors.text,
  },
  boldText: {
    ...theme.typography.body4Bold,
    color: theme.colors.text,
  },
  emptyText: {
    ...theme.typography.body4Regular,
    color: colors.gray[500],
  },
});

export default VerticalEventTicker;
