import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import BackButton from '../../../components/common/BackButton';
import CancelIcon from '../../../../assets/proicons_cancel.svg';
import { useState } from 'react';
import {
  AFFILIATION_PLACE_SEARCH_DATA,
  AFFILIATION_PLACE_DATA,
} from '../../../constants/DummyData';
import AffiliatePlaceItem from '../../../components/Council/AffiliatePlaceItem';
import useFormDraftStore from '../../../store/formDraftStore';
import MagnifyingGlass from '../../../../assets/input-tool.svg';
import { searchCouncilAffiliatePlace } from '../../../api/councilAffiliate';
import useAuthStore from '../../../store/authStore';

const SelectPlaceAffiliateScreen = ({ navigation }) => {
  const [affiliationPlaceData, setAffiliationPlaceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { setFormDraft } = useFormDraftStore();
  const { accessToken } = useAuthStore();

  const handleSearch = async () => {
    console.log('handleSearch');
    const response = await searchCouncilAffiliatePlace(
      searchQuery,
      accessToken
    );
    console.log('response at handleSearch', response);
    setAffiliationPlaceData(response.data.data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBarContainer}>
          <BackButton
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <TextInput
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.searchBar}
            placeholder="도로명, 건물명, 번지 검색"
            placeholderTextColor={colors.gray[400]}
            placeholderStyle={styles.placeholderText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Pressable style={styles.cancelButton} onPress={handleSearch}>
            <MagnifyingGlass width={20} height={20} />
          </Pressable>
        </View>
      </View>
      <FlatList
        // data={AFFILIATION_PLACE_SEARCH_DATA}
        data={affiliationPlaceData}
        renderItem={({ item }) => (
          <AffiliatePlaceItem
            item={item}
            onPress={() => {
              setFormDraft({ placeInfo: item });
              navigation.goBack();
            }}
          />
        )}
        keyExtractor={(item) => item.placeKey}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  searchBarWrapper: {
    paddingHorizontal: 20,
    width: '100%',
    height: 48,
    marginTop: 10,
  },
  // searchBar: {
  //   flex: 1,
  //   ...typography.body3Regular,
  //   color: colors.gray[850],
  //   ...(Platform.OS === 'ios' && {
  //     lineHeight: typography.body3Regular.fontSize * 1.4,
  //   }),
  // },
  // searchBar: {
  //   flex: 1,
  //   ...typography.body3Regular,
  //   color: colors.gray[850],
  //   ...(Platform.OS === 'ios'
  //     ? {
  //         lineHeight: typography.body3Regular.fontSize * 1.4,
  //       }
  //     : {
  //         textAlignVertical: 'center',
  //       }),
  // },
  // searchBar: {
  //   flex: 1,
  //   ...typography.body3Regular,
  //   color: colors.gray[850],

  //   ...(Platform.OS === 'ios'
  //     ? {
  //         lineHeight: typography.body3Regular.fontSize * 1.4,
  //       }
  //     : {
  //         textAlignVertical: 'center',
  //         includeFontPadding: false, // 🔥 이게 핵심
  //         paddingVertical: 0, // 🔥 이거 없으면 또 안 보임
  //       }),
  // },
  searchBar: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0, // 🔥
    ...typography.body3Regular,
    color: colors.gray[850],
    ...(Platform.OS === 'ios'
      ? {
          lineHeight: typography.body3Regular.fontSize * 1.25,
        }
      : {
          textAlignVertical: 'center', // 🔥
          includeFontPadding: false, // 🔥
        }),
  },
  // searchBarContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   borderRadius: 10,
  //   paddingVertical: 12,
  //   paddingHorizontal: 16,
  //   boxShadow: '0 0 6px 0 rgba(225, 228, 230, 0.70)',
  // },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 🔥 핵심
    height: 48, // 🔥 핵심
    borderRadius: 10,
    paddingHorizontal: 16, // vertical padding 제거
    boxShadow: '0 0 6px 0 rgba(225, 228, 230, 0.70)',
  },
  placeholderText: {
    ...typography.body3Regular,
    color: colors.gray[400],
  },
  backButton: {
    marginRight: 8,
  },
  cancelButton: {
    width: 20,
    height: 20,
    marginLeft: 'auto',
  },
  flatListContent: {},
});

export default SelectPlaceAffiliateScreen;
