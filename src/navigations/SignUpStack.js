import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpFirstScreen from '../screens/SignUp/SignUpFirstScreen';
import SignUpSecondScreen from '../screens/SignUp/SignUpSecondScreen';
import SignUpRepresentativeScreen from '../screens/SignUp/SignUpRepresentativeScreen';
import MainTab from '../components/MainTab';

const Stack = createNativeStackNavigator();

const SignUpStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignUpFirstScreen" component={SignUpFirstScreen} />
      <Stack.Screen name="SignUpSecondScreen" component={SignUpSecondScreen} />
      <Stack.Screen
        name="SignUpRepresentativeScreen"
        component={SignUpRepresentativeScreen}
      />
      <Stack.Screen name="MainTab" component={MainTab} />
    </Stack.Navigator>
  );
};

export default SignUpStack;
