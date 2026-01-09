import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StampScreen from '../screens/Stamp/StampScreen';

const Stack = createNativeStackNavigator();

const StampStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StampScreen"
        component={StampScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StampStack;
