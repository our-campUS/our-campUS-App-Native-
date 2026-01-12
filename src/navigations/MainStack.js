import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTab from '../components/MainTab';
import CouncilMainTab from '../components/CouncilMainTab';

import StoreDetailScreen from '../screens/Store/StoreDetailScreen';
import ReviewListScreen from '../screens/Store/ReviewListScreen';
import CameraScanScreen from '../screens/Store/ScanScreen';
import ScanConfirmScreen from '../screens/Store/ScanConfirmScreen';
import WriteReviewScreen from '../screens/Store/WriteReviewScreen';
import ReviewResultScreen from '../screens/Store/ReviewResultScreen';
import SelectStoreScreen from '../screens/Stamp/SelectStoreScreen';

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

      <Stack.Screen name="StoreDetailScreen" component={StoreDetailScreen} />
      <Stack.Screen
        name="ReviewListScreen"
        component={ReviewListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SelectStoreScreen" component={SelectStoreScreen} />
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
      <Stack.Screen
        name="WriteReviewScreen"
        component={WriteReviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewResultScreen"
        component={ReviewResultScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
