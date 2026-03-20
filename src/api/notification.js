import api from './axiosInstance';
import useAuthStore from '../store/authStore';

// 미확인 알림 조회
export const checkUnreadNotification = async () => {
  try {
    const token = useAuthStore.getState().accessToken;

    const response = await api.get('/notifications/unread/exists', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.code === 200 || response.data.code === 0) {
      return response.data.data; // boolean
    }
    return false;
  } catch (error) {
    console.error('미확인 알림 조회 실패:', error);
    return false;
  }
};
