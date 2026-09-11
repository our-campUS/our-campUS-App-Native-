import api from './axiosInstance';
import useAuthStore from '../store/authStore';

export const COUNCIL_LOGIN_ERROR = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INVALID_INPUT: 'INVALID_INPUT',
  NETWORK: 'NETWORK',
  UNKNOWN: 'UNKNOWN',
};

// 404(존재하지 않는 학생회)와 401(비밀번호 불일치)을 한 결과로 묶어 계정 존재 여부가 드러나지 않게 한다
const toLoginError = (error) => {
  const status = error.response?.status;
  if (!status) {
    return COUNCIL_LOGIN_ERROR.NETWORK;
  }
  if (status === 401 || status === 404) {
    return COUNCIL_LOGIN_ERROR.INVALID_CREDENTIALS;
  }
  if (status === 400) {
    return COUNCIL_LOGIN_ERROR.INVALID_INPUT;
  }
  return COUNCIL_LOGIN_ERROR.UNKNOWN;
};

// 학생회 로그인 api 호출
export async function councilLogin(data) {
  try {
    const response = await api.post('auth/council/login', data);
    if (response.data.code !== 200) {
      return { success: false, error: COUNCIL_LOGIN_ERROR.UNKNOWN };
    }

    const { accessToken, refreshToken } = response.data.data;
    const user = {
      role: 'COUNCIL',
      councilName: response.data.data.councilName,
      councilId: response.data.data.councilId,
      schoolName: response.data.data.schoolName,
      majorName: response.data.data.majorName,
      collegeName: response.data.data.collegeName,
      loginId: response.data.data.loginId,
      email: response.data.data.email,
      councilNickname: response.data.data.councilNickname,
      councilProfileImageUrl: response.data.data.councilProfileImageUrl,
    };
    useAuthStore.getState().loginCouncil({ user, accessToken, refreshToken });
    return { success: true };
  } catch (error) {
    return { success: false, error: toLoginError(error) };
  }
}

// 학생회 아이디 찾기를 위한 이메일 인증 코드 전송
export async function sendCouncilEmailCode(email) {
  console.log('전송하려는 이메일 : ' + email);
  try {
    const response = await api.post(`/auth/council/find/id/email/code`, {
      email: email,
    });
    if (response.data.code === 200) {
      console.log('성공 시 response', response);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    return error.response?.data ?? { code: null };
  }
}

// 학생회 아이디 찾기 위한 이메일 인증 코드 검증 API 호출
export async function verifyCouncilFindIdAuthCode(email, code) {
  try {
    const response = await api.post(`/auth/council/find/id/email/code/verify`, {
      email: email,
      code: code,
    });
    if (response.data.code === 200) {
      console.log(
        '✅ Verify Council Find Id Auth Code Success:',
        response.data
      );
      return {
        isValid: true,
        data: response.data,
      };
    } else {
      return {
        isValid: false,
        message: response.data.message || '인증번호 검증에 실패했습니다.',
      };
    }
  } catch (error) {
    return {
      isValid: false,
      message:
        error.response?.data?.message ||
        error.message ||
        '인증번호 검증 중 오류가 발생했습니다.',
    };
  }
}

// 학생회 아이디 찾기 위한 이메일 인증 코드 재전송 API 호출
export async function resendCouncilFindIdAuthCode(email) {
  try {
    const response = await api.post('auth/council/find/id/email/code', {
      email: email,
    });
    if (response.data.code === 200) {
      console.log(
        '✅ Resend Council Sign Up Auth Code Success:',
        response.data
      );
      return {
        isSuccess: true,
      };
    } else {
      return {
        isSuccess: false,
        message: response.data.message || '인증번호 재전송에 실패했습니다.',
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      message:
        error.response?.data?.message ||
        error.message ||
        '인증번호 재전송 중 오류가 발생했습니다.',
    };
  }
}

// 인증된 이메일을 통한 학생회 아이디 찾기 API 호출
export async function findCouncilLoginId(email) {
  try {
    const response = await api.get('auth/council/find/id', {
      params: {
        email: email,
      },
    });
    if (response.data.code === 200) {
      console.log('성공 시 response', response);
      return response.data;
    } else {
      console.log('실패 시 response', response);
      return response.data;
    }
  } catch (error) {
    console.log('오류 시 error', error);
    return error.response?.data ?? { code: null };
  }
}

// 비밀번호 찾기를 위한 아이디 검증
export async function findCouncilPasswordValidateLoginId(loginId) {
  try {
    const response = await api.post('auth/council/find/password/validate/id', {
      loginId: loginId,
    });
    if (response.data.code === 200) {
      console.log('성공 시 response', response);
      return {
        isValid: true,
        data: response.data,
      };
    } else {
      console.log('실패 시 response', response);
      return {
        isValid: false,
        message: response.data.message || '아이디 검증에 실패했습니다.',
      };
    }
  } catch (error) {
    console.log('오류 시 error', error);
    return {
      isValid: false,
      message:
        error.response?.data?.message ||
        error.message ||
        '아이디 검증 중 오류가 발생했습니다.',
    };
  }
}

// 비밀번호를 찾기 위한 이메일 존재 여부 확인
export async function findCouncilPasswordValidateEmail({ loginId, email }) {
  console.log('서버 전송 데이터 : { loginId, email }', { loginId, email });
  try {
    const response = await api.post(
      'auth/council/find/password/validate/email',
      {
        loginId: loginId,
        email: email,
      }
    );
    if (response.data.code === 200) {
      console.log('성공 시 response', response);
      return {
        isValid: true,
        data: response.data,
      };
    } else {
      console.log('실패 시 response', response);
      return {
        isValid: false,
        message: response.data.message || '이메일 검증에 실패했습니다.',
      };
    }
  } catch (error) {
    console.log('오류 시 error', error);
    console.log('오류 시 error.message', error.message);
    return {
      isValid: false,
      message:
        error.response?.data?.message ||
        error.message ||
        '이메일 검증 중 오류가 발생했습니다.',
    };
  }
}

// 비밀번호 찾기를 위한 이메일 인증 코드 전송
export async function sendCouncilPasswordFindEmailCode(email) {
  try {
    const response = await api.post('auth/council/find/password/email/code', {
      email: email,
    });
    if (response.data.code === 200) {
      console.log('성공 시 response', response);
      return {
        isSuccess: true,
        data: response.data,
      };
    } else {
      console.log('실패 시 response', response);
      return {
        isSuccess: false,
        message:
          response.data.message || '이메일 인증 코드 전송에 실패했습니다.',
      };
    }
  } catch (error) {
    console.log('오류 시 error', error);
    console.log('오류 시 error.message', error.message);
    return { isSuccess: false };
  }
}

// 비밀번호 찾기를 위한 이메일 인증 코드 검증
export async function verifyCouncilPasswordFindEmailCode(email, code) {
  try {
    const response = await api.post(
      'auth/council/find/password/email/code/verify',
      {
        email: email,
        code: code,
      }
    );
    if (response.data.code === 200) {
      console.log('성공 시 response', response);
      return {
        isValid: true,
        data: response.data,
      };
    } else {
      console.log('실패 시 response', response);
      return {
        isValid: false,
        message: response.data.message || '인증번호 검증에 실패했습니다.',
      };
    }
  } catch (error) {
    console.log('오류 시 error', error);
    console.log('오류 시 error.message', error.message);
    return {
      isValid: false,
      message:
        error.response?.data?.message ||
        error.message ||
        '인증번호 검증 중 오류가 발생했습니다.',
    };
  }
}

// 비밀번호 찾기를 위한 이메일 인증 코드 재전송
export async function resendCouncilPasswordFindEmailCode(email) {
  try {
    const response = await api.post('auth/council/find/password/email/code', {
      email: email,
    });
    if (response.data.code === 200) {
      console.log('성공 시 response', response);
      return {
        isSuccess: true,
        data: response.data,
      };
    } else {
      console.log('실패 시 response', response);
      return {
        isSuccess: false,
        message: response.data.message || '인증번호 재전송에 실패했습니다.',
      };
    }
  } catch (error) {
    console.log('오류 시 error', error);
    console.log('오류 시 error.message', error.message);
    return {
      isSuccess: false,
      message:
        error.response?.data?.message ||
        error.message ||
        '인증번호 재전송 중 오류가 발생했습니다.',
    };
  }
}

// 비밀번호 재설정
export async function resetCouncilPassword(email, loginId, password) {
  console.log('서버 전송 데이터 : { email, loginId, password }', {
    email,
    loginId,
    password,
  });
  try {
    const response = await api.patch('auth/council/find/password', {
      email: email,
      loginId: loginId,
      password: password,
    });
    if (response.data.code === 200) {
      console.log('성공 시 response', response);
      return {
        isSuccess: true,
        data: response.data,
      };
    } else {
      console.log('실패 시 response', response);
      return {
        isSuccess: false,
        message: response.data.message || '비밀번호 재설정에 실패했습니다.',
      };
    }
  } catch (error) {
    console.log('오류 시 error', error);
    console.log('오류 시 error.message', error.message);
    return {
      isSuccess: false,
      message:
        error.response?.data?.message ||
        error.message ||
        '비밀번호 재설정 중 오류가 발생했습니다.',
    };
  }
}
