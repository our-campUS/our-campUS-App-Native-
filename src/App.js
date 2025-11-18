import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainTab from './components/MainTab';
import AuthStack from './navigations/AuthStack';
import { StatusBar } from 'react-native';
import { initKakao } from './api/signUp';
import { useEffect } from 'react';
import { getKakaoKeyHash } from '@react-native-seoul/kakao-login';

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
  useEffect(() => {
    initKakao();
    // getKakaoKeyHash().then((hash) => {
    //   console.log('🔥 KAKAO HASH:', hash);
    // });
  }, []);
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AuthStack />
      {/* <MainTab /> */}
    </NavigationContainer>
  );
};

export default App;
