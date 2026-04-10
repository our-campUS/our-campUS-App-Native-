import api from './axiosInstance';

// 미확인 알림 조회
export const checkUnreadNotification = async () => {
  try {
    const response = await api.get('/notifications/unread/exists');

    if (response.data.code === 200 || response.data.code === 0) {
      return response.data.data; // boolean
    }
    return false;
  } catch (error) {
    console.error('미확인 알림 조회 실패:', error);
    return false;
  }
};

// 알림 목록 조회 (커서 기반 페이지네이션)
export const getNotifications = async (
  limit = 20,
  cursorCreatedAt = null,
  cursorId = null
) => {
  try {
    const params = { limit };
    if (cursorCreatedAt) params.cursorCreatedAt = cursorCreatedAt;
    if (cursorId) params.cursorId = cursorId;

    const response = await api.get('/notifications', {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('알림 목록 조회 실패:', error);
    throw error;
  }
};

// 특정 알림 읽음 처리
export const markNotificationRead = async (notificationId) => {
  try {
    const response = await api.patch(
      `/notifications/${notificationId}/read`,
      {}
    );

    if (response.data.code === 200 || response.data.code === 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('알림 읽음 처리 실패:', error);
    return false;
  }
};
