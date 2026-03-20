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

// 학생회 프로필 이미지 수정 ( patch council/change/image )
export async function changeCouncilProfileImage(image) {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    console.log('accessToken', accessToken);
    console.log('image', image);
    const response = await api.patch(
      '/council/change/image',
      {
        councilProfileImageUrl: image,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.data.code === 200 || response.data.code === 0) {
      useAuthStore.getState().updateUser({
        councilProfileImageUrl: image,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.log('changeCouncilProfileImage error', error.response);
    return false;
  }
}

// 학생회 계정 비밀번호 변경 ( patch council/change/password )

export async function changeCouncilPassword(
  prevPassword,
  newPassword,
  newPasswordConfirm
) {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    console.log('accessToken', accessToken);
    console.log('prevPassword', prevPassword);
    console.log('newPassword', newPassword);
    console.log('newPasswordConfirm', newPasswordConfirm);
    const response = await api.patch(
      '/council/change/password',
      {
        currentPassword: prevPassword,
        newPassword: newPassword,
        newPasswordConfirm: newPasswordConfirm,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('changeCouncilPassword response', response);
    if (response.data.code === 200 || response.data.code === 0) {
      return { success: true, message: '비밀번호 변경 성공' };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.log('changeCouncilPassword error', error.response);
    return { success: false, message: error.response.data.message };
  }
}
