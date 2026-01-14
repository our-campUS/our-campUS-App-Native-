const shadows = {
  small: {
    // iOS 속성
    shadowColor: '#B1B8BE',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,

    // Android 속성
    elevation: 2,
  },

  level2: {
    // iOS
    // shadowColor: '#888', //임의 수정
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowOpacity: 0.7,
    // shadowRadius: 3,
    shadowColor: 'rgb(225, 228, 230)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,

    // Android
    elevation: 20,
  },
};

export default shadows;
