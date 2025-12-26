import BottomTabs from '@/components/bottom-tabs';
import { PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Step Detail Data
const STEP_DETAILS: { [key: number]: {
  title: string;
  date: string;
  location: string;
  description: string;
  whereToStop: string;
  whereToGo: string;
  relatedSteps: string[];
  image?: any;
} } = {
  1: {
    title: 'Wearing Ihram Clothes',
    date: '8th Dhul-Hijjah',
    location: 'Makkah / Miqat',
    description: 'Ihram is the sacred state a Muslim must enter before performing Hajj or Umrah. It involves wearing two white seamless cloths (for men) and making the intention.',
    whereToStop: 'Stop at the Miqat boundary before entering Makkah. You must be in Ihram before crossing this point.',
    whereToGo: 'Go to your designated Miqat station (such as Dhul-Hulaifah, Juhfah, Qarn al-Manazil, or Yalamlam) based on your route.',
    relatedSteps: ['Intention for Hajj', 'Reciting Talbiyah'],
  },
  2: {
    title: 'Intention for Hajj',
    date: '8th Dhul-Hijjah',
    location: 'At Miqat',
    description: 'Make a sincere intention (Niyyah) in your heart to perform Hajj for the sake of Allah alone. This intention should be made at the Miqat.',
    whereToStop: 'Stop at the Miqat boundary and make your intention before proceeding.',
    whereToGo: 'After making intention, proceed towards Makkah while reciting Talbiyah.',
    relatedSteps: ['Wearing Ihram Clothes', 'Reciting Talbiyah'],
  },
  3: {
    title: 'Reciting Talbiyah',
    date: '8th Dhul-Hijjah',
    location: 'From Miqat to Makkah',
    description: 'Talbiyah is the special prayer recited continuously from the time of entering Ihram until the start of Tawaf. It is: "Labbaik Allahumma Labbaik..."',
    whereToStop: 'Continue reciting until you reach the Kaaba in Makkah.',
    whereToGo: 'Proceed to Makkah while continuously reciting Talbiyah.',
    relatedSteps: ['Intention for Hajj', 'Tawaf Ifadhah'],
  },
  4: {
    title: 'Wukuf at Arafah',
    date: '9th Dhul-Hijjah',
    location: 'Arafat',
    description: 'Wukuf (standing) at Arafah is the most important pillar of Hajj. Pilgrims must be present in Arafat from noon until sunset on the 9th of Dhul-Hijjah.',
    whereToStop: 'Stop and remain in Arafat from Dhuhr (noon) prayer until Maghrib (sunset) prayer.',
    whereToGo: 'After sunset, proceed to Muzdalifah for the night stay.',
    relatedSteps: ['Throwing Jamarat', 'Mabit in Mina'],
  },
  5: {
    title: 'Throwing Jamarat',
    date: '10th-13th Dhul-Hijjah',
    location: 'Mina',
    description: 'Pilgrims throw pebbles at the three Jamarat (stone pillars) representing the devil. This is done on the 10th, 11th, 12th, and optionally 13th of Dhul-Hijjah.',
    whereToStop: 'Stop at each Jamrah (Jamrat al-Aqabah, Jamrat al-Wusta, Jamrat al-Sughra) and throw 7 pebbles at each.',
    whereToGo: 'After throwing at Jamrat al-Aqabah on 10th, proceed to Makkah for Tawaf Ifadhah.',
    relatedSteps: ['Tawaf Ifadhah', 'Mabit in Mina'],
  },
  6: {
    title: 'Tawaf Ifadhah',
    date: '10th Dhul-Hijjah',
    location: 'Makkah - Kaaba',
    description: 'Tawaf Ifadhah is the obligatory circumambulation of the Kaaba. It must be performed after leaving Arafat and can be done anytime from the 10th of Dhul-Hijjah onwards.',
    whereToStop: 'Stop at the Black Stone (Hajar al-Aswad) to start and complete each circuit.',
    whereToGo: 'Go to the Kaaba and perform 7 circuits (Tawaf) around it, starting from the Black Stone.',
    relatedSteps: ["Sa'i", 'Second Tahallul'],
  },
  7: {
    title: "Sa'i",
    date: '10th Dhul-Hijjah',
    location: 'Between Safa and Marwah',
    description: "Sa'i is the ritual of walking/running between the hills of Safa and Marwah seven times. It commemorates Hajar's search for water for her son Ismail.",
    whereToStop: 'Start at Safa, walk to Marwah (counts as 1), then return to Safa (counts as 2), and continue until 7 circuits are complete.',
    whereToGo: 'After Tawaf Ifadhah, proceed to the area between Safa and Marwah hills.',
    relatedSteps: ['Tawaf Ifadhah', 'Second Tahallul'],
  },
  8: {
    title: 'Second Tahallul',
    date: '10th Dhul-Hijjah',
    location: 'After Sa\'i',
    description: 'Tahallul means exiting the state of Ihram. The second Tahallul occurs after completing Tawaf Ifadhah and Sa\'i, allowing all restrictions of Ihram to be lifted except marital relations.',
    whereToStop: 'After completing Sa\'i, you can perform Tahallul by cutting or shaving your hair.',
    whereToGo: 'Return to Mina after Tahallul to complete the remaining rituals.',
    relatedSteps: ["Sa'i", 'Mabit in Mina'],
  },
  9: {
    title: 'Mabit in Mina',
    date: '10th-12th Dhul-Hijjah',
    location: 'Mina',
    description: 'Pilgrims must spend the nights of the 10th, 11th, and 12th of Dhul-Hijjah in Mina. This is where the Jamarat throwing takes place.',
    whereToStop: 'Stay in your tent in Mina for the required nights.',
    whereToGo: 'Go to your assigned tent area in Mina after completing Tawaf and Sa\'i.',
    relatedSteps: ['Throwing Jamarat', 'Second Tahallul'],
  },
};

export default function HajjStepDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const stepNumber = parseInt(params.stepNumber as string) || 1;
  const stepDetail = STEP_DETAILS[stepNumber] || STEP_DETAILS[1];

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Main Content - No Pink Header */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button - Floating */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1B131F" />
          </TouchableOpacity>

          {/* Step Title Header */}
          <View style={styles.titleHeader}>
            <Text style={styles.titleText}>{stepDetail.title}</Text>
            <Text style={styles.titleSub}>
              {stepDetail.date} · {stepDetail.location}
            </Text>
          </View>

          {/* Compact day highlight strip (modern UI in place of old pink line/card) */}
          <View style={styles.highlightStrip}>
            <View style={styles.highlightCol}>
              <Text style={styles.highlightLabel}>Ritual</Text>
              <Text style={styles.highlightValue}>{stepDetail.title}</Text>
            </View>
            <View style={styles.highlightDivider} />
            <View style={styles.highlightCol}>
              <Text style={styles.highlightLabel}>When</Text>
              <Text style={styles.highlightValue}>{stepDetail.date}</Text>
            </View>
            <View style={styles.highlightDivider} />
            <View style={styles.highlightCol}>
              <Text style={styles.highlightLabel}>Where</Text>
              <Text style={styles.highlightValue}>{stepDetail.location}</Text>
            </View>
          </View>

          <View style={styles.highlightActionRow}>
            <Text style={styles.highlightHint}>
              Read this guidance carefully before you move with your group so you don’t miss any
              pillar of Hajj.
            </Text>
            <TouchableOpacity style={styles.highlightButton}>
              <Text style={styles.highlightButtonText}>Mark as understood</Text>
            </TouchableOpacity>
          </View>

          {/* Description Card / Key Guidance */}
          <View style={styles.contentCard}>
            <Text style={styles.cardTitle}>Description</Text>
            <Text style={styles.cardText}>{stepDetail.description}</Text>
          </View>

          {/* Where to Stop Card */}
          <View style={styles.contentCard}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="stop-circle-outline" size={22} color="#B82073" />
              <Text style={styles.cardTitle}>Where to Stop</Text>
            </View>
            <Text style={styles.cardText}>{stepDetail.whereToStop}</Text>
          </View>

          {/* Where to Go Card */}
          <View style={styles.contentCard}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="arrow-forward-circle-outline" size={22} color="#B82073" />
              <Text style={styles.cardTitle}>Where to Go</Text>
            </View>
            <Text style={styles.cardText}>{stepDetail.whereToGo}</Text>
          </View>

          {/* Related Steps Card */}
          {stepDetail.relatedSteps.length > 0 && (
            <View style={styles.contentCard}>
              <Text style={styles.cardTitle}>Related Steps</Text>
              <View style={styles.relatedStepsContainer}>
                {stepDetail.relatedSteps.map((step, index) => (
                  <View key={index} style={styles.relatedStepTag}>
                    <Text style={styles.relatedStepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <BottomTabs active="home" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    padding: 16,
    paddingBottom: 100,
  },
  titleHeader: {
    marginBottom: 20,
    paddingTop: 8,
  },
  titleText: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#1B131F',
    letterSpacing: 0.3,
    lineHeight: 32,
  },
  titleSub: {
    marginTop: 6,
    fontSize: 13,
    color: '#77798A',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  highlightStrip: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  highlightCol: {
    flex: 1,
    paddingHorizontal: 6,
  },
  highlightLabel: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'PlusJakartaSans-Regular',
    marginBottom: 4,
  },
  highlightValue: {
    fontSize: 13,
    color: '#1B131F',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  highlightDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 4,
  },
  highlightActionRow: {
    marginBottom: 18,
  },
  highlightHint: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 20,
    marginBottom: 10,
  },
  highlightButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#B82073',
  },
  highlightButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#1B131F',
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  cardText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#555',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  relatedStepsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  relatedStepTag: {
    backgroundColor: '#F5E1EB',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  relatedStepText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#B82073',
  },
});
