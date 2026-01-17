import api from './axiosInstance';
import useAuthStore from '../store/authStore';

//  제휴 리뷰 작성 ( post /reviews/patnership/{placeId} )
export const createReview = async (placeId, reviewData) => {
  console.log('placeId', placeId);
  try {
    const accessToken = useAuthStore.getState().accessToken;
    console.log('accessToken', accessToken);
    const response = await api.post(
      `/reviews/partnership/${placeId}`,
      reviewData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('response', response);
    //   return response.data;
    return { success: true, data: response.data.data };
  } catch (error) {
    console.log('error', error.response);
    return { success: false, data: null };
  }
};

// 비제휴 리뷰 작성 ( post /reviews )
export const createNoPartnerReview = async (reviewData) => {
  console.log('reviewData', reviewData);
  try {
    const accessToken = useAuthStore.getState().accessToken;
    console.log('accessToken', accessToken);
    const response = await api.post('/reviews', reviewData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('response', response);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.log('error', error.response);
    return { success: false, data: null };
  }
};
// ocr 요청 (post reviews/receipt-ocr)

// export const requestOcr = async (image, placeId) => {
//   console.log('placeId', placeId);
//   try {
//     const accessToken = useAuthStore.getState().accessToken;

//     const formData = new FormData();
//     formData.append('file', {
//       uri: image,
//       name: 'receipt.jpg',
//       type: 'image/jpeg',
//     });

//     const requestBody = {
//       placeId: placeId,
//     };

//     formData.append(
//       'request',
//       new Blob([JSON.stringify(requestBody)], { type: 'application/json' })
//     );

//     const response = await api.post('/reviews/receipt-ocr', formData, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         // 'Content-Type': 'multipart/form-data',
//       },
//     });

//     console.log('response', response);
//     return true;
//   } catch (error) {
//     console.log('error', error.response);
//     return false;
//   }
// };

export const requestOcr = async (image, placeId) => {
  try {
    const accessToken = useAuthStore.getState().accessToken;

    const formData = new FormData();

    // 1️⃣ 파일
    formData.append('file', {
      uri: image,
      name: 'receipt.jpg',
      type: 'image/jpeg',
    });

    // 2️⃣ placeId를 직접 추가 (🔥 핵심)
    formData.append('placeId', String(placeId));
    // 또는 Number(placeId).toString()

    const response = await api.post('/reviews/receipt-ocr', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Content-Type 직접 지정 ❌
      },
      timeout: 30000,
    });

    console.log('response', response);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.log('error', error.response?.data || error);
    return { success: false, data: null };
  }
};

// 제휴 매장 둘러보기  ( get /reviews/partnership-list )

export const getPartnershipList = async ({ lat, lon }) => {
  try {
    const accessToken = useAuthStore.getState().accessToken;
    const response = await api.get('/reviews/partnership-list', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        lat: lat,
        lng: lon,
      },
    });
    console.log('response', response);
    return response;
    // return { success: true, data: response.data.data };
  } catch (error) {
    console.log('error', error.response);
  }
};

export const getReviewList = async (
  placeId,
  cursorCreatedAt = null,
  cursorId = null,
  size = 10
) => {
  try {
    const token = useAuthStore.getState().accessToken;

    const params = {
      size,
    };

    if (cursorCreatedAt) params.cursorCreatedAt = cursorCreatedAt;
    if (cursorId) params.cursorId = cursorId;

    const response = await api.get(`/reviews/list/${placeId}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('리뷰 목록 조회 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('리뷰 목록 조회 실패:', error);
    throw error;
  }
};

// 내가 쓴 리뷰 조회  ( get /reviews/mine)

export const getMyReviewList = async () => {
  try {
    const token = useAuthStore.getState().accessToken;
    const response = await api.get('/reviews/mine', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('response', response);
    return response;
  } catch (error) {
    console.error('내가 쓴 리뷰 조회 실패:', error);
    throw error;
  }
};
