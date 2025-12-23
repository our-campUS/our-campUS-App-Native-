import PartnerIcon from '../assets/icons/category/partner.svg';
import CafeIcon from '../assets/icons/category/cafe.svg';
import RestarauntICon from '../assets/icons/category/restaraunt.svg';
import PubICon from '../assets/icons/category/pub.svg';
import StoreICon from '../assets/icons/category/store.svg';
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
    label: '음식점',
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
  FAVORITE: 'FAVORITE',
};

// Dummy
export const RECENT_SEARCHES = [
  { id: 1, text: '스타벅스 상도역 1호점', type: SEARCH_TYPE.STORE },
  { id: 2, text: '통일 공대 제휴', type: SEARCH_TYPE.KEYWORD },
  { id: 3, text: '스타벅스 상도역 2호점', type: SEARCH_TYPE.FAVORITE },
];
