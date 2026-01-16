import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../../components/LabelTitle';
import StoreListItem from '../../components/common/StoreListItem';
import theme from '../../style';
import typography from '../../style/typography';
import colors from '../../style/colors';
import DUMMY_STORE from '../../constants/StoreData';
import { StatusBar } from 'react-native/types_generated/index';

const ScanConfirmScreen = ({ route }) => {
  const navigation = useNavigation();
  const [dateYear, setDateYear] = useState(null);
  const [dateMonth, setDateMonth] = useState(null);
  const [dateDay, setDateDay] = useState(null);

  const { storeData, ocrResult } = route.params;

  useEffect(() => {
    console.log('ocrResult', ocrResult);
    setDateYear(ocrResult?.paymentDate.slice(0, 4));
    setDateMonth(ocrResult?.paymentDate.slice(5, 7));
    setDateDay(ocrResult?.paymentDate.slice(8, 10));
  }, [ocrResult]);

  const IS_ALREADY_REGISTERED = false;

  // const storeData = DUMMY_STORE;

  const renderSuccessView = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.yearText}>{dateYear}년</Text>
      <Text style={styles.dateText}>
        {dateMonth}월 {dateDay}일
      </Text>

      <View style={styles.cardWrapper}>
        <StoreListItem
          item={storeData}
          showImages={false}
          showDiscountDetail={true}
          onPress={() => {}}
        />
      </View>

      <Text style={styles.guideText}>
        이용한 제휴 내용이 맞는지 확인해주세요.
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.buttonGray]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonTextGray}>아니요, 달라요</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]}
          onPress={() => {
            console.log('리뷰 작성 화면으로 이동');
            navigation.navigate('WriteReviewScreen', { store: storeData });
          }}
        >
          <Text style={styles.buttonTextWhite}>네, 맞아요</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDuplicateView = () => (
    <View style={styles.contentContainer}>
      <Text style={styles.yearText}>2021년 10월 10일</Text>

      <Text style={styles.duplicateTitle}>
        이미 리뷰가 작성된{'\n'}영수증이에요!
      </Text>

      {/* [TODO] ReviewListScreen 컴포넌트화 후 적용 필요 */}
      <View style={styles.reviewPreview}>
        <View style={styles.starRow}>
          {[...Array(5)].map((_, i) => (
            <Ionicons
              key={i}
              name="star"
              size={14}
              color={theme.colors.primary2}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.reviewContent} numberOfLines={2}>
              떡볶이 정말 양 많아요. 아 근데 스벅이네...
            </Text>
            <Text style={styles.reviewMeta}>
              {storeData.name}{' '}
              <Text style={{ color: colors.gray[300] }}>|</Text> 21.10.10
            </Text>
          </View>
          <View style={styles.reviewImagePlaceholder} />
        </View>
      </View>

      <View style={styles.spacer} />

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={[styles.fullButton, styles.buttonBlue]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonTextWhite}>다른 영수증 촬영하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.textButton}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.textButtonLabel}>다음에 하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <LabelTitle
        title="리뷰 작성"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />

      {IS_ALREADY_REGISTERED ? renderDuplicateView() : renderSuccessView()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  yearText: {
    ...typography.body2Regular,
    color: colors.gray[500],
  },
  dateText: {
    ...typography.heading2,
    color: theme.colors.text,
    marginBottom: 20,
  },

  cardWrapper: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.blue[400],
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
    ...theme.shadows.level1,
    marginBottom: 12,
  },
  guideText: {
    ...typography.caption1Regular,
    color: theme.colors.textDim,
  },
  buttonRow: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGray: {
    backgroundColor: colors.blue[100],
  },
  buttonBlue: {
    backgroundColor: colors.blue[400],
  },
  buttonTextGray: {
    color: colors.blue[600],
    ...typography.heading6,
  },
  buttonTextWhite: {
    color: colors.gray['000'],
    ...typography.heading6,
  },

  duplicateTitle: {
    ...typography.heading2,
    color: theme.colors.text,
    marginBottom: 20,
  },
  reviewPreview: {
    paddingVertical: 20,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 2,
  },
  reviewContent: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewMeta: {
    fontSize: 12,
    color: colors.gray[400],
  },
  reviewImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
  },
  spacer: {
    flex: 1,
  },
  bottomButtons: {
    paddingBottom: 30,
  },
  fullButton: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  textButton: {
    alignItems: 'center',
    padding: 10,
  },
  textButtonLabel: {
    color: theme.colors.textDim,
    ...typography.heading6,
  },
});

export default ScanConfirmScreen;
