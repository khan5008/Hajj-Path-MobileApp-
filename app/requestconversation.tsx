import { useLanguage } from '@/contexts/LanguageContext';
import {
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORAGE_KEY = '@hajjpath_requests';
const RESPONSE_STORAGE_KEY = '@hajjpath_request_responses';

export default function RequestConversationScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const params = useLocalSearchParams();
  const requestId = params.requestId as string;
  const pilgrim = params.pilgrim as string;

  const [request, setRequest] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
  });

  useEffect(() => {
    loadConversation();
  }, [requestId]);

  const loadConversation = async () => {
    try {
      // Load request
      const requestData = await AsyncStorage.getItem('@hajjpath_user_request_data_' + requestId);
      if (requestData) {
        setRequest(JSON.parse(requestData));
      } else {
        // Try loading from requests storage
        const allRequests = await AsyncStorage.getItem(STORAGE_KEY);
        if (allRequests) {
          const requests = JSON.parse(allRequests);
          const foundRequest = requests.find((r: any) => r.id === requestId);
          if (foundRequest) {
            setRequest(foundRequest);
          }
        }
      }

      // Load response
      const responsesData = await AsyncStorage.getItem(RESPONSE_STORAGE_KEY);
      if (responsesData) {
        const responses = JSON.parse(responsesData);
        const foundResponse = responses.find((r: any) => r.requestId === requestId);
        if (foundResponse) {
          setResponse(foundResponse);
        }
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, isRTL && { marginRight: 0, marginLeft: 12 }]}
        >
          <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color="#1B131F" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>
            {t('conversation.title')}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Request Section */}
        {request && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="person-outline" size={20} color="#B82073" />
              <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>
                {t('conversation.yourRequest')}
              </Text>
            </View>
            
            <View style={styles.messageCard}>
              <View style={[styles.messageRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="create-outline" size={18} color="#77798A" style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} />
                <View style={[styles.messageContent, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.messageLabel, isRTL && { textAlign: 'right' }]}>
                    {t('conversation.request')}
                  </Text>
                  <Text style={[styles.messageText, isRTL && { textAlign: 'right' }]}>
                    {request.request}
                  </Text>
                </View>
              </View>

              {request.tent && (
                <View style={[styles.messageRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="home-outline" size={18} color="#77798A" style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} />
                  <View style={[styles.messageContent, isRTL && { alignItems: 'flex-end' }]}>
                    <Text style={[styles.messageLabel, isRTL && { textAlign: 'right' }]}>
                      {t('conversation.tent')}
                    </Text>
                    <Text style={[styles.messageText, isRTL && { textAlign: 'right' }]}>
                      {request.tent}
                    </Text>
                  </View>
                </View>
              )}

              {request.date && (
                <View style={[styles.messageRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="calendar-outline" size={18} color="#77798A" style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} />
                  <View style={[styles.messageContent, isRTL && { alignItems: 'flex-end' }]}>
                    <Text style={[styles.messageLabel, isRTL && { textAlign: 'right' }]}>
                      {t('conversation.date')}
                    </Text>
                    <Text style={[styles.messageText, isRTL && { textAlign: 'right' }]}>
                      {request.date}
                    </Text>
                  </View>
                </View>
              )}

              {request.additionalNotes && (
                <View style={[styles.messageRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="document-text-outline" size={18} color="#77798A" style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} />
                  <View style={[styles.messageContent, isRTL && { alignItems: 'flex-end' }]}>
                    <Text style={[styles.messageLabel, isRTL && { textAlign: 'right' }]}>
                      {t('conversation.notes')}
                    </Text>
                    <Text style={[styles.messageText, isRTL && { textAlign: 'right' }]}>
                      {request.additionalNotes}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Response Section */}
        {response && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#B82073" />
              <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>
                {t('conversation.workerResponse')}
              </Text>
            </View>
            
            <View style={[styles.messageCard, styles.responseCard]}>
              <Text style={[styles.responseText, isRTL && { textAlign: 'right' }]}>
                {response.response}
              </Text>
              {response.timestamp && (
                <Text style={[styles.timestamp, isRTL && { textAlign: 'right' }]}>
                  {new Date(response.timestamp).toLocaleString()}
                </Text>
              )}
            </View>
          </View>
        )}

        {!response && (
          <View style={styles.noResponseContainer}>
            <Ionicons name="time-outline" size={48} color="#9A9A9A" />
            <Text style={[styles.noResponseText, isRTL && { textAlign: 'right' }]}>
              {t('conversation.noResponseYet')}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#1B131F',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    color: '#1B131F',
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  responseCard: {
    backgroundColor: '#F8F0F5',
    borderWidth: 1,
    borderColor: '#FFE5F2',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  messageContent: {
    flex: 1,
  },
  messageLabel: {
    fontSize: 12,
    fontFamily: 'OpenSans-SemiBold',
    color: '#77798A',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#212529',
    lineHeight: 20,
  },
  responseText: {
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
    color: '#212529',
    lineHeight: 22,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#77798A',
  },
  noResponseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResponseText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#9A9A9A',
    marginTop: 12,
  },
});

