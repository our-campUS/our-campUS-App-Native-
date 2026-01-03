import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPageDefaultScreen from '../screens/MyPage/MyPageDefaultScreen';
import MyPageProfileEditScreen from '../screens/MyPage/MyPageProfileEditScreen';
import EditNicknameScreen from '../screens/MyPage/EditNicknameScreen';

const Stack = createNativeStackNavigator();

const MyPageStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyPageDefaultScreen"
        component={MyPageDefaultScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyPageProfileEditScreen"
        component={MyPageProfileEditScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditNicknameScreen"
        component={EditNicknameScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MyPageStack;
