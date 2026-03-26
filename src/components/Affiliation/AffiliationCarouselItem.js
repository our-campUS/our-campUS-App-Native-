import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';
import Vector2 from '../../../assets/Vector2.svg';
import CalendarIcon from '../../../assets/calendar.svg';
import { useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { parseISODate } from '../../utils/dateTime';

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

  useEffect(() => {
    console.log('user', user);
  }, [user]);


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
            {item.place || item.placeName} {item.detailedLocation}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <CalendarIcon width={18} height={18} color={colors.gray[300]} />
          <Text style={styles.date} numberOfLines={1} ellipsizeMode="tail">
            {(() => {
              const p = parseISODate(item?.dateTime || item?.endDateTime);
              if (!p) return '';
              const mm = String(p.month).padStart(2, '0');
              const dd = String(p.day).padStart(2, '0');
              const time = p.hour !== null ? ` ${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}` : '';
              return `${p.year}.${mm}.${dd}${time}`;
            })()}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default AffiliationCarouselItem;
