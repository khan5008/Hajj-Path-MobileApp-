import NotificationPopup from '@/components/NotificationPopup';
import WorkerBottomTabs from '@/components/worker-bottom-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import {
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import {
    PlusJakartaSans_400Regular,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
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
import Svg, { Defs, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getRecentRequests = (t: any) => [
  {
    id: '1',
    pilgrim: t('workerHome.samplePilgrim1'),
    request: t('workerHome.sampleRequest1'),
    status: 'pending',
    tent: 'B12, Row 3',
    date: t('workerRequests.sampleDate1'),
    image: require('@/assets/images/profilepic.png'),
  },
  {
    id: '2',
    pilgrim: t('workerHome.samplePilgrim2'),
    request: t('workerHome.sampleRequest2'),
    status: 'completed',
    tent: 'A5, Row 1',
    date: t('workerRequests.sampleDate2'),
    image: require('@/assets/images/fatima.jpg'),
  },
  {
    id: '3',
    pilgrim: t('workerRequests.samplePilgrim1'),
    request: t('workerRequests.sampleRequest1'),
    status: 'inProgress',
    tent: t('workerRequests.sampleTent1'),
    date: t('workerRequests.sampleDate1'),
    image: require('@/assets/images/profilepic.png'),
  },
  {
    id: '4',
    pilgrim: t('workerRequests.samplePilgrim2'),
    request: t('workerRequests.sampleRequest2'),
    status: 'pending',
    tent: t('workerRequests.sampleTent2'),
    date: t('workerRequests.sampleDate2'),
    image: require('@/assets/images/fatima.jpg'),
  },
];

export default function WorkerHomeScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [hasNewRequest, setHasNewRequest] = useState(false);
  const [newRequestInfo, setNewRequestInfo] = useState<any>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showRequestNotification, setShowRequestNotification] = useState(false);
  const [requestNotificationMessage, setRequestNotificationMessage] = useState('');
  const [requestNotificationData, setRequestNotificationData] = useState<any>(null);
  const [recentRequests, setRecentRequests] = useState(() => getRecentRequests(t));
  const noticeAnim = useRef(new Animated.Value(0)).current;
  const [fontsLoaded] = useFonts({
    'OpenSans-Bold': OpenSans_700Bold,
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'Inter-Regular': Inter_400Regular,
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
  });

  useEffect(() => {
    checkForNewRequests();
    loadRecentRequests();
    
    // Set up interval to check for new requests
    const interval = setInterval(() => {
      checkForNewRequests();
      loadRecentRequests();
    }, 2000);

    return () => clearInterval(interval);
  }, [t]);

  useEffect(() => {
    if (!fontsLoaded || !showNoticeModal) {
      return;
    }
    noticeAnim.setValue(0);
    Animated.timing(noticeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showNoticeModal, fontsLoaded]);

  const loadRecentRequests = async () => {
    try {
      const storedRequests = await AsyncStorage.getItem('@hajjpath_requests');
      const defaultRequests = getRecentRequests(t);
      
      if (storedRequests) {
        const userRequests = JSON.parse(storedRequests);
        // Sort by submittedAt (newest first) and merge with defaults
        const sortedUserRequests = userRequests
          .sort((a: any, b: any) => {
            const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
            const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 4)
          .map((r: any) => ({
            ...r,
            image: require('@/assets/images/profilepic.png'),
          }));
        
        // Merge with defaults, prioritizing user requests
        const allRequests = [
          ...sortedUserRequests,
          ...defaultRequests.filter(dr => !sortedUserRequests.find((ur: any) => ur.id === dr.id))
        ].slice(0, 4);
        
        setRecentRequests(allRequests);
      } else {
        setRecentRequests(defaultRequests);
      }
    } catch (error) {
      console.error('Error loading recent requests:', error);
    }
  };

  const checkForNewRequests = async () => {
    try {
      const hasNew = await AsyncStorage.getItem('@hajjpath_new_request');
      const requestId = await AsyncStorage.getItem('@hajjpath_new_request_id');
      
      if (hasNew === 'true' && requestId) {
        // Get the request details
        const requestsData = await AsyncStorage.getItem('@hajjpath_requests');
        if (requestsData) {
          const requests = JSON.parse(requestsData);
          const newReq = requests.find((r: any) => r.id === requestId);
          if (newReq) {
            setHasNewRequest(true);
            setNewRequestInfo(newReq);
            
            // Show notification popup
            const message = `${t('notifications.newRequest')} ${newReq.pilgrim}`;
            setRequestNotificationMessage(message);
            setRequestNotificationData(newReq);
            setShowRequestNotification(true);
            
            // Clear notification flag after showing
            await AsyncStorage.setItem('@hajjpath_new_request', 'false');
          }
        }
      }
    } catch (error) {
      console.error('Error checking for new requests:', error);
    }
  };

  const handleNotificationClick = () => {
    if (hasNewRequest) {
      // Navigate to request screen
      router.push('/worker/workerrequestscreen');
    } else {
      setShowNoticeModal(true);
    }
  };

  const handleRequestNotificationPress = () => {
    setShowRequestNotification(false);
    if (requestNotificationData) {
      router.push('/worker/workerrequestscreen');
    }
  };

  const handleViewRequest = () => {
    setShowNoticeModal(false);
    AsyncStorage.setItem('@hajjpath_new_request', 'false');
    setHasNewRequest(false);
    router.push('/worker/workerrequestscreen');
  };

  const handleRequestCardPress = (request: any) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#B82073" />
      
      {/* Notification Popup */}
      <NotificationPopup
        visible={showRequestNotification}
        message={requestNotificationMessage}
        onPress={handleRequestNotificationPress}
        onDismiss={() => setShowRequestNotification(false)}
        type="request"
      />
      
      {/* Header with Pink to Black Gradient - Extends into SafeArea */}
      <LinearGradient
        colors={['#B82073', '#1B131F']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContainer}>
            <View pointerEvents="none" style={styles.headerFrameBase}>
              <View style={styles.headerPatternWrapper}>
                <HeaderFramePattern
                  width={SCREEN_WIDTH}
                  height={SCREEN_WIDTH * (422 / 375)}
                />
              </View>
            </View>
            <View style={styles.headerContent}>
              {/* Status Bar Area */}
              <View style={styles.statusBarArea}>
                <Text style={styles.statusTime}></Text>
              </View>
              {/* Greeting Section */}
              <View style={[styles.greetingRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.greetingTexts, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.greetingLine, isRTL && { textAlign: 'right' }]}>{t('workerHome.greeting')}</Text>
                  <Text style={[styles.nameText, isRTL && { textAlign: 'right' }]}>{t('workerHome.workerName')}</Text>
                </View>
                <View style={[styles.rightIcons, isRTL && { flexDirection: 'row-reverse' }]}>
                  <TouchableOpacity style={styles.bellButton} onPress={handleNotificationClick}>
                    <Ionicons name="notifications" size={16} color="#8A0D4A" />
                    {hasNewRequest && (
                      <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>!</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/worker/workerprofilescreen')}>
                    <Image
                      source={require('@/assets/images/profilepic.png')}
                      style={styles.avatar}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Search Bar */}
              <View style={[styles.searchBox, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="search-outline" size={18} color="#999" />
                <TextInput
                  style={[styles.searchField, isRTL && { textAlign: 'right' }]}
                  placeholder={t('workerHome.searchPlaceholder')}
                  placeholderTextColor="#B0B0B0"
                />
                <TouchableOpacity style={styles.filterIconButton}>
                  <Ionicons name="options-outline" size={18} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      
      <View style={styles.container}>
        {/* Main Content */}
        <ScrollView 
          style={styles.mainScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Your Pilgrim Group Card */}
          <View style={styles.pilgrimGroupCard}>
            {/* Glassmorphism Content */}
            <BlurView intensity={20} tint="light" style={styles.cardBlurContent}>
              <Text style={[styles.pilgrimGroupTitle, isRTL && { textAlign: 'right' }]}>{t('workerHome.yourPilgrimGroup')}</Text>
              
              {/* Info Chips */}
              <View style={[styles.infoChipsContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.infoChip, isRTL && { flexDirection: 'row-reverse' }]}>
                  <TentIcon width={18} height={13} />
                  <Text style={[styles.infoChipText, isRTL && { marginLeft: 0, marginRight: 6 }]}>45 {t('workerHome.assigned')}</Text>
                </View>
                
                <View style={[styles.infoChip, isRTL && { flexDirection: 'row-reverse' }]}>
                  <TentIcon width={18} height={13} />
                  <Text style={[styles.infoChipText, isRTL && { marginLeft: 0, marginRight: 6 }]}>{t('workerHome.tent')} #3</Text>
                </View>
              </View>
              
              <View style={[styles.infoChipsRow2, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.infoChip, isRTL && { flexDirection: 'row-reverse' }]}>
                  <BusIcon width={18} height={18} />
                  <Text style={[styles.infoChipText, isRTL && { marginLeft: 0, marginRight: 6 }]}>{t('workerHome.bus')} A - {t('workerHome.gate')} 4</Text>
                </View>
                
                <View style={[styles.infoChip, isRTL && { flexDirection: 'row-reverse' }]}>
                  <HealthAlertIcon width={18} height={15} />
                  <Text style={[styles.infoChipText, isRTL && { marginLeft: 0, marginRight: 6 }]}>2 {t('workerHome.healthAlerts')}</Text>
                </View>
              </View>
              
              {/* Centered Gradient Button */}
              <TouchableOpacity 
                style={styles.viewDashboardButton}
                onPress={() => router.push('/worker/workergroupdashboardscreen')}
              >
                <LinearGradient
                  colors={['#C0276C', '#692466']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.viewDashboardGradient, isRTL && { flexDirection: 'row-reverse' }]}
                >
                  <Text style={[styles.viewDashboardText, isRTL && { textAlign: 'right' }]}>{t('workerHome.viewGroupDashboard')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>
            {/* Gradient Accent Strip at Bottom */}
            <LinearGradient
              colors={['#B82073', '#1B131F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cardAccentStripBottom}
            />
          </View>
          {/* Quick Actions Section */}
          <View style={styles.quickActionsSection}>
            <Text style={[styles.sectionTitle, isRTL && { textAlign: 'right' }]}>{t('workerHome.quickActions')}</Text>
            <View style={[styles.quickActionsGrid, isRTL && { flexDirection: 'row-reverse' }]}>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/worker/workeressentialscreen')}
              >
                <View style={styles.quickActionIconContainer}>
                  <Ionicons name="book-outline" size={24} color="#952562" />
                </View>
                <Text style={styles.quickActionLabel}>{t('workerHome.essentials')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/worker/workermealsscreen')}
              >
                <View style={styles.quickActionIconContainer}>
                  <Ionicons name="restaurant-outline" size={24} color="#952562" />
                </View>
                <Text style={styles.quickActionLabel}>{t('workerHome.meals')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/worker/workerrequestscreen')}
              >
                <View style={styles.quickActionIconContainer}>
                  <Ionicons name="document-text-outline" size={24} color="#952562" />
                </View>
                <Text style={styles.quickActionLabel}>{t('workerHome.requests')}</Text>
              </TouchableOpacity>
   </View>
          </View>

          {/* Recent Pilgrim Requests Section */}
          <View style={styles.pilgrimRequestSection}>
            <View style={[styles.sectionHeaderRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={[styles.sectionTitle, styles.pilgrimRequestTitle]}>{t('workerHome.recentPilgrimRequests')}</Text>
              <TouchableOpacity onPress={() => router.push('/worker/workerrequestscreen')}>
                <Text style={styles.viewAllText}>{t('workerHome.viewAll')}</Text>
              </TouchableOpacity>
            </View>

            {recentRequests.map((request, index) => (
              <React.Fragment key={request.id}>
                <TouchableOpacity 
                  style={[styles.pilgrimCard, isRTL && { flexDirection: 'row-reverse' }]}
                  onPress={() => handleRequestCardPress(request)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.pilgrimAvatarContainer, isRTL && { marginRight: 0, marginLeft: 12 }]}>
                    <Image
                      source={request.image}
                      style={styles.pilgrimAvatar}
                    />
                  </View>
                  <View style={[styles.pilgrimTextColumn, isRTL && { alignItems: 'flex-end', paddingRight: 8, paddingLeft: 0 }]}>
                    <Text style={[styles.pilgrimName, isRTL && { textAlign: 'right' }]}>{request.pilgrim}</Text>
                    <Text style={[styles.pilgrimRequestText, isRTL && { textAlign: 'right' }]} numberOfLines={2}>
                      {request.request}
                    </Text>
                    <View style={[styles.pilgrimBadgeRow, isRTL && { flexDirection: 'row-reverse' }]}>
                      <View style={
                        request.status === 'completed' ? styles.completedBadge :
                        request.status === 'inProgress' ? styles.inProgressBadge :
                        styles.pendingBadge
                      }>
                        <Text style={styles.badgeText}>
                          {request.status === 'completed' ? t('workerRequests.completed') :
                           request.status === 'inProgress' ? t('workerRequests.inProgress') :
                           t('workerRequests.pending')}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.pilgrimRightColumn, isRTL && { marginRight: 12, marginLeft: 0 }]}>
                    <ArrowCircleIcon />
                  </View>
                </TouchableOpacity>
                {index < recentRequests.length - 1 && <View style={styles.requestDivider} />}
              </React.Fragment>
            ))}
          </View>
        </ScrollView>

        <WorkerBottomTabs active="home" />
      </View>

      {/* Request Detail Modal */}
      <Modal
        transparent
        visible={showRequestModal}
        animationType="fade"
        onRequestClose={() => setShowRequestModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRequestModal(false)}
        >
          <View style={[styles.requestModalContent, isRTL && { direction: 'rtl' }]} onStartShouldSetResponder={() => true}>
            {selectedRequest && (
              <>
                <View style={[styles.requestModalHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View style={[styles.requestModalHeaderLeft, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Image
                      source={selectedRequest.image}
                      style={[styles.requestModalAvatar, isRTL && { marginRight: 0, marginLeft: 12 }]}
                    />
                    <View style={isRTL && { alignItems: 'flex-end' }}>
                      <Text style={[styles.requestModalPilgrimName, isRTL && { textAlign: 'right' }]}>{selectedRequest.pilgrim}</Text>
                      <View style={[
                        styles.requestModalStatusBadge,
                        selectedRequest.status === 'completed' ? styles.completedBadge :
                        selectedRequest.status === 'inProgress' ? styles.inProgressBadge :
                        styles.pendingBadge,
                        isRTL && { alignSelf: 'flex-end' }
                      ]}>
                        <Text style={styles.badgeText}>
                          {selectedRequest.status === 'completed' ? t('workerRequests.completed') :
                           selectedRequest.status === 'inProgress' ? t('workerRequests.inProgress') :
                           t('workerRequests.pending')}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                    <Ionicons name="close" size={24} color="#1B131F" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.requestModalDivider} />
                
                <View style={styles.requestModalBody}>
                  <View style={styles.requestModalRow}>
                    <Text style={[styles.requestModalLabel, isRTL && { textAlign: 'right' }]}>{t('workerRequests.request')}:</Text>
                    <Text style={[styles.requestModalValue, isRTL && { textAlign: 'right' }]}>{selectedRequest.request}</Text>
                  </View>
                  
                  <View style={styles.requestModalRow}>
                    <Text style={[styles.requestModalLabel, isRTL && { textAlign: 'right' }]}>{t('workerRequests.tent')}:</Text>
                    <Text style={[styles.requestModalValue, isRTL && { textAlign: 'right' }]}>{selectedRequest.tent}</Text>
                  </View>
                  
                  <View style={styles.requestModalRow}>
                    <Text style={[styles.requestModalLabel, isRTL && { textAlign: 'right' }]}>{t('workerRequests.date')}:</Text>
                    <Text style={[styles.requestModalValue, isRTL && { textAlign: 'right' }]}>{selectedRequest.date}</Text>
                  </View>
                </View>
                
                <View style={[styles.requestModalButtons, isRTL && { flexDirection: 'row-reverse' }]}>
                  <TouchableOpacity
                    style={styles.requestModalButtonSecondary}
                    onPress={() => setShowRequestModal(false)}
                  >
                    <Text style={[styles.requestModalButtonSecondaryText, isRTL && { textAlign: 'right' }]}>{t('common.close')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.requestModalButton}
                    onPress={() => {
                      setShowRequestModal(false);
                      router.push('/worker/workerrequestscreen');
                    }}
                  >
                    <LinearGradient
                      colors={['#B82073', '#1B131F']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.requestModalButtonGradient}
                    >
                      <Text style={styles.requestModalButtonText}>{t('workerRequests.respond')}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        transparent
        visible={showNoticeModal}
        animationType="fade"
        onRequestClose={() => setShowNoticeModal(false)}
      >
        <View style={styles.noticeOverlay}>
          <Animated.View
            style={[
              styles.noticeSheet,
              {
                opacity: noticeAnim,
                transform: [
                  {
                    scaleY: noticeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.noticePointer} />
            <View style={styles.noticeInner}>
              {hasNewRequest && newRequestInfo ? (
                <>
                  <View style={styles.newRequestHeader}>
                    <Ionicons name="notifications" size={24} color="#952562" />
                    <Text style={styles.noticeTitle}>{t('workerHome.newRequestAlert')}</Text>
                  </View>
                  <Text style={styles.noticeBody}>
                    <Text style={styles.boldText}>{newRequestInfo.pilgrim}</Text> {t('workerHome.hasSubmittedRequest')}
                  </Text>
                  <View style={styles.requestPreview}>
                    <Text style={styles.requestPreviewTitle}>{newRequestInfo.request}</Text>
                    <Text style={styles.requestPreviewDetails}>
                      {t('workerHome.tent')}: {newRequestInfo.tent} • {t('workerHome.date')}: {newRequestInfo.date}
                    </Text>
                  </View>
                  <View style={[styles.noticeButtonsRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <TouchableOpacity
                      style={styles.noticeButtonSecondary}
                      onPress={() => {
                        setShowNoticeModal(false);
                        AsyncStorage.setItem('@hajjpath_new_request', 'false');
                        setHasNewRequest(false);
                      }}
                    >
                      <Text style={styles.noticeButtonSecondaryText}>{t('common.dismiss')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.noticeButton}
                      onPress={handleViewRequest}
                    >
                      <Text style={styles.noticeButtonText}>{t('workerHome.viewRequest')}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.noticeTitle}>Important information for workers</Text>
                  <Text style={styles.noticeBody}>
                    Please monitor your assigned pilgrims, check tent assignments, and respond to health alerts promptly.
                  </Text>
                  <TouchableOpacity
                    style={styles.noticeButton}
                    onPress={() => setShowNoticeModal(false)}
                  >
                    <Text style={styles.noticeButtonText}>Got it</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

// Header Frame Pattern Component
function HeaderFramePattern({ width = 375, height = 422 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 375 422" fill="none">
      <Path
        d="M497.144 386.709L502.541 378.783L503.002 378.082L512.546 381.378V409.435L497.144 386.709ZM479.305 381.378L488.06 378.362H488.85L494.708 386.99L479.305 409.505V381.378ZM313.233 386.709L318.631 378.853L319.092 378.152L328.636 381.449V409.505L313.233 386.709ZM295.395 381.378L304.15 378.362H304.94L310.798 386.92L295.395 409.505V381.378ZM129.192 386.709L134.655 378.783L135.116 378.082L144.595 381.378V409.435L129.192 386.709ZM111.42 381.378L120.174 378.362H120.964L126.822 386.99L111.42 409.155V381.378ZM-54.784 386.709L-49.3864 378.783L-48.9257 378.082L-39.3813 381.378V409.435L-54.784 386.709ZM-72.622 381.378L-63.8675 378.362H-63.0777L-57.2194 386.99L-72.622 409.576V381.378ZM514.587 380.116V369.454L523.341 366.438H524.131L539.468 388.954L514.587 380.116ZM467.523 366.859L467.984 366.157L477.528 369.454V379.695L452.581 388.323L467.523 366.859ZM330.545 379.695V369.174L339.234 366.157H340.024L355.426 388.743L330.545 379.695ZM283.481 366.438L284.008 365.737L293.487 369.033V379.695L268.605 388.323L283.481 366.438ZM146.569 379.695V369.033L155.324 366.017H156.048L171.45 388.603L146.569 379.695ZM99.5056 366.438L99.9664 365.737L109.445 369.033V379.695L84.5638 388.252L99.5056 366.438ZM-37.4724 379.695V369.103L-28.718 366.017H-27.9281L-12.5913 388.603L-37.4724 379.695ZM-84.536 366.438L-84.0753 365.737L-74.5309 369.033V379.695L-99.4779 388.323L-84.536 366.438ZM571.458 399.686V381.098L587.19 358.091L588.045 356.758L604.633 381.098V399.756L588.045 405.437L571.458 399.686ZM387.153 399.686V381.098L402.885 358.091L403.806 356.758L420.394 381.098V399.686L403.74 405.437L387.153 399.686ZM203.177 399.686V381.098L218.843 358.091L219.765 356.758L236.352 381.098V399.686L219.765 405.437L203.177 399.686ZM18.8722 399.686V381.098L34.6039 358.091L35.4597 356.758L52.0471 381.098V399.756L35.4597 405.437L18.8722 399.686ZM-165.433 399.686V381.098L-149.701 358.091L-148.779 356.758L-132.192 381.098V399.686L-147.924 405.016L-165.433 399.686ZM541.838 390.076L526.04 365.666L552.369 356.478L568.957 362.229V380.817L558.688 395.828L541.838 390.076ZM421.776 380.747V362.159L437.969 356.548H438.363L465.153 365.877L448.566 390.146L431.979 395.898L421.776 380.747ZM358.915 389.585L342.327 365.246L368.657 356.057H369.052L385.639 361.809V380.396L375.371 395.477L358.915 389.585ZM238.853 380.186V361.598L255.112 355.987L281.967 365.316L265.446 389.515L248.793 395.267L238.853 380.186ZM174.61 389.515L158.022 365.105L184.352 355.987H184.681L201.268 361.739V380.326L191 395.407L174.61 389.515ZM54.5484 380.116V361.528L70.8067 355.917H71.1358L97.9917 365.246L81.4042 389.585L64.8168 395.337L54.5484 380.116ZM-9.69505 389.375L-26.2825 365.035L0.0467682 355.847H0.3759L17.0292 361.598V380.186L6.82657 395.196L-9.69505 389.375ZM-129.493 380.046V361.458L-113.301 355.847H-112.906L-86.05 365.176L-102.703 389.515L-119.291 395.196L-129.493 380.046ZM518.997 354.935L524.394 347.009L524.855 346.307L549.736 354.935L524.855 363.562L518.997 354.935ZM442.379 354.935L466.47 346.588H467.26L473.118 355.215L467.26 363.843L442.379 354.935ZM334.955 354.935L340.353 347.079L340.879 346.377L365.497 354.865L340.55 363.422L334.955 354.935ZM258.337 354.935L282.494 346.588H283.218L289.142 355.215L283.218 363.843L258.337 354.935ZM150.914 354.935L156.377 347.009L156.838 346.307L181.719 354.935L156.838 363.562L150.914 354.935ZM74.2953 354.935L98.4525 346.588H99.2423L105.101 355.215L99.2423 363.843L74.2953 354.935ZM-33.0623 354.935L-27.6648 347.009L-27.204 346.307L-2.32286 354.935L-27.204 363.562L-33.0623 354.935ZM-109.68 354.935L-85.5892 346.588H-84.7993L-78.9411 355.145L-84.7993 363.773L-109.68 354.935ZM589.296 354.935L604.699 332.419V349.604L620.101 354.935L604.699 360.266V377.521L589.296 354.935ZM571.458 360.266L556.055 354.935L571.458 349.604V332.419L586.861 354.935L571.458 377.521V360.266ZM404.991 354.865L420.394 332.279V349.534L435.796 354.865L420.394 360.195V377.45L404.991 354.865ZM387.219 360.195L372.079 354.865L387.482 349.534V332.279L402.819 354.865L387.416 377.38L387.219 360.195ZM220.949 354.794L236.352 332.209V349.464L251.755 354.794L236.352 360.125V377.31L220.949 354.794ZM203.177 360.125L187.775 354.724L203.177 349.393V332.209L218.58 354.794L203.177 377.31V360.125ZM36.9736 354.654L52.3762 332.138V349.323L67.713 354.724L52.3104 359.985V377.24L36.9736 354.654ZM19.1355 359.985L3.73288 354.654L19.1355 349.323V332.138L34.5381 354.654L19.1355 377.24V359.985ZM-147.068 354.584L-131.665 332.068V349.253L-116.263 354.584L-131.665 359.915V377.17L-147.068 354.584ZM-164.84 359.915L-180.243 354.584L-164.84 349.253V331.998L-149.504 354.584L-164.906 377.17L-164.84 359.915Z"
        fill="white"
        fillOpacity={0.1}
      />
    </Svg>
  );
}

// Tent Icon SVG
function TentIcon({ width = 21, height = 15 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 21 15" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_68_392" x1="0" y1="0" x2="14.1892" y2="19.8649" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path d="M7.52762 7.72208L5.28535 1.21904V15H10.0371L7.52762 7.72208ZM7.98924 7.27792L10.6524 14.9999H21L18.4904 7.7202L15.8272 0H5.48068L7.98924 7.27792ZM11.0682 4.37692H14.3099L15.4117 7.57342H12.17L11.0682 4.37692ZM0 14.9997H4.75178L4.75074 1.21873L2.50847 7.72177L0 14.9997Z" fill="url(#paint0_linear_68_392)" />
    </Svg>
  );
}

// Bus Icon SVG
function BusIcon({ width = 20, height = 20 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_68_391" x1="10" y1="0" x2="10" y2="20" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#7B1B53" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path fillRule="evenodd" clipRule="evenodd" d="M10 0C6.229 0 4.343 -1.19209e-07 3.172 1.172C2.108 2.235 2.01 3.886 2 7H1C0.734784 7 0.48043 7.10536 0.292893 7.29289C0.105357 7.48043 0 7.73478 0 8V9C0 9.15524 0.036145 9.30836 0.105573 9.44721C0.175 9.58607 0.275804 9.70685 0.4 9.8L2 11C2.01 14.114 2.108 15.765 3.172 16.828C3.414 17.071 3.686 17.263 4 17.415V19C4 19.2652 4.10536 19.5196 4.29289 19.7071C4.48043 19.8946 4.73478 20 5 20H6.5C6.76522 20 7.01957 19.8946 7.20711 19.7071C7.39464 19.5196 7.5 19.2652 7.5 19V17.982C8.227 18 9.054 18 10 18C10.946 18 11.773 18 12.5 17.982V19C12.5 19.2652 12.6054 19.5196 12.7929 19.7071C12.9804 19.8946 13.2348 20 13.5 20H15C15.2652 20 15.5196 19.8946 15.7071 19.7071C15.8946 19.5196 16 19.2652 16 19V17.415C16.3073 17.2678 16.5873 17.0693 16.828 16.828C17.892 15.765 17.991 14.114 18 11L19.6 9.8C19.7242 9.70685 19.825 9.58607 19.8944 9.44721C19.9639 9.30836 20 9.15524 20 9V8C20 7.73478 19.8946 7.48043 19.7071 7.29289C19.5196 7.10536 19.2652 7 19 7H18C17.99 3.886 17.892 2.235 16.828 1.172C15.657 -1.19209e-07 13.771 0 10 0ZM3.5 7.5C3.5 8.914 3.5 9.621 3.94 10.06C4.379 10.5 5.086 10.5 6.5 10.5H13.5C14.914 10.5 15.621 10.5 16.06 10.06C16.5 9.621 16.5 8.914 16.5 7.5V5C16.5 3.586 16.5 2.879 16.06 2.44C15.622 2 14.915 2 13.5 2H6.5C5.086 2 4.379 2 3.94 2.44C3.5 2.878 3.5 3.585 3.5 5V7.5ZM4.25 14C4.25 13.8011 4.32902 13.6103 4.46967 13.4697C4.61032 13.329 4.80109 13.25 5 13.25H6.5C6.69891 13.25 6.88968 13.329 7.03033 13.4697C7.17098 13.6103 7.25 13.8011 7.25 14C7.25 14.1989 7.17098 14.3897 7.03033 14.5303C6.88968 14.671 6.69891 14.75 6.5 14.75H5C4.80109 14.75 4.61032 14.671 4.46967 14.5303C4.32902 14.3897 4.25 14.1989 4.25 14ZM15.75 14C15.75 13.8011 15.671 13.6103 15.5303 13.4697C15.3897 13.329 15.1989 13.25 15 13.25H13.5C13.3011 13.25 13.1103 13.329 12.9697 13.4697C12.829 13.6103 12.75 13.8011 12.75 14C12.75 14.1989 12.829 14.3897 12.9697 14.5303C13.1103 14.671 13.3011 14.75 13.5 14.75H15C15.1989 14.75 15.3897 14.671 15.5303 14.5303C15.671 14.3897 15.75 14.1989 15.75 14Z" fill="url(#paint0_linear_68_391)" />
    </Svg>
  );
}

// Health Alert Icon SVG
function HealthAlertIcon({ width = 20, height = 17 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 17" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_68_393" x1="10" y1="0" x2="10" y2="17.0001" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path fillRule="evenodd" clipRule="evenodd" d="M6.962 15.4691C4.019 13.2141 0 9.4891 0 5.9671C0 0.0830979 5.5 -2.1139 10 2.4301C14.5 -2.1139 20 0.0830979 20 5.9671C20 9.4891 15.98 13.2141 13.038 15.4691C11.706 16.4891 11.04 17.0001 10 17.0001C8.96 17.0001 8.294 16.4901 6.962 15.4691ZM14.5 3.2501C14.6989 3.2501 14.8897 3.32912 15.0303 3.46977C15.171 3.61042 15.25 3.80119 15.25 4.0001V5.2501H16.5C16.6989 5.2501 16.8897 5.32912 17.0303 5.46977C17.171 5.61042 17.25 5.80119 17.25 6.0001C17.25 6.19901 17.171 6.38978 17.0303 6.53043C16.8897 6.67108 16.6989 6.7501 16.5 6.7501H15.25V8.0001C15.25 8.19901 15.171 8.38977 15.0303 8.53043C14.8897 8.67108 14.6989 8.7501 14.5 8.7501C14.3011 8.7501 14.1103 8.67108 13.9697 8.53043C13.829 8.38977 13.75 8.19901 13.75 8.0001V6.7501H12.5C12.3011 6.7501 12.1103 6.67108 11.9697 6.53043C11.829 6.38978 11.75 6.19901 11.75 6.0001C11.75 5.80119 11.829 5.61042 11.9697 5.46977C12.1103 5.32912 12.3011 5.2501 12.5 5.2501H13.75V4.0001C13.75 3.80119 13.829 3.61042 13.9697 3.46977C14.1103 3.32912 14.3011 3.2501 14.5 3.2501Z" fill="url(#paint0_linear_68_393)" />
    </Svg>
  );
}

// Islamic Geometric Pattern Component
function IslamicPattern() {
  return (
    <View style={{ opacity: 0.12 }}>
      <Svg width="100%" height="60" viewBox="0 0 345 60" fill="none">
        <Defs>
          <SvgLinearGradient id="patternGradient" x1="0" y1="0" x2="345" y2="60">
            <Stop stopColor="#B82073" offset="0%" />
            <Stop stopColor="#1B131F" offset="100%" />
          </SvgLinearGradient>
        </Defs>
        {/* Star pattern - spread wider and moved higher */}
        <Path
          d="M30 20 L35 30 L45 30 L37 37 L40 47 L30 40 L20 47 L23 37 L15 30 L25 30 Z"
          fill="url(#patternGradient)"
          opacity={0.8}
        />
        <Path
          d="M100 20 L105 30 L115 30 L107 37 L110 47 L100 40 L90 47 L93 37 L85 30 L95 30 Z"
          fill="url(#patternGradient)"
          opacity={0.8}
        />
        <Path
          d="M170 20 L175 30 L185 30 L177 37 L180 47 L170 40 L160 47 L163 37 L155 30 L165 30 Z"
          fill="url(#patternGradient)"
          opacity={0.8}
        />
        <Path
          d="M240 20 L245 30 L255 30 L247 37 L250 47 L240 40 L230 47 L233 37 L225 30 L235 30 Z"
          fill="url(#patternGradient)"
          opacity={0.8}
        />
        <Path
          d="M315 20 L320 30 L330 30 L322 37 L325 47 L315 40 L305 47 L308 37 L300 30 L310 30 Z"
          fill="url(#patternGradient)"
          opacity={0.8}
        />
      </Svg>
    </View>
  );
}

// Thin gradient line between group info rows
function InfoDividerLine() {
  return (
    <Svg width={129} height={1} viewBox="0 0 129 1" fill="none">
      <Defs>
        <SvgLinearGradient
          id="paint0_linear_261_274"
          x1={0}
          y1={1}
          x2={0.0155029}
          y2={2.99988}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#B82073" />
          <Stop offset={1} stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M0.5 0.5L128.5 0.5"
        stroke="url(#paint0_linear_261_274)"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Arrow Circle Icon SVG (Right side arrow)
function ArrowCircleIcon() {
  return (
    <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
      <Defs>
        <SvgLinearGradient
          id="paint0_linear_68_403"
          x1="17.4688"
          y1="0"
          x2="17.4688"
          y2="34.9375"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#B82073" />
          <Stop offset={1} stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M17.4688 0C7.83675 0 0 7.83675 0 17.4688C0 27.1007 7.83675 34.9375 17.4688 34.9375C27.1007 34.9375 34.9375 27.1007 34.9375 17.4688C34.9375 7.83675 27.1007 0 17.4688 0ZM17.4688 2.6875C25.6482 2.6875 32.25 9.28934 32.25 17.4688C32.25 25.6482 25.6482 32.25 17.4688 32.25C9.28934 32.25 2.6875 25.6482 2.6875 17.4688C2.6875 9.28934 9.28934 2.6875 17.4688 2.6875ZM18.4362 8.86069L16.5012 10.75L21.8763 16.125H8.0625V18.8125H21.8763L16.5012 24.1875L18.4362 26.0768L26.0768 18.4349L27.0443 17.4674L26.0768 16.4999L18.4349 8.85934L18.4362 8.86069Z"
        fill="url(#paint0_linear_68_403)"
      />
    </Svg>
  );
}

// Pending Badge SVG
function PendingBadgeIcon() {
  return (
    <Svg width={39} height={11} viewBox="0 0 39 11" fill="none">
      <Path
        d="M1.375 1.1H0V0H11V1.1H9.625V2.2C9.625 3.08825 9.064 3.80325 8.35725 4.38735C7.87394 4.78665 7.28613 5.1546 6.69006 5.5C7.28613 5.8454 7.87394 6.21335 8.35725 6.61265C9.064 7.19675 9.625 7.91175 9.625 8.8V9.9H11V11H0V9.9H1.375V8.8C1.375 7.91175 1.936 7.19675 2.64275 6.61265C3.12606 6.21335 3.71388 5.8454 4.30994 5.5C3.71388 5.1546 3.12606 4.78665 2.64275 4.38735C1.936 3.80325 1.375 3.08825 1.375 2.2V1.1ZM2.75 1.1V2.2C2.75 2.57675 2.92875 2.93425 3.28006 3.3H7.71994C8.07056 2.93425 8.25 2.57675 8.25 2.2V1.1H2.75ZM5.5 6.1721C4.78156 6.578 4.1305 6.96465 3.63069 7.3777C3.50645 7.47986 3.38939 7.58746 3.28006 7.7H7.71994C7.61061 7.58746 7.49355 7.47986 7.36931 7.3777C6.8695 6.96465 6.21844 6.578 5.5 6.1721Z"
        fill="#FB865C"
      />
      <Path
        d="M11.5593 8V2.90909H13.3739C13.77 2.90909 14.0981 2.98118 14.3583 3.12535C14.6185 3.26953 14.8132 3.46674 14.9425 3.71697C15.0717 3.96555 15.1364 4.24562 15.1364 4.55717C15.1364 4.87038 15.0709 5.15211 14.94 5.40234C14.8107 5.65092 14.6152 5.84813 14.3533 5.99396C14.0932 6.13814 13.7659 6.21023 13.3714 6.21023H12.1236V5.55895H13.3018C13.5521 5.55895 13.7551 5.51586 13.9109 5.42969C14.0666 5.34186 14.181 5.22254 14.2539 5.07173C14.3268 4.92093 14.3633 4.74941 14.3633 4.55717C14.3633 4.36494 14.3268 4.19425 14.2539 4.0451C14.181 3.89595 14.0658 3.77912 13.9084 3.6946C13.7526 3.61009 13.5471 3.56783 13.2919 3.56783H12.3274V8H11.5593Z"
        fill="#E57536"
      />
      <Path
        d="M17.5749 8.07706C17.1987 8.07706 16.8748 7.99669 16.603 7.83594C16.3329 7.67353 16.1241 7.44567 15.9766 7.15234C15.8307 6.85736 15.7578 6.51184 15.7578 6.11577C15.7578 5.72467 15.8307 5.37997 15.9766 5.08168C16.1241 4.78338 16.3295 4.55054 16.593 4.38317C16.8582 4.21579 17.1681 4.1321 17.5227 4.1321C17.7382 4.1321 17.947 4.16773 18.1491 4.23899C18.3513 4.31025 18.5328 4.42211 18.6935 4.57457C18.8543 4.72704 18.9811 4.92507 19.0739 5.16868C19.1667 5.41063 19.2131 5.70478 19.2131 6.05114V6.31463H16.1779V5.75781H18.4847C18.4847 5.56226 18.445 5.38909 18.3654 5.23828C18.2859 5.08582 18.174 4.96567 18.0298 4.87784C17.8873 4.79001 17.7199 4.74609 17.5277 4.74609C17.3189 4.74609 17.1366 4.79747 16.9808 4.90021C16.8267 5.0013 16.7074 5.13388 16.6229 5.29794C16.54 5.46035 16.4986 5.63684 16.4986 5.82741V6.26243C16.4986 6.51764 16.5433 6.73473 16.6328 6.91371C16.724 7.09268 16.8507 7.2294 17.0131 7.32386C17.1755 7.41667 17.3653 7.46307 17.5824 7.46307C17.7232 7.46307 17.8517 7.44318 17.9677 7.40341C18.0837 7.36198 18.1839 7.30066 18.2685 7.21946C18.353 7.13826 18.4176 7.038 18.4624 6.91868L19.1658 7.04545C19.1095 7.2526 19.0084 7.43407 18.8626 7.58984C18.7184 7.74396 18.5369 7.86411 18.3182 7.95028C18.1011 8.0348 17.8533 8.07706 17.5749 8.07706Z"
        fill="#E57536"
      />
      {/* Remaining text paths truncated for brevity */}
    </Svg>
  );
}

// Completed Badge SVG
// (CompletedBadgeIcon removed – using styled View + Text instead to show full word)

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  headerGradient: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  headerFrameBase: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 0,
    opacity: 1,
  },
  headerPatternWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * (422 / 375),
    marginTop: -60,
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  statusBarArea: {
    paddingTop: 10,
    paddingBottom: 6,
  },
  statusTime: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 4,
  },
  greetingTexts: {
    flex: 1,
  },
  greetingLine: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellButton: {
    position: 'relative',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 21,
    paddingHorizontal: 14,
    height: 42,
    width: 342,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchField: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 8,
  },
  filterIconButton: {
    padding: 2,
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    paddingTop: 0,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  pilgrimGroupCard: {
    width: 345,
    minHeight: 200,
    borderRadius: 20,
    marginTop: 16,
    marginBottom: 12,
    alignSelf: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
    position: 'relative',
  },
  cardAccentStripBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    zIndex: 2,
  },
  cardBlurContent: {
    padding: 18,
    paddingTop: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    overflow: 'hidden',
  },
  pilgrimGroupTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 20,
    letterSpacing: 0.2,
    zIndex: 3,
  },
  infoChipsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  infoChipsRow2: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    shadowColor: '#B82073',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 100, 0.08)',
    flex: 1,
    minWidth: 0,
  },
  infoChipText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#1A1A1A',
  },
  viewDashboardButton: {
    width: '90%',
    height: 46,
    borderRadius: 16,
    alignSelf: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
    marginTop: 8,
  },
  viewDashboardGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDashboardText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontWeight: '600',
  },
  groupManagementSection: {
    marginTop: 4,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  quickActionsSection: {
    marginTop: 4,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '30%',
    minWidth: 100,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(184, 32, 115, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  sosLabel: {
    color: '#FF3B30',
    fontFamily: 'OpenSans-SemiBold',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  viewAllText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#952562',
  },
  pilgrimRequestSection: {
    marginTop: 4,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  pilgrimRequestTitle: {
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#1A1A1A',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  iconRowContainer: {
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  iconRowBlob: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    overflow: 'hidden',
  },
  iconRowGradient: {
    flex: 1,
    borderRadius: 24,
  },
  groupManagementScroll: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 22,
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  managementIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    flex: 1,
  },
  managementIconOuter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  managementIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  managementIconImage: {
    width: '100%',
    height: '100%',
  },
  managementIconLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#4A4A4A',
    textAlign: 'center',
    marginTop: 6,
  },
  pilgrimCard: {
    width: 345,
    height: 90,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 14,
    paddingVertical: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  pilgrimAvatarContainer: {
    width: 57,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    marginRight: 12,
    marginLeft: 0,
  },
  pilgrimAvatar: {
    width: '100%',
    height: '100%',
  },
  pilgrimTextColumn: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pilgrimName: {
    fontSize: 18,
    fontFamily: 'OpenSans-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  pilgrimRequestText: {
    fontSize: 8,
    fontFamily: 'OpenSans-SemiBold',
    color: '#4B5563',
    marginBottom: 6,
    lineHeight: 12,
  },
  pilgrimBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pilgrimRightColumn: {
    marginLeft: 10,
    marginRight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
  },
  pendingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(251,134,92,0.12)',
    borderWidth: 1,
    borderColor: '#FB865C',
  },
  completedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(115,223,107,0.12)',
    borderWidth: 1,
    borderColor: '#73DF6B',
  },
  requestDivider: {
    height: 1,
    backgroundColor: '#000000',
    opacity: 0.08,
    width: 300,
    alignSelf: 'center',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#374151',
  },
  noticeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: 24,
  },
  noticeSheet: {
    maxWidth: 260,
    marginRight: 0,
  },
  noticePointer: {
    alignSelf: 'flex-end',
    width: 14,
    height: 14,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
    marginBottom: -7,
  },
  noticeInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  noticeTitle: {
    fontSize: 18,
    color: '#1B131F',
    marginBottom: 10,
    fontFamily: 'PlusJakartaSans-Regular',
    fontWeight: '600',
  },
  noticeBody: {
    fontSize: 14,
    color: '#4C4C4C',
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  noticeButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#B82073',
  },
  noticeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
  },
  newRequestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  boldText: {
    fontFamily: 'OpenSans-Bold',
    fontWeight: '700',
  },
  requestPreview: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  requestPreviewTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: '#1B131F',
    marginBottom: 6,
  },
  requestPreviewDetails: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    color: '#7A7A7A',
  },
  noticeButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  noticeButtonSecondary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeButtonSecondaryText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#7A7A7A',
  },
  inProgressBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(149, 37, 98, 0.12)',
    borderWidth: 1,
    borderColor: '#952562',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  requestModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  requestModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  requestModalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  requestModalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  requestModalPilgrimName: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#1B131F',
    marginBottom: 8,
  },
  requestModalStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  requestModalDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 16,
  },
  requestModalBody: {
    marginBottom: 20,
  },
  requestModalRow: {
    marginBottom: 12,
  },
  requestModalLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#7A7A7A',
    marginBottom: 4,
  },
  requestModalValue: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: '#1B131F',
    lineHeight: 22,
  },
  requestModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  requestModalButtonSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestModalButtonSecondaryText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#7A7A7A',
  },
  requestModalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  requestModalButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestModalButtonText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

