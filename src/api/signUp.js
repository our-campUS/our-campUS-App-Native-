import { initializeKakaoSDK } from '@react-native-kakao/core';
import { KAKAO_NATIVE_APP_KEY } from '@env';

// 카카오 SDK 초기화
export function initKakao() {
  initializeKakaoSDK(KAKAO_NATIVE_APP_KEY);
}

import {
  loginWithKakaoAccount,
  getProfile,
} from '@react-native-seoul/kakao-login';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { sha256 } from 'js-sha256';
import api from './axiosInstance';
import useAuthStore from '../store/authStore';
import { getDisplayName } from '../utils/displayName';

export async function onKakaoLogin() {
  try {
    const result = await loginWithKakaoAccount();
    console.log('✅ Kakao Login Success:', result);

    const response = await api.post('auth/login/kakao', null, {
      params: {
        token: result.accessToken,
      },
    });

    if (response.data.code === 200) {
      const {
        nickname,
        campusNickname,
        userId,
        kakaoId,
        email,
        profileImage,
        accessToken,
        refreshToken,
        isProfileNotCompleted,
      } = response.data.data;

      await useAuthStore.getState().setAuthFromKakao({
        user: {
          name: nickname,
          campusNickname,
          userId,
          kakaoId,
          email,
          profileImage,
          role: 'USER',
        },
        accessToken,
        refreshToken,
      });

      return {
        isValid: true,
        isProfileNotCompleted,
        nickname,
      };
    }

    return { isValid: false, isProfileNotCompleted: false };
  } catch (error) {
    console.error('❌ Kakao Login Error:', error?.message ?? error);
    return false;
  }
}

export async function onAppleLogin() {
  try {
    // 1. 백엔드에서 1회용 nonce 발급
    const nonceResponse = await api.post('auth/login/apple/nonce');
    const { nonce } = nonceResponse.data.data;

    // 2. Apple 네이티브 로그인 요청 — 원문 nonce를 그대로 넘긴다.
    //    라이브러리 네이티브 코드가 Apple에 보내기 전에 SHA256 해싱을 해 주므로
    //    여기서 미리 해싱하면 이중 해시가 된다. (ID Token의 nonce 클레임 = sha256(원문))
    const appleAuthResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      nonce,
    });

    const { authorizationCode, fullName } = appleAuthResponse;
    if (!authorizationCode) {
      throw new Error('Apple 인증 코드를 받지 못했습니다.');
    }

    // fullName은 최초 로그인 시에만 내려오고, 이후 재로그인 시에는 null
    const nickname = fullName?.givenName
      ? [fullName.givenName, fullName.familyName].filter(Boolean).join(' ')
      : undefined;

    // 3. 백엔드로 authorizationCode + nonce의 SHA-256 해시(소문자 hex) 전달.
    //    서버는 이 값을 ID Token의 nonce 클레임과 비교하고 Redis에서 소비한다.
    const response = await api.post('auth/login/apple', {
      authorizationCode,
      nonce: sha256(nonce),
      nickname,
    });

    if (response.data.code === 200) {
      const {
        nickname: serverNickname,
        campusNickname,
        userId,
        kakaoId,
        email,
        profileImage,
        accessToken,
        refreshToken,
        isProfileNotCompleted,
      } = response.data.data;

      await useAuthStore.getState().setAuthFromKakao({
        user: {
          name: serverNickname,
          campusNickname,
          userId,
          kakaoId,
          email,
          profileImage,
          role: 'USER',
        },
        accessToken,
        refreshToken,
      });

      return {
        isValid: true,
        isProfileNotCompleted,
        nickname: getDisplayName(serverNickname),
      };
    }

    return { isValid: false, isProfileNotCompleted: false };
  } catch (error) {
    // 사용자가 Apple 로그인 시트를 직접 취소한 경우 — 에러 토스트 띄우지 않음
    if (error.code === appleAuth.Error.CANCELED) {
      return { isValid: false, isProfileNotCompleted: false, isCanceled: true };
    }
    console.error('❌ Apple Login Error:', error?.message ?? error, {
      url: error?.config?.url,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    return { isValid: false, isProfileNotCompleted: false };
  }
}

// 학교 검색 API
export async function searchUniversity(keyword) {
  const response = await api.get('search/schools', {
    params: {
      keyword: keyword,
    },
  });
  console.log('✅ Search University Response:', response.data);
  if (response.data.code === 200) {
    console.log('found data');
    return response.data.data;
  } else {
    return false;
  }
}

// 학과 검색 API
export async function searchMajor(schoolId, keyword) {
  const response = await api.get('search/majors', {
    params: {
      schoolId: schoolId,
      keyword: keyword,
    },
  });
  console.log('✅ Search Major Response:', response.data);
  if (response.data.code === 200) {
    console.log('found data');
    return response.data.data;
  } else {
    return false;
  }
}

// 단과대학 검색 API
export async function searchCollege(schoolId, keyword) {
  const response = await api.get('search/colleges', {
    params: {
      schoolId: schoolId,
      keyword: keyword,
    },
  });
  console.log('✅ Search College Response:', response.data);
  if (response.data.code === 200) {
    console.log('found data');
    return response.data.data;
  } else {
    return false;
  }
}

// 최초 로그인 마지막 완료 단계 api 호출 (jwt 토큰 사용) + authStore 업데이트
export async function sendUserProfile(schoolId, majorId) {
  try {
    console.log('✅ School ID:', schoolId);
    console.log('✅ Major ID:', majorId);
    const response = await api.patch('users/profile', {
      schoolId: schoolId,
      majorId: majorId,
    });
    if (response.data.code === 200) {
      console.log('✅ Send User Profile Success:', response.data);
      useAuthStore.getState().updateUser({
        collegeName: response.data.data.collegeName,
        majorName: response.data.data.majorName,
        schoolName: response.data.data.schoolName,
      });
      console.log('✅ Update User Success:', useAuthStore.getState());
      // useAuthStore.getState().finishInitialLogin();
      return true;
    } else {
      console.error('❌ Send User Profile Error:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Send User Profile Error:', error);
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
