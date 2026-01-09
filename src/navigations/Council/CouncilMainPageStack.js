import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CouncilMyPageDefaultScreen from '../../screens/Council/MyPage/CouncilMyPageDefaultScreen';
import CouncilProfileScreen from '../../screens/Council/MyPage/CouncilProfileScreen';
import CouncilEditProfileScreen from '../../screens/Council/MyPage/CouncilEditProfileScreen';
import CouncilSendEmailCode from '../../screens/Council/MyPage/CouncilSendEmailCode';
import CouncilVerfiyEmailCode from '../../screens/Council/MyPage/CouncilVerfiyEmailCode';
import CouncilSendProof from '../../screens/Council/MyPage/CouncilSendProof';

const Stack = createNativeStackNavigator();

const CouncilMainPageStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CouncilMyPageDefaultScreen"
        component={CouncilMyPageDefaultScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CouncilProfileScreen"
        component={CouncilProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CouncilEditProfileScreen"
        component={CouncilEditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CouncilSendEmailCode"
        component={CouncilSendEmailCode}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CouncilVerfiyEmailCode"
        component={CouncilVerfiyEmailCode}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CouncilSendProof"
        component={CouncilSendProof}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default CouncilMainPageStack;
