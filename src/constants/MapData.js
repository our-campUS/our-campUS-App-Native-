import PartnerIcon from '../../assets/icons/category/shake.svg';
import CafeIcon from '../../assets/icons/category/cafe.svg';
import RestarauntICon from '../../assets/icons/category/restaraunt.svg';
import PubICon from '../../assets/icons/category/pub.svg';
import StoreICon from '../../assets/icons/category/store.svg';
import PinIcon from '../../assets/icons/search-list/pin.svg';
import HeartIcon from '../../assets/icons/search-list/heart.svg';
import SearchIcon from '../../assets/icons/search-list/search.svg';
import theme from '../style';

export const CATEGORIES = [
  {
    id: 'PARTNER',
    label: '제휴',
    IconComponent: PartnerIcon,
    defaultColor: theme.colors.primary1,
  },
  {
    id: 'CAFE',
    label: '카페',
    IconComponent: CafeIcon,
    defaultColor: '#FFCB05',
  },
  {
    id: 'FOOD',
    label: '식당',
    IconComponent: RestarauntICon,
    defaultColor: '#B3ED76',
  },
  {
    id: 'PUB',
    label: '술집',
    IconComponent: PubICon,
    defaultColor: '#FF9805',
  },
  {
    id: 'STORE',
    label: '편의점',
    IconComponent: StoreICon,
    defaultColor: '#B686F3',
  },
];

export const SEARCH_TYPE = {
  STORE: 'STORE',
  KEYWORD: 'KEYWORD',
  LIKE: 'LIKE',
};

export const SEARCH_ICON_CONFIG = {
  [SEARCH_TYPE.STORE]: {
    Component: PinIcon,
  },
  [SEARCH_TYPE.FAVORITE]: {
    Component: HeartIcon,
  },
  [SEARCH_TYPE.KEYWORD]: {
    Component: SearchIcon,
  },
};

// Dummy
export const RECENT_SEARCHES = [
  { id: 1, text: '스타벅스 상도역 1호점', type: SEARCH_TYPE.STORE },
  { id: 2, text: '통일 공대 제휴', type: SEARCH_TYPE.KEYWORD },
  { id: 3, text: '스타벅스 상도역 2호점', type: SEARCH_TYPE.FAVORITE },
];

export const SEARCH_RESULTS = [
  {
    id: 1,
    name: '스타벅스 상도역 1호점',
    category: 'CAFE',
    address: '걸어서 4분',
    distance: '0.0km',
    rating: 5.0,
    type: 'PARTNER',
    partnership: '사회과학대학',
    discount: '(-9/30) 중앙대생 할인',
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    id: 2,
    name: '스타벅스 상도역 2호점',
    category: 'CAFE',
    address: '걸어서 5분',
    distance: '150m',
    rating: 4.8,
    type: 'STORE',
    partnership: null,
    latitude: 37.567,
    longitude: 126.98,
  },
];
