import api from './axiosInstance';
import useAuthStore from '../store/authStore';

// 학생회 로그인 api 호출
export async function councilLogin(data) {
  try {
    console.log('data', data);
    const response = await api.post('/auth/council/login', data);
    if (response.data.code === 200) {
      console.log('성공 시 response', response);
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      const user = {
        role: 'COUNCIL',
        councilName: response.data.councilName,
        councilId: response.data.councilId,
        schoolName: response.data.schoolName,
        majorName: response.data.majorName,
        collegeName: response.data.collegeName,
      };
      useAuthStore.getState().loginCouncil({ user, accessToken, refreshToken });
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    return error.response.data;
  }
}
