import { useLanguage } from '@/contexts/LanguageContext';
import {
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContactAdminScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSubmit = () => {
    if (subject.trim() && message.trim()) {
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setSubject('');
        setMessage('');
        router.back();
      }, 2000);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color="#1B131F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('contactAdmin.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{t('contactAdmin.formTitle')}</Text>
            <Text style={styles.formSubtitle}>
              {t('contactAdmin.formSubtitle')}
            </Text>

            <Text style={styles.label}>{t('contactAdmin.subject')}</Text>
            <TextInput
              style={[styles.input, isRTL && { textAlign: 'right' }]}
              placeholder={t('contactAdmin.subjectPlaceholder')}
              placeholderTextColor="#9A9A9A"
              value={subject}
              onChangeText={setSubject}
            />

            <Text style={styles.label}>{t('contactAdmin.message')}</Text>
            <TextInput
              style={[styles.input, styles.textArea, isRTL && { textAlign: 'right' }]}
              placeholder={t('contactAdmin.messagePlaceholder')}
              placeholderTextColor="#9A9A9A"
              multiline
              numberOfLines={8}
              value={message}
              onChangeText={setMessage}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={!subject.trim() || !message.trim()}
            >
              <LinearGradient
                colors={['#B82073', '#1B131F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButtonGradient}
              >
                <Text style={styles.submitButtonText}>{t('contactAdmin.sendMessage')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.successModalContent}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
              <Text style={styles.successText}>{t('contactAdmin.messageSent')}</Text>
              <Text style={styles.successSubtext}>{t('contactAdmin.adminWillRespond')}</Text>
            </View>
          </View>
        </Modal>
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
  headerTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#1B131F',
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  formTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#1B131F',
    marginBottom: 8,
  },
  formSubtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#7A7A7A',
    marginBottom: 24,
    lineHeight: 20,
  },
  label: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#1B131F',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#1B131F',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 4,
  },
  textArea: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 24,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
  },
  successText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#1B131F',
    marginTop: 16,
    marginBottom: 8,
  },
  successSubtext: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#7A7A7A',
  },
});




