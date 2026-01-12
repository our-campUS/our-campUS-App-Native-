import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import theme from '../../style';
import typography from '../../style/typography';

import StarIcon from '../../../assets/icons/common/star.svg';
import TicketIcon from '../../../assets/icons/common/ticket.svg';
import PinIcon from '../../../assets/icons/common/pin.svg';
import { CATEGORIES } from '../../constants/MapData';
import LikedIcon from '../../../assets/Liked.svg';
import UnlikedIcon from '../../../assets/Unliked.svg';

const StoreListItem = ({
  item,
  onPress,
  showImages = true,
  showDiscountDetail = false,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const categoryLabel =
    CATEGORIES.find((cat) => cat.id === item.category)?.label || item.category;

  const tags =
    item.partnerTags && item.partnerTags.length > 0
      ? item.partnerTags
      : item.partnership
      ? [item.partnership]
      : [];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={styles.headerRow}>
          <View style={styles.titleWrapper}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.category}>{categoryLabel}</Text>
          </View>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => setIsLiked(!isLiked)}
            activeOpacity={0.7}
          >
            {isLiked ? (
              <LikedIcon width={16} height={15} color={theme.colors.primary2} />
            ) : (
              <UnlikedIcon width={16} height={15} />
            )}
          </TouchableOpacity>
        </View>

        {tags.length > 0 && (
          <View style={styles.tagRow}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.badge}>
                <Text style={styles.badgeText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={[styles.infoRow, !showImages && { marginBottom: 0 }]}>
          <View style={styles.infoItem}>
            <StarIcon width={16} height={16} style={{ marginRight: 4 }} />
            <Text style={styles.infoText}>{item.rating}</Text>
          </View>

          {showDiscountDetail ? (
            item.discount && (
              <View style={styles.infoItem}>
                <TicketIcon width={20} height={20} style={{ marginRight: 4 }} />
                <Text style={styles.infoText}>{item.discount}</Text>
              </View>
            )
          ) : (
            <>
              {item.discount && (
                <View style={styles.infoItem}>
                  <TicketIcon
                    width={20}
                    height={20}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.infoText}>{item.discount}</Text>
                </View>
              )}
              <View style={styles.infoItem}>
                <PinIcon width={20} height={20} style={{ marginRight: 4 }} />
                <Text style={styles.infoText}>
                  {item.address} {item.distance}
                </Text>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>

      {showImages && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {[1, 2, 3, 4].map((img, index) => (
            <View key={index} style={styles.imagePlaceholder} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  likeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  name: {
    ...typography.heading4,
    color: theme.colors.text,
    marginRight: 8,
  },
  category: {
    ...typography.caption1Regular,
    color: theme.colors.textDim,
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 6,
  },
  badge: {
    backgroundColor: theme.colors.primary1Light,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  badgeText: {
    color: theme.colors.primary1,
    ...typography.caption2Bold,
  },

  infoRow: {
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  infoText: {
    ...typography.body4Regular,
    color: theme.colors.textDim,
  },
  imageScroll: {
    flexDirection: 'row',
  },
  imagePlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 8,
    backgroundColor: theme.colors.backgroundSub,
    marginRight: 8,
  },
});

export default StoreListItem;
