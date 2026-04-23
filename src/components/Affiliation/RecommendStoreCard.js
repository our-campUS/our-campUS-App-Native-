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
  const isEvent = item?.type === '행사' || item?.activityType === '행사';
  const isPartner = item?.type === '제휴' || item?.activityType === '제휴';
  const iconSize = isLong ? 20 : 15;

  // 1. 카드 메인 제목 (title 최우선)
  const name = item?.title || item?.name || item?.placeName;
  const category = item?.placeType ?? item?.category;

  // 2. 📍 공통: 장소 정보 (제휴, 행사 둘 다 사용)
  const place = item?.placeName || item?.place;

  // 3. 🎫 제휴 전용 데이터 (혜택 상세)
  const benefit = item?.detail ?? item?.benefit;

  // 4. 📅 행사 전용 데이터 (날짜)
  let eventDate = item?.date;
  if (!eventDate && (item?.endDateTime || item?.startDateTime)) {
    const targetDate = item?.endDateTime || item?.startDateTime;
    eventDate = targetDate.split('T')[0].replace(/-/g, '.');
  }

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
          <Text
            style={isLong ? styles.nameLong : styles.nameShort}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
          <Text style={isLong ? styles.placeTypeLong : styles.placeTypeShort}>
            {category}
          </Text>
        </View>

        <View style={styles.detailWrapper}>
          {/* ✅ 1. 공통: 장소 정보 (제휴든 행사든 무조건 띄움) */}
          {place && (
            <View style={styles.detailRow}>
              <PlaceIcon
                width={iconSize}
                height={iconSize}
                color={colors.gray[300]}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[detailTextStyle, styles.detailRowText]}
              >
                {place}
              </Text>
            </View>
          )}

          {/* ✅ 2. 제휴일 경우: 쿠폰 아이콘 (상세 혜택 내용) */}
          {isPartner && benefit && (
            <View style={styles.detailRow}>
              <CouponIcon width={iconSize} height={iconSize} />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[detailTextStyle, styles.detailRowText]}
              >
                {benefit}
              </Text>
            </View>
          )}

          {/* ✅ 3. 행사일 경우: 달력 아이콘 (날짜) */}
          {isEvent && eventDate && (
            <View style={styles.detailRow}>
              <CalendarIcon width={iconSize} height={iconSize} />
              <Text style={[detailTextStyle, styles.detailRowText]}>
                {eventDate}
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
    borderColor: theme.colors.backgroundSub,
    backgroundColor: colors.gray['000'],
  },
  long: {
    width: 335,
    padding: 20,
    backgroundColor: theme.colors.background,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.backgroundSub,
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
    backgroundColor: theme.colors.border,
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
    flexShrink: 1,
  },
  nameLong: {
    ...typography.heading6,
    fontWeight: 'bold',
    color: theme.colors.text,
    flexShrink: 1,
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
    color: theme.colors.textWhite,
    position: 'absolute',
    top: 9,
    left: 9,
    right: 9.3,
    bottom: 10,
    textAlign: 'center',
  },
});

export default RecommendStoreCard;
