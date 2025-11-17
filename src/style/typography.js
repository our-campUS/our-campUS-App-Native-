import { lineHeight, letterSpacing } from './typographyUtils';

const FONT_FAMILY_BASE = 'Pretendard-Regular';
const FONT_FAMILY_BOLD = 'Pretendard-SemiBold';

export const typography = {
  // === Display ===
  display1: {
    fontSize: 44,
    fontWeight: '600',
    lineHeight: lineHeight(44, 132),
    letterSpacing: letterSpacing(44, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },
  display2: {
    fontSize: 32,
    fontWeight: '600',
    lineHeight: lineHeight(32, 132),
    letterSpacing: letterSpacing(32, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },
  display3: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: lineHeight(28, 132),
    letterSpacing: letterSpacing(28, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },

  // === Heading ===
  heading1: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: lineHeight(28, 132),
    letterSpacing: letterSpacing(28, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },
  heading2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: lineHeight(24, 128),
    letterSpacing: letterSpacing(24, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },
  heading3: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: lineHeight(22, 128),
    letterSpacing: letterSpacing(22, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },
  heading4: {
    fontSize: 19,
    fontWeight: '600',
    lineHeight: lineHeight(19, 128),
    letterSpacing: letterSpacing(19, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },
  heading5: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: lineHeight(17, 128),
    letterSpacing: letterSpacing(17, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },
  heading6: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: lineHeight(15, 128),
    letterSpacing: letterSpacing(15, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },

  // === Body ===
  body1Bold: {
    fontSize: 19,
    fontWeight: '600',
    lineHeight: lineHeight(19, 155),
    letterSpacing: letterSpacing(19, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },
  body1Regular: {
    fontSize: 19,
    fontWeight: '400',
    lineHeight: lineHeight(19, 155),
    letterSpacing: letterSpacing(19, -2),
    fontFamily: FONT_FAMILY_BASE,
  },
  body2Bold: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: lineHeight(17, 155),
    letterSpacing: letterSpacing(17, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },
  body2Regular: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: lineHeight(17, 155),
    letterSpacing: letterSpacing(17, -2),
    fontFamily: FONT_FAMILY_BASE,
  },
  body3Bold: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: lineHeight(15, 155),
    letterSpacing: letterSpacing(15, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },
  body3Regular: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: lineHeight(15, 155),
    letterSpacing: letterSpacing(15, -2),
    fontFamily: FONT_FAMILY_BASE,
  },
  body4Bold: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: lineHeight(13, 155),
    letterSpacing: letterSpacing(13, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },
  body4Regular: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: lineHeight(13, 155),
    letterSpacing: letterSpacing(13, -2),
    fontFamily: FONT_FAMILY_BASE,
  },

  // === Caption ===
  caption1Bold: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: lineHeight(12, 126),
    letterSpacing: letterSpacing(12, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },
  caption1Regular: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: lineHeight(12, 126),
    letterSpacing: letterSpacing(12, -2),
    fontFamily: FONT_FAMILY_BASE,
  },
  caption2Bold: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: lineHeight(10, 126),
    letterSpacing: letterSpacing(10, -2),
    fontFamily: FONT_FAMILY_BOLD,
  },
  caption2Regular: {
    fontSize: 10,
    fontWeight: '400',
    lineHeight: lineHeight(10, 126),
    letterSpacing: letterSpacing(10, -2),
    fontFamily: FONT_FAMILY_BASE,
  },
};

export default typography;
