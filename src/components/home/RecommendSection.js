import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StoreCard from '../common/StoreCard';
import { getRandomPlaces } from '../../api/place';
import { calculateDistance } from '../../utils/distance';

const RecommendSection = () => {
  const navigation = useNavigation();
  const [recommendList, setRecommendList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // 내 위치 (기준점)
      const myLat = 37.5570389272802;
      const myLng = 126.960204232592;

      const data = await getRandomPlaces(myLat, myLng);

      if (data) {
        const partners = (data.partnershipPosts || []).map((item) => {
          const itemLat = item.coordinate?.latitude;
          const itemLng = item.coordinate?.longitude;

          return {
            id: `partner_${item.placeId}`,
            name: item.placeName,
            category: '제휴 매장',
            discount: item.partnershipTitle,
            tags: ['제휴', item.councilName],
            image: item.imageUrl || 'https://via.placeholder.com/150',
            rating: 4.8,
            distance:
              calculateDistance(myLat, myLng, itemLat, itemLng) ||
              '거리 정보 없음',
          };
        });

        const nearby = (data.nearbyPlaces || []).map((item, index) => {
          const itemLat = item.coordinate?.latitude;
          const itemLng = item.coordinate?.longitude;

          return {
            id: item.placeKey || `nearby_${index}`,
            name: item.placeName,
            category: item.category ? item.category.split('>').pop() : '기타',
            discount: '일반 매장',
            tags: ['추천'],
            image:
              (item.imgUrls && item.imgUrls[0]) ||
              'https://via.placeholder.com/150',
            rating: 4.0,
            distance: calculateDistance(myLat, myLng, itemLat, itemLng),
          };
        });

        setRecommendList([...partners, ...nearby]);
      }
    };

    fetchData();
  }, []);

  const handlePressCard = (item) => {
    navigation.navigate('StoreDetailScreen', { store: item });
  };

  return (
    <View>
      <FlatList
        data={recommendList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <StoreCard
            image={item.image}
            tags={item.tags}
            name={item.name}
            category={item.category}
            rating={item.rating}
            discount={item.discount}
            distance={item.distance}
            onPress={() => handlePressCard(item)}
          />
        )}
      />
    </View>
  );
};

export default RecommendSection;
