import { useLanguage } from '@/contexts/LanguageContext';
import { PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Magnetometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COMPASS_SIZE = SCREEN_WIDTH * 0.75;
const KAABA_LAT = 21.4225; // Kaaba coordinates
const KAABA_LON = 39.8262;

// Calculate Qibla direction from current location
function calculateQiblaDirection(lat: number, lon: number): number {
  const lat1 = (lat * Math.PI) / 180;
  const lon1 = (lon * Math.PI) / 180;
  const lat2 = (KAABA_LAT * Math.PI) / 180;
  const lon2 = (KAABA_LON * Math.PI) / 180;

  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;
  return bearing;
}

// Kaaba Icon Component
function KaabaIcon({ size = 40 }: { size?: number }) {
  return (
    <View style={[styles.kaabaIcon, { width: size, height: size }]}>
      <View style={styles.kaabaBase} />
      <View style={styles.kaabaTop} />
      <View style={styles.kaabaDoor} />
    </View>
  );
}

export default function QiblaScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
  });

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [qiblaBearing, setQiblaBearing] = useState(0);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [angleToQibla, setAngleToQibla] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);

  const compassRotation = useRef(new Animated.Value(0)).current;
  const glowAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkLocationPermission();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (hasLocationPermission && location) {
      const bearing = calculateQiblaDirection(location.lat, location.lon);
      setQiblaBearing(bearing);
    }
  }, [location, hasLocationPermission]);

  useEffect(() => {
    if (hasLocationPermission) {
      startCompass();
    }
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [hasLocationPermission]);

  useEffect(() => {
    // Calculate angle between device heading and Qibla direction
    const angle = ((qiblaBearing - deviceHeading + 360) % 360);
    setAngleToQibla(angle);
    
    // Animate compass rotation based on angle to Qibla
    Animated.spring(compassRotation, {
      toValue: -angle,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [deviceHeading, qiblaBearing]);

  // Breathing animation for compass glow
  useEffect(() => {
    const animate = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    animate.start();
    return () => animate.stop();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
      setHasLocationPermission(true);
      getCurrentLocation();
    } else {
      setShowPermissionModal(true);
    }
  };

  const requestLocationPermission = async () => {
    setShowPermissionModal(false);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setHasLocationPermission(true);
      getCurrentLocation();
    }
  };

  const getCurrentLocation = async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        lat: loc.coords.latitude,
        lon: loc.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const startCompass = () => {
    if (Magnetometer.setUpdateInterval) {
      Magnetometer.setUpdateInterval(100);
    }
    
    const sub = Magnetometer.addListener(({ x, y, z }) => {
      // Calculate heading from magnetometer data
      // atan2 gives angle in radians, convert to degrees
      let heading = Math.atan2(y, x) * (180 / Math.PI);
      
      // Convert to 0-360 range
      heading = (heading + 360) % 360;
      setDeviceHeading(heading);
    });
    setSubscription(sub);
  };

  const getRotationInstruction = () => {
    if (angleToQibla <= 5 || angleToQibla >= 355) {
      return t('qibla.facingQibla');
    }
    if (angleToQibla <= 180) {
      return isRTL 
        ? `قم بتدوير هاتفك ${Math.round(angleToQibla)}° إلى اليمين`
        : `Rotate your phone ${Math.round(angleToQibla)}° to the right`;
    } else {
      return isRTL
        ? `قم بتدوير هاتفك ${Math.round(360 - angleToQibla)}° إلى اليسار`
        : `Rotate your phone ${Math.round(360 - angleToQibla)}° to the left`;
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  // Qibla marker should be positioned at the top of the compass (0 degrees)
  // and rotate based on the difference between device heading and Qibla bearing
  const qiblaMarkerAngle = ((qiblaBearing - deviceHeading + 360) % 360);

  return (
    <LinearGradient
      colors={['#FFE7F2', '#FFF9FD']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.wrapper}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header - clean, floating back button and centered title */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#1B131F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('qibla.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Compass Container with Blurred Pink Background */}
          <View style={styles.compassContainer}>
            <Animated.View
              style={[
                styles.compassGlow,
                {
                  opacity: glowAnimation.interpolate({
                    inputRange: [1, 1.2],
                    outputRange: [0.3, 0.5],
                  }),
                  transform: [{ scale: glowAnimation }],
                },
              ]}
            />
            
            {/* Kaaba marker fixed at top */}
            <View style={styles.qiblaMarkerFixed}>
              <KaabaIcon size={28} />
              <View style={styles.qiblaTriangle} />
            </View>

              <View style={styles.compassCircle}>
                {/* Compass Ring with Directions */}
                <View style={styles.compassRing}>
                  {/* Cardinal Directions */}
                  <Text style={[styles.directionLabel, styles.directionNorth]}>N</Text>
                  <Text style={[styles.directionLabel, styles.directionEast]}>E</Text>
                  <Text style={[styles.directionLabel, styles.directionSouth]}>S</Text>
                  <Text style={[styles.directionLabel, styles.directionWest]}>W</Text>
                  
                  {/* Intermediate Dots */}
                  {[45, 135, 225, 315].map((angle) => (
                    <View
                      key={angle}
                      style={[
                        styles.intermediateDot,
                        {
                          transform: [
                            { rotate: `${angle}deg` },
                            { translateY: -(COMPASS_SIZE / 2 - 8) },
                          ],
                        },
                      ]}
                    />
                  ))}
                </View>

                {/* Pink middle pin (needle) with compass image */}
                <Animated.View
                  style={[
                    styles.centerNeedleWrapper,
                    {
                      transform: [
                        {
                          rotate: compassRotation.interpolate({
                            inputRange: [-360, 0, 360],
                            outputRange: ['-360deg', '0deg', '360deg'],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Image
                    source={require('@/assets/images/right-arrow.png')}
                    style={styles.arrowImage}
                    resizeMode="contain"
                  />
                  <View style={styles.centerDot} />
                </Animated.View>
              </View>
          </View>

          {/* Angle Display */}
          <View style={styles.angleContainer}>
            <Text style={styles.angleValue}>{Math.round(angleToQibla)}°</Text>
            <Text style={styles.angleLabel}>{t('qibla.deviceAngle')}</Text>
          </View>

          {/* Instruction Bar */}
          <View style={styles.instructionBar}>
            <LinearGradient
              colors={['rgba(184, 32, 115, 0.18)', 'rgba(184, 32, 115, 0.08)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.instructionGradient}
            >
              <Text style={styles.instructionText}>
                {hasLocationPermission ? getRotationInstruction() : t('qibla.enableLocationToFind')}
              </Text>
            </LinearGradient>
          </View>
        </View>
      </SafeAreaView>

      {/* Location Permission Modal */}
      <Modal
        visible={showPermissionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPermissionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="location" size={48} color="#B82073" />
            </View>
            <Text style={styles.modalTitle}>{t('qibla.enableLocation')}</Text>
            <Text style={styles.modalDescription}>
              {t('qibla.locationDescription')}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonOutline}
                onPress={() => setShowPermissionModal(false)}
              >
                <Text style={styles.modalButtonOutlineText}>{t('qibla.notNow')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={requestLocationPermission}
              >
                <LinearGradient
                  colors={['#B82073', '#1B131F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalButtonGradient}
                >
                  <Text style={styles.modalButtonPrimaryText}>{t('qibla.allow')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B131F',
    fontFamily: 'PlusJakartaSans-SemiBold',
    letterSpacing: 0.6,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  compassContainer: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  compassGlow: {
    position: 'absolute',
    width: COMPASS_SIZE + 40,
    height: COMPASS_SIZE + 40,
    borderRadius: (COMPASS_SIZE + 40) / 2,
    backgroundColor: '#B82073',
    shadowColor: '#B82073',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10,
  },
  compassCircle: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 2,
    borderColor: 'rgba(184, 32, 115, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B82073',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  compassRing: {
    position: 'absolute',
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
  },
  directionLabel: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: '700',
    color: '#1B131F',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  directionNorth: {
    top: 8,
    left: COMPASS_SIZE / 2 - 9,
  },
  directionEast: {
    right: 8,
    top: COMPASS_SIZE / 2 - 12,
  },
  directionSouth: {
    bottom: 8,
    left: COMPASS_SIZE / 2 - 9,
  },
  directionWest: {
    left: 8,
    top: COMPASS_SIZE / 2 - 12,
  },
  intermediateDot: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#8A5A6B',
    top: COMPASS_SIZE / 2,
    left: COMPASS_SIZE / 2,
  },
  qiblaMarker: {
    position: 'absolute',
    top: -15,
    left: COMPASS_SIZE / 2 - 10,
    alignItems: 'center',
  },
  qiblaMarkerFixed: {
    position: 'absolute',
    top: 6,
    left: COMPASS_SIZE / 2 - 14,
    alignItems: 'center',
    zIndex: 10,
  },
  qiblaMarkerContainer: {
    alignItems: 'center',
  },
  qiblaTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#B82073',
    marginTop: 2,
  },
  compassNeedle: {
    position: 'absolute',
    width: 10,
    height: COMPASS_SIZE * 0.4,
    justifyContent: 'flex-start',
  },
  centerNeedleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowImage: {
    width: 28,
    height: COMPASS_SIZE * 0.5,
    marginBottom: 6,
  },
  centerDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FF8FBF',
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    shadowColor: '#B82073',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  kaabaIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  kaabaBase: {
    width: 16,
    height: 12,
    backgroundColor: '#1B131F',
    borderRadius: 2,
  },
  kaabaTop: {
    width: 12,
    height: 8,
    backgroundColor: '#8A5A6B',
    borderRadius: 1,
    marginTop: -4,
    alignSelf: 'center',
  },
  kaabaDoor: {
    width: 4,
    height: 8,
    backgroundColor: '#B82073',
    borderRadius: 1,
    marginTop: -8,
    alignSelf: 'center',
  },
  angleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  angleValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1B131F',
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 8,
  },
  angleLabel: {
    fontSize: 14,
    color: '#77798A',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  instructionBar: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  instructionGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  instructionText: {
    fontSize: 16,
    color: '#1B131F',
    fontFamily: 'PlusJakartaSans-SemiBold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(184, 32, 115, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B131F',
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 15,
    color: '#77798A',
    fontFamily: 'PlusJakartaSans-Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButtonOutline: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonOutlineText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#77798A',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  modalButtonPrimary: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});

