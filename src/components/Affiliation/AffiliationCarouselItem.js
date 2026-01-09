import { View, Text, StyleSheet } from 'react-native';
import colors from '../../style/colors';
import typography from '../../style/typography';
import Vector2 from '../../../assets/Vector2.svg';
import CalendarIcon from '../../../assets/calendar.svg';

const styles = StyleSheet.create({
  container: {
    width: '255px',
    height: 147,
    backgroundColor: colors.common.white,
    padding: 30,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  placeContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  place: {
    ...typography.body4Regular,
    color: colors.gray[700],
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  date: {
    ...typography.body4Regular,
    color: colors.gray[700],
  },
});

const AffiliationCarouselItem = ({ item, isOrange = false }) => {
  return (
    <View style={styles.container}>
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
          {item.activityType}
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
            {item.place}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <CalendarIcon width={20} height={20} color={colors.gray[300]} />
          <Text style={styles.date} numberOfLines={1} ellipsizeMode="tail">
            {item.date}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AffiliationCarouselItem;
