import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import LabelTitle from '../../components/LabelTitle';
import StoreListItem from '../../components/common/StoreListItem';
import theme from '../../style';
import typography from '../../style/typography';
import colors from '../../style/colors';

const DUMMY_STORES = [
  {
    id: 1,
    name: '스타벅스 상도역점',
    category: '카페',
    rating: 5.0,
    reviewCount: 120,
    discount: '중앙대생 할인',
    partnerTags: ['통일공대 제휴', '화학공학과 제휴'],
    images: [],
    isFavorite: true,
  },
  {
    id: 2,
    name: '한신포차 상도역점',
    category: '주점',
    rating: 4.8,
    partnerTags: ['통일공대 제휴', '화학공학과 제휴'],
    discount: '중앙대생 할인',
    isFavorite: false,
  },
  {
    id: 3,
    name: '명동국수 상도역점',
    category: '한식',
    rating: 4.5,
    partnerTags: ['통일공대 제휴', '화학공학과 제휴'],
    discount: '중앙대생 할인',
    isFavorite: false,
  },
  {
    id: 4,
    name: '도담헤어 상도역점',
    category: '미용실',
    rating: 5.0,
    partnerTags: ['통일공대 제휴', '화학공학과 제휴'],
    discount: '중앙대생 할인',
    isFavorite: true,
  },
];

const SelectStoreScreen = () => {
  const navigation = useNavigation();
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const handleNext = () => {
    if (selectedStoreId) {
      // TODO: OCR 미구현 - 스탬프/스캔 플로우 복구 시 아래 주석 해제 (iOS 심사 차단 항목, #165)
      // navigation.navigate('CameraScanScreen', { storeId: selectedStoreId });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ marginBottom: 20 }}>
        <LabelTitle
          title="리뷰 작성"
          useBackButton={true}
          onPressBack={() => navigation.goBack()}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.pageTitle}>어떤 매장의 제휴를 이용하셨나요?</Text>

        {DUMMY_STORES.map((store) => {
          const isSelected = selectedStoreId === store.id;

          return (
            <TouchableOpacity
              key={store.id}
              onPress={() => setSelectedStoreId(store.id)}
              activeOpacity={0.9}
              style={[
                styles.cardWrapper,
                isSelected && styles.cardWrapperSelected,
              ]}
            >
              <View pointerEvents="none">
                <StoreListItem
                  item={store}
                  showImages={false}
                  showDiscountDetail={true}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedStoreId
              ? styles.nextButtonActive
              : styles.nextButtonDisabled,
          ]}
          disabled={!selectedStoreId}
          onPress={handleNext}
        >
          <Text
            style={[
              styles.nextButtonText,
              selectedStoreId ? styles.textActive : styles.textDisabled,
            ]}
          >
            선택 완료
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 80,
  },
  pageTitle: {
    ...typography.heading4,
    color: theme.colors.text,
    marginBottom: 24,
  },

  cardWrapper: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.gray[250],
    marginBottom: 12,
    backgroundColor: theme.colors.background,
    ...theme.shadows.level1,
    overflow: 'hidden',
  },
  cardWrapperSelected: {
    borderColor: colors.blue[400],
    borderWidth: 2,
    backgroundColor: theme.colors.background,
  },

  bottomButtonContainer: {
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  nextButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextButtonActive: {
    backgroundColor: colors.blue[400],
  },
  nextButtonDisabled: {
    backgroundColor: colors.blue[100],
  },
  nextButtonText: {
    ...typography.heading6,
  },
  textActive: {
    color: colors.gray['000'],
  },
  textDisabled: {
    color: theme.colors.textWhite,
  },
});

export default SelectStoreScreen;
