export const CATEGORIES = ['중앙대', '사회과학대', '정치국제'];

export const BENEFITS_DATA = [
  { id: '1', name: '중앙대 카페', desc: '아메리카노 30% 할인', tag: '인기' },
  { id: '2', name: '블루포트', desc: '모든 음료 10% 할인', tag: '인기' },
  { id: '3', name: '맥도날드', desc: '세트 메뉴 500원 할인', tag: '인기' },
];

export const STORE_DATA = [
  {
    id: '1',
    name: '스타벅스 상도점',
    category: '카페',
    rating: '5.0',
    discount: '(~9/30) 중앙대생 할인',
    distance: '걸어서 3분 (0.0km)',
    tags: ['총학생회 제휴', '정치국제학과 제휴'],
    image: 'https://via.placeholder.com/300',
  },
  {
    id: '2',
    name: '투썸플레이스',
    category: '식당',
    rating: '4.5',
    discount: '상시 10% 할인',
    distance: '걸어서 10분 (0.8km)',
    tags: ['중앙대 제휴'],
    image: 'https://via.placeholder.com/300',
  },
  {
    id: '3',
    name: '다른 가게 이름',
    category: '식당',
    rating: '4.5',
    discount: '상시 10% 할인',
    distance: '걸어서 10분 (0.8km)',
    tags: ['중앙대 제휴'],
    image: 'https://via.placeholder.com/300',
  },
];

export const CAROUSEL_DATA = [
  {
    id: '1',
    image: require('../../assets/default_image.jpeg'),
  },
  {
    id: '2',
    image: require('../../assets/default_image.jpeg'),
  },
  {
    id: '3',
    image: require('../../assets/default_image.jpeg'),
  },
  {
    id: '4',
    image: 'https://via.placeholder.com/600x400/FF33F5/FFFFFF?text=Banner+4',
  },
  {
    id: '5',
    image: require('../../assets/default_image.jpeg'),
  },
  {
    id: '6',
    image: 'https://via.placeholder.com/600x400/33FFFF/FFFFFF?text=Banner+6',
  },
];

export const CURATION_DATA = [
  {
    id: 1,
    title: '최근 오픈한 흑석 핫플 구경하기',
    count: 9,
    images: Array(9).fill('https://via.placeholder.com/100'),
  },
  {
    id: 2,
    title: '데이트하기 좋은 분위기 맛집',
    count: 9,
    images: Array(9).fill('https://via.placeholder.com/100'),
  },
];

// 제휴 탭 카루셀 전용 더미 데이터 (재상)
export const AFFILIATION_CAROUSEL_DATA = [
  {
    id: '1',
    activityType: '간식행사',
    title: '25-2학기 중간고사 간식행사',
    place: '301관 1층',
    date: '2025.11.18',
  },
  {
    id: '2',
    activityType: '총회',
    title: '25-2학기 종강 총회',
    place: '크라운호프 중앙대점',
    date: '2025.12.30',
  },
];

// 제휴 칼럼 리스트 전용 더미 데이터 (재상)
export const AFFILIATION_COLUMN_LIST_DATA_AFFILIATION = [
  {
    title: '수아르떼 첫 방문 30% 할인',
    place: '수아르떼 중앙대점',
    date: '2025년 12월 1일까지',
    image: null,
    detailImages: [],
    type: '제휴',
  },
  {
    title: '맥도날드 첫 방문 30% 할인',
    place: '맥도날드 중앙대점',
    date: '2025년 12월 1일까지',
    image: null,
    detailImages: [],
    type: '제휴',
  },
  {
    title: '이탈리안 돈까스와 냉면 첫 방문 30% 할인',
    place: '이탈리안 돈까스와 냉면 중앙대점',
    date: '2025년 12월 1일까지',
    image: null,
    detailImages: [],
    type: '제휴',
  },
  {
    title: '이탈리안 돈까스와 냉면 첫 방문 30% 할인',
    place: '이탈리안 돈까스와 냉면 중앙대점',
    date: '2025년 12월 1일까지',
    image: null,
    detailImages: [],
    type: '제휴',
  },
];

// 행사 칼럼 리스트 전용 더미 데이터 (재상)
export const AFFILIATION_COLUMN_LIST_DATA_EVENT = [
  {
    title: '25-2학기 중간고사 간식사업',
    place: '310관 1층',
    date: '2025년 12월 1일',
    image: null,
    detailImages: [],
    type: '행사',
  },
  {
    title: '25-2학기 기말고사 간식사업',
    place: '310관 1층',
    date: '2025년 12월 2일',
    image: null,
    detailImages: [],
    type: '행사',
  },
  {
    title: '25-2학기 계절학기 간식사업',
    place: '310관 1층',
    date: '2025년 12월 3일',
    image: null,
    detailImages: [],
    type: '행사',
  },
];

export const AFFILIATION_RECOMMEND_DATA = [
  {
    id: '1',
    title: '빅브로짐 중앙대점',
    place: '빅브로짐 중앙대점',
    date: '2025년 12월 1일까지',
    image: null,
    detailImages: [],
    type: '제휴',
    detail: '첫 방문 20% 할인',
    distance: '걸어서 4분 ',
    placeType: '카페',
    approved: true,
    rank: null,
  },
  {
    id: '2',
    title: '빅브로짐 중앙대점',
    place: '빅브로짐 중앙대점',
    date: '2025년 12월 1일까지',
    image: null,
    detailImages: [],
    type: '제휴',
    detail: '첫 방문 20% 할인',
    distance: '걸어서 4분 ',
    placeType: '카페',
    approved: true,
    rank: 1,
  },
];

export const INTERESTED_PLACE_DATA = [
  {
    id: '1',
    name: '스타벅스 상도점',
    category: '카페',
    rating: '5.0',
    discount: '(~9/30) 중앙대생 할인',
    distance: '걸어서 3분 (0.0km)',
    tags: ['총학생회 제휴', '정치국제학과 제휴'],
    image: 'https://via.placeholder.com/300',
    partnership: '통일공대',
  },
  {
    id: '2',
    name: '투썸플레이스',
    category: '식당',
    rating: '4.5',
    discount: '상시 10% 할인',
    distance: '걸어서 10분 (0.8km)',
    tags: ['중앙대 제휴'],
    image: 'https://via.placeholder.com/300',
    partnership: '통일공대',
  },
  {
    id: '3',
    name: '다른 가게 이름',
    category: '식당',
    rating: '4.5',
    discount: '상시 10% 할인',
    distance: '걸어서 10분 (0.8km)',
    tags: ['중앙대 제휴'],
    image: 'https://via.placeholder.com/300',
    partnership: '통일공대',
  },
];

export const REVIEW_DATA = [
  {
    id: '1',
    rating: 5,
    comment:
      '리뷰는 두 줄까지만 보이게 노출해요! 오른쪽 더보기 누르면 나머지 내용 더 볼 수 있는 구조입니다.!! 나머지 내용을 마저 펼쳐보면 이러케~!~~~!~!~~~!~!~!~!~! \n엄청 길게써도 펼치면\n다 보여요!\n이렇게!!',
    place: '스타벅스 상도점',
    date: '2025-01-01',
  },
];

export const ANNOUNCEMENT_DATA = [
  {
    id: '1',
    title: '캠어스 새로워진 검색을 소개합니다',
    content:
      '안녕하세요 캠어스입니다.\n캠어스의 공지사항이 새로워집니다.\n\n아래 내용을 잘 읽어보세요.',
    isNew: true,
    date: '2025.00.00',
  },
  {
    id: '2',
    title: '캠어스 새로워진 검색을 소개합니다',
    content:
      '안녕하세요 캠어스입니다.\n캠어스의 공지사항이 새로워집니다.\n\n아래 내용을 잘 읽어보세요.',
    isNew: true,
    date: '2025.00.00',
  },
  {
    id: '3',
    title: '캠어스 새로워진 검색을 소개합니다',
    content:
      '안녕하세요 캠어스입니다.\n캠어스의 공지사항이 새로워집니다.\n\n아래 내용을 잘 읽어보세요.',
    isNew: false,
    date: '2025.00.00',
  },
  {
    id: '4',
    title: '캠어스 새로워진 검색을 소개합니다',
    content:
      '안녕하세요 캠어스입니다.\n캠어스의 공지사항이 새로워집니다.\n\n아래 내용을 잘 읽어보세요.',
    isNew: false,
    date: '2025.00.00',
  },
  {
    id: '5',
    title: '캠어스 새로워진 검색을 소개합니다',
    content:
      '안녕하세요 캠어스입니다.\n캠어스의 공지사항이 새로워집니다.\n\n아래 내용을 잘 읽어보세요.',
    isNew: false,
    date: '2025.00.00',
  },
];

export const PAST_QUERY_DATA = [
  {
    id: '1',
    title: '문의 카테고리1',
    category: 1,
    content: '문의 내용은 다음과 같습니다.\n좋은 하루 되세요.감사합니다.',
    date: '2025.00.00',
    answerStatus: true,
    answer:
      '안녕하세요.캠어스입니다.\n답변 내용은 다음과 같습니다.\n좋은 하루 되세요.감사합니다. ',
    answeredDate: '2025.00.00',
  },
  {
    id: '2',
    title: '문의 카테고리2',
    category: 2,
    content: '문의 내용은 다음과 같습니다.\n좋은 하루 되세요.감사합니다.',
    date: '2025.00.00',
    answerStatus: false,
    answer:
      '안녕하세요.캠어스입니다.\n답변 내용은 다음과 같습니다.\n좋은 하루 되세요.감사합니다. ',
    answeredDate: '2025.00.00',
  },
  {
    id: '3',
    title: '문의 카테고리3',
    category: 3,
    content: '문의 내용은 다음과 같습니다.\n좋은 하루 되세요.감사합니다.',
    date: '2025.00.00',
    answerStatus: false,
    answer:
      '안녕하세요.캠어스입니다.\n답변 내용은 다음과 같습니다.\n좋은 하루 되세요.감사합니다. ',
    answeredDate: '2025.00.00',
  },
  {
    id: '4',
    title: '문의 카테고리4',
    category: 4,
    content: '문의 내용은 다음과 같습니다.\n좋은 하루 되세요.감사합니다.',
    date: '2025.00.00',
    answerStatus: true,
    answer:
      '안녕하세요.캠어스입니다.\n답변 내용은 다음과 같습니다.\n좋은 하루 되세요.감사합니다. ',
    answeredDate: '2025.00.00',
  },
];

// 학생회 제휴 장소 검색 더미 데이터
export const AFFILIATION_PLACE_SEARCH_DATA = [
  {
    id: '1',
    placeName: '스타벅스 상도점',
    placeAddress: '서울 동작구 안양로 11 2층',
    distance: '0.0km',
  },
  {
    id: '2',
    placeName: '투썸플레이스 상도점',
    placeAddress: '서울 동작구 안양로 11 2층',
    distance: '0.8km',
  },
  {
    id: '3',
    placeName: '맥도날드 상도점',
    placeAddress: '서울 동작구 안양로 11 2층',
    distance: '0.8km',
  },
  {
    id: '4',
    placeName: '버거킹 상도점',
    placeAddress: '서울 동작구 안양로 11 2층',
    distance: '0.8km',
  },
  {
    id: '5',
    placeName: '빅브로짐 상도점',
    placeAddress: '서울 동작구 안양로 11 2층',
    distance: '0.8km',
  },
  {
    id: '6',
    placeName: '수아르떼 상도점',
    placeAddress: '서울 동작구 안양로 11 2층',
    distance: '0.8km',
  },
];
