import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CloseIcon from '../../../assets/icons/common/close.svg';
import theme from '../../style';
import typography from '../../style/typography';

const TRANSPARENT = 'transparent';

const LocationTooltip = ({ text, onClose, arrowDirection = 'right', gap = 12 }) => {
  const arrowStyle =
    arrowDirection === 'right'
      ? styles.arrowRight
      : styles.arrowLeft;

  return (
    <View style={styles.wrapper}>
      {arrowDirection === 'left' && <View style={arrowStyle} />}
      <View style={[styles.tooltip, { gap }]}>
        {Array.isArray(text) ? (
          <View style={styles.textContainer}>
            {text.map((line, i) => (
              <Text key={i} style={styles.tooltipText}>{line}</Text>
            ))}
          </View>
        ) : (
          <Text style={styles.tooltipText}>{text}</Text>
        )}
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.closeButton}
        >
          <CloseIcon width={5} height={5} color={theme.colors.primary1} />
        </TouchableOpacity>
      </View>
      {arrowDirection === 'right' && <View style={arrowStyle} />}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    flexShrink: 1,
  },
  tooltip: {
    backgroundColor: theme.colors.primary1Light,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  tooltipText: {
    ...typography.caption2Regular,
    color: theme.colors.primary1,
  },
  closeButton: {
    padding: 2,
  },
  arrowRight: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 8,
    borderTopColor: TRANSPARENT,
    borderBottomColor: TRANSPARENT,
    borderLeftColor: theme.colors.primary1Light,
    marginLeft: -2,
  },
  arrowLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 8,
    borderTopColor: TRANSPARENT,
    borderBottomColor: TRANSPARENT,
    borderRightColor: theme.colors.primary1Light,
    marginRight: -2,
  },
});

export default LocationTooltip;
