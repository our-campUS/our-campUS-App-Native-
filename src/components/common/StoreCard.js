import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../style';

const StoreCard = ({
  image,
  tags,
  name,
  category,
  rating,
  discount,
  distance,
}) => {
  return (
    <View style={styles.card}>
      {/* 상단 이미지 */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        {/* 태그 */}
        <View style={styles.tagsOverlay}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 하단 정보 */}
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.category}>{category}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="star" size={14} color="black" style={styles.icon} />
          <Text style={styles.infoText}>{rating}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons
            name="ticket-percent"
            size={14}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.infoText}>{discount}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="location-sharp"
            size={14}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.infoText}>{distance}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 260,
    backgroundColor: theme.colors.background,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 10,
  },
  imageContainer: {
    height: 143,
    backgroundColor: theme.colors.backgroundSub,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tagsOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: theme.colors.primary1Light,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  tagText: {
    color: theme.colors.primary1,
    ...theme.typography.caption2Bold,
  },
  infoContainer: {
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    ...theme.typography.body3Bold,
    marginRight: 6,
  },
  category: {
    ...theme.typography.caption2Bold,
    color: theme.colors.textDim,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 4,
    width: 24,
  },
  infoText: {
    ...theme.typography.body4Regular,
    color: theme.colors.text,
  },
});

export default StoreCard;
