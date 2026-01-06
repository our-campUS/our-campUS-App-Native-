import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTab from '../components/MainTab';
import MapSearchScreen from '../screens/Map/MapSearchScreen';
import MapSearchResultScreen from '../screens/Map/MapSearchResultScreen';
import StoreDetailScreen from '../screens/Store/StoreDetailScreen';
import ReviewListScreen from '../screens/Store/ReviewListScreen';
import CameraScanScreen from '../screens/Store/ScanScreen';
import ScanConfirmScreen from '../screens/Store/ScanConfirmScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTab" component={MainTab} />

      <Stack.Screen name="MapSearchScreen" component={MapSearchScreen} />
      <Stack.Screen
        name="MapSearchResultScreen"
        component={MapSearchResultScreen}
      />
      <Stack.Screen name="StoreDetailScreen" component={StoreDetailScreen} />
      <Stack.Screen
        name="ReviewListScreen"
        component={ReviewListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CameraScanScreen"
        component={CameraScanScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScanConfirmScreen"
        component={ScanConfirmScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
