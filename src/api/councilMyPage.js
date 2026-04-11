import api from './axiosInstance';
import useAuthStore from '../store/authStore';

// 학생회 프로필 조회 ( GET /council/profile )
export async function getCouncilProfile() {
  try {
    const response = await api.get('/council/profile');

    if (response.data.code === 200 || response.data.code === 0) {
      const { councilNickname, councilProfileImageUrl } = response.data.data;
      useAuthStore.getState().updateUser({
        councilNickname,
        councilProfileImageUrl,
      });
      return response.data.data;
    }
    return false;
  } catch (error) {
    console.error('getCouncilProfile error:', error);
    return false;
  }
}

// 학생회 닉네임 수정 ( patch council/change/nickname )
export async function changeCouncilNickname(nickname) {
  try {
    const response = await api.patch('/council/change/nickname', {
      councilNickname: nickname,
    });
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
    const response = await api.patch('/council/change/image', {
      councilProfileImageUrl: image,
    });
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

// 학생회 이메일 변경 인증코드 발송 ( POST /auth/council/change/email/code )
export async function sendCouncilChangeEmailCode(email) {
  try {
    const response = await api.post('/auth/council/change/email/code', {
      email,
    });
    const code = response.data.code;
    if (code === 200 || code === 201 || code === 0) {
      return { isSuccess: true };
    }
    return { isSuccess: false, message: response.data.message };
  } catch (error) {
    console.error('sendCouncilChangeEmailCode error:', error);
    return { isSuccess: false, message: '인증코드 발송에 실패했습니다.' };
  }
}

// 학생회 이메일 변경 인증코드 검증 ( POST /auth/council/change/email/code/verify )
export async function verifyCouncilChangeEmailCode(email, code) {
  try {
    const response = await api.post('/auth/council/change/email/code/verify', {
      email,
      code,
    });
    const resCode = response.data.code;
    if (resCode === 200 || resCode === 201 || resCode === 0) {
      return { isValid: true };
    }
    return { isValid: false, message: response.data.message };
  } catch (error) {
    console.error('verifyCouncilChangeEmailCode error:', error);
    return { isValid: false, message: '인증코드 검증에 실패했습니다.' };
  }
}

// 학생회 이메일 변경 인증코드 재발송
export async function resendCouncilChangeEmailCode(email) {
  try {
    const response = await api.post('/auth/council/change/email/code', {
      email,
    });
    const code = response.data.code;
    if (code === 200 || code === 201 || code === 0) {
      return { isSuccess: true };
    }
    return { isSuccess: false, message: response.data.message };
  } catch (error) {
    console.error('resendCouncilChangeEmailCode error:', error);
    return { isSuccess: false, message: '인증코드 재발송에 실패했습니다.' };
  }
}

// 학생회 이메일 변경 요청 ( PATCH /council/change/email )
export async function changeCouncilEmail(email, electionImageUrl) {
  try {
    const response = await api.patch('/council/change/email', {
      email,
      electionImageUrl,
    });
    const code = response.data.code;
    if (code === 200 || code === 201 || code === 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('changeCouncilEmail error:', error);
    return false;
  }
}

// 학생회 회원탈퇴 ( PATCH /auth/council/withdraw )
export async function withdrawCouncil(password) {
  try {
    const response = await api.patch('/auth/council/withdraw', {
      precaution: true,
      password,
    });
    const code = response.data.code;
    if (code === 200 || code === 201 || code === 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('withdrawCouncil error:', error);
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
    const response = await api.patch('/council/change/password', {
      currentPassword: prevPassword,
      newPassword: newPassword,
      newPasswordConfirm: newPasswordConfirm,
    });
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
