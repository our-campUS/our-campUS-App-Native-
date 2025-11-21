// 드롭다운 필터링용 한글 검색 로직
// - 일반 포함 검색 (includes)
// - 자모 단위 검색 (예: "정ㅊ" -> "ㅈㅓㅇㅊ")

const L_TABLE = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

const V_TABLE = [
  'ㅏ',
  'ㅐ',
  'ㅑ',
  'ㅒ',
  'ㅓ',
  'ㅔ',
  'ㅕ',
  'ㅖ',
  'ㅗ',
  'ㅘ',
  'ㅙ',
  'ㅚ',
  'ㅛ',
  'ㅜ',
  'ㅝ',
  'ㅞ',
  'ㅟ',
  'ㅠ',
  'ㅡ',
  'ㅢ',
  'ㅣ',
];

const T_TABLE = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

const toJamoString = (str) => {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const code = ch.charCodeAt(0);
    // 한글 음절 범위
    if (code >= 0xac00 && code <= 0xd7a3) {
      const syllableIndex = code - 0xac00;
      const lIndex = Math.floor(syllableIndex / (21 * 28));
      const vIndex = Math.floor((syllableIndex % (21 * 28)) / 28);
      const tIndex = syllableIndex % 28;

      result += L_TABLE[lIndex] || '';
      result += V_TABLE[vIndex] || '';
      if (T_TABLE[tIndex]) {
        result += T_TABLE[tIndex];
      }
    } else {
      // 이미 자모(ㅈ, ㅊ 등)이거나 기타 문자면 그대로 사용
      result += ch;
    }
  }
  return result;
};

export const filterDropdownItems = (items, keyword) => {
  // keyword가 비어 있으면, 문자열인 아이템만 그대로 반환
  if (!keyword) {
    return items.filter((item) => typeof item === 'string');
  }
  const lowerValue = keyword.toLowerCase();
  const valueJamo = toJamoString(lowerValue);

  return items.filter((item) => {
    if (typeof item !== 'string') {
      return false;
    }
    const lowerItem = item.toLowerCase();

    // 1단계: 원 문자열 앞부분이 정확히 일치하면 통과
    if (lowerItem.startsWith(lowerValue)) {
      return true;
    }

    // 2단계: 자모 단위로 분해해서 앞부분이 같은지 체크
    const itemJamo = toJamoString(lowerItem);
    return itemJamo.startsWith(valueJamo);
  });
};

export default filterDropdownItems;
