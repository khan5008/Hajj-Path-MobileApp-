import BottomTabs from '@/components/bottom-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Left Side Pentagon Icon SVG
function PentagonIcon({ width = 19, height = 20 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 19 20" fill="none">
      <Path
        d="M17.0995 5.1084L10.6255 1.0884C10.2713 0.867251 9.86208 0.75 9.4445 0.75C9.02691 0.75 8.61771 0.867251 8.2635 1.0884L1.7905 5.1314C1.42245 5.3635 1.13034 5.6982 0.950165 6.09427C0.76999 6.49033 0.709622 6.93045 0.776497 7.3604L2.4465 17.3874C2.53477 17.9123 2.80789 18.3883 3.2165 18.7295C3.62511 19.0706 4.14226 19.2543 4.6745 19.2474H14.2565C14.7889 19.2545 15.3063 19.0709 15.7151 18.7298C16.1239 18.3887 16.3972 17.9125 16.4855 17.3874L18.1555 7.3604C18.2227 6.92255 18.1579 6.4746 17.9695 6.0737C17.781 5.67279 17.4775 5.33709 17.0975 5.1094"
        stroke="#C4C4C4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Right Side Info Icon SVG (grey 'i')
function InfoIcon({ width = 20, height = 20 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 6V10M10 14H10.01"
        stroke="#666"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Circle cx="10" cy="6" r="0.5" fill="#666" />
    </Svg>
  );
}

export default function HajjPermitScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  
  const [fontsLoaded] = useFonts({
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'PlusJakartaSans-Medium': PlusJakartaSans_400Regular, // Using Regular as Medium fallback
  });

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const noticeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!fontsLoaded || !showNoticeModal) return;
    noticeAnim.setValue(0);
    Animated.timing(noticeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showNoticeModal, fontsLoaded, noticeAnim]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7F7" />
      
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#010F0F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('hajjPermit.title')}</Text>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => setShowNoticeModal(true)}
          >
            <Ionicons name="notifications" size={18} color="#14532d" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Green Permit Card */}
          <View style={styles.permitCardContainer}>
            <View style={styles.permitCard}>
              {/* Background Image */}
              <Image
                source={require('@/assets/images/hajj permit.png')}
                style={styles.cardBackgroundImage}
                resizeMode="cover"
              />
              
              {/* Left Side Circle with Pentagon Icon */}
              <View style={styles.leftIconCircle}>
                <View style={styles.leftIconInner}>
                  <PentagonIcon width={19} height={20} />
                </View>
              </View>

              {/* Profile Picture - Circular, Top Center */}
              <View style={styles.profileImageContainer}>
                <Image
                  source={require('@/assets/images/profilepic.png')}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              </View>

              {/* Name - Centered in Middle */}
              <View style={styles.nameContainer}>
                <Text style={styles.nameText}>Faisal Khan</Text>
              </View>

              {/* Text Details - Below Name */}
              <View style={styles.textDetails}>
                <Text style={styles.passportText}>{t('hajjPermit.passportNo')}: X0098765****000</Text>
                <Text style={styles.nationText}>{t('hajjPermit.nation')}: {t('hajjPermit.dubai')}</Text>
                <Text style={styles.permitNoText}>{t('hajjPermit.permitNo')}: 87654321*******23</Text>
              </View>

              {/* Right Side Info Icon Circle */}
              <View style={styles.rightIconCircle}>
                <InfoIcon width={20} height={20} />
              </View>
            </View>
          </View>

          {/* Date row above white card */}
          <View style={[styles.dateRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.dateText}>{t('hajjPermit.date')}</Text>
            <View style={styles.dateInfoIcon}>
              <InfoIcon width={20} height={20} />
            </View>
          </View>

          {/* Permit Details White Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailsContent}>
              <Text style={[styles.detailText, isRTL && { textAlign: 'right' }]}>{t('hajjPermit.type')}: {t('hajjPermit.hajj')}</Text>
              <Text style={[styles.detailText, isRTL && { textAlign: 'right' }]}>{t('hajjPermit.medicalStatus')}: {t('hajjPermit.na')}</Text>
              <Text style={[styles.detailText, isRTL && { textAlign: 'right' }]}>{t('hajjPermit.applicationStatus')}: {t('hajjPermit.initialApproval')}</Text>
            </View>

            {/* Segmented Control */}
            <View style={styles.segmentedControl}>
              <View style={styles.segmentLeft}>
                <Text style={styles.segmentArabicText}>٢٠٢٥</Text>
              </View>
              <View style={styles.segmentMiddle}>
                <Text style={styles.segmentNAText}>N/A</Text>
              </View>
              <View style={styles.segmentRight}>
                <Text style={styles.segmentNAText}>N/A</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <BottomTabs active="home" />

      <Modal
        transparent
        visible={showNoticeModal}
        animationType="fade"
        onRequestClose={() => setShowNoticeModal(false)}
      >
        <View style={styles.noticeOverlay}>
          <Animated.View
            style={[
              styles.noticeSheet,
              {
                opacity: noticeAnim,
                transform: [
                  {
                    scaleY: noticeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.noticePointer} />
            <View style={styles.noticeInner}>
              <Text style={styles.noticeTitle}>{t('hajjPermit.permitReminder')}</Text>
              <Text style={styles.noticeBody}>
                {t('hajjPermit.permitReminderBody')}
              </Text>
              <TouchableOpacity
                style={styles.noticeButton}
                onPress={() => setShowNoticeModal(false)}
              >
                <Text style={styles.noticeButtonText}>{t('common.gotIt')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F7F7F7',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#010F0F',
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
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  permitCardContainer: {
    width: 341,
    marginBottom: 12,
  },
  permitCard: {
    width: 341,
    height: 202,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  leftIconCircle: {
    position: 'absolute',
    left: 16,
    top: 16,
    width: 42,
    height: 40,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  leftIconInner: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'absolute',
    top: 20,
    left: (341 - 75) / 2, // Center horizontally
    width: 75,
    height: 75,
    borderRadius: 37.5,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  nameContainer: {
    position: 'absolute',
    top: 105,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textDetails: {
    position: 'absolute',
    top: 130,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  passportText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  nationText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  permitNoText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#FDC350',
    textAlign: 'center',
  },
  rightIconCircle: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 32,
    height: 32,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsCard: {
    width: 341,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  dateRow: {
    width: 341,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#5A5A5A',
  },
  dateInfoIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContent: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'left',
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  segmentLeft: {
    flex: 1,
    backgroundColor: '#424242', // Dark grey
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentMiddle: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
  },
  segmentRight: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentArabicText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
  segmentNAText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
});



