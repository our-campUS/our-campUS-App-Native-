import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpFirstScreen from '../screens/SignUpFirstScreen';
import SignUpSecondScreen from '../screens/SignUpSecondScreen';

const Stack = createNativeStackNavigator();

const SignUpStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignUpFirstScreen" component={SignUpFirstScreen} />
      <Stack.Screen name="SignUpSecondScreen" component={SignUpSecondScreen} />
    </Stack.Navigator>
  );
};

export default SignUpStack;
