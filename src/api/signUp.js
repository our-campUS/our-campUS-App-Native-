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
