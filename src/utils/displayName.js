// 백엔드는 Apple 로그인에서 이름이 전달되지 않으면 `apple_<식별자>` 형태의
// 임시 닉네임을 저장한다. 사용자에게는 식별자가 노출되지 않도록 화면 표시용으로만 치환한다.
// (저장된 user.name은 회원 탈퇴 등 서버 요청에 쓰이므로 원본을 그대로 둔다.)
const TEMP_NICKNAME_PREFIX = 'apple_';
const FALLBACK_NAME = '사용자';

export const getDisplayName = (name) => {
  if (!name || name.startsWith(TEMP_NICKNAME_PREFIX)) {
    return FALLBACK_NAME;
  }
  return name;
};
