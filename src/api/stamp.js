import api from './axiosInstance';
import useAuthStore from '../store/authStore';

export const getStamp = async () => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const response = await api.get('/stamps', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('getStamp response', response);
    return response;
  } catch (error) {
    console.error('getStamp error', error.response);
  }
};

export const getPartnershipListStamp = async () => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const response = await api.get('/places/partnership', {
      params: {
        size: 50,
        lat: 37.5570389272802,
        lng: 126.960204232592,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('getPartnershipListStamp response', response);
    return response;
  } catch (error) {
    console.error('getPartnershipListStamp error', error.response);
  }
};
