import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

const CELL_SIZE = 16;
const COLOR_LIGHT = '#FAFAFA';
const COLOR_DARK = '#F0F0F0';

const CheckerboardPlaceholder = ({
  width,
  height,
  borderRadius = 0,
  style,
}) => {
  const isPercentWidth = typeof width === 'string';
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const resolvedWidth = isPercentWidth ? measuredWidth : width;

  const rows = useMemo(() => {
    if (!resolvedWidth || !height) return null;

    const numCols = Math.ceil(resolvedWidth / CELL_SIZE);
    const numRows = Math.ceil(height / CELL_SIZE);
    const result = [];

    for (let r = 0; r < numRows; r++) {
      const cells = [];
      for (let c = 0; c < numCols; c++) {
        const isDark = (r + c) % 2 === 1;
        cells.push(
          <View
            key={c}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: isDark ? COLOR_DARK : COLOR_LIGHT,
            }}
          />,
        );
      }
      result.push(
        <View key={r} style={styles.row}>
          {cells}
        </View>,
      );
    }
    return result;
  }, [resolvedWidth, height]);

  const handleLayout = isPercentWidth
    ? (e) => setMeasuredWidth(e.nativeEvent.layout.width)
    : undefined;

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        { width, height, borderRadius },
        style,
      ]}
    >
      {rows}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
});

export default CheckerboardPlaceholder;
