import api from './axiosInstance';
import useAuthStore from '../store/authStore';

export const getAddressFromCoords = async (latitude, longitude) => {
  try {
    const token = useAuthStore.getState().accessToken;

    const response = await api.get('/places', {
      params: {
        lat: latitude,
        lng: longitude,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = response.data?.response?.result?.[0];

    if (result) {
      return {
        text: result.text,
        structure: result.structure,
      };
    }
    return null;
  } catch (error) {
    console.error('주소 변환 실패:', error);
    return null;
  }
};
// api/place.js

export const getPartnerships = async ({
  lat,
  lng,
  cursor = null,
  size = 5,
}) => {
  console.log('aaaaaaaa');
  try {
    const token = useAuthStore.getState().accessToken;

    console.log('👉 [API 요청] getPartnerships 파라미터:', {
      lat,
      lng,
      cursor,
      size,
    });

    if (!lat || !lng) {
      console.warn('⚠️ 위도/경도 값이 없어 요청을 중단합니다.');
      return null;
    }

    const params = {
      lat: lat,
      lng: lng,
      size: size || 5,
    };

    if (cursor) {
      params.cursor = cursor;
    }

    const response = await api.get('/places/partnership', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('✅ 제휴 리스트 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      '❌ 제휴 리스트 조회 실패:',
      error.response?.data || error.message
    );
    return null;
  }
};

export const getMapMarkers = async (minLat, maxLat, minLng, maxLng) => {
  try {
    const token = useAuthStore.getState().accessToken;

    console.log('bbbbbb');

    const response = await api.get('/places/partnership/map', {
      params: {
        minLat,
        maxLat,
        minLng,
        maxLng,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.code === 200) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('지도 마커 조회 실패:', error);
    return [];
  }
};

export const getPartnershipDetail = async (postId, lat, lng) => {
  try {
    const token = useAuthStore.getState().accessToken;

    console.log('cccccccc');

    const response = await api.get('/places/partnership/detail', {
      params: {
        postId: postId,
        lat: lat,
        lng: lng,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.code === 200) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('상세 정보 조회 실패:', error);
    return null;
  }
};

export const getPlacesByKeyword = async (keyword) => {
  try {
    const token = useAuthStore.getState().accessToken;

    const response = await api.get('/places/search/keyword', {
      params: {
        keyword: keyword,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.code === 200) {
      console.log(response.data.data);
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('키워드 검색 실패:', error);
    return [];
  }
};

export const getPlacesSearch = async (keyword, lat, lng) => {
  try {
    const token = useAuthStore.getState().accessToken;
    console.log('dddddd');

    const response = await api.get('/places/search', {
      params: {
        keyword: keyword,
        lat: lat,
        lng: lng,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.code === 200) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('장소 검색 실패:', error);
    return [];
  }
};

export const getPlacesSearchInfo = async (keyword, lat, lng) => {
  try {
    const token = useAuthStore.getState().accessToken;

    const response = await api.get('/places/search/info', {
      params: {
        keyword: keyword,
        lat: lat,
        lng: lng,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.code === 200) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('장소 검색 실패:', error);
    return [];
  }
};

export const getRandomPlaces = async (lat, lng) => {
  try {
    const token = useAuthStore.getState().accessToken;

    const response = await api.get('/places/random', {
      params: {
        lat: lat,
        lng: lng,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.code === 200) {
      console.log(response.data.data);
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('랜덤 장소 추천 실패:', error);
    return null;
  }
};
