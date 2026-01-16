import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import GiftIcon from '../../../assets/icons/gift.svg';
import StampFilledImage from '../../../assets/images/stamp/stamp_filled.png';
import StampVariantImage from '../../../assets/images/stamp/stamp_variant.png';
import PencilIcon from '../../../assets/icons/pencil.svg';

import theme from '../../style';
import typography from '../../style/typography';
import colors from '../../style/colors';

const StampItem = ({ index, currentStampCount }) => {
  const isStamped = index <= currentStampCount;
  const isLast = index === 10;

  return (
    <View style={styles.stampSlot}>
      {isStamped ? (
        <Image source={StampFilledImage} style={styles.stampImage} />
      ) : isLast ? (
        <View style={styles.stampEmptyContainer}>
          <Image source={StampVariantImage} style={styles.stampImage} />
          <View style={styles.iconOverlay}>
            <GiftIcon width={24} height={24} color={colors.gray[400]} />
          </View>
        </View>
      ) : (
        <View style={styles.stampEmptyContainer}>
          <Image source={StampVariantImage} style={styles.stampImage} />
          <Text style={styles.stampNumber}>{index}</Text>
        </View>
      )}
    </View>
  );
};

const HorizontalLine = () => <View style={styles.dottedLineHorizontal} />;

const StampBoard = ({ onPressReview, stampCount }) => {
  const currentStampCount = stampCount % 10;

  return (
    <View style={styles.whiteCard}>
      <View style={styles.snakeContainer}>
        <View style={styles.row}>
          <StampItem index={1} currentStampCount={currentStampCount} />
          <HorizontalLine />
          <StampItem index={2} currentStampCount={currentStampCount} />
          <HorizontalLine />
          <StampItem index={3} currentStampCount={currentStampCount} />
        </View>

        <View style={styles.connectorRight}>
          <View style={styles.diagonalLineLeft} />
        </View>

        <View style={styles.row}>
          <StampItem index={7} currentStampCount={currentStampCount} />
          <HorizontalLine />
          <StampItem index={6} currentStampCount={currentStampCount} />
          <HorizontalLine />
          <StampItem index={5} currentStampCount={currentStampCount} />
          <HorizontalLine />
          <StampItem index={4} currentStampCount={currentStampCount} />
        </View>

        <View style={styles.connectorLeft}>
          <View style={styles.diagonalLineLeft} />
        </View>

        <View style={styles.row}>
          <StampItem index={8} currentStampCount={currentStampCount} />
          <HorizontalLine />
          <StampItem index={9} currentStampCount={currentStampCount} />
          <HorizontalLine />
          <StampItem index={10} currentStampCount={currentStampCount} />
        </View>
      </View>

      <TouchableOpacity style={styles.reviewButton} onPress={onPressReview}>
        <PencilIcon width={16} height={16} color={colors.blue[600]} />
        <Text style={styles.reviewButtonText}>리뷰 쓰고 스탬프 받기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  whiteCard: {
    width: '90%',
    backgroundColor: theme.colors.background,
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 10,
    ...theme.shadows.level1,
    alignSelf: 'center',
  },
  snakeContainer: {
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  dottedLineHorizontal: {
    width: 20,
    height: 1,
    borderWidth: 1,
    borderColor: colors.blue[250],
    borderStyle: 'dashed',
    borderRadius: 1,
  },
  stampSlot: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  stampImage: {
    width: 68,
    height: 68,
    resizeMode: 'contain',
  },
  stampEmptyContainer: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  stampNumber: {
    position: 'absolute',
    zIndex: 2,
    ...typography.body3Regular,
    fontWeight: '600',
    color: colors.gray[400],
  },
  iconOverlay: {
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectorRight: {
    height: 40,
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: 28,
    marginTop: -10,
    marginBottom: -10,
    zIndex: 0,
  },
  connectorLeft: {
    height: 40,
    width: '100%',
    alignItems: 'flex-start',
    paddingLeft: 10,
    marginTop: -10,
    marginBottom: -10,
    zIndex: 0,
  },
  diagonalLineLeft: {
    width: 60,
    height: 1,
    borderWidth: 1,
    borderColor: colors.blue[250],
    borderStyle: 'dashed',
    transform: [{ rotate: '60deg' }, { translateX: 20 }],
  },
  reviewButton: {
    backgroundColor: theme.colors.primary1Light,
    borderRadius: 16,
    paddingVertical: 15,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewButtonText: {
    color: colors.blue[600],
    ...typography.heading6,
    marginLeft: 8,
  },
});

export default StampBoard;
