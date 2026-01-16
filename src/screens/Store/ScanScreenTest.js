import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../../style';
import colors from '../../style/colors';
import FlipCameraIcon from '../../../assets/icons/flip_camera.png';
import {
  Camera,
  useCameraDevices,
  useCameraDevice,
} from 'react-native-vision-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import typography from '../../style/typography';

const { width, height } = Dimensions.get('window');
// const SCAN_AREA_SIZE = width * 0.7;
const SCAN_WIDTH = width * 0.72;
const SCAN_HEIGHT = SCAN_WIDTH * 1.4;

const GRADIENT_HEIGHT = 188;
const VISIBLE_START = 40; // 처음에 보이고 싶은 높이 (px)

const CameraScanScreenTest = () => {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const [cameraReady, setCameraReady] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const cameraRef = useRef(null);
  const [mode, setMode] = useState('CAMERA'); // 'CAMERA' | 'PREVIEW'
  const [photoPath, setPhotoPath] = useState(null);
  const device = useCameraDevice('back');

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false, // 🔥 이게 핵심
    });
  }, [navigation]);

  useEffect(() => {
    if (mode === 'PREVIEW') {
      setTimeout(() => {
        navigation.navigate('ScanConfirmScreen');
      }, 3000);
    }
  }, [mode]);

  useEffect(() => {
    console.log('📷 device:', device);
  }, [device]);

  useEffect(() => {
    if (mode !== 'PREVIEW') return;

    scanAnim.setValue(0);

    Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 2600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  }, [mode]);

  useEffect(() => {
    console.log('VisionCamera module:', Camera);
  }, []);

  useEffect(() => {
    const request = async () => {
      const status = await Camera.getCameraPermissionStatus();

      if (status !== 'authorized') {
        const newStatus = await Camera.requestCameraPermission();
        setHasPermission(newStatus === 'authorized');
      } else {
        setHasPermission(true);
      }
    };

    request();
  }, []);
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCameraReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    console.log('❌ X pressed, mode:', mode);
    if (mode === 'PREVIEW') {
      console.log('➡️ preview → camera');
      // 🔥 미리보기 상태 → 다시 촬영 모드로
      setMode('CAMERA');
      setPhotoPath(null);
      scanAnim.stopAnimation(); // 애니메이션 정지
      scanAnim.setValue(0);
    } else {
      console.log('⬅️ go back');
      // 🔥 촬영 화면 → 진짜 뒤로가기
      navigation.goBack();
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePhoto({
      qualityPrioritization: 'quality',
      flash: 'off',
      enableAutoStabilization: true,
    });

    setPhotoPath(`file://${photo.path}`);
    setMode('PREVIEW'); // 🔥 핵심
  };

  return (
    <View style={styles.root}>
      {/* <Camera style={styles.camera} device={device} isActive /> */}
      {mode === 'CAMERA' ? (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          isActive
          photo
        />
      ) : (
        <Image
          source={{ uri: photoPath }}
          style={styles.camera}
          resizeMode="cover"
        />
      )}

      {mode === 'PREVIEW' && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <Animated.View
            style={[
              styles.gradientBarWrapper,
              {
                transform: [
                  {
                    translateY: scanAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-height * 0.4, height * 0.4],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[
                'rgba(125,203,255,0.5)', // 위
                'rgba(125,203,255,0)', // 아래
              ]}
              start={{ x: 0.5, y: 0 }} // 위
              end={{ x: 0.5, y: 1 }} // 아래
              style={styles.scanGradient}
            />
          </Animated.View>
          <Text style={styles.loadingText}>영수증 정보를 인식중입니다.</Text>
        </View>
      )}

      {/* Overlay */}
      <View style={styles.overlay} pointerEvents="box-none">
        <SafeAreaView style={styles.safeArea}>
          {/* Top */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => handleClose()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={40} color="white" />
            </TouchableOpacity>
          </View>

          {/* Center */}
          <View style={styles.centerArea}>
            <Text style={styles.guideText} />
          </View>

          {/* Bottom */}
          {mode === 'CAMERA' && (
            <View style={styles.bottomControl}>
              <TouchableOpacity activeOpacity={0.85} onPress={handleCapture}>
                <View style={styles.shutterOuter}>
                  <View style={styles.shutterInner} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  /* ===== Root ===== */
  root: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },

  /* ===== Overlay ===== */
  overlay: {
    zIndex: 10,
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },

  /* ===== Top ===== */
  topBar: {
    zIndex: 20,
    height: 56,
    paddingHorizontal: 36,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: 8,
    marginTop: 55,
  },

  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ===== Center ===== */
  centerArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    fontWeight: '500',
  },

  /* ===== Scan Frame ===== */
  scanFrame: {
    width: SCAN_WIDTH,
    height: SCAN_HEIGHT,
    position: 'relative',
  },

  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: 'white',
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

  /* ===== Scan Line ===== */
  scanLine: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(0, 255, 150, 0.9)',
  },
  scanGradient: {
    width: '100%',
    height: 188, // 🔥 정확히 188
  },

  /* ===== Bottom ===== */
  bottomControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    marginBottom: 50,
    paddingHorizontal: 24,
  },

  /* ===== Shutter ===== */
  shutterOuter: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
  },

  /* ===== Sub Buttons ===== */
  subButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  blueBar: {
    position: 'absolute',
    width: SCAN_WIDTH * 0.9,
    height: 22,
    borderRadius: 2,
    backgroundColor: '#2F80ED',
    opacity: 0.9,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },

  gradientBarWrapper: {
    position: 'absolute',
    width: '100%', // 🔥 화면 전체 너비
    // alignItems: 'center',
  },

  gradientBar: {
    width: '100%', // 🔥 진짜 풀 너비
    // height: 22, // 두께
    height: height * 0.12,
  },

  loadingText: {
    position: 'absolute',
    bottom: 80,
    color: 'white',
    ...typography.body2Bold,
    // fontSize: 24,
    // fontWeight: '600',
    // lineHeight: 128,
    // letterSpacing: -0.48,
  },
});

export default CameraScanScreenTest;
