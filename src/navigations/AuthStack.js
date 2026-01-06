import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginInitialScreen from '../screens/SignUp/LoginInitialScreen';
import SignUpRepresentativStack from './SignUpRepresentativStack';
import MainTab from '../components/MainTab';
import SignUpStack from './SignUpStack';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginInitialScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="LoginInitialScreen"
        component={LoginInitialScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="SignUpFirstScreen"
        component={SignUpFirstScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUpSecondScreen"
        component={SignUpSecondScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="SignUpStack"
        component={SignUpStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUpRepresentativStack"
        component={SignUpRepresentativStack}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="MainTab"
        component={MainTab}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
};

export default AuthStack;
