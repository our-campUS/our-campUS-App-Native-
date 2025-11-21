import {
  TextInput,
  StyleSheet,
  View,
  Text,
  Platform,
  Pressable,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import colors from '../style/colors';
import typography from '../style/typography';
import MagnifyingGlass from '../../assets/input-tool.svg';
import { filterDropdownItems } from '../utils/searchLogic';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // paddingHorizontal: 20,
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
  dropdownContainer: {
    marginTop: 16,
    gap: 8,
    // borderColor: colors.gray[200],
    // backgroundColor: colors.white,
    maxHeight: 5 * 40, // 아이템 최대 5개 높이만큼만 보이게
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: colors.gray[250],
    width: '100%',
    height: 43,
  },
  dropdownItemText: {
    ...typography.body3Regular,
    color: colors.gray[850],
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
      value, // optional controlled value
      useTitle = false,
      useMagnifyingGlass = false,
      disabled = false,
      additionalStyle = {},
      usePopUPModal = false,
      onPressPopUPModal = null,
      useDropDown = false,
      dropdownData = [],
      onSelectDropdownItem = null,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [innerValue, setInnerValue] = useState('');

    const isControlled = value !== undefined;

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
          onPress={() => {
            if (usePopUPModal && typeof onPressPopUPModal === 'function') {
              onPressPopUPModal();
            } else {
              focusInput();
            }
          }}
        >
          <View pointerEvents={usePopUPModal ? 'none' : 'auto'}>
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
              value={isControlled ? value : innerValue}
              editable={!disabled && !usePopUPModal}
              onChangeText={(text) => {
                if (!isControlled) {
                  setInnerValue(text);
                }
                if (typeof onChangeText === 'function') {
                  onChangeText(text);
                }
              }}
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
        {useDropDown && isFocused && dropdownData.length > 0 && (
          <View style={styles.dropdownContainer}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              persistentScrollbar={true} // Android에서 스크롤바 항상 보이게
            >
              {filterDropdownItems(
                dropdownData,
                isControlled ? value || '' : innerValue
              ).map((item) => (
                <Pressable
                  key={item}
                  style={styles.dropdownItem}
                  onPress={() => {
                    if (!isControlled) {
                      setInnerValue(item);
                    }
                    innerRef.current?.blur();
                    Keyboard.dismiss();
                    if (typeof onChangeText === 'function') {
                      onChangeText(item);
                    }
                    if (typeof onSelectDropdownItem === 'function') {
                      onSelectDropdownItem(item);
                    }
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  }
);

export default Input;
