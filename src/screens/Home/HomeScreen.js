import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import theme from '../../style';
import StoreCard from './StoreCard';
import MainCarousel from './MainCarousel';
import CurationCarousel from './CurationCarousel';
import {
  CATEGORIES,
  BENEFITS_DATA,
  STORE_DATA,
  CAROUSEL_DATA,
} from './DummyData';

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('중앙대');

  return (
    <ScrollView style={styles.container}>
      {/* 행사 안내 */}
      <View style={styles.header}>
        <Text style={styles.greeting}>사용자님, 안녕하세요</Text>
        <TouchableOpacity style={styles.eventBox}>
          <Text style={styles.eventText} numberOfLines={1} ellipsizeMode="tail">
            <Text style={styles.boldText}>오늘의 행사</Text> 310관 1층
            ‘경영경제대학 간식행사’가 18시에 있습니다 🎉
          </Text>
        </TouchableOpacity>
      </View>

      {/* 캐러셀 */}
      <View style={styles.carouselWrapper}>
        <MainCarousel data={CAROUSEL_DATA} />
      </View>

      {/* 이용 가능한 제휴 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🧐 이용 가능한 제휴</Text>
      </View>

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
        keyExtractor={(item) => item.id}
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

      {/* 공간 추천 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          🚀 3시간 공강, 이런 공간은 어때요?
        </Text>
      </View>

      <FlatList
        data={STORE_DATA}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        renderItem={({ item }) => (
          <StoreCard
            name={item.name}
            category={item.category}
            rating={item.rating}
            discount={item.discount}
            distance={item.distance}
            tags={item.tags}
            image={item.image}
          />
        )}
      />

      {/* 큐레이션 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>💕 추천 큐레이션</Text>
      </View>

      <CurationCarousel />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },
  header: { marginTop: 30 },
  greeting: { ...theme.typography.heading6, marginBottom: 15 },
  eventBox: {
    backgroundColor: theme.colors.primary1Light,
    padding: 10,
    borderRadius: 8,
  },
  eventText: { ...theme.typography.body4Regular, color: theme.colors.text },
  boldText: { ...theme.typography.body4Bold, marginRigh: 8 },
  carouselWrapper: {
    marginTop: 20,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: theme.colors.backgroundSub,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  sectionHeader: { marginVertical: 20 },
  sectionTitle: { ...theme.typography.heading4 },

  tabContainer: { flexDirection: 'row', marginBottom: 12 },
  tabButton: {
    flex: 1,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: theme.colors.primary1 },
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
    borderColor: theme.colors.border,
  },
  benefitImage: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.backgroundSub,
    borderRadius: 100,
    marginRight: 21,
  },
  brandName: { ...theme.typography.body3Bold },
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
  tagText: { color: theme.colors.textWhite, ...theme.typography.caption2Bold },

  moreButton: {
    backgroundColor: theme.colors.primary1Light,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 20,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  moreText: { color: theme.colors.text, ...theme.typography.heading6 },
  listPadding: {
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
