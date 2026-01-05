export const editNickname = async (nickname) => {
  //   const response = await axios.put('/api/profile/nickname', { nickname });
  //   return response.data;

  if (nickname === '최서연') {
    return {
      isValid: false,
      errorType: 'NICKNAME_ALREADY_EXISTS',
    };
  }
  if (nickname.length < 2 || nickname.length > 16) {
    return {
      isValid: false,
      errorType: 'NICKNAME_LENGTH_INVALID',
    };
  }
  return {
    isValid: true,
  };
};
