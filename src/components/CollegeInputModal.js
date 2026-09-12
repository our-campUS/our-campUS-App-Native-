import { View, Text, StyleSheet, Pressable } from 'react-native';
import typography from '../style/typography';
import colors from '../style/colors';
import CloseIcon from '../../assets/proicons_cancel.svg';
import Input from './Input';
import collegeList from '../constants/collegeList';
import { searchCollege } from '../api/signUp';
import { useState } from 'react';

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#00000099',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderRadius: 15,
    marginHorizontal: 20,
    width: '90%',
    height: 454,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 20,
    height: 60,
  },
  headerTitle: {
    ...typography.heading6,
    color: colors.gray[850],
  },
  headerCloseButton: {
    width: 24,
    height: 24,
  },
  headerCloseButtonIcon: {
    width: 18,
    height: 18,
  },
  mainContent: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 30,
    paddingVertical: 40,
    gap: 16,
  },
});

const CollegeInputModal = ({
  onClose,
  onSelect,
  universityId,
  isOrange = false,
}) => {
  const [dropdownData, setDropdownData] = useState([]);
  return (
    <View style={styles.layout}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>단과대학 검색하기</Text>
          <Pressable style={styles.headerCloseButton} onPress={onClose}>
            <CloseIcon style={styles.headerCloseButtonIcon} />
          </Pressable>
        </View>
        <View style={styles.mainContent}>
          <Input
            isOrange={isOrange}
            useMagnifyingGlass={true}
            useDropDown={true}
            dropdownData={dropdownData}
            onChangeText={async (text) => {
              const result = await searchCollege(universityId, text);
              if (result && text.length > 0) {
                setDropdownData(result);
              }
            }}
            onSelectDropdownItem={(selectedCollege) => {
              onSelect(selectedCollege);
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default CollegeInputModal;
