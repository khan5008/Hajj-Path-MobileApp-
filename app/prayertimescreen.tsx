import BottomTabs from '@/components/bottom-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Inter_200ExtraLight, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { OpenSans_600SemiBold } from '@expo-google-fonts/open-sans';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Location pin icon
function LocationIcon({ width = 8, height = 10 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 8 10" fill="none">
      <Path
        d="M4 4.75C3.62112 4.75 3.25776 4.6183 2.98985 4.38388C2.72194 4.14946 2.57143 3.83152 2.57143 3.5C2.57143 3.16848 2.72194 2.85054 2.98985 2.61612C3.25776 2.3817 3.62112 2.25 4 2.25C4.37888 2.25 4.74224 2.3817 5.01015 2.61612C5.27806 2.85054 5.42857 3.16848 5.42857 3.5C5.42857 3.66415 5.39162 3.8267 5.31983 3.97835C5.24804 4.13001 5.14281 4.26781 5.01015 4.38388C4.8775 4.49996 4.72001 4.59203 4.54669 4.65485C4.37337 4.71767 4.1876 4.75 4 4.75ZM4 0C2.93913 0 1.92172 0.368749 1.17157 1.02513C0.421427 1.6815 0 2.57174 0 3.5C0 6.125 4 10 4 10C4 10 8 6.125 8 3.5C8 2.57174 7.57857 1.6815 6.82843 1.02513C6.07828 0.368749 5.06087 0 4 0Z"
        fill="white"
        fillOpacity={0.5}
      />
    </Svg>
  );
}

// Fajr icon
function FajrIcon({ width = 28, height = 28 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Path
        d="M19.2622 5.5625H16.5902V5.4925L19.3202 1.8945C19.5667 1.578 19.6602 1.3795 19.6602 1.168C19.6602 0.804501 19.3792 0.582001 18.9922 0.582001H15.2307C14.8792 0.582001 14.6097 0.816501 14.6097 1.18C14.6097 1.5665 14.8792 1.789 15.2307 1.789H17.7502V1.859L14.9847 5.4455C14.7387 5.762 14.6447 5.9375 14.6447 6.1835C14.6447 6.5235 14.9147 6.7695 15.3012 6.7695H19.2617C19.6137 6.7695 19.8717 6.547 19.8717 6.16C19.8717 5.797 19.6142 5.5625 19.2622 5.5625ZM24.7457 10.039H22.8602V9.992L24.8052 7.449C25.0277 7.1565 25.1217 6.969 25.1217 6.758C25.1217 6.418 24.8522 6.207 24.4892 6.207H21.6177C21.2897 6.207 21.0437 6.43 21.0437 6.7695C21.0437 7.1445 21.2897 7.3555 21.6177 7.3555H23.3172V7.4025L21.3837 9.9455C21.1607 10.2265 21.0787 10.4025 21.0787 10.6485C21.0787 10.965 21.3247 11.199 21.6887 11.199H24.7467C25.0867 11.199 25.3212 10.9765 25.3212 10.625C25.3212 10.2735 25.0867 10.039 24.7467 10.039M12.9922 27.418C17.2582 27.418 20.7272 25.25 22.2972 21.5C22.4962 21.0315 22.4612 20.645 22.2272 20.41C22.0512 20.2225 21.6877 20.199 21.3127 20.3515C20.3402 20.7385 19.2152 20.9025 17.9962 20.9025C12.7462 20.9025 9.31269 17.574 9.31269 12.512C9.31269 11.129 9.58269 9.594 9.94569 8.879C10.1682 8.422 10.1682 8.035 9.98069 7.801C9.76969 7.543 9.38319 7.496 8.87919 7.672C5.14069 9.043 2.67969 12.957 2.67969 17.3045C2.67969 23.117 7.06269 27.418 12.9922 27.418ZM19.5782 14.047H17.9732V14L19.6252 11.8085C19.8362 11.5155 19.9302 11.3515 19.9302 11.1525C19.9302 10.824 19.6722 10.625 19.3322 10.625H16.8012C16.4847 10.625 16.2502 10.836 16.2502 11.164C16.2502 11.5155 16.4847 11.715 16.8012 11.715H18.2072V11.7615L16.5782 13.9415C16.3672 14.2225 16.2852 14.3865 16.2852 14.6095C16.2852 14.9145 16.5202 15.1485 16.8597 15.1485H19.5782C19.8947 15.1485 20.1172 14.926 20.1172 14.586C20.1172 14.2695 19.8947 14.047 19.5782 14.047Z"
        fill="white"
      />
    </Svg>
  );
}

// Sunrise icon
function SunriseIcon({ width = 26, height = 26 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 26 26" fill="none">
      <Path
        d="M11.9167 1.08333C11.9167 0.796016 11.8025 0.520465 11.5994 0.317301C11.3962 0.114137 11.1207 0 10.8333 0C10.546 0 10.2705 0.114137 10.0673 0.317301C9.86414 0.520465 9.75 0.796016 9.75 1.08333V3.14167C9.75 3.42898 9.86414 3.70453 10.0673 3.9077C10.2705 4.11086 10.546 4.225 10.8333 4.225C11.1207 4.225 11.3962 4.11086 11.5994 3.9077C11.8025 3.70453 11.9167 3.42898 11.9167 3.14167V1.08333Z"
        fill="white"
      />
      <Path
        d="M16.575 10.725C16.5754 11.4098 16.451 12.089 16.2078 12.7292H5.67667C5.38288 11.9571 5.26247 11.13 5.32397 10.3062C5.38546 9.48248 5.62736 8.68234 6.03253 7.9625C6.43769 7.24266 6.9962 6.62073 7.66849 6.14078C8.34078 5.66082 9.11039 5.33459 9.9228 5.18519C10.7352 5.03579 11.5705 5.06688 12.3696 5.27626C13.1686 5.48564 13.9119 5.86818 14.5466 6.39679C15.1814 6.92539 15.6921 7.58712 16.0426 8.33509C16.3932 9.08306 16.5749 9.89897 16.575 10.725Z"
        fill="white"
      />
      {/* rest of paths omitted for brevity but using same SVG */}
    </Svg>
  );
}

// Zohr/Asr icon
function ZohrIcon({ width = 26, height = 21 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 26 21" fill="none">
      <Path
        d="M0 19.6875C0 20.4122 0.582156 21 1.3 21H3.9C4.61784 21 5.2 20.4122 5.2 19.6875V6.5625H0V19.6875ZM23.5284 11.8125C24.2539 11.0992 24.7 10.281 24.7 9.39627C24.7 7.22818 23.0023 5.54941 21.1283 4.35545C19.4244 3.26977 17.8527 1.98598 16.5799 0.408926L16.25 0L15.9201 0.408926C14.6473 1.98598 13.076 3.27018 11.3717 4.35545C9.49772 5.54941 7.8 7.22818 7.8 9.39627C7.8 10.281 8.24606 11.0992 8.97162 11.8125H23.5284ZM24.7 13.125H7.8C7.08216 13.125 6.5 13.7128 6.5 14.4375V19.6875C6.5 20.4122 7.08216 21 7.8 21H9.1V18.375C9.1 17.6503 9.68216 17.0625 10.4 17.0625C11.1178 17.0625 11.7 17.6503 11.7 18.375V21H14.3V18.0469C14.3 16.0781 16.25 15.0938 16.25 15.0938C16.25 15.0938 18.2 16.0781 18.2 18.0469V21H20.8V18.375C20.8 17.6503 21.3822 17.0625 22.1 17.0625C22.8178 17.0625 23.4 17.6503 23.4 18.375V21H24.7C25.4178 21 26 20.4122 26 19.6875V14.4375C26 13.7128 25.4178 13.125 24.7 13.125ZM2.6 0C2.6 0 0 1.3125 0 3.9375V5.25H5.2V3.9375C5.2 1.3125 2.6 0 2.6 0Z"
        fill="white"
      />
    </Svg>
  );
}

// Maghrib icon
function MaghribIcon({ width = 26, height = 26 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 26 26" fill="none">
      <Path
        d="M8.6665 23.8333H17.3332M5.4165 20.5833H20.5832M2.1665 17.3333H23.8332"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.9999 6.5C11.7489 6.49993 10.5245 6.86086 9.47353 7.53947C8.4226 8.21808 7.58982 9.18553 7.07513 10.3257C6.56045 11.4659 6.38572 12.7304 6.57192 13.9675C6.75812 15.2045 7.29735 16.3616 8.12487 17.2997H17.8749C18.7024 16.3616 19.2416 15.2045 19.4278 13.9675C19.614 12.7304 19.4393 11.4659 18.9246 10.3257C18.4099 9.18553 17.5771 8.21808 16.5262 7.53947C15.4753 6.86086 14.2509 6.49993 12.9999 6.5Z"
        stroke="white"
        strokeWidth={1.5}
      />
      <Path
        d="M12.9998 2.16666V3.25M23.8332 13H22.7498M3.24984 13H2.1665M20.659 5.34083L20.2343 5.76658M5.76534 5.7655L5.33959 5.33975"
        stroke="white"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function PrayerTimeScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const [fontsLoaded] = useFonts({
    'Inter-ExtraLight': Inter_200ExtraLight,
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#B82073" />

      {/* Header gradient including SafeArea (like home screen) */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#B82073', '#1B131F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.headerTopRow}>
              <View>
                <Text style={styles.timeText}>3:00 pm</Text>
                <Text style={styles.maghribText}>{t('prayerTime.maghrib')} {t('prayerTime.endsIn')} 2h 00m 30s</Text>
              </View>
              <View style={styles.dateLocationColumn}>
                <Text style={styles.dateText}>10 Dhul Hijiah 1447  ١٤٤٧</Text>
                <View style={styles.locationPill}>
                  <LocationIcon />
                  <Text style={styles.locationText}>{t('prayerTime.jeddah')}</Text>
                </View>
              </View>
            </View>

            {/* Prayer icons row */}
            <View style={styles.prayerRow}>
              <View style={styles.prayerItem}>
                <FajrIcon />
                <Text style={styles.prayerLabel}>{t('prayerTime.fajr')}</Text>
                <Text style={styles.prayerTime}>4:50 PM</Text>
              </View>
              <View style={styles.prayerItem}>
                <SunriseIcon />
                <Text style={styles.prayerLabel}>{t('prayerTime.sunrise')}</Text>
                <Text style={styles.prayerTime}>4:50 PM</Text>
              </View>
              <View style={styles.prayerItem}>
                <ZohrIcon />
                <Text style={styles.prayerLabel}>{t('prayerTime.zohr')}</Text>
                <Text style={styles.prayerTime}>4:50 PM</Text>
              </View>
              <View style={styles.prayerItem}>
                <ZohrIcon />
                <Text style={styles.prayerLabel}>{t('prayerTime.asr')}</Text>
                <Text style={styles.prayerTime}>4:50 PM</Text>
              </View>
              <View style={styles.prayerItem}>
                <MaghribIcon />
                <Text style={styles.prayerLabel}>{t('prayerTime.maghrib')}</Text>
                <Text style={styles.prayerTime}>4:50 PM</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Qur'an of the Day card overlaying header */}
        <View style={styles.quranCard}>
          <Text style={styles.quranTitle}>{t('prayerTime.quranOfTheDay')}</Text>
          <Text style={styles.quranArabic}>
            آيَت ٱلْكُرْسِي
          </Text>
          <Text style={styles.quranArabicSmall}>
            ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ...
          </Text>
          <Text style={styles.quranSource}>{t('prayerTime.quranSource')}</Text>
        </View>
      </View>

      {/* Content below header + card */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Day by Day Guide header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('prayerTime.dayByDayGuide')}</Text>
        </View>

        {/* Day cards styled like home screen */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayCardsRow}
        >
          <View style={styles.dayCard}>
            <Image
              source={require('@/assets/images/tents.jpg')}
              style={styles.dayImage}
              resizeMode="cover"
            />
            <View style={styles.dayCardInfo}>
              <Text style={styles.dayCardTitle}>{t('prayerTime.stepByStepHajjRites')}</Text>
              <Text style={styles.dayCardSubtitle}>
                {t('prayerTime.detailedGuide')}
              </Text>
            </View>
          </View>
          <View style={styles.dayCard}>
            <Image
              source={require('@/assets/images/madinah.jpg')}
              style={styles.dayImage}
              resizeMode="cover"
            />
            <View style={styles.dayCardInfo}>
              <Text style={styles.dayCardTitle}>{t('prayerTime.essentialHajjDuas')}</Text>
              <Text style={styles.dayCardSubtitle}>
                {t('prayerTime.essentialDuasDescription')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScrollView>

      <BottomTabs active="home" />
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
    backgroundColor: 'transparent',
  },
  headerContainer: {
    width: SCREEN_WIDTH,
    height: 398,
    position: 'relative',
  },
  headerGradient: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 3000,
    borderBottomRightRadius: 3000,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 5,
  },
  timeText: {
    fontSize: 32,
    color: '#FFFFFF',
    // Josefin Sans not available; using Inter-SemiBold as fallback
    fontFamily: 'Inter-SemiBold',
  },
  maghribText: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Inter-ExtraLight',
    color: '#C7C7C7',
  },
  dateLocationColumn: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: 'rgba(217,217,217,0.3)',
  },
  locationText: {
    marginLeft: 4,
    fontSize: 10,
    fontFamily: 'Inter-ExtraLight',
    color: '#FFFFFF',
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 32,
    paddingHorizontal: 4,
  },
  prayerItem: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - 40) / 5,
  },
  prayerLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
  },
  prayerTime: {
    marginTop: 2,
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Inter-ExtraLight',
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  quranCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    position: 'absolute',
    left: 23,
    right: 23,
    top: 260,
  },
  quranTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-SemiBold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  quranArabic: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  quranArabicSmall: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  quranSource: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666666',
  },
  sectionHeader: {
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1A1A1A',
  },
  dayCardsRow: {
    paddingBottom: 20,
  },
  dayCard: {
    width: 170,
    minHeight: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  dayImage: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  dayCardInfo: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
  },
  dayCardTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'left',
  },
  dayCardSubtitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666',
    textAlign: 'left',
    lineHeight: 18,
  },
});




