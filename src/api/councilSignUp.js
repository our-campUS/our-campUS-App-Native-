import api from './axiosInstance';
import useAuthStore from '../store/authStore';

// 학생회 회원가입 이메일 주소 형식 검사 및 인증코드 발송
export const sendCouncilEmail = async (email) => {
  try {
    const response = await api.post('auth/council/signup/email/code', {
      email: email,
    });
    if (response.data.code === 200) {
      console.log('✅ Send Council Email Success:', response.data);
      return {
        isValid: true,
      };
    } else {
      return {
        isValid: false,
        message: response.data.message || '이메일 발송에 실패했습니다.',
      };
    }
  } catch (error) {
    return {
      isValid: false,
      message:
        error.response?.data?.message ||
        error.message ||
        '이메일 발송 중 오류가 발생했습니다.',
    };
  }
};

// 학생회 회원가입 인증번호 재전송하기 api 호출
export const resendCouncilSignUpAuthCode = async (email) => {
  try {
    const response = await api.post('auth/council/signup/email/code', {
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
};

// 학생회 회원가입 아이디 중복검사 api 호출
export const checkCouncilLoginIdDuplicate = async (loginId) => {
  try {
    const response = await api.post('auth/council/signup/validate', {
      loginId: loginId,
    });
    console.log('checkCouncilLoginIdDuplicate response', response);
    if (response.data.code === 200) {
      console.log('✅ Check Council Login Id Success:', response.data);
      return {
        isDuplicate: false,
      };
    } else {
      return {
        isDuplicate: true,
        message: response.data.message || '아이디 중복검사에 실패했습니다.',
      };
    }
  } catch (error) {
    return {
      isDuplicate: true,
      message:
        error.response?.data?.message ||
        error.message ||
        '아이디 중복검사 중 오류가 발생했습니다.',
    };
  }
};

// 학생회 회원가입 인증번호 검증 api 호출
export const verifyCouncilSignUpAuthCode = async (email, code) => {
  console.log('verifyCouncilSignUpAuthCode email', email);
  console.log('verifyCouncilSignUpAuthCode code', code);
  try {
    const response = await api.post('auth/council/signup/email/code/verify', {
      email: email,
      code: code,
    });
    if (response.data.code === 200) {
      console.log(
        '✅ Verify Council Sign Up Auth Code Success:',
        response.data
      );
      return {
        isValid: true,
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
};

// 학생회 회원가입 최종 제출 api 호출
export const submitCouncilSignUp = async (finalData) => {
  try {
    const response = await api.post('auth/council/signup', finalData);
    if (response.data.code === 200) {
      console.log('✅ Submit Council Sign Up Success:', response.data);
      return {
        isSuccess: true,
      };
    } else {
      console.log('❌ Submit Council Sign Up Error!!:', response);
      return {
        isSuccess: false,
        message: response.data.message || '학생회 회원가입에 실패했습니다.',
      };
    }
  } catch (error) {
    console.log('❌ Submit Council Sign Up Error:', error);
    return {
      isSuccess: false,
      message:
        error.response?.data?.message ||
        error.message ||
        '학생회 회원가입에 실패했습니다.',
    };
  }
};
