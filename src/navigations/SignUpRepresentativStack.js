import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpRepresentativeScreen from '../screens/SignUp/SignUpRepresentativeScreen';
import ReceiveAuthCode from '../screens/SignUp/ReceiveAuthCode';
import WriteRepresentativeInfo1 from '../screens/SignUp/WriteRepresentativeInfo1';
import RepresentativeProof from '../screens/SignUp/RepresentativeProof';
import RepresentativeSuccess from '../screens/SignUp/RepresentativeSuccess';
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
      <Stack.Screen
        name="RepresentativeProof"
        component={RepresentativeProof}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RepresentativeSuccess"
        component={RepresentativeSuccess}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default SignUpRepresentativeStack;
