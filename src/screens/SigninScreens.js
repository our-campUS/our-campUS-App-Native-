import { View, Text, StyleSheet } from 'react-native';
import useForm from 'react-hook-form';
import colors from '../style/colors';

const styles = StyleSheet.create({
  statusBar: {
    heiht: 5,
    width: '100%',
    flexDirection: 'row',
  },
});

const SigninScreens = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <View>
      <View style={[styles.statusBar]}>
        <View
          style={{ backgroundColor: colors.orange[500], width: '20%' }}
        ></View>
        <View style={{ backgroundColor: white, width: '80%' }}></View>
      </View>
      {/* <Text>SigninScreens</Text> */}
    </View>
  );
};
