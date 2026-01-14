import api from './axiosInstance';

// 학교 총학생회 제휴 게시글 목록 조회
export const getStudentSchoolAffiliateList = async (accessToken) => {
  try {
    const response = await api.get('/users/student-council/posts/school', {
      params: {
        category: 'PARTNERSHIP',
        size: 10,
        page: 0,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('getStudentSchoolAffiliateList response', response);
    return response.data.data.content;
  } catch (error) {
    console.error('getStudentSchoolAffiliateList error', error.response);
    return [];
  }
};

// 학교 총학생회 행사 게시글 목록 조회
export const getStudentSchoolEventList = async (accessToken) => {
  try {
    const response = await api.get('/users/student-council/posts/school', {
      params: {
        category: 'EVENT',
        size: 10,
        page: 0,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('getStudentSchoolEventList response', response);
    return response.data.data.content;
  } catch (error) {
    console.error('getStudentSchoolEventList error', error.response);
    return [];
  }
};

// 전공 학생회 제휴 게시글 목록 조회
export const getStudentMajorAffiliateList = async (accessToken) => {
  try {
    const response = await api.get('/users/student-council/posts/major', {
      params: {
        category: 'PARTNERSHIP',
        size: 10,
        page: 0,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('getStudentMajorAffiliateList response', response);
    return response.data.data.content;
  } catch (error) {
    console.error('getStudentMajorAffiliateList error', error.response);
    return [];
  }
};

// 전공 학생회 행사 게시글 목록 조회
export const getStudentMajorEventList = async (accessToken) => {
  try {
    const response = await api.get('/users/student-council/posts/major', {
      params: {
        category: 'EVENT',
        size: 10,
        page: 0,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('getStudentMajorEventList response', response);
    return response.data.data.content;
  } catch (error) {
    console.error('getStudentMajorEventList error', error.response);
    return [];
  }
};

// 단과대 제휴 게시글 목록 조회
export const getStudentCollegeAffiliateList = async (accessToken) => {
  try {
    const response = await api.get('/users/student-council/posts/college', {
      params: {
        category: 'PARTNERSHIP',
        size: 10,
        page: 0,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('getStudentCollegeAffiliateList response', response);
    return response.data.data.content;
  } catch (error) {
    console.error('getStudentCollegeAffiliateList error', error.response);
    return [];
  }
};

// 단과대 행사 게시글 목록 조회
export const getStudentCollegeEventList = async (accessToken) => {
  try {
    const response = await api.get('/users/student-council/posts/college', {
      params: {
        category: 'EVENT',
        size: 10,
        page: 0,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('getStudentCollegeEventList response', response);
    return response.data.data.content;
  } catch (error) {
    console.error('getStudentCollegeEventList error', error.response);
    return [];
  }
};
