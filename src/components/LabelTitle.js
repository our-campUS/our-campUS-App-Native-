import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Platform,
} from 'react-native';
import colors from '@style/colors';
import typography from '@style/typography';
import BackButton from '@components/common/BackButton';

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 20,
    // justifyContent: 'center',
    // marginTop: 45,
    ...(Platform.OS === 'ios' && {
      marginTop: 70,
    }),
    position: 'relative',
  },
  title: {
    ...typography.heading6,
    color: colors.gray[700],
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    // marginRight: -10,
  },
  backButton: {
    width: 14,
    height: 28,
    justifySelf: 'flex-start',
    marginRight: 'auto',
  },
  rightButton: {
    position: 'absolute',
    right: 10,
    // padding:
    zIndex: 1,
    alignItems: 'center',
  },
  rightButtonText: {
    ...typography.body3Regular,
    color: colors.orange[500],
  },
  titleWithIcon: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  titleInline: {
    ...typography.heading6,
    color: colors.gray[700],
    flexShrink: 1,
  },
});

const LabelTitle = ({
  navigation,
  title,
  titleIcon = null,
  additionalStyle = null,
  onPressBack,
  useBackButton = false,
  useRightButton = false,
  onPressRight = null,
  rightButtonText = null,
  rightButtonTextStyle = null,
}) => {
  return (
    <View style={[styles.container, additionalStyle]}>
      {useBackButton && (
        <BackButton
          onPress={() => {
            if (onPressBack) {
              onPressBack();
            } else if (navigation) {
              navigation.goBack();
            }
          }}
        />
      )}
      {titleIcon ? (
        <View style={styles.titleWithIcon} pointerEvents="none">
          {titleIcon}
          <Text style={styles.titleInline} numberOfLines={1}>{title}</Text>
        </View>
      ) : (
        <Text style={styles.title} pointerEvents="none">
          {title}
        </Text>
      )}
      {useRightButton && (
        <Pressable onPress={onPressRight} style={styles.rightButton}>
          <Text style={[styles.rightButtonText, rightButtonTextStyle]}>
            {rightButtonText}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default LabelTitle;
