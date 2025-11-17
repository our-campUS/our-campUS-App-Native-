import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginInitialScreen from '../screens/LoginInitialScreen';
import SignUpFirstScreen from '../screens/SignUpFirstScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginInitialScreen"
      // screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="LoginInitialScreen"
        component={LoginInitialScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen name="SignUpStack" component={SignUpStack} /> */}
      <Stack.Screen
        name="SignUpFirstScreen"
        component={SignUpFirstScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
