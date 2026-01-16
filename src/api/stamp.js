import api from './axiosInstance';
import useAuthStore from '../store/authStore';

export const getStamp = async () => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const response = await api.get('/stamps', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('getStamp response', response);
    return response;
  } catch (error) {
    console.error('getStamp error', error.response);
  }
};
