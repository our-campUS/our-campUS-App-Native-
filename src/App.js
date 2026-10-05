import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigations/AuthStack';
import { StatusBar } from 'react-native';
import { initKakao } from './api/signUp';
import { useEffect, useState } from 'react';
import useAuthStore from './store/authStore';
import { getTokens, setTokens } from './utils/tokenStorage';
import MainStack from './navigations/MainStack';
import ErrorBoundary from './components/common/ErrorBoundary';

const App = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isHydrated, setIsHydrated] = useState(
    useAuthStore.persist.hasHydrated()
  );
  const [isTokenHydrated, setIsTokenHydrated] = useState(false);

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

  // Keychain에서 토큰을 읽어와 state에 채워 넣는다. isHydrated가 먼저
  // 끝나야 하는 이유: 이 업데이트 이전 버전에서는 accessToken/refreshToken이
  // AsyncStorage(auth-storage)에 같이 저장돼 있었는데, 아직 Keychain으로
  // 옮겨지지 않은 구버전 설치라면 zustand-persist가 그 값을 state에
  // 그대로 복원해 놓는다. 이 시점에 그 값이 남아 있으면 1회성으로
  // Keychain에 옮겨 쓰고, hydrateTokens 호출로 authStore의 partialize가
  // AsyncStorage에서 토큰 필드를 자연스럽게 제거하도록 한다.
  useEffect(() => {
    if (!isHydrated) return;

    let cancelled = false;
    (async () => {
      const keychainTokens = await getTokens();
      if (cancelled) return;

      if (keychainTokens.accessToken || keychainTokens.refreshToken) {
        useAuthStore.getState().hydrateTokens(keychainTokens);
      } else {
        const legacyTokens = {
          accessToken: useAuthStore.getState().accessToken,
          refreshToken: useAuthStore.getState().refreshToken,
        };
        if (legacyTokens.accessToken || legacyTokens.refreshToken) {
          await setTokens(legacyTokens);
        }
        useAuthStore.getState().hydrateTokens(legacyTokens);
      }

      // isLoggedIn과 Keychain은 저장소가 달라 동기화가 보장되지 않음.
      // 로그인 상태이나 토큰이 없으면 로그아웃 처리
      const {
        isLoggedIn: persistedLoggedIn,
        accessToken,
        refreshToken,
      } = useAuthStore.getState();
      if (persistedLoggedIn && !accessToken && !refreshToken) {
        await useAuthStore.getState().logout();
      }
      if (!cancelled) setIsTokenHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [isHydrated]);

  if (!isHydrated || !isTokenHydrated) {
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
