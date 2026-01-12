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

// 학생회 전용 제휴 게시글 조회 api
export const getCouncilAffiliatePosts = async (accessToken) => {
  console.log('accessToken at getCouncilAffiliatePosts', accessToken);
  try {
    const response = await api.get('/student-councils/posts', {
      params: {
        category: 'PARTNERSHIP',
        size: 100,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.data.code === 200) {
      console.log('getCouncilAffiliatePosts success');
      console.log(response.data);
      return response;
    } else {
      console.log('getCouncilAffiliatePosts error');
      console.log(response.data);
    }
  } catch (error) {
    console.log('getCouncilAffiliatePosts error');
    console.log(error.response);
  }
};

// 학생회 전용 제휴 게시글 상세 조회 api
export const getCouncilAffiliatePostDetail = async (postId, accessToken) => {
  try {
    const response = await api.get(`/student-councils/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.data.code === 200) {
      console.log('getCouncilAffiliatePostDetail success');
      console.log(response.data);
      return response;
    } else {
      console.log('getCouncilAffiliatePostDetail error');
      console.log(response.data);
    }
  } catch (error) {
    console.log('getCouncilAffiliatePostDetail error');
    console.log(error.response);
  }
};

// 학생회 전용 제휴 게시글 수정 api
export const EditCouncilPost = async (data, accessToken, postId) => {
  try {
    const response = await api.patch(
      `/student-councils/posts/${postId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.data.code === 200) {
      console.log('EditCouncilPost success');
      console.log(response.data);
      return response;
    } else {
      console.log('EditCouncilPost error');
      console.log(response.data);
    }
  } catch (error) {
    console.log('EditCouncilPost error');
    console.log(error.response);
  }
};
