import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { View, Text, Keyboard } from 'react-native';
import { Platform } from 'react-native';

import HomeIcon from '../../assets/Vector1.svg';
import MapIcon from '../../assets/Vector2.svg';
import PartnershipIcon from '../../assets/Vector3.svg';
// import StampIcon from '../../assets/Vector4.svg'; // TODO: 스탬프 화면 정식 오픈 시 주석 해제 (#165)
import MyPageIcon from '../../assets/Vector5.svg';

import colors from '../style/colors';
import typography from '../style/typography';

import HomeScreen from '../screens/Home/HomeScreen';
import MapScreen from '../screens/Map/MapScreen';
import AffiliationSelectStack from '../navigations/AffiliationSelectStack';
import MapStack from '../navigations/MapStack';
import MyPageStack from '../navigations/MyPageStack';
// import WIPScreen from './common/WIPScreen'; // TODO: 스탬프 화면 정식 오픈 시 주석 해제 (#165)

const Tab = createBottomTabNavigator();

const PlaceholderScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>PlaceholderScreen</Text>
    </View>
  );
};

const ICONS = {
  Home: HomeIcon,
  Map: MapIcon,
  Partnership: PartnershipIcon,
  // Stamp: StampIcon, // TODO: 스탬프 화면 정식 오픈 시 주석 해제 (#165)
  MyPage: MyPageIcon,
};

const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          const IconComponent = ICONS[route.name];
          if (!IconComponent) return null;

          return (
            <IconComponent
              width={32}
              height={32}
              color={color}
              style={{ marginBottom: 6 }}
            />
          );
        },
        tabBarStyle:
          Platform.OS === 'ios'
            ? {
                height: 91,
                paddingTop: 20,
                paddingHorizontal: 20,
                marginBottom: 10,
                backgroundColor: colors.common.white,
              }
            : {
                height: 91,
                paddingTop: 20,
                paddingHorizontal: 20,
                backgroundColor: colors.common.white,
              },
        tabBarItemStyle: { height: 51, width: 67, gap: 6 },
        tabBarLabelStyle: [
          typography.caption2Bold,
          { marginTop: 6, height: 13 },
        ],
        tabBarActiveTintColor: colors.blue[500],
        tabBarInactiveTintColor: colors.gray[300],
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: '홈' }}
      />
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'MapScreen';
          const hideTabBar = routeName !== 'MapScreen';

          return {
            title: '학교상권',
            tabBarStyle: hideTabBar
              ? { display: 'none' }
              : Platform.OS === 'ios'
              ? {
                  height: 91,
                  paddingTop: 20,
                  paddingHorizontal: 20,
                  marginBottom: 10,
                }
              : {
                  height: 91,
                  paddingTop: 20,
                  paddingHorizontal: 20,
                },
          };
        }}
      />
      <Tab.Screen
        name="Partnership"
        component={AffiliationSelectStack}
        options={{ title: '제휴 보기' }}
      />
      {/* TODO: 스탬프 화면 정식 오픈 시 주석 해제 (iOS 심사 차단 항목, #165) */}
      {/* <Tab.Screen
        name="Stamp"
        component={WIPScreen}
        options={{ title: '스탬프' }}
      /> */}
      <Tab.Screen
        name="MyPage"
        component={MyPageStack}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? 'MyPageDefaultScreen';
          const hideTabBar = routeName !== 'MyPageDefaultScreen';

          return {
            title: '마이페이지',
            tabBarStyle: hideTabBar
              ? { display: 'none' }
              : Platform.OS === 'ios'
              ? {
                  height: 91,
                  paddingTop: 20,
                  paddingHorizontal: 20,
                  marginBottom: 10,
                  backgroundColor: colors.common.white,
                }
              : {
                  height: 91,
                  paddingTop: 20,
                  paddingHorizontal: 20,
                  backgroundColor: colors.common.white,
                },
          };
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
