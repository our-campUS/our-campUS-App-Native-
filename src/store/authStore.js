import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 카카오 로그인/회원 인증 상태 전역 관리

const KEYCHAIN_SERVICE = 'ourCampusApp.authStorage';
const LEGACY_ASYNC_STORAGE_KEY = 'auth-storage';

// Keychain 전환 이전 버전에서 AsyncStorage에 평문으로 남아있던 토큰 제거
AsyncStorage.removeItem(LEGACY_ASYNC_STORAGE_KEY).catch(() => {});

// zustand persist가 요구하는 StateStorage 인터페이스를 Keychain 위에 구현
// (accessToken/refreshToken을 포함한 인증 상태 전체를 암호화 저장소에 보관)
// Keychain 접근 자체가 실패해도(생체인증 미설정, 사용자 거부 등) hydration이
// 멈추지 않도록 실패 시 로그아웃 상태로 취급한다.
const keychainStorage = {
  getItem: async (name) => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: KEYCHAIN_SERVICE,
      });
      if (!credentials || credentials.username !== name) return null;
      return credentials.password;
    } catch (error) {
      console.error('Keychain getItem error:', error);
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await Keychain.setGenericPassword(name, value, {
        service: KEYCHAIN_SERVICE,
      });
    } catch (error) {
      console.error('Keychain setItem error:', error);
    }
  },
  removeItem: async () => {
    try {
      await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
    } catch (error) {
      console.error('Keychain removeItem error:', error);
    }
  },
};

const useAuthStore = create(
  persist(
    (set) => ({
      // ----- 상태 -----
      isLoggedIn: false, // 로그인 여부
      user: null, // { id, name, email, provider, ... }
      accessToken: null, // 액세스 토큰 (있다면)
      refreshToken: null, // 리프레시 토큰 (있다면)

      // ----- 액션 -----

      // 최초 로그인 시 호출
      setAuthFromKakao: ({ user, isLoggedIn, accessToken, refreshToken }) =>
        set(() => ({
          isLoggedIn: isLoggedIn || false,
          user: user || null,
          accessToken: accessToken || null,
          refreshToken: refreshToken || null,
        })),

      // 최초 로그인 시 마무리 단계 처리 함수
      finishInitialLogin: () =>
        set(() => ({
          isLoggedIn: true,
        })),

      // 일반 로그인
      login: () =>
        set(() => ({
          isLoggedIn: true,
        })),

      // 학생회 로그인
      loginCouncil: ({ user, accessToken, refreshToken }) =>
        set(() => ({
          isLoggedIn: true,
          user: user || null,
          accessToken: accessToken || null,
          refreshToken: refreshToken || null,
        })),

      // 프로필 부분만 업데이트하고 싶을 때
      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : partialUser,
        })),

      // 로그아웃 (Keychain에 남은 인증 정보까지 완전히 삭제)
      logout: () => {
        set(() => ({
          isLoggedIn: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        }));
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => keychainStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export default useAuthStore;
