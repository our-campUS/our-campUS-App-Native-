import {
  TextInput,
  StyleSheet,
  View,
  Text,
  Platform,
  Pressable,
} from 'react-native';
import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
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
      disabled = false,
      additionalStyle = {},
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState('');

    // 내부에서 항상 사용할 실제 TextInput ref
    const innerRef = useRef(null);

    // 부모가 ref를 넘겨줬다면, TextInput의 실제 ref를 그대로 노출
    useImperativeHandle(ref, () => innerRef.current, []);

    const focusInput = () => {
      if (innerRef.current) {
        innerRef.current.focus();
      }
    };

    return (
      <View style={styles.container}>
        {useTitle && <Text style={styles.title}>{title}</Text>}
        <Pressable
          style={[
            styles.inputWrapper,
            isFocused && styles.focused,
            additionalStyle,
          ]}
          disabled={disabled}
          onPress={focusInput}
        >
          <View>
            <TextInput
              style={[
                styles.input,
                Platform.OS === 'ios' && { paddingBottom: 8 },
              ]}
              ref={innerRef}
              placeholder={placeholder}
              placeholderTextColor={colors.gray[400]}
              placeholderStyle={typography.body3Regular}
              returnKeyType={returnKeyType}
              value={value}
              editable={!disabled}
              onChangeText={(text) => setValue(text)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
          {useMagnifyingGlass && (
            <MagnifyingGlass
              style={styles.magnifyingGlass}
              pointerEvents="none"
            />
          )}
        </Pressable>
      </View>
    );
  }
);

export default Input;
