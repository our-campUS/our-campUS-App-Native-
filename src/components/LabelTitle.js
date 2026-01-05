import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../style/colors';
import typography from '../style/typography';
import { Pressable } from 'react-native';
import BackIcon from '../../assets/back.svg';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // backgroundColor: 'red',
    paddingHorizontal: 20,
    // justifyContent: 'center',
    marginTop: 45,
    position: 'relative',
  },
  title: {
    ...typography.heading6,
    color: colors.gray[700],
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  backButton: {
    width: 14,
    height: 28,
    justifySelf: 'flex-start',
    marginRight: 'auto',
  },
});

const LabelTitle = ({
  navigation,
  title,
  additionalStyle = null,
  onPressBack,
  useBackButton = false,
}) => {
  return (
    <View style={[styles.container, additionalStyle]}>
      {useBackButton && (
        <Pressable
          onPress={() => {
            if (onPressBack) {
              onPressBack();
            } else if (navigation) {
              navigation.goBack();
            }
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ padding: 5, zIndex: 1 }}
        >
          {/* <Text style={styles.backButton}>{'<'}</Text> */}
          <BackIcon width={20} height={10} />
        </Pressable>
      )}
      <Text style={styles.title} pointerEvents="none">
        {title}
      </Text>
    </View>
  );
};

export default LabelTitle;
