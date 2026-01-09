import { View, Text, StyleSheet, Image } from 'react-native';
import colors from '../../../style/colors';
import typography from '../../../style/typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import LabelTitle from '../../../components/LabelTitle';
import { useState } from 'react';
import Button from '../../../components/Button';
import ChooseLogoBottomSheet from '../../../components/Council/ChooseLogoBottomSheet';
import useImagePicker from '../../../hooks/useImagePicker';

const SelectAffiliationLogoScreen = ({ navigation, route }) => {
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedLogoType, setSelectedLogoType] = useState(null);
  const isButtonDisabled = !selectedLogo;
  const [isChooseLogoBottomSheetVisible, setIsChooseLogoBottomSheetVisible] =
    useState(false);
  console.log(route.params);

  const { pickImage } = useImagePicker({
    onSelectImages: (images) => {
      if (images && images.length > 0) {
        setSelectedLogo(images[0]);
        setSelectedLogoType('CUSTOM');
      }
    },
    useGallery: true,
    useCamera: false,
    selectionLimit: 1,
  });

  const handleSelectLogo = (logo) => {
    if (logo.type === 'CUSTOM') {
      pickImage();
    } else {
      setSelectedLogo(logo);
      setSelectedLogoType(logo.type);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LabelTitle
        title="제휴 글쓰기"
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <Text style={styles.title}>제휴 업체 로고 등록하기</Text>
        <Text style={styles.description}>
          메인화면에 보여질 매장 로고를 추가해주세요.
        </Text>
        <View style={styles.previewContainer}>
          <View style={styles.previewImageContainer}>
            <Image
              source={
                selectedLogo
                  ? selectedLogoType === 'CUSTOM'
                    ? { uri: selectedLogo.uri }
                    : selectedLogo.image
                  : require('../../../../assets/LogoDefaultImage.png')
              }
              resizeMode="cover"
              style={styles.previewImage}
            />
          </View>
          <View style={styles.previewInfoContainer}>
            <Text style={styles.previewPlaceName}>{route.params.place}</Text>
            <Text style={styles.previewTitle}>{route.params.title}</Text>
          </View>
        </View>
        <Text
          style={styles.applyLogoText}
          onPress={() => setIsChooseLogoBottomSheetVisible(true)}
        >
          로고 이미지 등록하기
        </Text>
        <Button
          title="게시하기"
          isOrange={true}
          disabled={isButtonDisabled}
          style={{
            width: '100%',
            height: 50,
            paddingHorizontal: 10,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.orange[400],
            borderRadius: 10,
            marginTop: 'auto',
          }}
          // onPress={() => navigation.navigate('SelectAffiliationLogoScreen')}
        />
      </View>
      <ChooseLogoBottomSheet
        isVisible={isChooseLogoBottomSheetVisible}
        onClose={() => setIsChooseLogoBottomSheetVisible(false)}
        onSelectCategory={(logo) => handleSelectLogo(logo)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  content: {
    marginTop: 20,
    flex: 1,
    padding: 20,
  },
  title: {
    ...typography.heading4,
    color: colors.gray[850],
  },
  description: {
    ...typography.body3Regular,
    color: colors.gray[800],
  },
  previewContainer: {
    width: '100%',
    marginTop: 24,
    padding: 20,
    flexDirection: 'row',
    gap: 21,
    borderRadius: 14,
    boxShadow: '0 0 6px 0 rgba(225, 228, 230, 0.70)',
  },
  previewImageContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    overflow: 'hidden',
  },
  previewImage: {
    width: 76,
    height: 76,
  },
  previewInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 4,
  },
  previewPlaceName: {
    ...typography.body3Bold,
    color: colors.common.black,
  },
  previewTitle: {
    ...typography.body3Regular,
    color: colors.common.black,
  },
  applyLogoText: {
    ...typography.body4Bold,
    color: colors.orange[500],
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});

export default SelectAffiliationLogoScreen;
