import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigations/AuthStack';
import { StatusBar } from 'react-native';
import { initKakao } from './api/signUp';
import { useEffect, useState } from 'react';
import useAuthStore from './store/authStore';
import MainStack from './navigations/MainStack';
import ErrorBoundary from './components/common/ErrorBoundary';

const App = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isHydrated, setIsHydrated] = useState(
    useAuthStore.persist.hasHydrated()
  );

  useEffect(() => {
    initKakao();
  }, []);

  useEffect(() => {
    if (isHydrated) return;

    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    return unsub;
  }, [isHydrated]);

  if (!isHydrated) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="auto" />
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <StatusBar style="auto" />
        {isLoggedIn ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
