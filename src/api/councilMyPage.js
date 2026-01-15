import api from './axiosInstance';
import useAuthStore from '../store/authStore';

// 학생회 닉네임 수정 ( patch council/change/nickname )
export async function changeCouncilNickname(nickname) {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    console.log('accessToken', accessToken);
    console.log('nickname', nickname);
    const response = await api.patch(
      '/council/change/nickname',
      {
        councilNickname: nickname,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('changeCouncilNickname response', response);
    if (response.data.code === 200 || response.data.code === 0) {
      useAuthStore.getState().updateUser({
        councilNickname: nickname,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.log('changeCouncilNickname error', error.response);
    return false;
  }
}
