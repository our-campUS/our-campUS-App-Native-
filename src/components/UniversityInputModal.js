import { View, Text, StyleSheet, Pressable } from 'react-native';
import theme from '../style';
import CloseIcon from '../../assets/proicons_cancel.svg';
import Input from './Input';
import majorList from '../constants/majorlist';
import { searchUniversity } from '../api/signUp';
import { useState } from 'react';

const styles = StyleSheet.create({
  layout: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
  },
  container: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
    height: 454,
    borderRadius: 15,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 59,
    paddingLeft: 30,
    paddingRight: 27,
  },
  headerTitle: {
    ...theme.typography.heading6,
    color: theme.colors.text,
  },
  headerCloseButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
});

const UniversityInputModal = ({ onClose, onSelect, isOrange = false }) => {
  const [dropdownData, setDropdownData] = useState([]);
  return (
    <View style={styles.layout}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>학교 검색하기</Text>
          <Pressable style={styles.headerCloseButton} onPress={onClose}>
            <CloseIcon width={18} height={18} />
          </Pressable>
        </View>
        <View style={styles.mainContent}>
          <Input
            isOrange={isOrange}
            additionalStyle={{ height: 54 }}
            useMagnifyingGlass={true}
            useDropDown={true}
            useKoreanOnly={true}
            onChangeText={async (text) => {
              const result = await searchUniversity(text);
              if (result && text.length > 0) {
                setDropdownData(result);
              }
              console.log('✅ Dropdown Data:', dropdownData);
              console.log('✅ Dropdown Data Length:', dropdownData.length);
            }}
            dropdownData={dropdownData}
            onSelectDropdownItem={(selectedUniversity) => {
              onSelect(selectedUniversity);
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default UniversityInputModal;
