import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CouncilAffiliateScreen from '../../screens/Council/CouncilAffiliateScreen';
import CouncilAffiliateDetailScreen from '../../screens/Council/CouncilAffiliateDetailScreen';
import WriteAffiliatePostScreen from '../../screens/Council/AffiliateCreate/WriteAffiliatePostScreen';
import SelectPlaceAffiliateScreen from '../../screens/Council/AffiliateCreate/SelectPlaceAffiliateScreen';
import SelectAffiliationLogoScreen from '../../screens/Council/AffiliateCreate/SelectAffiliationLogoScreen';
import PostFinishScreen from '../../screens/Council/AffiliateCreate/PostFinishScreen';
import WriteEventPostScreen from '../../screens/Council/AffiliateCreate/WriteEventPostScreen';
import AffiliateEditScreen from '../../screens/Council/AffiliateCreate/AffiliateEditScreen';

const Stack = createNativeStackNavigator();

const CouncilAffiliateStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CouncilAffiliateScreen"
        component={CouncilAffiliateScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CouncilAffiliateDetailScreen"
        component={CouncilAffiliateDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WriteAffiliatePostScreen"
        component={WriteAffiliatePostScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectPlaceAffiliateScreen"
        component={SelectPlaceAffiliateScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectAffiliationLogoScreen"
        component={SelectAffiliationLogoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PostFinishScreen"
        component={PostFinishScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WriteEventPostScreen"
        component={WriteEventPostScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AffiliateEditScreen"
        component={AffiliateEditScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default CouncilAffiliateStack;
