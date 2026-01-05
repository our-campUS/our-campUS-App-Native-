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
import EyeSlashIcon from '../../assets/inputHidden.svg';
import EyeIcon from '../../assets/inputUnhidden.svg';
import ArrowDownIcon from '../../assets/ArrowDown.svg';
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
  error: {
    borderColor: colors.common.error,
  },
  readOnly: {
    // borderColor: colors.blue[300],
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
  timeLimit: {
    ...typography.body3Regular,
    color: colors.gray[400],
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -13 }],
  },
  toggleIconWrapper: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -13 }],
  },
});

const Input = forwardRef(
  (
    {
      autoCapitalize = true,
      title,
      placeholder,
      keyboardType,
      returnKeyType,
      onChangeText,
      onSubmitEditing = null,
      onBlur = null,
      value, // optional controlled value
      useTitle = false,
      useMagnifyingGlass = false,
      disabled = false,
      additionalStyle = {},
      usePopUPModal = false,
      onPressPopUPModal = null,
      useDropDown = false,
      usePassword = false,
      dropdownData = [],
      onSelectDropdownItem = null,
      hasError = false,
      usetimeLimit = false,
      useOnlyNumber = false,
      maxLength,
      usePassWordIcon = false,
      onlyRead = false,
      useToggleIcon = false,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [innerValue, setInnerValue] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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

    // onlyRead일 때 additionalStyle의 backgroundColor를 우선 적용하도록 처리
    const finalAdditionalStyle =
      onlyRead && additionalStyle.backgroundColor
        ? {
            ...additionalStyle,
            backgroundColor: additionalStyle.backgroundColor,
          }
        : additionalStyle;

    return (
      <View style={styles.container}>
        {useTitle && <Text style={styles.title}>{title}</Text>}
        <Pressable
          style={[
            styles.inputWrapper,
            onlyRead && styles.readOnly,
            hasError && styles.error,
            !hasError && isFocused && !onlyRead && styles.focused,
            finalAdditionalStyle,
          ]}
          disabled={disabled || onlyRead}
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
              secureTextEntry={usePassword && !isPasswordVisible}
              placeholderTextColor={colors.gray[400]}
              placeholderStyle={typography.body3Regular}
              returnKeyType={returnKeyType || 'done'}
              keyboardType={useOnlyNumber ? 'number-pad' : keyboardType}
              maxLength={maxLength}
              autoCapitalize="none"
              autoCorrect={false}
              value={isControlled ? value : innerValue}
              editable={!disabled && !usePopUPModal && !onlyRead}
              pointerEvents={onlyRead ? 'none' : 'auto'}
              onChangeText={(text) => {
                // 숫자만 입력받기
                let filteredText = text;
                if (useOnlyNumber) {
                  filteredText = text.replace(/[^0-9]/g, '');
                }

                // maxLength 제한 적용
                if (maxLength && filteredText.length > maxLength) {
                  filteredText = filteredText.slice(0, maxLength);
                }

                if (!isControlled) {
                  setInnerValue(filteredText);
                }
                if (typeof onChangeText === 'function') {
                  onChangeText(filteredText);
                }
              }}
              onSubmitEditing={
                onSubmitEditing && typeof onSubmitEditing === 'function'
                  ? onSubmitEditing
                  : undefined
              }
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                if (onBlur && typeof onBlur === 'function') {
                  onBlur();
                }
              }}
            />
          </View>
          {useMagnifyingGlass && (
            <MagnifyingGlass
              style={styles.magnifyingGlass}
              pointerEvents="none"
            />
          )}
          {usePassWordIcon &&
            (isPasswordVisible ? (
              <Pressable
                style={styles.magnifyingGlass}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <EyeIcon pointerEvents="none" />
              </Pressable>
            ) : (
              <Pressable
                style={styles.magnifyingGlass}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <EyeSlashIcon pointerEvents="none" />
              </Pressable>
            ))}
          {useToggleIcon && (
            <View style={styles.toggleIconWrapper}>
              <ArrowDownIcon width={24} height={24} />
            </View>
          )}
          {usetimeLimit && <Text style={styles.timeLimit}>{timeLimit}</Text>}
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
