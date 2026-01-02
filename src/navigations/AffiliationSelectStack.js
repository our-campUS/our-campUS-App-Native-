import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AffiliationMainScreen from '../screens/Affiliation/AffiliationMainScreen';
import AffiliationDetailScreen from '../screens/Affiliation/AffiliationDetailScreen';

const Stack = createNativeStackNavigator();

const AffiliationSelectStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AffiliationMainScreen"
        component={AffiliationMainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AffiliationDetailScreen"
        component={AffiliationDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AffiliationSelectStack;
