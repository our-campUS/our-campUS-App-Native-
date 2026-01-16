import api from './axiosInstance';
import useAuthStore from '../store/authStore';

// 리뷰 작성 ( post /reviews )
export const createReview = async (reviewData) => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const response = await api.post('/reviews', reviewData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('response', response);
    //   return response.data;
  } catch (error) {
    console.log('error', error.response);
  }
};
