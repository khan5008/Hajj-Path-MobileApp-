import BottomTabs from '@/components/bottom-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import {
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORAGE_KEY = '@hajjpath_requests';

export default function UserRequestFormScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [pilgrimName, setPilgrimName] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [requestType, setRequestType] = useState('');
  const [tentLocation, setTentLocation] = useState('');
  const [date, setDate] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
    'Inter-Regular': Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSubmit = async () => {
    if (!pilgrimName || !requestType || !tentLocation || !date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newRequest = {
      id: Date.now().toString(),
      pilgrim: pilgrimName,
      workerName: workerName,
      request: requestType,
      tent: tentLocation,
      date: date,
      additionalNotes: additionalNotes,
      status: 'pending' as const,
      submittedAt: new Date().toISOString(),
      fromUser: true,
    };

    try {
      // Get existing requests
      const existingRequests = await AsyncStorage.getItem(STORAGE_KEY);
      const requests = existingRequests ? JSON.parse(existingRequests) : [];
      
      // Add new request
      requests.push(newRequest);
      
      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
      
      // Mark that there's a new request for worker
      await AsyncStorage.setItem('@hajjpath_new_request', 'true');
      await AsyncStorage.setItem('@hajjpath_new_request_id', newRequest.id);
      
      Alert.alert('Success', 'Your request has been submitted successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#1B131F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('userRequest.title')}</Text>
            <View style={styles.headerSpacer} />
        </View>

        {/* Quick Action: Call Support */}
        <TouchableOpacity 
          style={styles.callSupportButton}
          onPress={() => router.push('/callsupport')}
        >
          <Ionicons name="call-outline" size={20} color="#952562" />
          <Text style={styles.callSupportText}>{t('userRequest.needHelp')}</Text>
        </TouchableOpacity>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{t('userRequest.formTitle')}</Text>
            <Text style={styles.formSubtitle}>{t('userRequest.formSubtitle')}</Text>

            {/* Pilgrim Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('userRequest.pilgrimName')} *</Text>
              <View style={[styles.inputContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="person-outline" size={20} color="#7A7A7A" />
                <TextInput
                  style={[styles.input, isRTL && { textAlign: 'right' }]}
                  placeholder={t('userRequest.pilgrimNamePlaceholder')}
                  placeholderTextColor="#9A9A9A"
                  value={pilgrimName}
                  onChangeText={setPilgrimName}
                />
              </View>
            </View>

            {/* Worker Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('userRequest.workerName') || 'Which Worker Name?'}</Text>
              <View style={[styles.inputContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="people-outline" size={20} color="#7A7A7A" />
                <TextInput
                  style={[styles.input, isRTL && { textAlign: 'right' }]}
                  placeholder={t('userRequest.workerNamePlaceholder') || 'Enter worker name (optional)'}
                  placeholderTextColor="#9A9A9A"
                  value={workerName}
                  onChangeText={setWorkerName}
                />
              </View>
            </View>

            {/* Request Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('userRequest.requestType')} *</Text>
              <View style={[styles.inputContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="create-outline" size={20} color="#7A7A7A" />
                <TextInput
                  style={[styles.input, isRTL && { textAlign: 'right' }]}
                  placeholder={t('userRequest.requestTypePlaceholder')}
                  placeholderTextColor="#9A9A9A"
                  value={requestType}
                  onChangeText={setRequestType}
                />
              </View>
            </View>

            {/* Tent Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('userRequest.tentLocation')} *</Text>
              <View style={[styles.inputContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="home-outline" size={20} color="#7A7A7A" />
                <TextInput
                  style={[styles.input, isRTL && { textAlign: 'right' }]}
                  placeholder={t('userRequest.tentLocationPlaceholder')}
                  placeholderTextColor="#9A9A9A"
                  value={tentLocation}
                  onChangeText={setTentLocation}
                />
              </View>
            </View>

            {/* Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('userRequest.date')} *</Text>
              <View style={[styles.inputContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="calendar-outline" size={20} color="#7A7A7A" />
                <TextInput
                  style={[styles.input, isRTL && { textAlign: 'right' }]}
                  placeholder={t('userRequest.datePlaceholder')}
                  placeholderTextColor="#9A9A9A"
                  value={date}
                  onChangeText={setDate}
                />
              </View>
            </View>

            {/* Additional Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('userRequest.additionalNotes')}</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="document-text-outline" size={20} color="#7A7A7A" style={styles.textAreaIcon} />
                <TextInput
                  style={[styles.input, styles.textArea, isRTL && { textAlign: 'right' }]}
                  placeholder={t('userRequest.additionalNotesPlaceholder')}
                  placeholderTextColor="#9A9A9A"
                  value={additionalNotes}
                  onChangeText={setAdditionalNotes}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <LinearGradient
              colors={['#B82073', '#1B131F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButton}
            >
              <TouchableOpacity onPress={handleSubmit} style={styles.submitButtonInner}>
                <Text style={styles.submitButtonText}>{t('userRequest.submitRequest')}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Quick Action: Call Support */}
          <TouchableOpacity 
            style={styles.callSupportButton}
            onPress={() => router.push('/callsupport')}
          >
            <Ionicons name="call-outline" size={20} color="#952562" />
            <Text style={styles.callSupportText}>{t('userRequest.needHelp')}</Text>
          </TouchableOpacity>
        </ScrollView>

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
    paddingTop: 16,
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
    fontSize: 24,
    color: '#1B131F',
    marginBottom: 8,
  },
  formSubtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#7A7A7A',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#1B131F',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  input: {
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: '#1B131F',
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textAreaIcon: {
    marginTop: 4,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 0,
  },
  submitButton: {
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  submitButtonInner: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  callSupportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(184, 32, 115, 0.1)',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  callSupportText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#952562',
  },
});



