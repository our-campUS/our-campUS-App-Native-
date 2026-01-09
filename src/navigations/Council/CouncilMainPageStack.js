import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CouncilMyPageDefaultScreen from '../../screens/Council/MyPage/CouncilMyPageDefaultScreen';
import CouncilProfileScreen from '../../screens/Council/MyPage/CouncilProfileScreen';
import CouncilEditProfileScreen from '../../screens/Council/MyPage/CouncilEditProfileScreen';
import CouncilSendEmailCode from '../../screens/Council/MyPage/CouncilSendEmailCode';
import CouncilVerfiyEmailCode from '../../screens/Council/MyPage/CouncilVerfiyEmailCode';
import CouncilSendProof from '../../screens/Council/MyPage/CouncilSendProof';
import CouncilChangePasswordEmail from '../../screens/Council/MyPage/CouncilChangePasswordEmail';
import CouncilChangePasswordVerifyCode from '../../screens/Council/MyPage/CouncilChangePasswordVerifyCode';
import CouncilResetPassword from '../../screens/Council/MyPage/CouncilResetPassword';
import CouncilCancelMembershipScreen from '../../screens/Council/MyPage/CouncilCancelMembership';
import AnnouncementScreen from '../../screens/MyPage/AnnouncementScreen';
import AnnouncementDetailScreen from '../../screens/MyPage/AnnouncementDetailScreen';
import InqueryMainScreen from '../../screens/MyPage/InqueryMainScreen';

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
      <Stack.Screen
        name="CouncilChangePasswordEmail"
        component={CouncilChangePasswordEmail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CouncilChangePasswordVerifyCode"
        component={CouncilChangePasswordVerifyCode}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CouncilResetPassword"
        component={CouncilResetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CouncilCancelMembershipScreen"
        component={CouncilCancelMembershipScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AnnouncementScreen"
        component={AnnouncementScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AnnouncementDetailScreen"
        component={AnnouncementDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InqueryMainScreen"
        component={InqueryMainScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default CouncilMainPageStack;
