import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainTab from './components/MainTab';
import AuthStack from './navigations/AuthStack';
import { StatusBar } from 'react-native';
import { initKakao } from './api/signUp';
import { useEffect } from 'react';

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
