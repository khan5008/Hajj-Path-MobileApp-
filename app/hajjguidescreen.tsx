import { useLanguage } from '@/contexts/LanguageContext';
import { PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
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
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

// Modern Step Card Component
function StepCard({ stepNumber, title, onPress, isRTL }: { stepNumber: number; title: string; onPress: () => void; isRTL: boolean }) {
  return (
    <TouchableOpacity 
      style={styles.stepCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.stepCardContent, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={styles.stepCardCenter}>
          <Text style={[styles.stepCardTitle, isRTL && { textAlign: 'right' }]}>{title}</Text>
        </View>
        <View style={styles.stepCardRight}>
          <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={22} color="#B82073" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Base Hajj Steps Data - will be translated in component
const BASE_HAJJ_STEPS = [
  { number: 1, key: 'wearingIhram' },
  { number: 2, key: 'intentionHajj' },
  { number: 3, key: 'recitingTalbiyah' },
  { number: 4, key: 'wukufArafah' },
  { number: 5, key: 'throwingJamarat' },
  { number: 6, key: 'tawafIfadhah' },
  { number: 7, key: 'sai' },
  { number: 8, key: 'secondTahallul' },
  { number: 9, key: 'mabitMina' },
];

export default function HajjGuideScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // Get translated steps
  const HAJJ_STEPS = BASE_HAJJ_STEPS.map(step => ({
    number: step.number,
    title: t(`hajjGuide.step${step.number}.title`),
  }));

  const handleStepPress = (stepNumber: number, title: string) => {
    router.push({
      pathname: '/hajjstepdetail',
      params: { stepNumber: stepNumber.toString(), title },
    });
  };

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
            source={require('@/assets/images/hajj guide.jpg')}
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
            <GradientText text={t('hajjGuide.title')} />
          </View>
        </View>

          {/* Modern Hajj Path Guide Section */}
          <View style={styles.pathGuideContainer}>
            <View style={styles.stepsList}>
              {HAJJ_STEPS.map((step, index, arr) => (
                <View key={step.number} style={styles.stepCardWrapper}>
                  <View style={[styles.stepTimelineRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <View style={styles.stepTimelineCol}>
                      <View style={styles.stepTimelineNodeOuter}>
                        <View style={styles.stepTimelineNodeInner} />
                      </View>
                      {index < arr.length - 1 && <View style={styles.stepTimelineConnector} />}
                    </View>
                    <View style={[styles.stepCardContentWrapper, isRTL && { paddingRight: 8, paddingLeft: 0 }]}>
                      <StepCard 
                        stepNumber={step.number} 
                        title={step.title}
                        onPress={() => handleStepPress(step.number, step.title)}
                        isRTL={isRTL}
                      />
                    </View>
                  </View>
                </View>
              ))}
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
  titleOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientMaskText: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  gradientHiddenText: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans-SemiBold',
    opacity: 0,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // Modern Path Guide Section
  pathGuideContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginTop: -12,
  },
  stepsList: {
    gap: 0,
  },
  stepCardWrapper: {
    marginBottom: 20,
  },
  stepTimelineRow: {
    flexDirection: 'row',
  },
  stepTimelineCol: {
    width: 32,
    alignItems: 'center',
    paddingTop: 4,
  },
  stepTimelineNodeOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    borderColor: 'rgba(184,32,115,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  stepTimelineNodeInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#B82073',
  },
  stepTimelineConnector: {
    width: 3,
    flex: 1,
    backgroundColor: 'rgba(184,32,115,0.25)',
    marginTop: 4,
    minHeight: 20,
  },
  stepCardContentWrapper: {
    flex: 1,
    paddingLeft: 12,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  stepCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  stepCardCenter: {
    flex: 1,
  },
  stepCardTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#1B131F',
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  stepCardRight: {
    marginLeft: 8,
  },
});



