import api from './axiosInstance';
import useAuthStore from '../store/authStore';

// 유저 정보 조회 (GET /users)
export async function getUserInfo() {
  try {
    const response = await api.get('users');

    console.log('Get User Info Response:', response.data);

    if (response.data.code === 200 || response.data.code === 0) {
      const { nickname, schoolName, collegeName, majorName } =
        response.data.data;

      useAuthStore.getState().updateUser({
        name: nickname,
        schoolName: schoolName,
        collegeName: collegeName,
        majorName: majorName,
      });

      return response.data.data;
    }
    return false;
  } catch (error) {
    console.error('Get User Info Error:', error);
    return false;
  }
}

// 로그아웃 (POST /jwt/logout)
export const requestLogout = async () => {
  try {
    const response = await api.post('/jwt/logout', null);

    console.log('로그아웃 API 성공:', response.data);
    return true;
  } catch (error) {
    console.error('로그아웃 API 에러 (앱 내 로그아웃 진행):', error);
    return false;
  }
};

// 유저 탈퇴 (PATCH /auth/withdraw/users)
export const withdrawUser = async (nickname) => {
  try {
    const response = await api.patch('/auth/withdraw/users', {
      nickname: nickname,
    });

    if (response.data.code === 200 || response.data.code === 0) {
      console.log('회원탈퇴 성공:', response.data);
      return true;
    }

    console.error('회원탈퇴 실패:', response.data);
    return false;
  } catch (error) {
    console.error('회원탈퇴 에러:', error);
    return false;
  }
};

// 유저 닉네임 수정 (patch /users/change/nickname)
export const editNickname = async (nickname) => {
  try {
    const response = await api.patch('/users/change/nickname', {
      campusNickname: nickname,
    });

    if (response.data.code === 200) {
      console.log('유저 닉네임 수정 성공:', response.data);
      return true;
    }

    console.error('유저 닉네임 수정 실패:', response.data);
    return false;
  } catch (error) {
    console.error('유저 닉네임 수정 에러:', error.response);
    return false;
  }
};

// 유저 관심 제휴글 조회 ( GET /users/student-council/posts/likes)
export const getUserInterestedAffiliatePosts = async () => {
  try {
    const response = await api.get('/users/student-council/posts/likes', {
      params: {
        page: 1,
        size: 10,
        category: 'PARTNERSHIP',
      },
    });
    if (response.data.code === 200 || response.data.code === 0) {
      console.log('유저 관심 제휴글 조회 성공:', response.data);
      return response.data.data.content;
    }
    return false;
  } catch (error) {
    console.error('유저 관심 제휴글 조회 에러:', error.response);
    return false;
  }
};

// 유저 관심 행사글 조회 ( GET /users/student-council/posts/likes)
export const getUserInterestedEventPosts = async () => {
  try {
    const response = await api.get('/users/student-council/posts/likes', {
      params: {
        page: 1,
        size: 10,
        category: 'EVENT',
      },
    });
    if (response.data.code === 200 || response.data.code === 0) {
      console.log('유저 관심 행사글 조회 성공:', response.data);
      return response.data.data.content;
    }
    return false;
  } catch (error) {
    console.error('유저 관심 행사글 조회 에러:', error.response);
    return false;
  }
};

// 유저 프로필 이미지 변경 (PATCH /users/change/profile/image)
export const editProfileImage = async (image) => {
  try {
    const response = await api.patch('/users/change/profile/image', {
      newProfileImage: image,
    });
    if (response.data.code === 200 || response.data.code === 0) {
      console.log('유저 프로필 이미지 변경 성공 api:', response.data);
      console.log(
        '유저 프로필 이미지 변경 성공 response:',
        response.data.data.newProfileImage
      );
      useAuthStore.getState().updateUser({
        profileImage: response.data.data.newProfileImage,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('유저 프로필 이미지 변경 에러:', error.response);
    return false;
  }
};

// 유저 학적 정보 변경 (PATCH /users/change/profile/academic)
export const editAcademicInfo = async (schoolId, majorId) => {
  try {
    const response = await api.patch('/users/change/profile/academic', {
      schoolId: schoolId,
      majorId: majorId,
    });
    if (response.data.code === 200 || response.data.code === 0) {
      console.log('유저 학적 정보 변경 성공 api:', response.data);
      console.log('유저 학적 정보 변경 성공 response:', response.data.data);
      return {
        success: true,
        nextUpdateAvailableDate: response.data.data.nextUpdateAvailableDate,
      };
    }
    return false;
  } catch (error) {
    return false;
  }
};
