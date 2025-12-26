import { useLanguage } from '@/contexts/LanguageContext';
import { PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type TimelineTag = 'Essential' | 'Sunnah' | 'Mandatory';

type TimelineStep = {
  title: string;
  time: string;
  description: string;
  tag: TimelineTag;
};

type DayConfig = {
  id: string;
  dayNumber: string;
  islamicDate: string;
  location: string;
  heroImage: any;
  steps: TimelineStep[];
};

const DAY_CONFIGS: Record<string, DayConfig> = {
  '1': {
    id: '1',
    dayNumber: 'Day 1',
    islamicDate: '8th Dhul‑Hijjah',
    location: 'Mina',
    heroImage: require('@/assets/images/hajj guide.jpg'),
    steps: [
      {
        title: 'Enter Ihram (if not already in Ihram)',
        time: 'Before Fajr',
        description: 'Make intention for Hajj, wear Ihram, and recite the Talbiyah while travelling towards Mina.',
        tag: 'Mandatory',
      },
      {
        title: 'Arrive in Mina',
        time: 'Morning',
        description: 'Settle in your tent, pray Dhuhr, Asr, Maghrib and Isha shortened but not combined.',
        tag: 'Essential',
      },
      {
        title: 'Engage in Dhikr & Du‘a',
        time: 'Afternoon & Night',
        description: 'Spend the day in worship, Qur’an, and making du‘a; prepare spiritually for the Day of Arafah.',
        tag: 'Sunnah',
      },
    ],
  },
  '2': {
    id: '2',
    dayNumber: 'Day 2',
    islamicDate: '9th Dhul‑Hijjah',
    location: 'Arafah',
    heroImage: require('@/assets/images/hajj guide.jpg'),
    steps: [
      {
        title: 'Depart from Mina to Arafah',
        time: 'After Fajr',
        description: 'Leave Mina with your group and proceed to the plains of Arafah, reciting Talbiyah on the way.',
        tag: 'Mandatory',
      },
      {
        title: 'Wuquf in Arafah',
        time: 'Dhuhr to Maghrib',
        description: 'Pray Dhuhr and Asr combined and shortened, then stand in du‘a facing the Qiblah until sunset.',
        tag: 'Mandatory',
      },
      {
        title: 'Depart to Muzdalifah',
        time: 'After Sunset',
        description: 'Leave Arafah calmly after Maghrib without praying there; head to Muzdalifah for the night.',
        tag: 'Essential',
      },
    ],
  },
  '3': {
    id: '3',
    dayNumber: 'Day 3 (Night)',
    islamicDate: 'Night of 10th Dhul‑Hijjah',
    location: 'Muzdalifah',
    heroImage: require('@/assets/images/hajj guide.jpg'),
    steps: [
      {
        title: 'Pray Maghrib & Isha',
        time: 'Arrival in Muzdalifah',
        description: 'Pray Maghrib and Isha combined and shortened with one Adhan and two Iqamahs.',
        tag: 'Mandatory',
      },
      {
        title: 'Stay Overnight',
        time: 'Night',
        description: 'Sleep in Muzdalifah under the open sky, increasing in dhikr and du‘a.',
        tag: 'Mandatory',
      },
      {
        title: 'Collect Pebbles',
        time: 'Before Fajr',
        description: 'Collect 49–70 small pebbles that will be used for Rami at the Jamarat in Mina.',
        tag: 'Essential',
      },
    ],
  },
  '4': {
    id: '4',
    dayNumber: 'Day 4',
    islamicDate: '10th Dhul‑Hijjah',
    location: 'Mina – Rami & Sacrifice',
    heroImage: require('@/assets/images/hajj guide.jpg'),
    steps: [
      {
        title: 'Return to Mina & Rami al‑Jamarah al‑Aqabah',
        time: 'Morning',
        description: 'Stone the large pillar (Jamarah al‑Aqabah) with seven pebbles while saying “Allāhu Akbar”.',
        tag: 'Mandatory',
      },
      {
        title: 'Sacrifice (Hadi)',
        time: 'After Rami',
        description: 'Arrange your sacrifice (Hadi) through your campaign or official slaughterhouse.',
        tag: 'Mandatory',
      },
      {
        title: 'Shaving / Trimming the Hair',
        time: 'After Sacrifice',
        description: 'Men shave or shorten the hair; women trim a fingertip length from their hair.',
        tag: 'Mandatory',
      },
      {
        title: 'Tawaf al‑Ifadah & Sa‘i',
        time: 'Day / Night',
        description: 'Travel to Masjid al‑Haram to perform Tawaf al‑Ifadah and Sa‘i for Hajj.',
        tag: 'Mandatory',
      },
    ],
  },
  '5': {
    id: '5',
    dayNumber: 'Day 5',
    islamicDate: '11th Dhul‑Hijjah',
    location: 'Mina – Rami',
    heroImage: require('@/assets/images/hajj guide.jpg'),
    steps: [
      {
        title: 'Rami of Three Jamarat',
        time: 'After Dhuhr',
        description: 'Stone all three pillars (small, middle, large) with seven pebbles each, in order.',
        tag: 'Mandatory',
      },
      {
        title: 'Return to Tent',
        time: 'Afternoon & Evening',
        description: 'Spend time in Mina remembering Allah, reflecting and resting in your tent.',
        tag: 'Essential',
      },
    ],
  },
  '6': {
    id: '6',
    dayNumber: 'Day 6',
    islamicDate: '12th Dhul‑Hijjah',
    location: 'Mina – Rami & Departure',
    heroImage: require('@/assets/images/hajj guide.jpg'),
    steps: [
      {
        title: 'Rami of Three Jamarat',
        time: 'After Dhuhr',
        description: 'Again stone the three Jamarat with seven pebbles each, in the same order as previous day.',
        tag: 'Mandatory',
      },
      {
        title: 'Leave Mina (Before Maghrib)',
        time: 'Late Afternoon',
        description: 'Depart Mina before Maghrib if choosing to stay two days; otherwise remain for a third day.',
        tag: 'Essential',
      },
      {
        title: 'Tawaf al‑Wada‘',
        time: 'Before Final Departure',
        description: 'Perform the farewell Tawaf around the Ka‘bah before leaving Makkah.',
        tag: 'Mandatory',
      },
    ],
  },
};

export default function DayDetailScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const params = useLocalSearchParams<{ dayId?: string }>();
  const dayId = params.dayId || '1';
  const baseDayConfig = DAY_CONFIGS[dayId] ?? DAY_CONFIGS['1'];
  
  // Get translated day config
  const dayConfig = {
    ...baseDayConfig,
    dayNumber: t(`dayDetails.day${dayId}.dayNumber`),
    islamicDate: t(`dayDetails.day${dayId}.islamicDate`),
    location: t(`dayDetails.day${dayId}.location`),
    steps: baseDayConfig.steps.map((step, idx) => ({
      ...step,
      title: t(`dayDetails.day${dayId}.step${idx + 1}.title`),
      time: t(`dayDetails.day${dayId}.step${idx + 1}.time`),
      description: t(`dayDetails.day${dayId}.step${idx + 1}.description`),
      tag: t(`dayDetails.tag.${step.tag.toLowerCase()}`) as TimelineTag,
    })),
  };

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image */}
        <View style={styles.heroWrapper}>
          <Image source={dayConfig.heroImage} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.heroOverlay}
          />
          <SafeAreaView style={styles.heroSafeArea} edges={['top']}>
            <View style={styles.heroHeaderRow}>
              <TouchableOpacity onPress={() => router.back()} style={styles.heroBackButton}>
                <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Day heading */}
        <View style={[styles.dayHeader, isRTL && { flexDirection: 'row-reverse' }]}>
          <View>
            <Text style={styles.dayNumber}>{dayConfig.dayNumber}</Text>
            <Text style={styles.dayDate}>{dayConfig.islamicDate}</Text>
          </View>
          <View style={styles.locationChip}>
            <Ionicons name="location-sharp" size={14} color="#FFFFFF" />
            <Text style={styles.locationText}>{dayConfig.location}</Text>
          </View>
        </View>

        {/* Timeline as stacked cards (no side line/dots) */}
        <View style={styles.timelineContainer}>
          {dayConfig.steps.map((step) => (
            <View key={step.title} style={styles.timelineCardWrapper}>
              <View style={styles.timelineCard}>
                <View style={[styles.timelineCardHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Text style={[styles.timelineTitle, isRTL && { textAlign: 'right' }]}>{step.title}</Text>
                  <Text style={styles.timelineTime}>{step.time}</Text>
                </View>
                <Text style={styles.timelineDescription}>{step.description}</Text>
                <View style={[styles.tagChipBase, getTagChipStyle(step.tag)]}>
                  <Text style={styles.tagText}>{step.tag}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const getTagChipStyle = (tag: TimelineTag) =>
  ({
    backgroundColor:
      tag === 'Mandatory'
        ? 'rgba(220, 53, 69, 0.08)'
        : tag === 'Essential'
        ? 'rgba(184, 32, 115, 0.08)'
        : 'rgba(111, 207, 151, 0.08)',
  } as const);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  heroWrapper: {
    width: '100%',
    height: SCREEN_WIDTH * 0.7,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroSafeArea: {
    ...StyleSheet.absoluteFillObject,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  heroBackButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
  },
  dayNumber: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#1A1A1A',
  },
  dayDate: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#77798A',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#B82073',
  },
  locationText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#FFFFFF',
  },
  timelineContainer: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  timelineCardWrapper: {
    marginBottom: 16,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E4BDD6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  timelineCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timelineTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#1A1A1A',
    marginRight: 8,
  },
  timelineTime: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#77798A',
  },
  timelineDescription: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#55565F',
    lineHeight: 18,
    marginBottom: 10,
  },
  tagChipBase: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#B82073',
  },
});




