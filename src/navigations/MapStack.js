import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MapScreen from '../screens/Map/MapScreen';
import StoreDetailScreen from '../screens/Store/StoreDetailScreen';

const Stack = createNativeStackNavigator();

const MapStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MapHome"
        component={MapScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="StoreDetail"
        component={StoreDetailScreen}
        options={{ title: '가게 상세' }}
      />
    </Stack.Navigator>
  );
};

export default MapStack;
