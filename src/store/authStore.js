import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTokens, clearTokens } from '../utils/tokenStorage';

// 카카오 로그인/회원 인증 상태 전역 관리
//
// accessToken/refreshToken은 partialize에서 제외해 AsyncStorage(평문)에는
// 저장하지 않는다. 대신 Keychain에 저장하고, 앱 시작 시 App.js가
// hydrateTokens()로 in-memory state에 채워 넣는다 (이슈 #168).

const useAuthStore = create(
  persist(
    (set) => ({
      // ----- 상태 -----
      isLoggedIn: false, // 로그인 여부
      user: null, // { id, name, email, provider, ... }
      accessToken: null, // 액세스 토큰 (있다면)
      refreshToken: null, // 리프레시 토큰 (있다면)

      // ----- 액션 -----

      // 앱 시작 시 Keychain에서 읽어온 토큰을 state에 반영
      hydrateTokens: ({ accessToken, refreshToken }) =>
        set(() => ({
          accessToken: accessToken || null,
          refreshToken: refreshToken || null,
        })),

      // 최초 로그인 시 호출
      setAuthFromKakao: async ({ user, isLoggedIn, accessToken, refreshToken }) => {
        set(() => ({
          isLoggedIn: isLoggedIn || false,
          user: user || null,
          accessToken: accessToken || null,
          refreshToken: refreshToken || null,
        }));
        await setTokens({ accessToken, refreshToken });
      },

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
      loginCouncil: async ({ user, accessToken, refreshToken }) => {
        set(() => ({
          isLoggedIn: true,
          user: user || null,
          accessToken: accessToken || null,
          refreshToken: refreshToken || null,
        }));
        await setTokens({ accessToken, refreshToken });
      },

      // 프로필 부분만 업데이트하고 싶을 때
      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : partialUser,
        })),

      // 로그아웃
      logout: async () => {
        set(() => ({
          isLoggedIn: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        }));
        await clearTokens();
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
