import BottomTabs from '@/components/bottom-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import {
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SupportType = 'medical' | 'fatwa' | 'transport' | 'hotel' | 'customer';

type SupportOption = {
  id: SupportType;
  title: string;
  subtitle: string;
  icon: string;
  phoneNumber: string;
};

// Support options will be created inside component to use translations
const getSupportOptions = (t: any): SupportOption[] => [
  {
    id: 'medical',
    title: t('callSupport.medicalSupport'),
    subtitle: t('callSupport.medicalSubtitle'),
    icon: 'medical-outline',
    phoneNumber: '+966501234567',
  },
  {
    id: 'fatwa',
    title: t('callSupport.fatwaSupport'),
    subtitle: t('callSupport.fatwaSubtitle'),
    icon: 'book-outline',
    phoneNumber: '+966501234568',
  },
  {
    id: 'transport',
    title: t('callSupport.transportHelp'),
    subtitle: t('callSupport.transportSubtitle'),
    icon: 'bus-outline',
    phoneNumber: '+966501234569',
  },
  {
    id: 'hotel',
    title: t('callSupport.hotelAssistance'),
    subtitle: t('callSupport.hotelSubtitle'),
    icon: 'bed-outline',
    phoneNumber: '+966501234570',
  },
  {
    id: 'customer',
    title: t('callSupport.customerCare'),
    subtitle: t('callSupport.customerSubtitle'),
    icon: 'call-outline',
    phoneNumber: '+966501234571',
  },
];

export default function CallSupportScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [selectedSupport, setSelectedSupport] = useState<SupportOption | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
    'Inter-Regular': Inter_400Regular,
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
  });

  useEffect(() => {
    if (isCalling) {
      // Pulse animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      // Timer
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        pulse.stop();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isCalling, pulseAnim]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSupportPress = (support: SupportOption) => {
    setSelectedSupport(support);
    setShowConfirmModal(true);
  };

  const handleConfirmCall = () => {
    setShowConfirmModal(false);
    setIsCalling(true);
    setCallDuration(0);
    
    // In a real app, this would initiate the actual call
    // For now, we'll simulate it
    Linking.openURL(`tel:${selectedSupport?.phoneNumber}`);
  };

  const handleEndCall = () => {
    setIsCalling(false);
    setCallDuration(0);
    setSelectedSupport(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  if (isCalling && selectedSupport) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#952562" />
        <View style={styles.callContainer}>
          <View style={styles.callHeader}>
            <Text style={styles.callHeaderTitle}>{selectedSupport.title}</Text>
            <Text style={styles.callHeaderSubtitle}>{t('callSupport.calling')}</Text>
          </View>

          <View style={styles.callContent}>
            <Animated.View
              style={[
                styles.callingIndicator,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <View style={styles.callingIconContainer}>
                <Ionicons name={selectedSupport.icon as any} size={48} color="#FFFFFF" />
              </View>
            </Animated.View>

            <Text style={styles.callTimer}>{formatTime(callDuration)}</Text>
            <Text style={styles.callStatus}>{t('callSupport.connected')}</Text>
          </View>

          <View style={[styles.callControls, isRTL && { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity style={styles.callControlButton}>
              <Ionicons name="mic-outline" size={24} color="#1B131F" />
              <Text style={styles.callControlLabel}>{t('callSupport.mute')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
              <Ionicons name="call" size={32} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.callControlButton}>
              <Ionicons name="volume-high-outline" size={24} color="#1B131F" />
              <Text style={styles.callControlLabel}>{t('callSupport.speaker')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1B131F" />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.mainTitle}>{t('callSupport.title')}</Text>
            <Text style={styles.subtitle}>{t('callSupport.subtitle')}</Text>
          </View>

          {/* Support Options */}
          <View style={styles.supportOptionsContainer}>
            {getSupportOptions(t).map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.supportCard}
                onPress={() => handleSupportPress(option)}
                activeOpacity={0.7}
              >
                <View style={[styles.supportCardContent, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View style={styles.supportIconContainer}>
                    <Ionicons name={option.icon as any} size={24} color="#952562" />
                  </View>
                  <View style={styles.supportTextContainer}>
                    <Text style={styles.supportTitle}>{option.title}</Text>
                    <Text style={styles.supportSubtitle}>{option.subtitle}</Text>
                  </View>
                  <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color="#9A9A9A" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Confirmation Modal */}
        <Modal
          visible={showConfirmModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowConfirmModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('callSupport.confirmCall')}</Text>
              <Text style={styles.modalText}>
                {t('callSupport.confirmCallText').replace('{title}', selectedSupport?.title || '')}
              </Text>
              <View style={[styles.modalButtons, isRTL && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity
                  style={styles.modalButtonSecondary}
                  onPress={() => setShowConfirmModal(false)}
                >
                  <Text style={styles.modalButtonSecondaryText}>{t('callSupport.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonPrimary}
                  onPress={handleConfirmCall}
                >
                  <LinearGradient
                    colors={['#B82073', '#1B131F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.modalButtonGradient}
                  >
                    <Ionicons name="call" size={18} color="#FFFFFF" />
                    <Text style={styles.modalButtonPrimaryText}>{t('callSupport.callNow')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <BottomTabs active="profile" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F6F6F6',
  },
  backButton: {
    padding: 4,
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    color: '#1B131F',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: '#7A7A7A',
  },
  supportOptionsContainer: {
    gap: 12,
  },
  supportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  supportCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  supportIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(184, 32, 115, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#952562',
  },
  supportTextContainer: {
    flex: 1,
  },
  supportTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#1B131F',
    marginBottom: 4,
  },
  supportSubtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    color: '#7A7A7A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#1B131F',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: '#4C4C4C',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonSecondaryText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: '#7A7A7A',
  },
  modalButtonPrimary: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  modalButtonPrimaryText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  callContainer: {
    flex: 1,
    backgroundColor: '#952562',
  },
  callHeader: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  callHeaderTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  callHeaderSubtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  callContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  callingIndicator: {
    marginBottom: 32,
  },
  callingIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  callTimer: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  callStatus: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  callControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  callControlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    gap: 4,
  },
  callControlLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 11,
    color: '#1B131F',
  },
  endCallButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});



