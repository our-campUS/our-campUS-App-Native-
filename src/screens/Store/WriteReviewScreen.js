import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LabelTitle from '../../components/LabelTitle';
import theme from '../../style';
import typography from '../../style/typography';
import shadow from '../../style/shadow';
import colors from '../../style/colors';
import RatingIcon from '../../../assets/icons/rating.svg';

const StarItem = ({ filled, onPress, size = 28 }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <RatingIcon
      name="star"
      width={size}
      height={size}
      color={filled ? theme.colors.primary2 : colors.gray[250]}
      style={{ marginHorizontal: 4 }}
    />
  </TouchableOpacity>
);

const WriteReviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const storeName = route.params?.store?.name || '스타벅스 상도역점';

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState([1, 2, 3]);

  const isValid = reviewText.length >= 20 && rating > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    console.log('리뷰 등록 완료', { rating, reviewText });
    navigation.navigate('ReviewResultScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LabelTitle
        title="리뷰 작성"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.storeName}>{storeName}</Text>

          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((score) => (
              <StarItem
                key={score}
                filled={score <= rating}
                onPress={() => setRating(score)}
              />
            ))}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="매장에 대한 솔직한 리뷰를 작성해 주세요."
              placeholderTextColor={colors.gray[400]}
              multiline={true}
              textAlignVertical="top"
              value={reviewText}
              onChangeText={setReviewText}
              maxLength={1000}
            />

            <Text style={[styles.charCount, reviewText.length >= 20]}>
              {reviewText.length === 0
                ? '최소 20자 이상'
                : `${reviewText.length}/1000`}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.photoScroll}
            contentContainerStyle={styles.photoContainer}
          >
            <TouchableOpacity style={styles.addPhotoButton}>
              <View>
                <Ionicons
                  name="camera"
                  size={24}
                  color={theme.colors.primary1}
                />
              </View>
              <Text style={styles.addPhotoText}>사진 촬영하기</Text>
            </TouchableOpacity>

            {photos.map((photo, index) => (
              <View key={index} style={styles.photoItemPlaceholder}>
                <Text style={{ color: colors.gray[400], fontSize: 10 }}>
                  IMG_{index}
                </Text>
              </View>
            ))}
          </ScrollView>
        </ScrollView>

        <View style={styles.bottomButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isValid ? styles.activeButton : styles.disabledButton,
            ]}
            disabled={!isValid}
            onPress={handleSubmit}
          >
            <Text
              style={[
                styles.submitButtonText,
                isValid
                  ? { color: colors.gray[100] }
                  : { color: theme.colors.background },
              ]}
            >
              작성하기
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },

  storeName: {
    ...typography.heading4,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },

  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },

  inputWrapper: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    ...theme.shadows.level2,
    padding: 16,
    height: 180,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    ...typography.body3Regular,
    color: theme.colors.text,
  },
  charCount: {
    ...typography.caption1Regular,
    color: theme.colors.textDisabled,
    textAlign: 'right',
    marginTop: 8,
  },

  photoScroll: {
    flexGrow: 0,
    marginBottom: 20,
  },
  photoContainer: {
    paddingRight: 20,
    gap: 12,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    backgroundColor: theme.colors.primary1Light,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    ...typography.caption2Regular,
    color: colors.gray[500],
  },
  photoItemPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: colors.gray[200],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  bottomButtonWrapper: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    backgroundColor: theme.colors.background,
  },
  submitButton: {
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: colors.blue[400],
  },
  disabledButton: {
    backgroundColor: colors.blue[100],
  },
  submitButtonText: {
    ...typography.heading6,
  },
});

export default WriteReviewScreen;
