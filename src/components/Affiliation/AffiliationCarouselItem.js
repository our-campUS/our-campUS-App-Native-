import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';
import Vector2 from '../../../assets/Vector2.svg';
import CalendarIcon from '../../../assets/calendar.svg';
import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';

const styles = StyleSheet.create({
  container: {
    minWidth: 255,
    height: 147,
    backgroundColor: colors.common.white,
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 20,
  },
  activityTypeContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    height: 26,
    backgroundColor: colors.blue['050'],
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeOrangeActivityTypeContainer: {
    backgroundColor: colors.orange['050'],
  },
  activityType: {
    ...typography.caption2Bold,
    color: colors.blue[600],
  },
  activeOrangeActivityType: {
    color: colors.orange[600],
  },
  title: {
    ...typography.heading5,
    color: colors.gray[850],
    marginTop: 12,
  },
  bottomContainer: {
    // backgroundColor: 'red',
    flexDirection: 'column',
    alignItems: 'flex-start',
    // gap: 4,
    marginTop: 8,
  },
  placeContainer: {
    // backgroundColor: 'blue',
    // flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  place: {
    ...typography.body4Regular,
    color: colors.gray[700],
  },
  dateContainer: {
    // backgroundColor: 'blue',
    // flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginLeft: -4,
  },
  date: {
    ...typography.body4Regular,
    color: colors.gray[700],
    marginLeft: -4,
  },
});

const AffiliationCarouselItem = ({
  item,
  isOrange = false,
  navigation = null,
  councilType = null,
}) => {
  const { user } = useAuthStore();
  const [startYear, setStartYear] = useState(null);
  const [startMonth, setStartMonth] = useState(null);
  const [startDay, setStartDay] = useState(null);
  const [startHour, setStartHour] = useState(null);
  const [startMinute, setStartMinute] = useState(null);

  useEffect(() => {
    console.log('user', user);
  }, [user]);

  useEffect(() => {
    setStartYear(item?.dateTime?.slice(0, 4) || item?.endDateTime?.slice(0, 4));
    setStartMonth(
      item?.dateTime?.slice(5, 7) || item?.endDateTime?.slice(5, 7)
    );
    setStartDay(
      item?.dateTime?.slice(8, 10) || item?.endDateTime?.slice(8, 10)
    );
    setStartHour(
      item?.dateTime?.slice(11, 13) || item?.endDateTime?.slice(11, 13)
    );
    setStartMinute(
      item?.dateTime?.slice(14, 16) || item?.endDateTime?.slice(14, 16)
    );
  }, [item]);

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        user?.role === 'COUNCIL'
          ? navigation?.navigate('CouncilAffiliateDetailScreen', {
              item,
            })
          : navigation?.navigate('AffiliationDetailScreen', {
              item,
              councilType,
            })
      }
    >
      <View
        style={[
          styles.activityTypeContainer,
          isOrange && styles.activeOrangeActivityTypeContainer,
        ]}
      >
        <Text
          style={[
            styles.activityType,
            isOrange && styles.activeOrangeActivityType,
          ]}
        >
          {item.activityType || '행사'}
        </Text>
        <Text
          style={[
            styles.activityType,
            isOrange && styles.activeOrangeActivityType,
          ]}
        >
          {'>'}
        </Text>
      </View>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {item.title}
      </Text>
      <View style={styles.bottomContainer}>
        <View style={styles.placeContainer}>
          <Vector2 width={9.6} height={12.4} color={colors.gray[300]} />
          <Text style={styles.place} numberOfLines={1} ellipsizeMode="tail">
            {item.place} {item.detailedLocation}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <CalendarIcon width={18} height={18} color={colors.gray[300]} />
          <Text style={styles.date} numberOfLines={1} ellipsizeMode="tail">
            {startYear}.{startMonth}.{startDay} {startHour}:{startMinute}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default AffiliationCarouselItem;
