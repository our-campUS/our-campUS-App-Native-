// ISO 문자열 파싱에 new Date() 대신 문자열 슬라이싱 + parseInt 사용 (timezone 이슈 방지)

export const parseISODate = (isoString) => {
  if (!isoString) return null;

  const year = parseInt(isoString.slice(0, 4), 10);
  const month = parseInt(isoString.slice(5, 7), 10);
  const day = parseInt(isoString.slice(8, 10), 10);

  const hasTime = isoString.length > 10 && isoString.includes('T');
  const hour = hasTime ? parseInt(isoString.slice(11, 13), 10) : null;
  const minute = hasTime ? parseInt(isoString.slice(14, 16), 10) : null;

  return { year, month, day, hour, minute };
};

// "2026년 3월 5일 까지"
export const formatKoreanDate = (isoString) => {
  const parsed = parseISODate(isoString);
  if (!parsed) return '';
  return `${parsed.year}년 ${parsed.month}월 ${parsed.day}일까지`;
};

// "2026년 3월 5일 14시 30분" (시간 없으면 날짜만)
export const formatKoreanDateTime = (isoString) => {
  const parsed = parseISODate(isoString);
  if (!parsed) return '';

  const datePart = `${parsed.year}년 ${parsed.month}월 ${parsed.day}일`;
  if (parsed.hour === null) return datePart;

  return `${datePart} ${parsed.hour}시 ${parsed.minute}분`;
};

// "14시 30분" 또는 "14시" (0분이면 생략)
export const formatKoreanTime = (isoString) => {
  const parsed = parseISODate(isoString);
  if (!parsed || parsed.hour === null) return '';

  if (parsed.minute === 0) return `${parsed.hour}시`;
  return `${parsed.hour}시 ${parsed.minute}분`;
};

// "2026.03.05" (Date 객체 → 폼 입력용)
export const formatDotDate = (dateObj) => {
  if (!dateObj) return '';
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

// "14:30" (Date 객체 → 폼 시간 입력용)
export const formatClockTime = (dateObj) => {
  if (!dateObj) return '';
  const hh = String(dateObj.getHours()).padStart(2, '0');
  const mm = String(dateObj.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

// "26.03.05" (세기 제거, 하이픈→점)
export const formatReviewDate = (dateString) => {
  if (!dateString) return '';
  return dateString.slice(2, 10).replace(/-/g, '.');
};

export const createDateOnly = (dateObj) => {
  if (!dateObj) return null;
  return new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    0,
    0,
    0,
    0
  );
};

export const createTimeOnly = (dateObj) => {
  if (!dateObj) return null;
  return new Date(2000, 0, 1, dateObj.getHours(), dateObj.getMinutes(), 0, 0);
};

// "2026-03-05T00:00:00.000Z"
export const toISODateString = (dateObj) => {
  if (!dateObj) return null;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00.000Z`;
};

// "2026-03-05T14:30"
export const toISODateTimeString = (dateObj, timeObj) => {
  if (!dateObj || !timeObj) return null;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(timeObj.getHours()).padStart(2, '0');
  const minutes = String(timeObj.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
