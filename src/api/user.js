import api from './axiosInstance';
import useAuthStore from '../store/authStore';

// 유저 정보 조회 (GET /users)
export async function getUserInfo() {
  try {
    const accessToken = useAuthStore.getState().accessToken;

    const response = await api.get('users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Get User Info Response:', response.data);

    if (response.data.code === 200 || response.data.code === 0) {
      const { nickname, schoolName, collegeName, majorName } =
        response.data.data;

      useAuthStore.getState().updateUser({
        name: nickname,
        schoolName: schoolName,
        collegeName: collegeName,
        majorName: majorName,
      });

      return response.data.data;
    }
    return false;
  } catch (error) {
    console.error('Get User Info Error:', error);
    return false;
  }
}
