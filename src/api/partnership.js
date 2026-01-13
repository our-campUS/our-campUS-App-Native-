import api from './axiosInstance';
import useAuthStore from '../store/authStore';

export const getActivePartnerships = async (councilType) => {
  try {
    const accessToken = useAuthStore.getState().accessToken;

    const response = await api.get(
      '/users/student-council/posts/partnerships/active',
      {
        params: {
          councilType: councilType,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.code === 200 || response.data.code === 0) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Get Active Partnerships Error:', error);
    return [];
  }
};
