import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import theme from '../../style';
import { CATEGORIES, BENEFITS_DATA } from '../../constants/DummyData';

const AffiliateSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('중앙대');

  return (
    <View>
      {/* 탭 메뉴 */}
      <View style={styles.tabContainer}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.tabButton,
              selectedCategory === cat && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedCategory === cat && styles.activeTabText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 제휴 리스트 */}
      <FlatList
        data={BENEFITS_DATA}
        keyExtractor={(item) => String(item.id)}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.benefitItem}>
            <View style={styles.benefitImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.brandName}>{item.name}</Text>
              <Text style={styles.benefitDesc}>{item.desc}</Text>
            </View>
            <View style={styles.tagBox}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          </View>
        )}
      />

      {/* 더보기 버튼 */}
      <TouchableOpacity style={styles.moreButton}>
        <Text style={styles.moreText}>이용 가능한 제휴 더보기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // 탭 스타일
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: theme.colors.primary1,
  },
  tabText: {
    textAlign: 'center',
    color: theme.colors.textDim,
    ...theme.typography.heading5,
  },
  activeTabText: {
    color: theme.colors.primary1,
    ...theme.typography.heading5,
  },

  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomColor: theme.colors.border,
  },
  benefitImage: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.backgroundSub,
    borderRadius: 100,
    marginRight: 21,
  },
  brandName: {
    ...theme.typography.body3Bold,
  },
  benefitDesc: {
    ...theme.typography.body3Regular,
    color: theme.colors.text,
    marginTop: 2,
  },
  tagBox: {
    backgroundColor: theme.colors.primary2,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 50,
    marginLeft: 10,
  },
  tagText: {
    color: theme.colors.textWhite,
    ...theme.typography.caption2Bold,
  },

  moreButton: {
    backgroundColor: theme.colors.primary1Light,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 20,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  moreText: {
    color: theme.colors.text,
    ...theme.typography.heading6,
  },
});

export default AffiliateSection;
