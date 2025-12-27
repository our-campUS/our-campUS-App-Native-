import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SearchBar from '../../components/SearchBar';
import theme from '../../style';
import {
  CATEGORIES,
  RECENT_SEARCHES,
  SEARCH_ICON_CONFIG,
} from '../../constants/MapData';
import typography from '../../style/typography';

const MapSearchScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [keyword, setKeyword] = useState('');

  const renderHistoryItem = ({ item }) => {
    const { Component, color } = SEARCH_ICON_CONFIG[item.type];

    return (
      <TouchableOpacity style={styles.historyItem}>
        <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
          <Component width={22} height={22} />
        </View>

        <Text style={styles.historyText}>{item.text}</Text>

        <TouchableOpacity style={styles.deleteButton}>
          <Ionicons name="close" size={16} color={theme.colors.textDisabled} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.searchBarWrapper}>
        <SearchBar
          value={keyword}
          onChangeText={setKeyword}
          placeholder="원하는 제휴를 검색하세요"
          autoFocus={true}
          onBackPress={() => navigation.goBack()}
          onClearPress={() => setKeyword('')}
        />
      </View>

      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryChip}>
              <cat.IconComponent
                width={22}
                height={22}
                color={cat.defaultColor}
              />
              <Text style={styles.categoryText}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.divider} />

      <FlatList
        data={RECENT_SEARCHES}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHistoryItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchBarWrapper: {
    marginTop: 12,
  },
  categoryWrapper: {
    paddingVertical: 12,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  categoryText: {
    color: theme.colors.text,
    ...typography.body4Regular,
  },

  divider: {
    height: 2,
    backgroundColor: theme.colors.border,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyText: {
    flex: 1,
    color: theme.colors.text,
    ...typography.body3Regular,
  },
  deleteButton: {
    padding: 4,
  },
});

export default MapSearchScreen;
