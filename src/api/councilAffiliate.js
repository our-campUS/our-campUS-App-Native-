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
      return null;
    }
  } catch (error) {
    console.log('createCouncilAffiliate error');
    console.log(error.response);
    return null;
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
      return null;
    }
  } catch (error) {
    console.log('getCouncilAffiliatePosts error');
    console.log(error.response);
    return null;
  }
};

// 학생회 전용 행사 게시글 조회 api
export const getCouncilEventPosts = async (accessToken) => {
  console.log('accessToken at getCouncilEventPosts', accessToken);
  try {
    const response = await api.get('/student-councils/posts', {
      params: {
        category: 'EVENT',
        size: 100,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.data.code === 200) {
      console.log('getCouncilEventPosts success');
      console.log(response.data);
      return response;
    } else {
      console.log('getCouncilEventPosts error');
      console.log(response.data);
      return null;
    }
  } catch (error) {
    console.log('getCouncilEventPosts error');
    console.log(error.response);
    return null;
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
      return null;
    }
  } catch (error) {
    console.log('getCouncilAffiliatePostDetail error');
    console.log(error.response);
    return null;
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
      return null;
    }
  } catch (error) {
    console.log('EditCouncilPost error');
    console.log(error.response);
    return null;
  }
};

// 학생회 전용 제휴 게시글 삭제 api
export const deleteCouncilPost = async (postId, accessToken) => {
  console.log('postId at deleteCouncilPost', postId);
  try {
    const response = await api.delete(`/student-councils/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.data.code === 200) {
      console.log('deleteCouncilPost success');
      console.log(response.data);
      return response;
    } else {
      console.log('deleteCouncilPost error');
      console.log(response.data);
      throw new Error(response.data.message || 'deleteCouncilPost failed');
    }
  } catch (error) {
    console.log('deleteCouncilPost error');
    console.log(error.response);
    throw error;
  }
};

// 제휴 게시글 장소 검색 api
export const searchCouncilAffiliatePlace = async (keyword, accessToken) => {
  try {
    const response = await api.get('places/search/keyword', {
      params: {
        keyword: keyword,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.data.code === 200) {
      console.log('searchCouncilAffiliatePlace success');
      console.log(response.data);
      return response;
    } else {
      console.log('searchCouncilAffiliatePlace error');
      console.log(response.data);
      return null;
    }
  } catch (error) {
    console.log('searchCouncilAffiliatePlace error');
    console.log(error.response);
    return null;
  }
};

// 학생회 전용 72시간 내에 다가오는 행사 조회 api
export const getAvailableEvents = async (accessToken) => {
  try {
    const response = await api.get('/student-councils/posts/events/upcoming', {
      params: {
        size: 100,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.data.code === 200) {
      console.log('getAvailableEvents success');
      console.log(response.data);
      return response;
    } else {
      console.log('getAvailableEvents error');
      console.log(response.data);
      return null;
    }
  } catch (error) {
    console.log('getAvailableEvents error');
    console.log(error.response);
    return null;
  }
};
