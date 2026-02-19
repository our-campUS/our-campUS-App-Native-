import api from './axiosInstance';
import useAuthStore from '../store/authStore';

export const getReviewList = async (
  placeId,
  cursorCreatedAt = null,
  cursorId = null,
  size = 10
) => {
  try {
    const token = useAuthStore.getState().accessToken;

    const params = {
      size,
    };

    if (cursorCreatedAt) params.cursorCreatedAt = cursorCreatedAt;
    if (cursorId) params.cursorId = cursorId;

    const response = await api.get(`/reviews/list/${placeId}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('리뷰 목록 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('리뷰 목록 조회 실패:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const token = useAuthStore.getState().accessToken;

    const response = await api.delete(`/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('리뷰 삭제 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('리뷰 삭제 실패:', error);
    throw error;
  }
};

export const editReview = async (reviewId, reviewData) => {
  try {
    const token = useAuthStore.getState().accessToken;

    const response = await api.patch(`/reviews/${reviewId}`, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('리뷰 수정 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('리뷰 수정 실패:', error);
    throw error;
  }
};
