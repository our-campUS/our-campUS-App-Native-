import React from 'react';
import { View, FlatList } from 'react-native';
import StoreCard from '../common/StoreCard';
import { STORE_DATA } from '../../constants/DummyData';
const RecommendSection = () => {
  return (
    <View>
      <FlatList
        data={STORE_DATA}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <StoreCard {...item} />}
      />
    </View>
  );
};

export default RecommendSection;
