import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpRepresentativeScreen from '../screens/SignUp/StudentCouncil/SignUpRepresentativeScreen';
import ReceiveAuthCode from '../screens/SignUp/StudentCouncil/ReceiveAuthCode';
import WriteRepresentativeInfo1 from '../screens/SignUp/StudentCouncil/WriteRepresentativeInfo1';
import RepresentativeProof from '../screens/SignUp/StudentCouncil/RepresentativeProof';
import RepresentativeSuccess from '../screens/SignUp/StudentCouncil/RepresentativeSuccess';
import LoginRepresentative from '../screens/SignUp/StudentCouncil/LoginRepresentative';
import FindRepresentativeId from '../screens/SignUp/StudentCouncil/FindRepresentativeId';
import FindRepresentativePassword from '../screens/SignUp/StudentCouncil/FindRepresentativePassword';
import MainTab from '../components/MainTab';
import VerifyRepresentativeIdCode from '../screens/SignUp/StudentCouncil/VerifyRepresentativeIdCode';
import FoundRepresentativeId from '../screens/SignUp/StudentCouncil/FoundRepresentativeId';
import UseEmailForPassword from '../screens/SignUp/StudentCouncil/UseEmailForPassword';
import ReceiveAuthCodeForPassword from '../screens/SignUp/StudentCouncil/ReceiveAuthCodeForPassword';
import ResetRepresentativePassword from '../screens/SignUp/StudentCouncil/ResetRepresentativePassword';
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
      <Stack.Screen
        name="LoginRepresentative"
        component={LoginRepresentative}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FindRepresentativeId"
        component={FindRepresentativeId}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FindRepresentativePassword"
        component={FindRepresentativePassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTab"
        component={MainTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyRepresentativeIdCode"
        component={VerifyRepresentativeIdCode}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FoundRepresentativeId"
        component={FoundRepresentativeId}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UseEmailForPassword"
        component={UseEmailForPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReceiveAuthCodeForPassword"
        component={ReceiveAuthCodeForPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetRepresentativePassword"
        component={ResetRepresentativePassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default SignUpRepresentativeStack;
