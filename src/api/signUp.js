import { initializeKakaoSDK } from '@react-native-kakao/core';
import { login } from '@react-native-kakao/user';
import { KAKAO_NATIVE_APP_KEY } from '@env';

// const KAKAO_NATIVE_APP_KEY = 'cf9915ad21d898963c9b449516ca45fb';

export function initKakao() {
  initializeKakaoSDK(KAKAO_NATIVE_APP_KEY);
}

export async function onKakaoLogin() {
  try {
    const result = await login();
    console.log('✅ Kakao Login Success:', result);
    return true;
  } catch (error) {
    console.error('❌ Kakao Login Error:', error);
    return false;
  }
}

// 아이디 중복검사 함수 (실제 API 연결 필요)
export const checkUserIdDuplicate = async (userId) => {
  if (!userId || userId.trim() === '') {
    return { isValid: false, message: '아이디를 입력해주세요.' };
  }

  try {
    // TODO: 실제 API 호출로 변경 필요
    // const response = await fetch(`/api/users/check-id?userId=${userId}`);
    // const data = await response.json();

    // 임시로 시뮬레이션 (실제 API 연결 시 제거)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 예시: 'test'는 중복, 나머지는 사용 가능
    if (userId === 'test') {
      return { isValid: false, message: '이미 사용 중인 아이디입니다.' };
    }

    return { isValid: true, message: '사용 가능한 아이디입니다.' };
  } catch (error) {
    console.error('아이디 중복검사 오류:', error);
    return { isValid: false, message: '아이디 확인 중 오류가 발생했습니다.' };
  }
};

export const verifyAuthCode = async (authCode) => {
  // try {
  //   const response = await axios.post('/api/auth/verify-auth-code', { authCode });
  //   return response.data;
  // } catch (error) {
  //   console.error('인증번호 검증 오류:', error);
  //   return { isValid: false, message: '인증번호 검증 중 오류가 발생했습니다.' };
  // }
  if (authCode === '123123') {
    return { isValid: true, message: '인증번호 검증 성공' };
  } else {
    return { isValid: false, message: '인증번호 검증 실패' };
  }
};

export const representativeLogin = async (userId, password) => {
  // try {
  //   const response = await axios.post('/api/auth/login', { userId, password });
  //   return response.data;
  // } catch (error) {
  //   console.error('대표자 로그인 오류:', error);
  //   return { isValid: false, message: '대표자 로그인 중 오류가 발생했습니다.' };
  // }
  if (userId === 'test' && password === '1234') {
    return { isValid: true, message: '대표자 로그인 성공' };
  }
  if (userId === 'test' && password !== '1234') {
    return {
      isValid: false,
      message: '비밀번호가 일치하지 않습니다.',
      idmatch: true,
      passwordmatch: false,
    };
  }
  if (userId !== 'test') {
    return {
      isValid: false,
      message: '아이디가 일치하지 않습니다.',
      idmatch: false,
      passwordmatch: false,
    };
  }
};

export const findRepresentativeEmailExist = async (email) => {
  // try {
  //   const response = await axios.post('/api/auth/find-representative-email', { email });
  //   return response.data;
  // } catch (error) {
  //   console.error('대표자 이메일 존재 오류:', error);
  //   return { isValid: false, message: '대표자 이메일 존재 중 오류가 발생했습니다.' };
  // }
  if (email === 'test@test.com') {
    return { isValid: true, message: '대표자 이메일 존재' };
  }
  return { isValid: false, message: '존재하지 않는 이메일입니다.' };
};

export const checkRepresentativeIdExist = async (id) => {
  if (id === 'test') {
    return { isValid: true, message: '대표자 아이디 존재' };
  }
  return { isValid: false, message: '존재하지 않는 아이디입니다.' };
};
