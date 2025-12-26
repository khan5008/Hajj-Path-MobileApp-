import BottomTabs from '@/components/bottom-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// QR Code SVG Component
function QRCodeIcon() {
  return (
    <Svg width={85} height={85} viewBox="0 0 85 85" fill="none">
      <G clipPath="url(#clip0_62_306)">
        <Path d="M31.875 0H0V31.875H31.875V0ZM26.5625 26.5625H5.3125V5.3125H26.5625V26.5625Z" fill="black"/>
        <Path d="M10.625 10.625H21.25V21.25H10.625V10.625ZM0 85H31.875V53.125H0V85ZM5.3125 58.4375H26.5625V79.6875H5.3125V58.4375Z" fill="black"/>
        <Path d="M10.625 63.75H21.25V74.375H10.625V63.75ZM53.125 0V31.875H85V0H53.125ZM79.6875 26.5625H58.4375V5.3125H79.6875V26.5625Z" fill="black"/>
        <Path d="M63.75 10.625H74.375V21.25H63.75V10.625ZM10.625 37.1875H0V47.8125H15.9375V42.5H10.625V37.1875ZM37.1875 47.8125H47.8125V58.4375H37.1875V47.8125ZM15.9375 37.1875H26.5625V42.5H15.9375V37.1875ZM47.8125 63.75H37.1875V69.0625H42.5V74.375H47.8125V69.0625V63.75ZM31.875 37.1875V42.5H26.5625V47.8125H37.1875V37.1875H31.875ZM42.5 21.25H47.8125V31.875H42.5V21.25ZM47.8125 42.5V47.8125H58.4375V37.1875H42.5V42.5H47.8125ZM37.1875 31.875H42.5V37.1875H37.1875V31.875ZM47.8125 74.375H58.4375V85H47.8125V74.375ZM37.1875 74.375H42.5V85H37.1875V74.375ZM47.8125 58.4375H53.125V63.75H47.8125V58.4375ZM47.8125 15.9375V5.3125H42.5V0H37.1875V21.25H42.5V15.9375H47.8125ZM63.75 74.375H69.0625V85H63.75V74.375ZM63.75 63.75H74.375V69.0625H63.75V63.75ZM58.4375 69.0625H63.75V74.375H58.4375V69.0625ZM53.125 63.75H58.4375V69.0625H53.125V63.75ZM74.375 53.125V58.4375H79.6875V63.75H85V53.125H79.6875H74.375ZM79.6875 69.0625H74.375V85H85V74.375H79.6875V69.0625ZM53.125 53.125V58.4375H69.0625V47.8125H58.4375V53.125H53.125ZM63.75 37.1875V42.5H74.375V47.8125H85V37.1875H74.375H63.75Z" fill="black"/>
      </G>
      <Defs>
        <ClipPath id="clip0_62_306">
          <Rect width={85} height={85} fill="white"/>
        </ClipPath>
      </Defs>
    </Svg>
  );
}

// Verified Checkmark SVG Component
function VerifiedIcon() {
  return (
    <Svg width={20} height={18} viewBox="0 0 20 18" fill="none">
      <Path d="M7 0L6 3H2L3 7L0 9L3 11L2 15H6L7 18L10 16L13 18L14 15H18L17 11L20 9L17 7L18 3H14L13 0L10 2L7 0ZM14 5L15 6L8 13L5 10L6 9L8 11L14 5Z" fill="#8BC34A"/>
    </Svg>
  );
}

// Underline SVG Component
function UnderlineIcon() {
  return (
    <Svg width={85} height={2} viewBox="0 0 85 2" fill="none">
      <Path d="M0 1H85" stroke="#B82073" strokeWidth={1}/>
    </Svg>
  );
}

export default function DigitalIDScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  
  const [fontsLoaded] = useFonts({
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
  });

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
          <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>{t('digitalID.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Digital ID Card */}
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              {/* Card Header */}
              <View style={[styles.cardHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.flagIcon, isRTL && { marginRight: 0, marginLeft: 8 }]}>
                  <Text style={styles.flagEmoji}>🇸🇦</Text>
                </View>
                <View style={[styles.titleContainer, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]}>{t('digitalID.hajjDigitalId')}</Text>
                  <UnderlineIcon />
                </View>
              </View>

              {/* Card Body */}
              <View style={[styles.cardBody, isRTL && { flexDirection: 'row-reverse' }]}>
                {/* Left Side */}
                <View style={[styles.leftSection, isRTL && { alignItems: 'flex-end' }]}>
                  {/* Profile Picture */}
                  <TouchableOpacity onPress={() => router.push('/profile')}>
                    <Image
                      source={require('@/assets/images/profilepic.png')}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  
                  {/* Full Name */}
                  <View style={styles.infoRow}>
                    <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('digitalID.fullName')}</Text>
                    <Text style={[styles.value, isRTL && { textAlign: 'right' }]}>{t('digitalID.sampleFullName')}</Text>
                  </View>

                  {/* Passport No */}
                  <View style={styles.infoRow}>
                    <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('digitalID.passportNo')}</Text>
                    <Text style={[styles.value, isRTL && { textAlign: 'right' }]}>{t('digitalID.samplePassportNo')}</Text>
                  </View>

                  {/* Group/Agency */}
                  <View style={styles.infoRow}>
                    <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('digitalID.groupAgency')}</Text>
                    <Text style={[styles.value, isRTL && { textAlign: 'right' }]}>{t('digitalID.sampleGroupAgency')}</Text>
                  </View>
                </View>

                {/* Right Side */}
                <View style={[styles.rightSection, isRTL && { alignItems: 'flex-end' }]}>
                  {/* QR Code */}
                  <View style={styles.qrCodeContainer}>
                    <QRCodeIcon />
                  </View>

                  {/* Verified Badge */}
                  <View style={[styles.verifiedContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                    <VerifiedIcon />
                    <Text style={styles.verifiedText}>{t('digitalID.verified')}</Text>
                  </View>

                  {/* Nationality */}
                  <View style={styles.infoRow}>
                    <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('digitalID.nationality')}</Text>
                    <Text style={[styles.value, isRTL && { textAlign: 'right' }]}>{t('digitalID.sampleNationality')}</Text>
                  </View>

                  {/* Hajj Permit No */}
                  <View style={styles.infoRow}>
                    <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('digitalID.hajjPermitNo')}</Text>
                    <Text style={[styles.value, isRTL && { textAlign: 'right' }]}>{t('digitalID.sampleHajjPermitNo')}</Text>
                  </View>

                  {/* Tent Zone */}
                  <View style={styles.infoRow}>
                    <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('digitalID.tentZone')}</Text>
                    <Text style={[styles.value, isRTL && { textAlign: 'right' }]}>{t('digitalID.sampleTentZone')}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <BottomTabs active="home" />
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
  },
  cardContainer: {
    width: 333,
    height: 394,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 333,
    height: 394,
    backgroundColor: '#FFFFFF',
    borderRadius: 14.78,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  flagIcon: {
    marginRight: 8,
  },
  flagEmoji: {
    fontSize: 16,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 4,
  },
  cardBody: {
    flexDirection: 'row',
    flex: 1,
    gap: 20,
    paddingTop: 4,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  profileImage: {
    width: 130,
    height: 132,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
  },
  qrCodeContainer: {
    width: 85,
    height: 85,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#8BC34A',
  },
  infoRow: {
    marginBottom: 12,
    width: '100%',
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#B9B6B6',
    marginBottom: 6,
    textAlign: 'left',
  },
  value: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#212529',
    lineHeight: 18,
    textAlign: 'left',
  },
});


