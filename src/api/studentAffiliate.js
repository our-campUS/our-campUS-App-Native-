import api from './axiosInstance';

// 학교 총학생회 제휴 게시글 목록 조회
export const getStudentSchoolAffiliateList = async (page = 1) => {
  try {
    const response = await api.get('/users/student-council/posts', {
      params: {
        councilType: 'SCHOOL_COUNCIL',
        category: 'PARTNERSHIP',
        size: 10,
        page,
      },
    });
    console.log('getStudentSchoolAffiliateList response', response);
    return response.data.data;
  } catch (error) {
    console.error('getStudentSchoolAffiliateList error', error.response);
    return null;
  }
};

// 학교 총학생회 행사 게시글 목록 조회
export const getStudentSchoolEventList = async (page = 1) => {
  try {
    const response = await api.get('/users/student-council/posts', {
      params: {
        councilType: 'SCHOOL_COUNCIL',
        category: 'EVENT',
        size: 10,
        page,
      },
    });
    console.log('getStudentSchoolEventList response', response);
    return response.data.data;
  } catch (error) {
    console.error('getStudentSchoolEventList error', error.response);
    return null;
  }
};

// 전공 학생회 제휴 게시글 목록 조회
export const getStudentMajorAffiliateList = async (page = 1) => {
  try {
    const response = await api.get('/users/student-council/posts', {
      params: {
        councilType: 'MAJOR_COUNCIL',
        category: 'PARTNERSHIP',
        size: 10,
        page,
      },
    });
    console.log('getStudentMajorAffiliateList response', response);
    return response.data.data;
  } catch (error) {
    console.error('getStudentMajorAffiliateList error', error.response);
    return null;
  }
};

// 전공 학생회 행사 게시글 목록 조회
export const getStudentMajorEventList = async (page = 1) => {
  try {
    const response = await api.get('/users/student-council/posts', {
      params: {
        councilType: 'MAJOR_COUNCIL',
        category: 'EVENT',
        size: 10,
        page,
      },
    });
    console.log('getStudentMajorEventList response', response);
    return response.data.data;
  } catch (error) {
    console.error('getStudentMajorEventList error', error.response);
    return null;
  }
};

// 단과대 제휴 게시글 목록 조회
export const getStudentCollegeAffiliateList = async (page = 1) => {
  try {
    const response = await api.get('/users/student-council/posts', {
      params: {
        councilType: 'COLLEGE_COUNCIL',
        category: 'PARTNERSHIP',
        size: 10,
        page,
      },
    });
    console.log('getStudentCollegeAffiliateList response', response);
    return response.data.data;
  } catch (error) {
    console.error('getStudentCollegeAffiliateList error', error.response);
    return null;
  }
};

// 단과대 행사 게시글 목록 조회
export const getStudentCollegeEventList = async (page = 1) => {
  try {
    const response = await api.get('/users/student-council/posts', {
      params: {
        councilType: 'COLLEGE_COUNCIL',
        category: 'EVENT',
        size: 10,
        page,
      },
    });
    console.log('getStudentCollegeEventList response', response);
    return response.data.data;
  } catch (error) {
    console.error('getStudentCollegeEventList error', error.response);
    return null;
  }
};

// 제휴 / 행사 게시글 상세 조회
export const getStudentAffiliateDetail = async (postId) => {
  console.log('getStudentAffiliateDetail postId', postId);
  try {
    const response = await api.get(`/users/student-council/posts/${postId}`);
    console.log('getStudentAffiliateDetail response', response);
    if (response.data.code === 200 || response.data.code === 0) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('getStudentAffiliateDetail error', error.response);
    return null;
  }
};

// councilType 탭 이름 → API enum 매핑
const COUNCIL_TYPE_MAP = {
  school: 'SCHOOL_COUNCIL',
  major: 'MAJOR_COUNCIL',
  college: 'COLLEGE_COUNCIL',
};

// 제휴 / 행사 추천 게시글 목록 조회
export const getStudentAffiliateRecommendList = async (
  councilType,
  excludeId,
  category
) => {
  console.log('getStudentAffiliateRecommendList councilType', councilType);
  console.log('getStudentAffiliateRecommendList excludeId', excludeId);
  console.log('getStudentAffiliateRecommendList category', category);
  try {
    const response = await api.get('/users/student-council/posts', {
      params: {
        councilType: COUNCIL_TYPE_MAP[councilType] || councilType,
        excludePostId: excludeId,
        category: category,
        page: 1,
        size: 3,
      },
    });
    console.log('getStudentAffiliateRecommendList response', response);
    if (response.data.code === 200 || response.data.code === 0) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('getStudentAffiliateRecommendList error', error.response);
    return [];
  }
};

// 총학생회 72시간 이내 행사 목록 조회
export const getStudentSchoolUpcomingEventList = async () => {
  try {
    const response = await api.get(
      '/users/student-council/posts/events/upcoming',
      {
        params: {
          councilType: 'SCHOOL_COUNCIL',
          page: 1,
          size: 3,
        },
      }
    );
    console.log('getStudentSchoolUpcomingEventList response', response);
    return response?.data?.data?.content || [];
  } catch (error) {
    console.error('getStudentSchoolUpcomingEventList error', error.response);
    return [];
  }
};

// 전공 학생회 72시간 이내 행사 목록 조회
export const getStudentMajorUpcomingEventList = async () => {
  try {
    const response = await api.get(
      '/users/student-council/posts/events/upcoming',
      {
        params: {
          councilType: 'MAJOR_COUNCIL',
          page: 1,
          size: 3,
        },
      }
    );
    console.log('getStudentMajorUpcomingEventList response', response);
    return response?.data?.data?.content || [];
  } catch (error) {
    console.error('getStudentMajorUpcomingEventList error', error.response);
    return [];
  }
};

// 단과대 72시간 이내 행사 목록 조회
export const getStudentCollegeUpcomingEventList = async () => {
  try {
    const response = await api.get(
      '/users/student-council/posts/events/upcoming',
      {
        params: {
          councilType: 'COLLEGE_COUNCIL',
          page: 1,
          size: 3,
        },
      }
    );
    console.log('getStudentCollegeUpcomingEventList response', response);
    return response?.data?.data?.content || [];
  } catch (error) {
    console.error('getStudentCollegeUpcomingEventList error', error.response);
    return [];
  }
};

// 제휴 / 행사 게시글 좋아요 토글
export const toggleStudentAffiliateLike = async (postId) => {
  console.log('toggleStudentAffiliateLike postId', postId);
  try {
    const response = await api.post(
      `/users/student-council/posts/${postId}/like`,
      null
    );
    console.log('toggleStudentAffiliateLike response', response);
    if (response.data.code === 200 || response.data.code === 0) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('toggleStudentAffiliateLike error', error.response);
    throw error;
  }
};

export const getTodayEvent = async () => {
  try {
    const response = await api.get('/users/student-council/posts/events/today');
    console.log('오늘의 행사 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('오늘의 행사 조회 실패:', error);
    return null;
  }
};

// 전체 학생회 타입 72시간 이내 행사 통합 조회 (우선순위: school → college → major)
export const getUpcomingEventsAll = async () => {
  try {
    const [schoolEvents, collegeEvents, majorEvents] = await Promise.all([
      getStudentSchoolUpcomingEventList(),
      getStudentCollegeUpcomingEventList(),
      getStudentMajorUpcomingEventList(),
    ]);

    const tag = (events, councilType) =>
      events.map((e) => ({ ...e, councilType }));

    return [
      ...tag(schoolEvents, 'school'),
      ...tag(collegeEvents, 'college'),
      ...tag(majorEvents, 'major'),
    ];
  } catch (error) {
    console.error('getUpcomingEventsAll error', error);
    return [];
  }
};
