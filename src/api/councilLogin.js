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
    return error.response.data;
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
    return error.response.data;
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
    console.log('오류 시 error.response.data', error.response.data);
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
    console.log('오류 시 error.response.data', error.response.data);
    console.log('오류 시 error.message', error.message);
    return error.response.data;
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
    console.log('오류 시 error.response.data', error.response.data);
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
    console.log('오류 시 error.response.data', error.response.data);
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
    console.log('오류 시 error.response.data', error.response.data);
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
