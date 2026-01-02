import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPageDefaultScreen from '../screens/MyPage/MyPageDefaultScreen';

const Stack = createNativeStackNavigator();

const MyPageStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyPageDefaultScreen"
        component={MyPageDefaultScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MyPageStack;
