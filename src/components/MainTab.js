import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

import HomeIcon from '../../assets/Vector1.svg';
import MapIcon from '../../assets/Vector2.svg';
import PartnershipIcon from '../../assets/Vector3.svg';
import StampIcon from '../../assets/Vector4.svg';
import MyPageIcon from '../../assets/Vector5.svg';

import colors from '../style/colors';
import typography from '../style/typography';

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
  Stamp: StampIcon,
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
        tabBarStyle: { height: 91, paddingTop: 20, paddingHorizontal: 20 },
        tabBarItemStyle: { height: 51, width: 67, gap: 6 },
        tabBarLabelStyle: [
          typography.caption2Bold,
          { marginTop: 6, height: 13 },
        ],
        tabBarActiveTintColor: colors.blue[500],
        tabBarInactiveTintColor: colors.gray[300],
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={PlaceholderScreen}
        options={{ title: '홈' }}
      />
      <Tab.Screen
        name="Map"
        component={PlaceholderScreen}
        options={{ title: '학교 상권' }}
      />
      <Tab.Screen
        name="Partnership"
        component={PlaceholderScreen}
        options={{ title: '제휴 보기' }}
      />
      <Tab.Screen
        name="Stamp"
        component={PlaceholderScreen}
        options={{ title: '스탬프' }}
      />
      <Tab.Screen
        name="MyPage"
        component={PlaceholderScreen}
        options={{ title: '마이페이지' }}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
