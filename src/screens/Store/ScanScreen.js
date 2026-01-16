import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../../style';
import colors from '../../style/colors';
import FlipCameraIcon from '../../../assets/icons/flip_camera.png';

const { width } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;

const CameraScanScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('CameraScanScreenTest');
    }, 1500);
  }, [navigation]);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleCapture = () => {
    console.log('OCR 요청 시작');
    navigation.navigate('ScanConfirmScreen', {
      //실제로는 OCR 결과값
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <View style={styles.cameraPreviewPlaceholder}>
        <Text style={{ color: '#333' }}>Camera Preview Area</Text>
      </View>

      <SafeAreaView style={styles.overlayContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerArea}>
          <Text style={styles.guideText}>
            제휴를 이용한 가게의 사업자 정보와{'\n'}
            결제정보가 잘 나오게 찍어주세요
          </Text>

          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        <View style={styles.bottomControl}>
          <TouchableOpacity style={styles.subButton}>
            <View style={styles.galleryPlaceholder}>
              <Ionicons name="image" size={24} color={colors.gray[400]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCapture} activeOpacity={0.9}>
            <LinearGradient
              colors={[colors.blue[300], colors.orange[200]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.shutterOuter}
            >
              <View style={styles.shutterInner} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.subButton}>
            <Image
              source={FlipCameraIcon}
              style={{ width: 36, height: 36, tintColor: 'white' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraPreviewPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  topBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    alignItems: 'flex-end',
    height: 60,
    justifyContent: 'center',
  },
  closeButton: {
    padding: 8,
  },

  centerArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    fontWeight: '500',
  },
  scanFrame: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE * 1.4,
    position: 'relative',
  },

  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'white',
    borderWidth: 0,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },

  bottomControl: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  subButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666',
  },

  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
  },
});

export default CameraScanScreen;
