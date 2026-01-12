import api from './axiosInstance';

// 학생회 전용 제휴 / 행사 등록 Api

export const createCouncilPost = async (data, accessToken) => {
  try {
    const response = await api.post('/student-councils/posts', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.data.code === 201) {
      console.log('createCouncilAffiliate success');
      console.log(response.data);
      return response;
    } else {
      console.log('createCouncilAffiliate error');
      console.log(response.data);
    }
  } catch (error) {
    console.log('createCouncilAffiliate error');
    console.log(error.response);
  }
};
