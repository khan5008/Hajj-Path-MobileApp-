import { useLanguage } from '@/contexts/LanguageContext';
import { PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// Base day data - will be translated in component
const BASE_DAYS = [
  { id: '1', image: require('@/assets/images/tents.jpg') },
  { id: '2', image: require('@/assets/images/madinah.jpg') },
  { id: '3', image: require('@/assets/images/umrah.jpg') },
  { id: '4', image: require('@/assets/images/tents.jpg') },
  { id: '5', image: require('@/assets/images/tents.jpg') },
  { id: '6', image: require('@/assets/images/madinah.jpg') },
];

export default function DayListScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // Get translated days
  const DAYS = BASE_DAYS.map(day => ({
    ...day,
    dayNumber: t(`dayList.day${day.id}.dayNumber`),
    islamicDate: t(`dayList.day${day.id}.islamicDate`),
    location: t(`dayList.day${day.id}.location`),
    summary: t(`dayList.day${day.id}.summary`),
  }));

  const openDay = (id: string) => {
    router.push({ pathname: '/daydetailscreen', params: { dayId: id } });
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#B82073" />

      <LinearGradient
        colors={['#B82073', '#1B131F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
          <View style={[styles.headerRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('dayList.title')}</Text>
            <View style={styles.headerSpacer} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      <SafeAreaView edges={['bottom']} style={styles.safeAreaContent}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={styles.dayCard}
                onPress={() => openDay(day.id)}
                activeOpacity={0.85}
              >
                <View style={styles.cardImageBox}>
                  <Image source={day.image} style={styles.cardImage} resizeMode="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.imageOverlay}
                  />
                  <View style={styles.locationBadge}>
                    <Ionicons name="location-sharp" size={12} color="#FFFFFF" />
                    <Text style={styles.locationLabel}>{day.location}</Text>
                  </View>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.dayNumber}>{day.dayNumber}</Text>
                  <Text style={styles.dayDate}>{day.islamicDate}</Text>
                  <Text style={styles.daySummary} numberOfLines={2}>
                    {day.summary}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  safeAreaHeader: {
    flex: 0,
  },
  safeAreaContent: {
    flex: 1,
  },
  headerGradient: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 18,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-SemiBold',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  dayCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  cardImageBox: {
    width: '100%',
    height: 130,
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  locationBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(10px)',
  },
  locationLabel: {
    marginLeft: 4,
    fontSize: 11,
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-SemiBold',
    letterSpacing: 0.2,
  },
  cardInfo: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    paddingBottom: 16,
  },
  dayNumber: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  dayDate: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#77798A',
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  daySummary: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#55565F',
    lineHeight: 18,
    letterSpacing: 0.1,
  },
});





