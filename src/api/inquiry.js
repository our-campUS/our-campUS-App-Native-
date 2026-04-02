import api from './axiosInstance';
import useAuthStore from '../store/authStore';

export const getMyInquiries = async (page = 0, size = 20) => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const response = await api.get('/users/inquiries/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
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
    const accessToken = useAuthStore.getState().accessToken;
    const response = await api.post(
      '/users/inquiries',
      { title, content },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

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
