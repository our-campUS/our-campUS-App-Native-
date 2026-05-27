import { View, Text, StyleSheet, Pressable } from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';
import PinIcon from '@assets/icons/common/pin.svg';
import ArrowRightIcon from '@assets/ArrowRightIcon.svg';
import CalendarIcon from '@assets/calendar.svg';
import useAuthStore from '../../store/authStore';
import { parseISODate } from '../../utils/dateTime';

const styles = StyleSheet.create({
  container: {
    width: 270,
    backgroundColor: colors.common.white,
    paddingHorizontal: 30,
    paddingVertical: 30,
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
  contentWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    alignSelf: 'stretch',
    marginTop: 12,
  },
  title: {
    ...typography.heading5,
    color: colors.gray[850],
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    alignSelf: 'stretch',
  },
  placeContainer: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  place: {
    flexShrink: 1,
    ...typography.body4Regular,
    color: colors.gray[700],
  },
  dateContainer: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  date: {
    flexShrink: 1,
    ...typography.body4Regular,
    color: colors.gray[700],
  },
});

const AffiliationCarouselItem = ({
  item,
  isOrange = false,
  navigation = null,
  councilType = null,
}) => {
  const { user } = useAuthStore();

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
        <ArrowRightIcon
          width={4}
          height={7}
          color={isOrange ? colors.orange[600] : colors.blue[600]}
        />
      </View>
      <View style={styles.contentWrapper}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </Text>
        <View style={styles.bottomContainer}>
          <View style={styles.placeContainer}>
            <PinIcon color={colors.gray[300]} />
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
                const time =
                  p.hour !== null
                    ? ` ${String(p.hour).padStart(2, '0')}:${String(
                        p.minute
                      ).padStart(2, '0')}`
                    : '';
                return `${p.year}.${mm}.${dd}${time}`;
              })()}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default AffiliationCarouselItem;
