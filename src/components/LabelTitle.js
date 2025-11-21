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
    paddingHorizontal: 20,
    // justifyContent: 'center',
    marginTop: 45,
  },
  title: {
    ...typography.heading6,
    color: colors.gray[700],
    marginHorizontal: 'auto',
  },
  backButton: {
    width: 14,
    height: 7,
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
        <Pressable onPress={onPressBack}>
          <Text style={styles.backButton}>{'<'}</Text>
        </Pressable>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default LabelTitle;
