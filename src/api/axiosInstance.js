import axios from 'axios';
import { API_BASE_URL } from '@env';
import useAuthStore from '../store/authStore';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 토큰 불필요한 공개 엔드포인트 prefix 목록
const PUBLIC_PREFIXES = [
  'auth/login',
  'auth/council/login',
  'auth/council/signup',
  'auth/council/find',
  'search/',
  'storage/presigned',
  'jwt/token/reissue',
];

// --- 요청 인터셉터: Authorization 헤더 자동 주입 ---
api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_PREFIXES.some((prefix) =>
    config.url?.startsWith(prefix)
  );

  if (!isPublic) {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

// --- 응답 인터셉터: 401 → 토큰 리프레시 → 원래 요청 재시도 ---
let isRefreshing = false;
let refreshPromise = null;

const refreshAccessToken = async () => {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) {
    return null;
  }

  // api 인스턴스 대신 raw axios 사용 (인터셉터 재귀 방지)
  const response = await axios.post(`${API_BASE_URL}/jwt/token/reissue`, {
    refreshToken,
  });

  if (response.data.code === 200) {
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    useAuthStore.getState().setAuthFromKakao({
      user: useAuthStore.getState().user,
      isLoggedIn: true,
      accessToken,
      refreshToken: newRefreshToken || refreshToken,
    });

    return accessToken;
  }

  return null;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401이 아니거나 이미 재시도한 요청이면 그대로 reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 이미 리프레시 진행 중이면 대기 후 재시도
    if (isRefreshing) {
      return refreshPromise.then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    refreshPromise = refreshAccessToken()
      .then((newAccessToken) => {
        if (newAccessToken) {
          return newAccessToken;
        }
        throw new Error('Token refresh failed');
      })
      .catch((err) => {
        // 리프레시 토큰도 만료 → 강제 로그아웃
        useAuthStore.getState().logout();
        throw err;
      })
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });

    return refreshPromise.then((newToken) => {
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    });
  }
);

export default api;
