import { useLanguage } from '@/contexts/LanguageContext';
import { PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
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

const HERO_IMAGES = [
  require('@/assets/images/tents.jpg'),
  require('@/assets/images/madinah.jpg'),
  require('@/assets/images/umrah.jpg'),
];

// Popular Fatwa Detail Content
const FATWA_DETAILS = [
  {
    title: 'Popular Fatwa: Mina Tent Guidelines',
    subtitle: 'Essential Information for Your Stay',
    content: 'During your stay in Mina, it is important to follow the guidelines provided by your group leader. Ensure you know your tent number and location. Keep your belongings secure and maintain cleanliness in the tent area. Follow the prayer schedule and meal times as announced by your group.',
    relatedTopics: [
      'Tent Location and Number',
      'Prayer Times in Mina',
      'Meal Distribution',
      'Safety Guidelines',
    ],
  },
  {
    title: 'Popular Fatwa: Madinah Visit',
    subtitle: 'Guidelines for Visiting the Prophet\'s Mosque',
    content: 'When visiting Masjid an-Nabawi in Madinah, it is recommended to perform two rak\'ahs of greeting the mosque. Visit the Rawdah (the area between the Prophet\'s house and pulpit) with proper etiquette. Maintain respect and avoid crowding. It is also recommended to visit the graves of the Prophet (peace be upon him) and his two companions.',
    relatedTopics: [
      'Visiting the Rawdah',
      'Prayer in Masjid an-Nabawi',
      'Etiquette in the Prophet\'s Mosque',
      'Historical Sites in Madinah',
    ],
  },
  {
    title: 'Popular Fatwa: Umrah Rituals',
    subtitle: 'Complete Guide to Performing Umrah',
    content: 'Umrah consists of Ihram, Tawaf around the Kaaba, Sa\'i between Safa and Marwah, and shaving or trimming hair. Enter Ihram at the miqat point. After completing Tawaf, perform two rak\'ahs behind Maqam Ibrahim if possible. Then proceed to Safa and Marwah for Sa\'i. Complete Umrah by shaving or trimming your hair.',
    relatedTopics: [
      'Entering Ihram for Umrah',
      'Tawaf Procedures',
      'Sa\'i Between Safa and Marwah',
      'Completing Umrah',
    ],
  },
];

// Gradient Text Component
function GradientText({ text }: { text: string }) {
  return (
    <MaskedView maskElement={<Text style={[styles.gradientMaskText]}>{text}</Text>}>
      <LinearGradient colors={['#B82073', '#1B131F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text style={[styles.gradientHiddenText]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

export default function FatwaDetailScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const { imageIndex } = useLocalSearchParams<{ imageIndex: string }>();
  const index = imageIndex ? parseInt(imageIndex, 10) : 0;
  const currentImage = HERO_IMAGES[index] || HERO_IMAGES[0];
  const detailContent = FATWA_DETAILS[index] || FATWA_DETAILS[0];

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#B82073" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero banner with image starting from safe area */}
        <View style={styles.bannerContainer}>
          <Image
            source={currentImage}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.55)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.bannerGradient}
          />
          <SafeAreaView style={styles.heroSafeArea} edges={['top']}>
            <View style={styles.heroHeaderRow}>
              <TouchableOpacity 
                onPress={() => router.back()} 
                style={[styles.backButton, isRTL && { left: 'auto', right: 16 }]}
              >
                <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <View style={styles.titleOverlay}>
            <GradientText text={detailContent.title} />
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>{detailContent.subtitle}</Text>
          
          <Text style={styles.contentText}>{detailContent.content}</Text>

          {/* Related Topics */}
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Related Topics</Text>
            <View style={styles.relatedTopicsContainer}>
              {detailContent.relatedTopics.map((topic, idx) => (
                <View key={idx} style={styles.topicChip}>
                  <Text style={styles.topicText}>{topic}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  // Full Width Banner - Starting from Safe Area
  bannerContainer: {
    width: '100%',
    height: SCREEN_WIDTH * 0.7,
    position: 'relative',
    marginBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gradientMaskText: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  gradientHiddenText: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-SemiBold',
    opacity: 0,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -12,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#1B131F',
    marginBottom: 16,
    textAlign: 'left',
  },
  contentText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#45455F',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'left',
  },
  relatedSection: {
    marginTop: 8,
  },
  relatedTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#1B131F',
    marginBottom: 12,
  },
  relatedTopicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  topicChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5E1EB',
    borderWidth: 1,
    borderColor: 'rgba(184, 32, 115, 0.2)',
  },
  topicText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#B82073',
  },
});

