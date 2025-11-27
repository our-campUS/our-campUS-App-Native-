import colors from './colors';
import { typography } from './typography';
import shadows from './shadow';

const theme = {
  colors: {
    primary1: colors.blue[500],
    primary1Dark: colors.blue[700],
    primary1Light: colors.blue['050'],

    primary2: colors.orange[500],
    primary2Dark: colors.orange[700],
    primary2Light: colors.orange['050'],

    // 텍스트
    text: colors.gray[850],
    textDim: colors.gray[600],
    textDisabled: colors.gray[400],
    textWhite: colors.common.white,

    // 배경
    background: colors.common.white,
    backgroundSub: colors.gray['050'],

    // 상태
    error: colors.common.error,
    link: colors.common.link,

    // 테두리, 구분선
    border: colors.gray[200],
  },
  typography,
  shadows,
};

export default theme;
