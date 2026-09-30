import * as Keychain from 'react-native-keychain';

// accessToken/refreshToken을 iOS Keychain / Android Keystore에 저장한다.
// AsyncStorage는 평문 저장이라 탈옥/루팅 기기 등에서 그대로 읽힐 수 있어
// 인증 토큰은 반드시 OS 보안 저장소를 거치도록 한다 (이슈 #168).
const SERVICE = 'ourCampusApp.authTokens';

export async function getTokens() {
  try {
    const credentials = await Keychain.getGenericPassword({ service: SERVICE });
    if (!credentials) {
      return { accessToken: null, refreshToken: null };
    }
    const { accessToken, refreshToken } = JSON.parse(credentials.password);
    return { accessToken: accessToken || null, refreshToken: refreshToken || null };
  } catch (error) {
    console.warn('[tokenStorage] Keychain 조회 실패:', error);
    return { accessToken: null, refreshToken: null };
  }
}

export async function setTokens({ accessToken, refreshToken }) {
  try {
    await Keychain.setGenericPassword(
      'ourCampusApp',
      JSON.stringify({
        accessToken: accessToken || null,
        refreshToken: refreshToken || null,
      }),
      { service: SERVICE }
    );
  } catch (error) {
    console.warn('[tokenStorage] Keychain 저장 실패:', error);
  }
}

export async function clearTokens() {
  try {
    await Keychain.resetGenericPassword({ service: SERVICE });
  } catch (error) {
    console.warn('[tokenStorage] Keychain 삭제 실패:', error);
  }
}
