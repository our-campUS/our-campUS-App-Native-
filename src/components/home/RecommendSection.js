import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StoreCard from '../common/StoreCard';
import { getRandomPlaces } from '../../api/place';
import { calculateDistance } from '../../utils/distance';
import useLocation, { DEFAULT_LOCATION } from '../../hooks/useLocation';
const DEFAULT_STORE_IMAGE = require('../../../assets/images/default_image.webp');

const RecommendSection = () => {
  const navigation = useNavigation();
  const [recommendList, setRecommendList] = useState([]);
  const { getLocationIfPermitted } = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      // 이미 권한이 있으면 실제 위치 사용, 없으면 기본 위치(중앙대) 유지
      const location = await getLocationIfPermitted();
      const myLat = (location ?? DEFAULT_LOCATION).latitude;
      const myLng = (location ?? DEFAULT_LOCATION).longitude;

      const data = await getRandomPlaces(myLat, myLng);

      if (data) {
const partners = (data.partnershipPosts || []).map((item) => {
          const itemLat = item.coordinate?.latitude;
          const itemLng = item.coordinate?.longitude;

          return {
            ...item,
            id: `partner_${item.placeId}`,
            placeId: item.placeId,
            name: item.placeName,
            category: '제휴 매장',
            discount: item.partnershipTitle,
            tag: ['추천'],
            image: item.imageUrl ? { uri: item.imageUrl } : DEFAULT_STORE_IMAGE,
            imgUrls: item.imageUrl,
            rating: item.averageStar || '-',
            distance:
              calculateDistance(myLat, myLng, itemLat, itemLng) ||
              '거리 정보 없음',
            type: 'PARTNER',
            isPartnership: true,
          };
        });

        const nearby = (data.nearbyPlaces || []).map((item, index) => {
          const itemLat = item.coordinate?.latitude;
          const itemLng = item.coordinate?.longitude;
          const hasImages = item.imgUrls && item.imgUrls.length > 0;

          return {
            ...item,
            id: item.placeKey || `nearby_${index}`,
            name: item.placeName,
            category: item.category ? item.category.split('>').pop() : '기타',
            discount: '일반 매장',
            tag: ['추천'],
            image: hasImages ? { uri: item.imgUrls[0] } : DEFAULT_STORE_IMAGE,
            imgUrls: item.imgUrls || [],
            rating: item.averageStar || '-',
            distance: calculateDistance(myLat, myLng, itemLat, itemLng),
            type: 'DEFAULT',
            isPartner: false,
          };
        });

        setRecommendList([...partners, ...nearby]);
      }
    };

    fetchData();
  }, [getLocationIfPermitted]);

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
            tags={item.tag}
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
