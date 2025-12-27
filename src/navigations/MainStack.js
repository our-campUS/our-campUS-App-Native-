import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTab from '../components/MainTab';
import MapSearchScreen from '../screens/Map/MapSearchScreen';
import MapSearchResultScreen from '../screens/Map/MapSearchResultScreen';

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
    </Stack.Navigator>
  );
};

export default MainStack;
