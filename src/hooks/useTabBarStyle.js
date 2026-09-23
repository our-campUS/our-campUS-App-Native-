import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '../style/colors';

const useTabBarStyle = () => {
  const insets = useSafeAreaInsets();

  const base = {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.common.white,
  };

  if (Platform.OS === 'ios') {
    return { ...base, height: 91, marginBottom: 10 };
  }

  // 숫자 height를 주면 bottom-tabs가 하단 inset을 더하지 않아 직접 더함 (Android edge-to-edge)
  return { ...base, height: 91 + insets.bottom };
};

export default useTabBarStyle;
