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

export const getPartnerships = async ({
  lat,
  lng,
  cursor = null,
  size = 5,
}) => {
  try {
    const token = useAuthStore.getState().accessToken;

    const params = {
      lat,
      lng,
      size,
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

    console.log('제휴 리스트:', response.data);
    return response.data;
  } catch (error) {
    console.error('제휴 리스트 조회 실패:', error);
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
