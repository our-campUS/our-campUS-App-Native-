// Apple 로그인에서 이름이 전달되지 않으면 백엔드가 apple_로 시작하는 임시 닉네임 저장.
// 식별자 노출 방지를 위해 화면 표시 시에만 치환.
// 저장된 user.name은 회원 탈퇴 요청에 쓰이므로 원본 유지.
const TEMP_NICKNAME_PREFIX = 'apple_';
const FALLBACK_NAME = '사용자';

export const getDisplayName = (name) => {
  if (!name || name.startsWith(TEMP_NICKNAME_PREFIX)) {
    return FALLBACK_NAME;
  }
  return name;
};
