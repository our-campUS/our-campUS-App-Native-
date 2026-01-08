import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTab from '../components/MainTab';
import CouncilMainTab from '../components/CouncilMainTab';
import MapSearchScreen from '../screens/Map/MapSearchScreen';
import MapSearchResultScreen from '../screens/Map/MapSearchResultScreen';

import useAuthStore from '../store/authStore';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const isCouncil = useAuthStore((state) => state?.user?.role === 'COUNCIL');

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isCouncil ? (
        <Stack.Screen name="MainTab" component={CouncilMainTab} />
      ) : (
        <Stack.Screen name="MainTab" component={MainTab} />
      )}

      <Stack.Screen name="MapSearchScreen" component={MapSearchScreen} />
      <Stack.Screen
        name="MapSearchResultScreen"
        component={MapSearchResultScreen}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
