import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpRepresentativeScreen from '../screens/SignUpRepresentativeScreen';
import ReceiveAuthCode from '../screens/ReceiveAuthCode';
import WriteRepresentativeInfo1 from '../screens/WriteRepresentativeInfo1';
const Stack = createNativeStackNavigator();

const SignUpRepresentativeStack = () => {
  return (
    <Stack.Navigator initialRouteName="SignUpRepresentativeScreen">
      <Stack.Screen
        name="SignUpRepresentativeScreen"
        component={SignUpRepresentativeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReceiveAuthCode"
        component={ReceiveAuthCode}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WriteRepresentativeInfo1"
        component={WriteRepresentativeInfo1}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default SignUpRepresentativeStack;
