import api from './axiosInstance';

export const getPartnershipList = async (lat, lng) => {
  try {
    const response = await api.get('/reviews/partnership-list', {
      params: { lat, lng },
    });
    if (response.data.code === 200 || response.data.code === 0) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('제휴 매장 목록 조회 실패:', error);
    return [];
  }
};

export const getActivePartnerships = async (councilType) => {
  try {
    const response = await api.get(
      '/users/student-council/posts/partnerships/active',
      {
        params: {
          councilType: councilType,
        },
      }
    );

    if (response.data.code === 200 || response.data.code === 0) {
      console.log('Get User Info Response:', response.data);
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Get Active Partnerships Error:', error);
    return [];
  }
};
