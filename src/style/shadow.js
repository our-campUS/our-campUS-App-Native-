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
    shadowColor: '#E1E4E6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 3,

    // Android
    elevation: 5,
  },
};

export default shadows;
