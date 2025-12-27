import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../../style';
import typography from '../../style/typography';

import StarIcon from '../../../assets/icons/common/star.svg';
import TicketIcon from '../../../assets/icons/common/ticket.svg';
import PinIcon from '../../../assets/icons/common/pin.svg';

const StoreListItem = ({ item, onPress }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => setIsLiked(!isLiked)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={18}
            color={isLiked ? theme.colors.primary2 : theme.colors.border}
          />
        </TouchableOpacity>
      </View>

      {item.partnership && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.partnership}</Text>
        </View>
      )}

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <StarIcon width={16} height={16} style={{ marginRight: 4 }} />
          <Text style={styles.infoText}>{item.rating}</Text>
        </View>

        {item.discount && (
          <View style={styles.infoItem}>
            <TicketIcon width={20} height={20} style={{ marginRight: 4 }} />
            <Text style={styles.infoText}>{item.discount}</Text>
          </View>
        )}

        <View style={styles.infoItem}>
          <PinIcon width={20} height={20} style={{ marginRight: 4 }} />
          <Text style={styles.infoText}>
            {item.address} {item.distance}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageScroll}
      >
        {[1, 2, 3, 4].map((img, index) => (
          <View key={index} style={styles.imagePlaceholder} />
        ))}
      </ScrollView>
    </TouchableOpacity>
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
  badge: {
    backgroundColor: theme.colors.primary1Light,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 10,
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
    marginBottom: 4,
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
