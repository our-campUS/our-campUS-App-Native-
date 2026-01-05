export const DUMMY_STORE = {
  id: 1,
  name: '스타벅스 상도점',
  category: '카페',
  isPartner: true,
  partnerTags: ['통일공대 제휴', '화학공학과 제휴'],
  rating: 5.0,
  reviewCount: 128,
  address: '서울특별시 동작구 흑석로 84 (1층)',
  phone: '1234-5678',
  hours: ['평일 10:00 - 21:00', '주말 10:00 - 21:00'],
  reviews: [
    {
      id: 1,
      rating: 5,
      content: '떡볶이 정말 양 많아요. 아 근데 스벅이네...',
      date: '21.10.10',
      user: '최서*',
    },
    {
      id: 2,
      rating: 3,
      content:
        '사진 없이 리뷰를 길게 쓰면 이렇게 텍스트가 길어질 거예요 아마도...',
      date: '21.10.10',
      user: '김다*',
    },
    {
      id: 3,
      rating: 4,
      content: '맛있어요 냠냠',
      date: '21.10.11',
      user: '박지*',
    },
  ],
};

export default DUMMY_STORE;
