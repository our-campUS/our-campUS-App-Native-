import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainTab from './components/MainTab';
import AuthStack from './navigations/AuthStack';
import { StatusBar } from 'react-native';
import { initKakao } from './api/signUp';
import { useEffect } from 'react';
import { getKakaoKeyHash } from '@react-native-seoul/kakao-login';
import useAuthStore from './store/authStore';

// useEffect(() => {
//   getKakaoKeyHash().then((hash) => {
//     console.log('🔥 KAKAO HASH:', hash);
//   });
// }, []);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const App = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    initKakao();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {/* {isLoggedIn ? <MainTab /> : <AuthStack />} */}
      {/* 개발 테스트용 */}
      <MainTab />
    </NavigationContainer>
  );
};

export default App;
