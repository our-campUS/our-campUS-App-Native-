/**
 * line-height % 값 변환
 * @param fontSize
 * @param lineHeightPercent
 * @returns
 */
export const lineHeight = (fontSize, lineHeightPercent) => {
  return (fontSize * lineHeightPercent) / 100;
};

/**
 * letter-spacing % 값 변환
 * @param fontSize
 * @param letterSpacingPercent
 * @returns
 */
export const letterSpacing = (fontSize, letterSpacingPercent) => {
  return (fontSize * letterSpacingPercent) / 100;
};
