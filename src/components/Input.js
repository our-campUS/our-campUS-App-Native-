import { TextInput, StyleSheet, View, Text, Platform } from 'react-native';
import { useState, forwardRef } from 'react';
import colors from '../style/colors';
import typography from '../style/typography';
import MagnifyingGlass from '../../assets/input-tool.svg';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  inputWrapper: {
    position: 'relative',
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    backgroundColor: colors.gray['050'],
    justifyContent: 'center',
  },
  input: {
    paddingVertical: 0,
    paddingHorizontal: 20,
    // flex: 1,
    width: '100%',
    ...typography.body3Regular,
    color: colors.gray[850],
  },
  magnifyingGlass: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -13 }],
    width: 26,
    height: 26,
  },
  title: {
    ...typography.body3Bold,
    color: colors.gray[850],
    marginBottom: 10,
  },
  focused: {
    borderColor: colors.blue[500],
  },
});

const Input = forwardRef(
  (
    {
      title,
      placeholder,
      keyboardType,
      returnKeyType,
      onChangeText,
      useTitle = false,
      useMagnifyingGlass = false,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState('');

    return (
      <View style={styles.container}>
        {useTitle && <Text style={styles.title}>{title}</Text>}
        <View style={[styles.inputWrapper, isFocused && styles.focused]}>
          <TextInput
            style={[
              styles.input,
              Platform.OS === 'ios' && { paddingBottom: 6 },
            ]}
            ref={ref}
            placeholder={placeholder}
            placeholderTextColor={colors.gray[400]}
            placeholderStyle={typography.body3Regular}
            returnKeyType={returnKeyType}
            value={value}
            onChangeText={(text) => setValue(text)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {useMagnifyingGlass && (
            <MagnifyingGlass style={styles.magnifyingGlass} />
          )}
        </View>
      </View>
    );
  }
);

export default Input;
