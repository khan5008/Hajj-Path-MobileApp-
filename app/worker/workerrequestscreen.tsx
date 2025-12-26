import WorkerBottomTabs from '@/components/worker-bottom-tabs';
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
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Keyboard,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterId = 'all' | 'pending' | 'inprogress' | 'completed';

type Request = {
  id: string;
  pilgrim: string;
  request: string;
  tent: string;
  date: string;
  status: FilterId;
  additionalNotes?: string;
  fromUser?: boolean;
};

const getDefaultRequests = (t: any): Request[] => [
  {
    id: '1',
    pilgrim: t('workerRequests.samplePilgrim1'),
    request: t('workerRequests.sampleRequest1'),
    tent: t('workerRequests.sampleTent1'),
    date: t('workerRequests.sampleDate1'),
    status: 'inprogress',
  },
  {
    id: '2',
    pilgrim: t('workerRequests.samplePilgrim2'),
    request: t('workerRequests.sampleRequest2'),
    tent: t('workerRequests.sampleTent2'),
    date: t('workerRequests.sampleDate2'),
    status: 'pending',
  },
  {
    id: '3',
    pilgrim: t('workerRequests.samplePilgrim3'),
    request: t('workerRequests.sampleRequest3'),
    tent: t('workerRequests.sampleTent3'),
    date: t('workerRequests.sampleDate3'),
    status: 'completed',
  },
];

const getFilterTabs = (t: any): { id: FilterId; label: string }[] => [
  { id: 'all', label: t('workerRequests.all') },
  { id: 'pending', label: t('workerRequests.pending') },
  { id: 'inprogress', label: t('workerRequests.inProgress') },
  { id: 'completed', label: t('workerRequests.completed') },
];

const STORAGE_KEY = '@hajjpath_requests';
const RESPONSE_STORAGE_KEY = '@hajjpath_request_responses';
const USER_NOTIFICATION_KEY = '@hajjpath_user_response_notification';

export default function WorkerRequestScreen() {
  const router = useRouter();
  const { t, isRTL, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const [requests, setRequests] = useState<Request[]>(() => getDefaultRequests(t));
  
  // Update requests when language changes
  useEffect(() => {
    setRequests(getDefaultRequests(t));
  }, [language, t]);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [responseText, setResponseText] = useState('');

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
    'Inter-Regular': Inter_400Regular,
  });

  useEffect(() => {
    loadRequests();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [])
  );

  const loadRequests = async () => {
    try {
      const storedRequests = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedRequests) {
        const userRequests = JSON.parse(storedRequests);
        // Merge with default requests, prioritizing user requests
        const allRequests = [...userRequests, ...getDefaultRequests(t).filter(
          dr => !userRequests.find((ur: Request) => ur.id === dr.id)
        )];
        setRequests(allRequests);
      } else {
        setRequests(getDefaultRequests(t));
      }
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const filteredRequests = activeFilter === 'all' 
    ? requests 
    : requests.filter(r => r.status === activeFilter);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, isRTL && { marginRight: 0, marginLeft: 12 }]}>
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#1B131F" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>{t('workerRequests.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.filterTabsRow, isRTL && { flexDirection: 'row-reverse' }]}
          >
            {getFilterTabs(t).map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveFilter(tab.id)}
                  activeOpacity={0.8}
                >
                  {isActive ? (
                    <View style={styles.filterTabActive}>
                      <Text style={[styles.filterTabActiveText, isRTL && { textAlign: 'right' }]}>{tab.label}</Text>
                    </View>
                  ) : (
                    <View style={styles.filterTabInactive}>
                      <Text style={[styles.filterTabInactiveText, isRTL && { textAlign: 'right' }]}>{tab.label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Request Cards */}
          <View style={styles.requestsContainer}>
            {filteredRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={48} color="#9A9A9A" />
                <Text style={[styles.emptyStateText, isRTL && { textAlign: 'right' }]}>{t('workerRequests.noRequestsFound')}</Text>
              </View>
            ) : (
              filteredRequests.map((request) => (
                <RequestCard 
                  key={request.id} 
                  request={request}
                  onUpdateStatus={(id, newStatus) => {
                    const updated = requests.map(r => 
                      r.id === id ? { ...r, status: newStatus } : r
                    );
                    setRequests(updated);
                    // Save to storage
                    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated.filter(r => r.fromUser)));
                  }}
                  onRespond={(req) => {
                    setSelectedRequest(req);
                    setShowResponseModal(true);
                  }}
                />
              ))
            )}
          </View>
        </ScrollView>

        <WorkerBottomTabs active="request" />
      </View>

      {/* Response Modal */}
      <Modal
        visible={showResponseModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowResponseModal(false);
          setResponseText('');
          setSelectedRequest(null);
        }}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            // Dismiss keyboard when touching outside, but keep modal open
            Keyboard.dismiss();
          }}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => {
              e.stopPropagation();
              // Dismiss keyboard when touching modal content area (but not input)
              Keyboard.dismiss();
            }}
          >
            <Text style={styles.modalTitle}>{t('workerRequests.respondToRequest')}</Text>
            <Text style={styles.modalSubtitle}>
              {t('workerRequests.pilgrim')}: {selectedRequest?.pilgrim}
            </Text>
            <Text style={styles.modalLabel}>{t('workerRequests.yourResponse')}:</Text>
            <TextInput
              style={[styles.responseInput, isRTL && { textAlign: 'right' }]}
              placeholder={t('workerRequests.responsePlaceholder')}
              placeholderTextColor="#9A9A9A"
              multiline
              numberOfLines={6}
              value={responseText}
              onChangeText={setResponseText}
              blurOnSubmit={false}
            />
            <View style={[styles.modalButtons, isRTL && { flexDirection: 'row-reverse' }]}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowResponseModal(false);
                  setResponseText('');
                  setSelectedRequest(null);
                }}
              >
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSendButton}
                onPress={async () => {
                  if (selectedRequest && responseText.trim()) {
                    // Save response
                    const responseData = {
                      requestId: selectedRequest.id,
                      pilgrim: selectedRequest.pilgrim,
                      response: responseText.trim(),
                      timestamp: new Date().toISOString(),
                    };
                    
                    try {
                      const existingResponses = await AsyncStorage.getItem(RESPONSE_STORAGE_KEY);
                      const responses = existingResponses ? JSON.parse(existingResponses) : [];
                      responses.push(responseData);
                      await AsyncStorage.setItem(RESPONSE_STORAGE_KEY, JSON.stringify(responses));
                      
                      // Save request data for user to see
                      await AsyncStorage.setItem(
                        '@hajjpath_user_request_data_' + selectedRequest.id,
                        JSON.stringify(selectedRequest)
                      );
                      
                      // Set notification flag for user
                      await AsyncStorage.setItem(USER_NOTIFICATION_KEY, 'true');
                      await AsyncStorage.setItem('@hajjpath_user_response_data', JSON.stringify(responseData));
                      
                      setShowResponseModal(false);
                      setResponseText('');
                      setSelectedRequest(null);
                    } catch (error) {
                      console.error('Error saving response:', error);
                    }
                  }
                }}
              >
                <LinearGradient
                  colors={['#B82073', '#1B131F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalSendButtonGradient}
                >
                  <Text style={styles.modalSendText}>{t('workerRequests.sendResponse')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function RequestCard({ request, onUpdateStatus, onRespond }: { request: Request; onUpdateStatus: (id: string, newStatus: FilterId) => void; onRespond: (req: Request) => void }) {
  const { t, isRTL } = useLanguage();
  const handleUpdate = () => {
    let newStatus: FilterId;
    if (request.status === 'pending') {
      newStatus = 'inprogress';
    } else if (request.status === 'inprogress') {
      newStatus = 'completed';
    } else {
      newStatus = 'pending'; // Cycle back to pending if needed
    }
    onUpdateStatus(request.id, newStatus);
  };

  const getStatusIcon = (status: FilterId) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'inprogress':
        return 'refresh-outline';
      case 'completed':
        return 'checkmark-circle-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const getStatusText = (status: FilterId) => {
    switch (status) {
      case 'pending':
        return t('workerRequests.pending');
      case 'inprogress':
        return t('workerRequests.inProgress');
      case 'completed':
        return t('workerRequests.completed');
      default:
        return t('workerRequests.all');
    }
  };

  return (
    <View style={styles.requestCard}>
      {request.fromUser && (
        <View style={[styles.newRequestBadge, isRTL && { left: 'auto', right: 12 }]}>
          <Text style={styles.newRequestBadgeText}>{t('workerRequests.new')}</Text>
        </View>
      )}
      <View style={[styles.requestRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <Ionicons name="person-outline" size={20} color="#952562" />
        <View style={[styles.requestTextContainer, isRTL && { alignItems: 'flex-end' }]}>
          <Text style={[styles.requestLabel, isRTL && { textAlign: 'right' }]}>{t('workerRequests.pilgrim')}</Text>
          <Text style={[styles.requestValue, isRTL && { textAlign: 'right' }]}>: {request.pilgrim}</Text>
        </View>
      </View>

      <View style={[styles.requestRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <Ionicons name="create-outline" size={20} color="#952562" />
        <View style={[styles.requestTextContainer, isRTL && { alignItems: 'flex-end' }]}>
          <Text style={[styles.requestLabel, isRTL && { textAlign: 'right' }]}>{t('workerRequests.request')}</Text>
          <Text style={[styles.requestValue, isRTL && { textAlign: 'right' }]}>: {request.request}</Text>
        </View>
      </View>

      <View style={[styles.requestRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <Ionicons name="home-outline" size={20} color="#952562" />
        <View style={[styles.requestTextContainer, isRTL && { alignItems: 'flex-end' }]}>
          <Text style={[styles.requestLabel, isRTL && { textAlign: 'right' }]}>{t('workerRequests.tent')}</Text>
          <Text style={[styles.requestValue, isRTL && { textAlign: 'right' }]}>: {request.tent}</Text>
        </View>
      </View>

      <View style={[styles.requestRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <Ionicons name="calendar-outline" size={20} color="#952562" />
        <View style={[styles.requestTextContainer, isRTL && { alignItems: 'flex-end' }]}>
          <Text style={[styles.requestLabel, isRTL && { textAlign: 'right' }]}>{t('workerRequests.date')}</Text>
          <Text style={[styles.requestValue, isRTL && { textAlign: 'right' }]}>: {request.date}</Text>
        </View>
      </View>

      {request.additionalNotes && (
        <View style={[styles.requestRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="document-text-outline" size={20} color="#952562" />
          <View style={[styles.requestTextContainer, isRTL && { alignItems: 'flex-end' }]}>
            <Text style={[styles.requestLabel, isRTL && { textAlign: 'right' }]}>{t('workerRequests.notes')}</Text>
            <Text style={[styles.requestValue, isRTL && { textAlign: 'right' }]}>: {request.additionalNotes}</Text>
          </View>
        </View>
      )}

      <View style={[styles.requestRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <Ionicons name={getStatusIcon(request.status) as any} size={20} color="#952562" />
        <View style={[styles.requestTextContainer, isRTL && { alignItems: 'flex-end' }]}>
          <Text style={[styles.requestLabel, isRTL && { textAlign: 'right' }]}>{t('workerRequests.status')}</Text>
          <Text style={[styles.requestValue, isRTL && { textAlign: 'right' }]}>: {getStatusText(request.status)}</Text>
        </View>
      </View>

      <View style={[styles.actionButtonsRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity 
          style={[styles.respondButton, isRTL && { flexDirection: 'row-reverse' }]}
          onPress={() => onRespond(request)}
        >
          <Ionicons name="chatbubble-outline" size={16} color="#FFFFFF" />
          <Text style={[styles.respondButtonText, isRTL && { marginLeft: 0, marginRight: 4 }]}>{t('workerRequests.respond')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleUpdate} style={styles.updateButtonContainer}>
          <LinearGradient
            colors={['#B82073', '#1B131F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.updateButton, isRTL && { flexDirection: 'row-reverse' }]}
          >
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
            <Text style={[styles.updateButtonText, isRTL && { marginLeft: 0, marginRight: 4 }]}>{t('workerRequests.update')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#F6F6F6',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: '#1B131F',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  newRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  newRequestText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  filterTabsRow: {
    gap: 12,
    paddingVertical: 4,
    marginBottom: 20,
  },
  filterTabActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#952562',
    marginRight: 8,
  },
  filterTabActiveText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#952562',
  },
  filterTabInactive: {
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
  },
  filterTabInactiveText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#45455F',
  },
  requestsContainer: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#9A9A9A',
    marginTop: 12,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  newRequestBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },
  newRequestBadgeText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  requestTextContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  requestLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#1B131F',
  },
  requestValue: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#1B131F',
    flex: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  respondButton: {
    flex: 1,
    backgroundColor: '#1B131F',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  respondButtonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  updateButtonContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  updateButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  updateButtonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
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
    marginBottom: 8,
  },
  modalSubtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#7A7A7A',
    marginBottom: 20,
  },
  modalLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#1B131F',
    marginBottom: 8,
  },
  responseInput: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#1B131F',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: '#7A7A7A',
  },
  modalSendButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalSendButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSendText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
});




