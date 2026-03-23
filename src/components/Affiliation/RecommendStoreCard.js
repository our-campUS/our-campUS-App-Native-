import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import BadgeIcon from '@assets/badgeIcon.svg';
import CouponIcon from '@assets/couponIcon.svg';
import PlaceIcon from '@assets/icons/place-icon.svg';
import CalendarIcon from '@assets/calendar.svg';
import RankIcon from '@assets/icons/rank-icon.svg';
import colors from '@style/colors';
import typography from '@style/typography';
import theme from '@style';

const RecommendStoreCard = ({ item, variant = 'short', rank }) => {
  const isLong = variant === 'long';
  const isEvent = item?.type === '행사';
  const isPartner = item?.type === '제휴';
  const iconSize = isLong ? 20 : 15;

  const name = item?.placeName ?? item?.place ?? item?.name;
  const category = item?.placeType ?? item?.category;
  const benefit = item?.detail ?? item?.benefit ?? item?.title;
  const distance = item?.distance;

  const detailTextStyle = isLong
    ? styles.detailTextLong
    : styles.detailTextShort;

  return (
    <View style={[styles.container, isLong ? styles.long : styles.short]}>
      <View style={isLong ? styles.imageLong : styles.imageShort}>
        {item?.thumbnailImageUrl && (
          <Image
            source={{ uri: item.thumbnailImageUrl }}
            style={isLong ? styles.imageLong : styles.imageShort}
          />
        )}
      </View>
      <View style={[styles.infoWrapper, isLong && styles.infoWrapperLong]}>
        <View style={styles.titleWrapper}>
          {item?.approved && (
            <BadgeIcon width={20} height={20} style={styles.badgeIcon} />
          )}
          <Text style={isLong ? styles.nameLong : styles.nameShort}>
            {name}
          </Text>
          <Text style={isLong ? styles.placeTypeLong : styles.placeTypeShort}>
            {category}
          </Text>
        </View>
        <View style={styles.detailWrapper}>
          {isPartner && benefit && (
            <View style={styles.detailRow}>
              <CouponIcon width={iconSize} height={iconSize} />
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                textBreakStrategy="balanced"
                style={[detailTextStyle, styles.detailRowText]}
              >
                {benefit}
              </Text>
            </View>
          )}
          {isEvent && item?.date && (
            <View style={styles.detailRow}>
              <CalendarIcon width={iconSize} height={iconSize} />
              <Text style={[detailTextStyle, styles.detailRowText]}>
                {item.date}
              </Text>
            </View>
          )}
          {distance && (
            <View style={styles.detailRow}>
              <PlaceIcon
                width={iconSize}
                height={iconSize}
                color={colors.gray[300]}
              />
              <Text style={[detailTextStyle, styles.detailRowText]}>
                {distance}
              </Text>
            </View>
          )}
        </View>
      </View>
      {isLong && rank != null && (
        <View style={styles.rankBadge}>
          <RankIcon width={24} height={32} />
          <Text style={styles.rankText}>{rank}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  short: {
    width: 280,
    height: 88,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray['050'],
    backgroundColor: colors.gray['000'],
  },
  long: {
    width: 335,
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.backgroundSub,
    ...theme.shadows.level1,
  },
  imageShort: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  imageLong: {
    width: 68,
    height: 68,
    borderRadius: 8,
    backgroundColor: colors.gray[200],
  },
  infoWrapper: {
    maxWidth: 180,
    marginLeft: 12,
  },
  infoWrapperLong: {
    flex: 1,
    maxWidth: undefined,
    marginLeft: 12,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    marginRight: 2,
  },
  nameShort: {
    ...typography.body4Bold,
    color: theme.colors.text,
  },
  nameLong: {
    ...typography.heading6,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  placeTypeShort: {
    ...typography.caption2Regular,
    color: theme.colors.textDim,
    marginLeft: 4,
  },
  placeTypeLong: {
    ...typography.caption1Regular,
    color: theme.colors.textDim,
    marginLeft: 6,
  },
  detailWrapper: {
    flexDirection: 'column',
    gap: 2,
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTextShort: {
    ...typography.caption1Regular,
    color: theme.colors.textDim,
  },
  detailTextLong: {
    ...typography.body4Regular,
    color: theme.colors.textDim,
  },
  detailRowText: {
    marginLeft: 4,
  },
  rankBadge: {
    position: 'absolute',
    top: 0,
    right: 20,
  },
  rankText: {
    ...typography.caption2Bold,
    color: 'white',
    position: 'absolute',
    top: 9,
    left: 9,
    right: 9.3,
    bottom: 10,
    textAlign: 'center',
  },
});

export default RecommendStoreCard;
