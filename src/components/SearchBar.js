import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../style';
import colors from '../style/colors';

/**
 * @param {string} value - 입력된 텍스트
 * @param {function} onChangeText - 텍스트 변경 핸들러
 * @param {string} placeholder - 플레이스홀더 텍스트
 * @param {function} onBackPress - 뒤로가기 버튼 클릭 시
 * @param {function} onClearPress - X 버튼 클릭 시
 * @param {boolean} autoFocus - 자동 포커스 여부
 */
const SearchBar = ({
  value,
  onChangeText,
  placeholder,
  onBackPress,
  onClearPress,
  autoFocus = false,
  onSubmit,
}) => {
  return (
    <View style={styles.container}>
      {onBackPress && (
        <TouchableOpacity onPress={onBackPress} style={styles.leftIcon}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textDisabled}
        autoFocus={autoFocus}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />

      <View style={styles.rightIcon}>
        {onBackPress || value ? (
          <TouchableOpacity onPress={onClearPress}>
            <Ionicons name="close" size={24} color={colors.gray[800]} />
          </TouchableOpacity>
        ) : (
          <Ionicons name="search" size={24} color={theme.colors.primary1} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,

    ...theme.shadows.level2,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    color: theme.colors.text,
    ...theme.typography.body3,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default SearchBar;
