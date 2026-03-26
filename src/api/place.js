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
      console.log('✅ 지도 마커 응답:', response.data.data);
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('❌ 지도 마커 조회 실패:', error.response?.data || error.message);
    return [];
  }
};

export const getPartnershipDetail = async (postId, lat, lng) => {
  try {
    const token = useAuthStore.getState().accessToken;

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

    console.log('👉 [API 요청] getPlacesSearch 파라미터:', { keyword, lat, lng });

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

    console.log('✅ 카테고리 검색 응답:', response.data);

    if (response.data.code === 200) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('❌ 장소 검색 실패:', error.response?.data || error.message);
    return [];
  }
};

export const getPlacesSearchInfo = async (keyword, lat, lng) => {
  try {
    const token = useAuthStore.getState().accessToken;

    console.log('👉 [API 요청] getPlacesSearchInfo 파라미터:', { keyword, lat, lng });

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

    console.log('✅ 키워드 검색 응답:', response.data);

    if (response.data.code === 200) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('❌ 장소 검색 실패:', error.response?.data || error.message);
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

export const togglePlaceLike = async (placeData) => {
  try {
    const token = useAuthStore.getState().accessToken;

    const body = {
      placeId: 'backendPlaceId' in placeData ? placeData.backendPlaceId : null,
      placeName: placeData.name || placeData.placeName,
      placeKey: placeData.placeKey,
      address: placeData.address || '',
      category: placeData.category || '기타',
      link: placeData.link || '',
      telephone: placeData.telephone || placeData.phone || '',
      coordinate: {
        latitude: placeData.latitude || placeData.coordinate?.latitude || 0,
        longitude: placeData.longitude || placeData.coordinate?.longitude || 0,
      },
      imgUrls: placeData.imgUrls || [],
    };

    const response = await api.post('/places/like-place', body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.code === 200 || response.data.code === 0) {
      return response.data.data;
    }
    return false;
  } catch (error) {
    console.error('좋아요 요청 실패:', error);
    return false;
  }
};

export const getPlaceStatus = async (placeId, latitude, longitude) => {
  try {
    const token = useAuthStore.getState().accessToken;

    const params = {
      lat: latitude,
      lng: longitude,
    };
    if (placeId) {
      params.placeId = placeId;
    }

    const response = await api.get('/places/detail', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && (response.data.code === 200 || response.data.code === 0)) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    // console.error('장소 상태 조회 실패:', error);
    return null;
  }
};
