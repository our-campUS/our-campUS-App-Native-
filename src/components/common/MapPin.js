import React from 'react';
import { View, StyleSheet } from 'react-native';

import BgDefault from '../../../assets/icons/pin-bg/default.svg';
import BgPartner from '../../../assets/icons/pin-bg/partner.svg';
import BgSelected from '../../../assets/icons/pin-bg/selected.svg';

import { CATEGORIES } from '../../constants/MapData';
import theme from '../../style';

const MapPin = ({ type = 'DEFAULT', category }) => {
  let BgComponent;
  let size;
  let iconSize;
  let iconTop;

  switch (type) {
    case 'PARTNER':
      BgComponent = BgPartner;
      size = 30;
      iconSize = 14;
      iconTop = 0;
      break;
    case 'SELECTED':
      BgComponent = BgSelected;
      size = 56;
      iconSize = 24;
      iconTop = -5;
      break;
    case 'DEFAULT':
    default:
      BgComponent = BgDefault;
      size = 22;
      iconSize = 14;
      iconTop = 0;
      break;
  }

  const targetCategory = CATEGORIES.find((cat) => cat.id === category);
  const IconComponent = targetCategory
    ? targetCategory.IconComponent
    : CATEGORIES[1].IconComponent;

  return (
    <View
      collapsable={false}
      style={[styles.container, { width: size, height: size }]}
    >
      <BgComponent width={size} height={size} style={styles.bg} />

      <View style={[styles.iconWrapper, { marginTop: iconTop }]}>
        <IconComponent
          width={iconSize}
          height={iconSize}
          color={theme.colors.background}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: {
    position: 'absolute',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default MapPin;
