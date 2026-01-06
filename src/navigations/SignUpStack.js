import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpFirstScreen from '../screens/SignUp/StudentSignUp/SignUpFirstScreen';
import SignUpSecondScreen from '../screens/SignUp/StudentSignUp/SignUpSecondScreen';
import SignUpRepresentativeScreen from '../screens/SignUp/SignUpRepresentativeScreen';
import MainTab from '../components/MainTab';

const Stack = createNativeStackNavigator();

const SignUpStack = () => {
  return (
    <Stack.Navigator initialRouteName="SignUpFirstScreen">
      <Stack.Screen
        name="SignUpFirstScreen"
        component={SignUpFirstScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUpSecondScreen"
        component={SignUpSecondScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUpRepresentativeScreen"
        component={SignUpRepresentativeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTab"
        component={MainTab}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default SignUpStack;
