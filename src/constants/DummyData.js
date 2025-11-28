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
