import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPageDefaultScreen from '../screens/MyPage/MyPageDefaultScreen';
import MyPageProfileEditScreen from '../screens/MyPage/MyPageProfileEditScreen';
import EditNicknameScreen from '../screens/MyPage/EditNicknameScreen';
import InterestedAffiliateScreen from '../screens/MyPage/InterestedAffiliateScreen';
import AffiliationDetailScreen from '../screens/Affiliation/AffiliationDetailScreen';
import InterestedPlaceScreen from '../screens/MyPage/InterestedPlaceScreen';
import WrittenReviewScreen from '../screens/MyPage/WrittenReviewScreen';

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
      <Stack.Screen
        name="InterestedAffiliateScreen"
        component={InterestedAffiliateScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AffiliationDetailScreen"
        component={AffiliationDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InterestedPlaceScreen"
        component={InterestedPlaceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WrittenReviewScreen"
        component={WrittenReviewScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MyPageStack;
