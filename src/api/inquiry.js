import api from './axiosInstance';

export const getMyInquiries = async (page = 0, size = 20) => {
  try {
    const response = await api.get('/users/inquiries/me', {
      params: { page, size, sort: 'createdAt,desc' },
    });

    if (response.data.code === 200 || response.data.code === 0) {
      return response.data.data;
    }
    return false;
  } catch (error) {
    console.error('Get My Inquiries Error:', error);
    return false;
  }
};

export const createInquiry = async (title, content) => {
  try {
    const response = await api.post('/users/inquiries', { title, content });

    const code = response.data.code;
    if (code === 200 || code === 201 || code === 0) {
      return response.data.data;
    }
    return false;
  } catch (error) {
    console.error('Create Inquiry Error:', error);
    return false;
  }
};

// 총학 문의 내역 조회
export const getCouncilInquiries = async (page = 0, size = 20) => {
  try {
    const response = await api.get('/student-councils/inquiries/me', {
      params: { page, size, sort: 'createdAt,desc' },
    });

    if (response.data.code === 200 || response.data.code === 0) {
      return response.data.data;
    }
    return false;
  } catch (error) {
    console.error('Get Council Inquiries Error:', error);
    return false;
  }
};

// 총학 문의 등록
export const createCouncilInquiry = async (title, content) => {
  try {
    const response = await api.post('/student-councils/inquiries', {
      title,
      content,
    });

    const code = response.data.code;
    if (code === 200 || code === 201 || code === 0) {
      return response.data.data;
    }
    return false;
  } catch (error) {
    console.error('Create Council Inquiry Error:', error);
    return false;
  }
};
