import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef } from 'react';
import colors from '../../style/colors';
import typography from '../../style/typography';
import LabelTitle from '../../components/LabelTitle';
import PlaceHolderImage from '../../../assets/blankImage.svg';
import LikeIcon from '../../../assets/Liked.svg';
import UnLikeIcon from '../../../assets/Unliked.svg';
import ShareIcon from '../../../assets/share.svg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 375,
    borderRadius: 0,
    paddingHorizontal: 0,
  },
  detailImage: {
    height: 375,
    resizeMode: 'cover',
    borderRadius: 0,
  },
  placeholderWrapper: {
    width: '100%',
    height: 375,
    borderRadius: 0,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gray[250],
  },
  dotActive: {
    backgroundColor: colors.gray[500],
  },
  detailInfoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  topLayer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.heading4,
  },
  buttonWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AffiliationDetailScreen = ({ navigation, route }) => {
  const [isLiked, setIsLiked] = useState(false);

  const { width } = useWindowDimensions();
  const detailImages = route.params?.item?.detailImages || [];
  const isEmpty = detailImages.length === 0;

  // 빈 배열일 경우 5개 placeholder 이미지 생성
  const displayImages = isEmpty ? Array(5).fill(null) : detailImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LabelTitle
        title="총학생회 제휴"
        navigation={navigation}
        useBackButton={true}
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ width: '100%' }}>
          <FlatList
            ref={flatListRef}
            data={displayImages}
            horizontal
            pagingEnabled
            style={{ marginTop: 20 }}
            contentContainerStyle={{ paddingHorizontal: 0 }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={[styles.imageContainer, { width }]}>
                {isEmpty ? (
                  <PlaceHolderImage
                    width={width}
                    height={375}
                    preserveAspectRatio="none"
                  />
                ) : (
                  <Image
                    source={{ uri: item }}
                    style={[styles.detailImage, { width }]}
                  />
                )}
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        </View>
        <View style={styles.dotContainer}>
          {displayImages.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.dotActive]}
            />
          ))}
        </View>
        <View style={styles.detailInfoContainer}>
          <View style={styles.topLayer}>
            <Text style={styles.title}>{route.params?.item?.title}</Text>
            <View style={styles.buttonWrapper}>
              <Pressable
                style={styles.button}
                onPress={() => setIsLiked(!isLiked)}
              >
                <LikeIcon
                  width={18}
                  height={18}
                  color={isLiked ? colors.orange[500] : colors.gray[300]}
                />
              </Pressable>
              <Pressable style={styles.button}>
                <ShareIcon width={18} height={18} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AffiliationDetailScreen;
