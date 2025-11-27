import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import theme from '../../style';
import StoreCard from './StoreCard';
import MainCarousel from './MainCarousel';
import AffiliateSection from './AffiliateSection';
import CurationCarousel from './CurationCarousel';
import { STORE_DATA, CAROUSEL_DATA } from './DummyData';

const HomeScreen = () => {
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

      <AffiliateSection />

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
});

export default HomeScreen;
