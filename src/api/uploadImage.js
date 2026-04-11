import api from './axiosInstance';
import ImageResizer from 'react-native-image-resizer';

// 이미지 업로드를 위한 url 발급 api (회원가입 전용)
export const getCommonImagePresignedUrl = async (image) => {
  console.log('image', image);
  console.log('imageType', image.type);
  try {
    const response = await api.post('storage/presigned', {
      contentType: image.type,
    });
    console.log('response', response.data.data);
    return response.data.data;
  } catch (error) {
    console.log('❌ Upload Common Image Error:', error);
    return {
      isSuccess: false,
      message:
        error.response?.data?.message ||
        error.message ||
        '이미지 업로드에 실패했습니다.',
    };
  }
};

// 이미지 업로드를 위한 url 발급 api (학생회 전용)
export const getCouncilImagePresignedUrl = async (image) => {
  console.log('image', image);
  console.log('imageType', image.type);
  try {
    const response = await api.post('storage/posts/images/presigned', {
      contentType: image.type,
    });

    console.log('response', response.data.data);
    return response.data.data;
  } catch (error) {
    console.log('❌ Upload Council Image Error:', error);
    console.log('error', error.response);
    return {
      isSuccess: false,
      message:
        error.response?.data?.message ||
        error.message ||
        '이미지 업로드에 실패했습니다.',
    };
  }
};

// png 변환
export const convertToPng = async (asset) => {
  console.log('asset input for convertToPng', asset);
  const result = await ImageResizer.createResizedImage(
    asset.uri,
    asset.width || 1000,
    asset.height || 1000,
    'PNG',
    100
  );

  return {
    uri: result.uri,
    type: 'image/png',
  };
};

// 이미지 업로드
export const uploadImageToPresignedUrl = async (uploadUrl, image) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': image.type, // image/png
    },
    body: {
      uri: image.uri,
      type: image.type,
    },
  });
  console.log('response', response);

  if (!response.ok) {
    throw new Error('이미지 업로드 실패');
  }
};
