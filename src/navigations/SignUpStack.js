import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpFirstScreen from '../screens/SignUpFirstScreen';
import SignUpSecondScreen from '../screens/SignUpSecondScreen';
import MainTab from '../components/MainTab';

const Stack = createNativeStackNavigator();

const SignUpStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignUpFirstScreen" component={SignUpFirstScreen} />
      <Stack.Screen name="SignUpSecondScreen" component={SignUpSecondScreen} />
      <Stack.Screen name="MainTab" component={MainTab} />
    </Stack.Navigator>
  );
};

export default SignUpStack;
