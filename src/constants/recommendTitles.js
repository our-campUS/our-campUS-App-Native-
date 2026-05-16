const RECOMMEND_TITLES = {
  morning: [
    '🍚 오늘 하루, 든든하게 시작',
    '☀️ 바쁜 아침, 빠르게!',
    '🥪 등교 전 아침 한 입',
    '☕️ 모닝 커피 어때요?',
    '🏫 등교길 추천 스팟',
  ],
  lunch: [
    '🍚 점메추 해드립니다',
    '🍚 점심 맛집 투어',
    '🫩 배고픈 시간, 이런 장소는 어때요?',
  ],
  afternoon: [
    '🍰 디저트 타임, 여기 어때요?',
    '☕️ 잠깐 쉬고 싶을 때',
    '☺️ 분조카 힐링',
  ],
  evening: [
    '🍚 저메추 해드립니다',
    '🍚 저녁 시간 추천 맛집',
    '🍜 오늘 저녁 식사, 여기 어때요?',
  ],
  night: [
    '🍻 오늘 술 한잔, 이런 장소는 어때요?',
    '🍺 이번주 회식 장소는 여기로 정해드릴게요',
  ],
  dawn: [
    '🛍️ 지금 열려있는 매장',
    '🏪 24시간 운영하는 주변 매장',
    '☕️ 학교 주변 무인 매장',
    '🤓 밤샘 공부는 이곳에서 어때요?',
  ],
};

export const getRecommendTitle = () => {
  const hour = new Date().getHours();
  let list;
  if (hour >= 7 && hour <= 10) list = RECOMMEND_TITLES.morning;
  else if (hour >= 11 && hour <= 13) list = RECOMMEND_TITLES.lunch;
  else if (hour >= 14 && hour <= 16) list = RECOMMEND_TITLES.afternoon;
  else if (hour >= 17 && hour <= 20) list = RECOMMEND_TITLES.evening;
  else if (hour >= 21 || hour <= 2) list = RECOMMEND_TITLES.night;
  else list = RECOMMEND_TITLES.dawn;
  return list[Math.floor(Math.random() * list.length)];
};
