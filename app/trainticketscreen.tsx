import { useLanguage } from '@/contexts/LanguageContext';
import { Heebo_500Medium } from '@expo-google-fonts/heebo';
import {
    Inter_200ExtraLight,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
} from '@expo-google-fonts/inter';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Simple train icon (reusing plane style but more generic)
function TrainIcon({ width = 24, height = 25 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 20L6 22M20 20L18 22M4 6C4 3.79086 5.79086 2 8 2H16C18.2091 2 20 3.79086 20 6V15C20 17.2091 18.2091 19 16 19H8C5.79086 19 4 17.2091 4 15V6Z"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 14H16M8 10H16"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Info Icon SVG (same as boarding screen)
function InfoIcon({ width = 25, height = 24 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
      <Path
        d="M12.5 0C15.8152 0 18.9946 1.26428 21.3388 3.51472C23.683 5.76515 25 8.8174 25 12C25 15.1826 23.683 18.2348 21.3388 20.4853C18.9946 22.7357 15.8152 24 12.5 24C9.18479 24 6.00537 22.7357 3.66117 20.4853C1.31696 18.2348 0 15.1826 0 12C0 8.8174 1.31696 5.76515 3.66117 3.51472C6.00537 1.26428 9.18479 0 12.5 0ZM14.3749 7.36747C15.3034 7.36747 16.0569 6.74866 16.0569 5.83158C16.0569 4.91451 15.3016 4.29569 14.3749 4.29569C13.4464 4.29569 12.6964 4.91451 12.6964 5.83158C12.6964 6.74866 13.4464 7.36747 14.3749 7.36747ZM14.7016 17.0131C14.7016 16.8297 14.7677 16.3531 14.7302 16.0823L13.2624 17.7039C12.9589 18.0107 12.5786 18.2233 12.4 18.1667C12.319 18.1381 12.2513 18.0827 12.2091 18.0104C12.1668 17.9381 12.1529 17.8537 12.1697 17.7724L14.6159 10.3535C14.8159 9.41247 14.2659 8.55367 13.1 8.44397C11.8697 8.44397 10.0591 9.64217 8.9574 11.1626C8.9574 11.3443 8.92169 11.7969 8.95918 12.0677L10.4251 10.4444C10.7287 10.141 11.0822 9.92672 11.2608 9.985C11.3488 10.0153 11.4209 10.0775 11.4616 10.1583C11.5023 10.2391 11.5084 10.3319 11.4786 10.417L9.05382 17.7999C8.77348 18.6638 9.3038 19.5106 10.5894 19.7026C12.4821 19.7026 13.5999 18.5335 14.7034 17.0131H14.7016Z"
        fill="white"
      />
    </Svg>
  );
}

// Grid Icon SVG for button (same as boarding screen)
function GridIcon({ width = 18, height = 18 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 18" fill="none">
      <Path
        d="M10 8H18V0H10V8ZM0 18H8V10H0V18ZM0 8H8V0H0V8ZM10 18H18V10H10V18Z"
        fill="white"
      />
    </Svg>
  );
}

export default function TrainTicketScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [showQR, setShowQR] = useState(false);

  const [fontsLoaded] = useFonts({
    'Inter-Black': Inter_900Black,
    'Inter-ExtraLight': Inter_200ExtraLight,
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Heebo-Medium': Heebo_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ImageBackground
        source={require('@/assets/images/train.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('trainTicket.title')}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Section with Route */}
            <View style={styles.topSection}>
              {/* Departure and Arrival */}
              <View style={styles.routeContainer}>
                <View style={styles.airportContainer}>
                  <Text style={styles.airportCode}>JED</Text>
                  <Text style={styles.airportName}>{t('trainTicket.jeddah')}</Text>
                </View>

                <View style={styles.flightPathContainer}>
                  <View style={styles.dashedLine} />
                  <View style={styles.planeIconContainer}>
                    <TrainIcon width={24} height={25} />
                  </View>
                  <Text style={styles.durationText}>4h 30m {t('trainTicket.direct')}</Text>
                </View>

                <View style={styles.airportContainer}>
                  <Text style={styles.airportCode}>MKK</Text>
                  <Text style={styles.airportName}>{t('trainTicket.makkah')}</Text>
                </View>
              </View>

              {/* Date and Info */}
              <View style={[styles.dateContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={styles.dateText}>{t('trainTicket.date')}</Text>
                <View style={styles.infoIconContainer}>
                  <InfoIcon width={25} height={24} />
                </View>
              </View>
            </View>

            {/* Bottom White Card */}
            <View style={styles.bottomCard}>
              {/* Passenger Section */}
              <View style={styles.passengerSection}>
                <Text style={styles.passengerLabel}>{t('trainTicket.passenger')}</Text>
                <Text style={styles.passengerName}>{t('trainTicket.samplePassengerName')}</Text>
              </View>

              {/* Gradient Line */}
              <LinearGradient
                colors={['#B82073', '#1B131F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientLine}
              />

              {/* Ticket Details Grid */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t('trainTicket.coach')}</Text>
                    <Text style={styles.detailValue}>C3</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t('trainTicket.berth')}</Text>
                    <Text style={styles.detailValue}>14A</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t('trainTicket.trainNo')}</Text>
                    <Text style={styles.detailValue}>HJ204</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t('trainTicket.seat')}</Text>
                    <Text style={styles.detailValue}>12</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t('trainTicket.departureTime')}</Text>
                    <Text style={styles.detailValue}>06:14</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t('trainTicket.class')}</Text>
                    <Text style={styles.detailValue}>{t('trainTicket.economy')}</Text>
                  </View>
                </View>
              </View>

              {/* Button */}
              <TouchableOpacity style={styles.button} onPress={() => setShowQR(true)}>
                <LinearGradient
                  colors={['#B82073', '#1B131F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <GridIcon width={18} height={18} />
                  <Text style={styles.buttonText}>{t('trainTicket.showTicket')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* QR Overlay */}
          {showQR && (
            <View style={styles.qrOverlay}>
              <View style={styles.qrHeader}>
                <TouchableOpacity onPress={() => setShowQR(false)} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.qrTitle}>{t('trainTicket.qrTicketTitle')}</Text>
                <View style={styles.headerSpacer} />
              </View>
              <View style={styles.qrContent}>
                {/* Reuse boarding QR style size */}
                <Svg width={280} height={280} viewBox="0 0 85 85" fill="none">
                  <Path d="M31.875 0H0V31.875H31.875V0ZM26.5625 26.5625H5.3125V5.3125H26.5625V26.5625Z" fill="white" />
                  <Path d="M10.625 10.625H21.25V21.25H10.625V10.625ZM0 85H31.875V53.125H0V85ZM5.3125 58.4375H26.5625V79.6875H5.3125V58.4375Z" fill="white" />
                  <Path d="M10.625 63.75H21.25V74.375H10.625V63.75ZM53.125 0V31.875H85V0H53.125ZM79.6875 26.5625H58.4375V5.3125H79.6875V26.5625Z" fill="white" />
                  <Path d="M63.75 10.625H74.375V21.25H63.75V10.625ZM10.625 37.1875H0V47.8125H15.9375V42.5H10.625V37.1875ZM37.1875 47.8125H47.8125V58.4375H37.1875V47.8125ZM15.9375 37.1875H26.5625V42.5H15.9375V37.1875ZM47.8125 63.75H37.1875V69.0625H42.5V74.375H47.8125V69.0625V63.75ZM31.875 37.1875V42.5H26.5625V47.8125H37.1875V37.1875H31.875ZM42.5 21.25H47.8125V31.875H42.5V21.25ZM47.8125 42.5V47.8125H58.4375V37.1875H42.5V42.5H47.8125ZM37.1875 31.875H42.5V37.1875H37.1875V31.875ZM47.8125 74.375H58.4375V85H47.8125V74.375ZM37.1875 74.375H42.5V85H37.1875V74.375ZM47.8125 58.4375H53.125V63.75H47.8125V58.4375ZM47.8125 15.9375V5.3125H42.5V0H37.1875V21.25H42.5V15.9375H47.8125ZM63.75 74.375H69.0625V85H63.75V74.375ZM63.75 63.75H74.375V69.0625H63.75V63.75ZM58.4375 69.0625H63.75V74.375H58.4375V69.0625ZM53.125 63.75H58.4375V69.0625H53.125V63.75ZM74.375 53.125V58.4375H79.6875V63.75H85V53.125H79.6875H74.375ZM79.6875 69.0625H74.375V85H85V74.375H79.6875V69.0625ZM53.125 53.125V58.4375H69.0625V47.8125H58.4375V53.125H53.125ZM63.75 37.1875V42.5H74.375V47.8125H85V37.1875H74.375H63.75Z" fill="white" />
                </Svg>
              </View>
            </View>
          )}
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 8,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 0,
  },
  airportContainer: {
    alignItems: 'center',
    flex: 0,
  },
  airportCode: {
    fontSize: 23,
    fontFamily: 'Inter-Black',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  airportName: {
    fontSize: 12,
    fontFamily: 'Inter-ExtraLight',
    color: '#FFFFFF',
  },
  flightPathContainer: {
    width: 143,
    alignItems: 'center',
    marginHorizontal: 0,
    position: 'relative',
    height: 40,
  },
  dashedLine: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
  },
  planeIconContainer: {
    marginBottom: 8,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginTop: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomCard: {
    width: SCREEN_WIDTH,
    height: 390,
    position: 'absolute',
    left: 0,
    top: 390,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  passengerSection: {
    marginBottom: 16,
  },
  passengerLabel: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#878787',
    marginBottom: 8,
  },
  passengerName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#212529',
  },
  gradientLine: {
    height: 2,
    marginBottom: 20,
    borderRadius: 1,
  },
  detailsGrid: {
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#878787',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#212529',
  },
  button: {
    width: 353,
    height: 55,
    alignSelf: 'center',
    borderRadius: 1000,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Heebo-Medium',
    color: '#FFFFFF',
  },
  qrOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-start',
  },
  qrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 16,
  },
  qrTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  qrContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});








