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
import typograpy from '../../style/typography';

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
              <Icon width={20} height={20} color={cat.defaultColor} />
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
    paddingLeft: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 30,
    marginRight: 4,
    ...theme.shadows.level1,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    marginLeft: 6,
    ...typograpy.body3Bold,
    color: theme.colors.textDim,
  },
});

export default CategoryList;
