import api from './axiosInstance';
import useAuthStore from '../store/authStore';

// 앱 심사(리뷰어)용 카카오 우회 로그인 — 스토어 심사 계정 전용 엔드포인트
const REVIEW_LOGIN_PATH = '/test/login/review-login-c1a2mp93u';

export async function reviewerTestLogin(email) {
  try {
    const response = await api.post(REVIEW_LOGIN_PATH, { email });

    if (response.data.code === 200 || response.data.code === 0) {
      const {
        nickname,
        campusNickname,
        userId,
        kakaoId,
        email: userEmail,
        profileImage,
        accessToken,
        refreshToken,
        isProfileNotCompleted,
      } = response.data.data;

      useAuthStore.getState().setAuthFromKakao({
        user: {
          name: nickname,
          campusNickname,
          userId,
          kakaoId,
          email: userEmail,
          profileImage,
          role: 'USER',
        },
        accessToken,
        refreshToken,
      });

      return {
        isValid: true,
        isProfileNotCompleted,
        nickname,
      };
    }

    return { isValid: false, isProfileNotCompleted: false };
  } catch (error) {
    console.error('❌ Reviewer Test Login Error:', error?.message ?? error);
    return { isValid: false, isProfileNotCompleted: false };
  }
}
