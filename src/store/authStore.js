import { create } from 'zustand';

// 카카오 로그인/회원 인증 상태 전역 관리
// TypeScript 사용 안 함 (순수 JS)

const useAuthStore = create((set) => ({
  // ----- 상태 -----
  isLoggedIn: false, // 로그인 여부
  user: null, // { id, name, email, provider, ... }
  accessToken: null, // 우리 서버 액세스 토큰 (있다면)
  refreshToken: null, // 우리 서버 리프레시 토큰 (있다면)

  // ----- 액션 -----

  // 카카오 로그인 성공 후 서버까지 인증 끝난 시점에 호출
  // payload 예시:
  // {
  //   user: { id, name, email, ... },
  //   accessToken: '...',
  //   refreshToken: '...',
  // }
  setAuthFromKakao: ({ user, accessToken, refreshToken }) =>
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

  // 로그아웃
  logout: () =>
    set(() => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,
    })),
}));

export default useAuthStore;


