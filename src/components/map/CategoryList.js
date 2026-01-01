import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import theme from '../../style';
import colors from '../../style/colors';
import { CATEGORIES } from '../../constants/MapData';

const CategoryList = ({ onSelectCategory }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.IconComponent;
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.chip}
              onPress={() => onSelectCategory(cat)}
              activeOpacity={0.7}
            >
              <Icon width={18} height={18} color={cat.defaultColor} />
              <Text style={styles.label}>{cat.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  scrollContent: {
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    ...theme.shadows.level1,
  },
  label: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[800],
  },
});

export default CategoryList;
