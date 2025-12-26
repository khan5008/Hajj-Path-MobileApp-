import BottomTabs from '@/components/bottom-tabs';
import NotificationPopup from '@/components/NotificationPopup';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    OpenSans_600SemiBold,
} from '@expo-google-fonts/open-sans';
import {
    PlusJakartaSans_400Regular,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function HomeScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'Hotels' | 'PrayerTimes' | 'Qibla' | 'HajjGuide'>('Hotels');
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [hasNewMeal, setHasNewMeal] = useState(false);
  const [newMealInfo, setNewMealInfo] = useState<any>(null);
  const [hasWorkerResponse, setHasWorkerResponse] = useState(false);
  const [workerResponseData, setWorkerResponseData] = useState<any>(null);
  const [hasNewAnnouncement, setHasNewAnnouncement] = useState(false);
  const [newAnnouncementData, setNewAnnouncementData] = useState<any>(null);
  const noticeAnim = useRef(new Animated.Value(0)).current;
  const [fontsLoaded] = useFonts({
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
  });

  const [showResponseNotification, setShowResponseNotification] = useState(false);
  const [responseNotificationMessage, setResponseNotificationMessage] = useState('');
  const [responseNotificationData, setResponseNotificationData] = useState<any>(null);
  const [servicesScrollIndex, setServicesScrollIndex] = useState(0);

  useEffect(() => {
    checkForNewMeals();
    checkForWorkerResponse();
    checkForAnnouncements();
    
    // Set up interval to check for new responses
    const interval = setInterval(() => {
      checkForWorkerResponse();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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

  const checkForNewMeals = async () => {
    try {
      const hasNew = await AsyncStorage.getItem('@hajjpath_new_meal');
      const mealData = await AsyncStorage.getItem('@hajjpath_meal_notification_data');
      
      if (hasNew === 'true' && mealData) {
        const meal = JSON.parse(mealData);
        setHasNewMeal(true);
        setNewMealInfo(meal);
        // Auto-open modal after a short delay
        setTimeout(() => {
          setShowNoticeModal(true);
        }, 500);
      }
    } catch (error) {
      console.error('Error checking for new meals:', error);
    }
  };

  const checkForWorkerResponse = async () => {
    try {
      const hasResponse = await AsyncStorage.getItem('@hajjpath_user_response_notification');
      const responseData = await AsyncStorage.getItem('@hajjpath_user_response_data');
      
      if (hasResponse === 'true' && responseData) {
        const response = JSON.parse(responseData);
        setHasWorkerResponse(true);
        setWorkerResponseData(response);
        
        // Show notification popup
        const requestData = await AsyncStorage.getItem('@hajjpath_user_request_data_' + response.requestId);
        const request = requestData ? JSON.parse(requestData) : null;
        const message = request 
          ? `${t('notifications.workerRespondedGeneric')}: ${request.request}`
          : t('notifications.workerRespondedGeneric');
        
        setResponseNotificationMessage(message);
        setResponseNotificationData({ ...response, request });
        setShowResponseNotification(true);
        
        // Clear notification flag after showing
        await AsyncStorage.setItem('@hajjpath_user_response_notification', 'false');
      }
    } catch (error) {
      console.error('Error checking for worker response:', error);
    }
  };

  const checkForAnnouncements = async () => {
    try {
      const hasAnnouncement = await AsyncStorage.getItem('@hajjpath_user_announcement_notification');
      const announcementData = await AsyncStorage.getItem('@hajjpath_user_announcement_data');
      
      if (hasAnnouncement === 'true' && announcementData) {
        const announcement = JSON.parse(announcementData);
        setHasNewAnnouncement(true);
        setNewAnnouncementData(announcement);
        // Auto-open modal after a short delay
        setTimeout(() => {
          setShowNoticeModal(true);
        }, 500);
      }
    } catch (error) {
      console.error('Error checking for announcements:', error);
    }
  };

  const handleNotificationClick = () => {
    setShowNoticeModal(true);
  };

  const handleViewMeals = () => {
    setShowNoticeModal(false);
    AsyncStorage.setItem('@hajjpath_new_meal', 'false');
    setHasNewMeal(false);
    router.push('/usermealsscreen');
  };

  if (!fontsLoaded) {
    return null;
  }

  const handleResponseNotificationPress = () => {
    setShowResponseNotification(false);
    if (responseNotificationData) {
      router.push({
        pathname: '/requestconversation',
        params: {
          requestId: responseNotificationData.requestId,
          pilgrim: responseNotificationData.pilgrim,
        },
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#B82073" />
      
      {/* Notification Popup */}
      <NotificationPopup
        visible={showResponseNotification}
        message={responseNotificationMessage}
        onPress={handleResponseNotificationPress}
        onDismiss={() => setShowResponseNotification(false)}
        type="response"
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
                  <Text style={[styles.greetingLine, isRTL && { textAlign: 'right' }]}>{t('home.greeting')},</Text>
                  <Text style={[styles.nameText, isRTL && { textAlign: 'right' }]}>{t('home.userName')}</Text>
                </View>
                <View style={[styles.rightIcons, isRTL && { flexDirection: 'row-reverse' }]}>
                  <TouchableOpacity style={styles.bellButton} onPress={handleNotificationClick}>
                    <Ionicons name="notifications" size={16} color="#8A0D4A" />
                    {(hasNewMeal || hasWorkerResponse || hasNewAnnouncement) && (
                      <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>!</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/profile')}>
                    <Image
                      source={require('@/assets/images/profilepic.png')}
                      style={styles.avatar}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Search Bar */}
              <View style={[styles.searchBox, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="search-outline" size={18} color="#999" style={isRTL && { marginLeft: 0, marginRight: 8 }} />
                <TextInput
                  style={[styles.searchField, { textAlign: isRTL ? 'right' : 'left' }]}
                  placeholder={t('common.search')}
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
          {/* Filter Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterTabsRow}
            contentContainerStyle={styles.filterTabsContent}
          >
            {/* Hotels */}
            {activeFilter === 'Hotels' ? (
              <LinearGradient
                colors={['#B82073', '#1B131F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.filterTab, styles.filterTabActive, styles.filterTabHotels]}
              >
                <TouchableOpacity style={styles.filterTabInner} onPress={() => setActiveFilter('Hotels')}>
                  <MaterialCommunityIcons name="bed-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.filterTabActiveText}>{t('services.hotel')}</Text>
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              <TouchableOpacity
                style={[styles.filterTab, styles.filterTabHotels]}
                onPress={() => setActiveFilter('Hotels')}
              >
                <MaterialCommunityIcons name="bed-outline" size={20} color="#888" />
                <Text style={styles.filterTabText}>{t('services.hotel')}</Text>
              </TouchableOpacity>
            )}

            {/* Prayer Times */}
            {activeFilter === 'PrayerTimes' ? (
              <LinearGradient
                colors={['#B82073', '#1B131F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.filterTab, styles.filterTabActive, styles.filterTabPrayerTimes]}
              >
                <TouchableOpacity
                  style={styles.filterTabInner}
                  onPress={() => {
                    setActiveFilter('PrayerTimes');
                    router.push('/prayertimescreen');
                  }}
                >
                  <MaterialCommunityIcons name="clock-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.filterTabActiveText}>{t('home.prayerTimes')}</Text>
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              <TouchableOpacity
                style={[styles.filterTab, styles.filterTabPrayerTimes]}
                onPress={() => {
                  setActiveFilter('PrayerTimes');
                  router.push('/prayertimescreen');
                }}
              >
                <MaterialCommunityIcons name="clock-outline" size={20} color="#888" />
                <Text style={styles.filterTabText}>{t('home.prayerTimes')}</Text>
              </TouchableOpacity>
            )}

            {/* Qibla Direction */}
            {activeFilter === 'Qibla' ? (
              <LinearGradient
                colors={['#B82073', '#1B131F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.filterTab, styles.filterTabActive, styles.filterTabQibla]}
              >
                <TouchableOpacity
                  style={styles.filterTabInner}
                  onPress={() => {
                    setActiveFilter('Qibla');
                    router.push('/qiblascreen');
                  }}
                >
                  <MaterialCommunityIcons name="compass-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.filterTabActiveText}>{t('home.qiblaDirection')}</Text>
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              <TouchableOpacity
                style={[styles.filterTab, styles.filterTabQibla]}
                onPress={() => {
                  setActiveFilter('Qibla');
                  router.push('/qiblascreen');
                }}
              >
                <MaterialCommunityIcons name="compass-outline" size={20} color="#888" />
                <Text style={styles.filterTabText}>{t('home.qiblaDirection')}</Text>
              </TouchableOpacity>
            )}

            {/* Hajj Guide */}
            {activeFilter === 'HajjGuide' ? (
              <LinearGradient
                colors={['#B82073', '#1B131F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.filterTab, styles.filterTabActive, styles.filterTabHajjGuide]}
              >
                <TouchableOpacity
                  style={styles.filterTabInner}
                  onPress={() => {
                    setActiveFilter('HajjGuide');
                    router.push('/hajjguidescreen');
                  }}
                >
                  <MaterialCommunityIcons name="book-open-page-variant-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.filterTabActiveText}>{t('home.hajjGuide')}</Text>
                </TouchableOpacity>
              </LinearGradient>
            ) : (
              <TouchableOpacity
                style={[styles.filterTab, styles.filterTabHajjGuide]}
                onPress={() => {
                  setActiveFilter('HajjGuide');
                  router.push('/hajjguidescreen');
                }}
              >
                <MaterialCommunityIcons name="book-open-page-variant-outline" size={20} color="#888" />
                <Text style={styles.filterTabText}>{t('home.hajjGuide')}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
          {/* Services Grid Card */}
          <View style={styles.servicesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.servicesGridScroll}
              onScroll={(event) => {
                const scrollPosition = event.nativeEvent.contentOffset.x;
                const pageWidth = 343 + 12; // servicesPage width + gap
                const currentIndex = Math.round(scrollPosition / pageWidth);
                setServicesScrollIndex(currentIndex);
              }}
              scrollEventThrottle={16}
              pagingEnabled={false}
              snapToInterval={343 + 12}
              decelerationRate="fast"
            >
              <View style={styles.servicesGridWrapper}>
                {/* First Page - 2 rows of 4 items */}
                <View style={styles.servicesPage}>
                  {/* First Row - 4 items */}
                  <View style={styles.servicesRow}>
                    <ServiceBox icon="account-card-outline" title={t('services.digitalID')} router={router} t={t} />
                    <ServiceBox icon="file-document-outline" title={t('services.hajjPermit')} router={router} t={t} />
                    <ServiceBox icon="airplane-takeoff" title={t('services.boardingPass')} router={router} t={t} />
                    <ServiceBox icon="train" title={t('services.trainETicket')} router={router} t={t} />
                  </View>
                  {/* Second Row - 4 items */}
                  <View style={styles.servicesRow}>
                    <ServiceBox icon="book-open-page-variant-outline" title={t('services.fatwa')} router={router} t={t} />
                    <ServiceBox icon="account-supervisor-circle-outline" title={t('services.proxySacrifice')} router={router} t={t} />
                    <ServiceBox icon="tent" title={t('services.minaTent')} router={router} t={t} />
                    <ServiceBox icon="office-building-outline" title={t('services.hotel')} router={router} t={t} />
                  </View>
                </View>
                {/* Second Page - Additional services visible on scroll */}
                <View style={styles.servicesPage}>
                  <View style={styles.servicesRow}>
                    <ServiceBox icon="call-outline" title={t('services.callSupport')} router={router} t={t} />
                    <ServiceBox icon="checkmark-circle-outline" title={t('services.voting')} router={router} t={t} />
                  </View>
                </View>
              </View>
            </ScrollView>
            {/* Scroll Indicators */}
            <View style={styles.dotsRow}>
              <View style={[styles.dot, servicesScrollIndex === 0 && styles.dotActive]} />
              <View style={[styles.dot, servicesScrollIndex === 1 && styles.dotActive]} />
            </View>
          </View>

          {/* Day by Day Guide */}
          <View style={styles.guideSection}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideTitle}>{t('home.dayByDayGuide')}</Text>
              <LinearGradient
                colors={['#B82073', '#1B131F']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.viewAllButton}
              >
                <TouchableOpacity onPress={() => router.push('/daylistscreen')}>
                  <Text style={styles.viewAllLabel}>{t('common.viewAll')}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.guideCards}
            >
              <DayCard
                router={router}
                dayId="1"
                dayNum={t('home.day1')}
                title={t('home.day1Subtitle')}
                subtitle={t('home.day1Title')}
                tag={t('home.mina')}
                imageSource={require('@/assets/images/tents.jpg')}
              />
              <DayCard
                router={router}
                dayId="2"
                dayNum={t('home.day2')}
                title={t('home.day2Subtitle')}
                subtitle={t('home.day2Title')}
                tag={t('home.arafah')}
                imageSource={require('@/assets/images/madinah.jpg')}
              />
              <DayCard
                router={router}
                dayId="3"
                dayNum={t('home.day3')}
                title={t('home.day3Subtitle')}
                subtitle={t('home.day3Title')}
                tag=""
                imageSource={require('@/assets/images/umrah.jpg')}
              />
            </ScrollView>
          </View>

          {/* Hajj Transport Timeline */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{t('home.hajjTransportTimeline')}</Text>
            </View>
            <View style={styles.timelineContainer}>
              {[
                { key: 'mina', titleKey: 'home.mina', time: 'After Fajr', statusKey: 'home.busDeparting', icon: 'tent' },
                { key: 'arafah', titleKey: 'home.arafah', time: 'Dhuhr – Maghrib', statusKey: 'home.atArafah', icon: 'islam' },
                { key: 'muzdalifah', titleKey: 'home.muzdalifah', time: 'After Maghrib', statusKey: 'home.walkingRouteOpen', icon: 'walk' },
                { key: 'mina2', titleKey: 'home.mina', time: 'Fajr – Days of Tashreeq', statusKey: 'home.returnToMina', icon: 'map-marker-radius' },
              ].map((stop, index, arr) => (
                <View key={stop.key} style={styles.transportRow}>
                  <View style={styles.transportTimelineCol}>
                    <View style={styles.transportNodeOuter}>
                      <View style={styles.transportNodeInner} />
                    </View>
                    {index < arr.length - 1 && <View style={styles.transportConnector} />}
                  </View>
                  <View style={styles.transportInfoCol}>
                    <View style={styles.transportTitleRow}>
                      <MaterialCommunityIcons name={stop.icon as any} size={16} color="#B82073" />
                      <Text style={styles.transportTitle}>{t(stop.titleKey)}</Text>
                    </View>
                    <Text style={styles.transportTime}>{stop.time}</Text>
                    <Text style={styles.transportStatus}>{t(stop.statusKey)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <BottomTabs active="home" />
      </View>

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
              {hasNewMeal && newMealInfo ? (
                <>
                  <View style={styles.newMealHeader}>
                    <Ionicons name="restaurant" size={24} color="#952562" />
                    <Text style={styles.noticeTitle}>New Meal Plan Available</Text>
                  </View>
                  <Text style={styles.noticeBody}>
                    Your meal plan for today has been updated:
                  </Text>
                  <View style={styles.mealPreview}>
                    <Text style={styles.mealPreviewTitle}>{newMealInfo.title}</Text>
                    <Text style={styles.mealPreviewTime}>Time: {newMealInfo.time}</Text>
                    <Text style={styles.mealPreviewItems}>
                      {newMealInfo.items.slice(0, 3).join(', ')}
                      {newMealInfo.items.length > 3 && '...'}
                    </Text>
                  </View>
                  <View style={styles.noticeButtonsRow}>
                    <TouchableOpacity
                      style={styles.noticeButtonSecondary}
                      onPress={() => {
                        setShowNoticeModal(false);
                        AsyncStorage.setItem('@hajjpath_new_meal', 'false');
                        setHasNewMeal(false);
                      }}
                    >
                      <Text style={styles.noticeButtonSecondaryText}>Dismiss</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.noticeButton}
                      onPress={handleViewMeals}
                    >
                      <Text style={styles.noticeButtonText}>View Meals</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.noticeTitle}>Important information for pilgrims</Text>
                  <Text style={styles.noticeBody}>
                    Please arrive at your departure point at least 3 hours before your scheduled time, keep your Hajj ID with you at all times, and stay hydrated during long outdoor rituals.
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

// SVG Icon Components
function HajjPermitIcon({ width = 32, height = 38 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 32 38" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_68_309" x1="0" y1="0" x2="37.4457" y2="31.5332" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path fillRule="evenodd" clipRule="evenodd" d="M23.5767 4.81234H19.5781V3.42822H23.8693C25.2849 3.42983 26.4317 4.59183 26.4349 6.02423V19.7236C25.9736 19.6898 25.5092 19.7413 25.067 19.8765V6.3205C25.0638 5.48844 24.3975 4.81559 23.5767 4.81234ZM30.0915 33.7512L22.2725 33.7528C21.2244 33.7544 20.3734 34.6138 20.3718 35.6761C20.3734 36.0302 20.6581 36.315 21.0065 36.315H31.3654C31.7137 36.315 31.9984 36.0302 32 35.6761C31.9984 34.6139 31.1475 33.7544 30.0993 33.7528L30.0915 33.7512ZM7.63952 5.42211V3.42806C7.64111 2.81326 8.13415 2.31596 8.74333 2.31596H11.0273C11.0003 1.7108 11.2198 1.12178 11.6349 0.684022C12.0484 0.246259 12.621 0 13.2191 0C13.8187 0 14.3897 0.246243 14.8048 0.684022C15.2183 1.12178 15.4378 1.71084 15.4124 2.31596H17.7012C18.3071 2.31757 18.797 2.81486 18.8002 3.42806V5.42211C18.797 6.03531 18.3071 6.53261 17.7012 6.53422H8.74333C8.13415 6.53422 7.64111 6.03692 7.63952 5.42211ZM12.5908 2.31592C12.5908 2.57342 12.7434 2.80679 12.9804 2.90497C13.2158 3.00476 13.4878 2.95004 13.6675 2.76656C13.8489 2.58469 13.9029 2.30947 13.8043 2.07129C13.7073 1.8331 13.4767 1.67698 13.2222 1.67698C13.0536 1.67537 12.893 1.74297 12.7736 1.86367C12.6559 1.98277 12.5892 2.1453 12.5908 2.31592ZM28.1733 31.5687H24.2034C23.8646 31.5655 23.5385 31.7007 23.2983 31.9437C23.0582 32.1851 22.923 32.5151 22.9246 32.8579V32.9609H29.4393V32.8579C29.4393 32.1497 28.8731 31.5752 28.1733 31.572L28.1733 31.5687ZM21.4676 37.3369C21.4612 37.5123 21.5264 37.6829 21.6489 37.8068C21.7697 37.9324 21.9368 38.0016 22.1101 38H30.2536C30.4222 38 30.5828 37.9324 30.7021 37.8117C30.8214 37.691 30.8882 37.5284 30.8882 37.3578V37.1067L21.4674 37.1051L21.4676 37.3369ZM1.37271 32.8048V6.32026C1.3743 5.4882 2.04071 4.81547 2.86304 4.81221H6.86161V3.4281H2.56552C1.14994 3.42971 0.00317596 4.5917 0 6.0241V33.1089C0.00318084 34.5413 1.14994 35.7033 2.56552 35.7049H19.5935C19.5872 35.2189 19.7112 34.7409 19.9514 34.3208H2.8501C2.03258 34.3144 1.37251 33.64 1.37251 32.8128L1.37271 32.8048ZM23.1121 23.9914C23.1646 25.2275 23.7674 25.9066 24.1301 26.5375C24.1301 26.5375 24.4116 29.1335 24.569 30.7767H27.8105C27.9648 29.1287 28.2384 26.5586 28.2495 26.5375C28.6074 25.9067 29.2149 25.2436 29.2627 23.9914C29.3438 22.0843 28.0411 20.4942 26.1882 20.4942C24.3368 20.4942 23.031 22.0923 23.1121 23.9914ZM2.86337 5.60377H6.86988C6.96372 6.57908 7.77332 7.32425 8.74353 7.32585H17.7014C18.6684 7.32424 19.478 6.57908 19.5702 5.60377H23.5767C23.7644 5.60377 23.9441 5.67941 24.0777 5.81299C24.2098 5.94818 24.2845 6.13005 24.2845 6.31997V20.2171C22.9851 21.0234 22.2327 22.4928 22.3345 24.0331C22.3568 24.672 22.519 25.2981 22.8101 25.8662C22.9819 26.2041 23.1886 26.497 23.3763 26.8141C23.4081 27.0652 23.4336 27.3211 23.4574 27.5721L23.6419 29.3473L23.7883 30.8345C22.8355 31.0308 22.1532 31.8822 22.1596 32.8655V32.9734C21.606 32.9959 21.0732 33.1923 20.6358 33.5383H2.8635C2.67423 33.5367 2.4945 33.4594 2.36248 33.3226C2.23046 33.1874 2.1573 33.004 2.15889 32.8124V6.31968C2.15889 5.92537 2.47368 5.60538 2.86337 5.60377ZM8.995 13.7282C9.00136 15.769 10.4328 17.5216 12.4114 17.9126C14.3916 18.3037 16.3687 17.2254 17.1338 15.3359C17.8973 13.4465 17.2356 11.2737 15.5529 10.1487C13.8701 9.0221 11.6354 9.25708 10.2168 10.7088C9.42954 11.5103 8.99024 12.5968 8.995 13.7282ZM5.79486 20.2335C5.79486 20.454 5.96504 20.6342 6.18136 20.6455H21.0399C21.2133 20.594 21.3326 20.433 21.3326 20.2512C21.3326 20.0677 21.2133 19.9068 21.0399 19.8553H6.18136C5.97618 19.8649 5.81076 20.0275 5.79486 20.2335ZM5.00913 22.8295C5.00913 22.9389 5.05208 23.0435 5.12843 23.1208C5.20477 23.198 5.30816 23.2415 5.41631 23.2415H21.04C21.2133 23.19 21.3326 23.029 21.3326 22.8456C21.3326 22.6637 21.2133 22.5012 21.04 22.4513H5.41631C5.20318 22.4497 5.02663 22.6154 5.00913 22.8295ZM5.00913 25.4207C5.00913 25.5301 5.05208 25.6347 5.12843 25.712C5.20477 25.7892 5.30816 25.8327 5.41631 25.8327H21.04C21.1624 25.8713 21.2976 25.8488 21.401 25.7715C21.506 25.6943 21.568 25.5703 21.568 25.44C21.568 25.308 21.506 25.1857 21.401 25.1084C21.2976 25.0296 21.1624 25.007 21.04 25.0457H5.41631C5.20477 25.0457 5.02822 25.2082 5.00913 25.4207ZM5.00913 28.0167C5.00913 28.1261 5.05208 28.2307 5.12843 28.308C5.20477 28.3852 5.30816 28.4287 5.41631 28.4287H21.04C21.1624 28.4657 21.2961 28.4415 21.3978 28.3627C21.4996 28.2854 21.5601 28.1631 21.5601 28.0328C21.5601 27.904 21.4996 27.7817 21.3978 27.7044C21.2961 27.6256 21.1625 27.6014 21.04 27.6384H5.41631C5.20318 27.6368 5.02663 27.8026 5.00913 28.0167ZM5.00913 30.6127C5.00913 30.7221 5.05208 30.8267 5.12843 30.904C5.20477 30.9812 5.30816 31.0247 5.41631 31.0247H16.6551C16.7776 31.0633 16.9128 31.0408 17.0162 30.9635C17.1211 30.8847 17.1832 30.7623 17.1832 30.6304C17.1832 30.5 17.1211 30.3777 17.0162 30.2988C16.9128 30.2216 16.7776 30.199 16.6551 30.2377H5.41631C5.20477 30.2361 5.02822 30.4002 5.00913 30.6127ZM10.7873 16.1923C9.62942 15.019 9.45291 13.181 10.3627 11.8035C11.274 10.4258 13.0188 9.88993 14.5329 10.5224C16.0471 11.1565 16.9076 12.782 16.5911 14.4092C16.2746 16.0347 14.8685 17.2096 13.2303 17.2144C12.3126 17.2176 11.4331 16.8489 10.7873 16.1923ZM10.7094 13.6912L11.8212 15.1703C11.9612 15.3409 12.2093 15.3682 12.3826 15.2314L15.1883 12.8382C15.3076 12.7883 15.3967 12.6821 15.4269 12.555C15.4571 12.4278 15.4253 12.2926 15.3426 12.1928C15.2583 12.0931 15.1327 12.0383 15.0038 12.048C14.875 12.056 14.7573 12.1269 14.6873 12.2363L12.187 14.3543L11.3202 13.2051C11.1738 13.1037 10.9782 13.1102 10.8382 13.2212C10.6983 13.3323 10.6458 13.5222 10.7094 13.6912Z" fill="url(#paint0_linear_68_309)"/>
    </Svg>
  );
}

function BoardingPassIcon({ width = 43, height = 25 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 43 25" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_68_330" x1="0" y1="0" x2="21.7259" y2="37.3686" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path d="M39.1403 2.98557e-06H30.3212C29.8829 2.98557e-06 29.4612 0.171205 29.1511 0.476929L28.1154 1.50006L27.0797 0.478964V0.476925C26.7696 0.171201 26.3478 0 25.9096 0H3.85968C1.73244 0.0101906 0.0124369 1.70795 0 3.8032V21.1968C0.0124041 23.292 1.73239 24.9898 3.85968 25H25.9096C26.3479 25 26.7696 24.8288 27.0797 24.5231L28.1154 23.502L29.1511 24.5231C29.4612 24.8288 29.8829 25 30.3212 25H39.1424H39.1403C41.2676 24.9898 42.9876 23.2921 43 21.1968V3.8032C42.9876 1.708 41.2676 0.0102296 39.1403 2.98557e-06ZM21.4999 14.1305H19.6042L16.2304 18.8692C15.9306 19.3114 15.4241 19.5744 14.8845 19.5662C14.5434 19.5723 14.2085 19.4643 13.9356 19.2605C13.241 18.755 13.0674 17.8011 13.5387 17.0878L15.5667 14.2181H11.1572L9.43715 15.9138C8.79212 16.5497 7.7461 16.5497 7.10107 15.9138C6.45604 15.2758 6.45604 14.2446 7.10107 13.6086L8.13678 12.4999L7.10107 11.4788C6.4933 10.8347 6.51188 9.83402 7.14035 9.21442C7.77087 8.59279 8.78594 8.57442 9.43711 9.17366L11.1571 10.8694H15.5667L13.5387 7.99969C13.2348 7.65116 13.0921 7.19257 13.1479 6.73399C13.2058 6.27744 13.456 5.86571 13.8364 5.60076C14.2188 5.3358 14.6964 5.24205 15.1532 5.34192C15.6081 5.44382 15.9988 5.72917 16.2303 6.13067L19.6042 10.8694H21.4999C22.4137 10.8694 23.1537 11.599 23.1537 12.4999C23.1537 13.4008 22.4137 14.1305 21.4999 14.1305ZM29.7692 21.1967C29.7692 22.0956 29.0291 22.8273 28.1153 22.8273C27.2015 22.8273 26.4615 22.0956 26.4615 21.1967V19.022C26.4615 18.1211 27.2015 17.3915 28.1153 17.3915C29.0291 17.3915 29.7692 18.1211 29.7692 19.022V21.1967ZM29.7692 14.6747C29.7692 15.5735 29.0291 16.3052 28.1153 16.3052C27.2015 16.3052 26.4615 15.5735 26.4615 14.6747V10.3253C26.4615 9.42644 27.2015 8.69476 28.1153 8.69476C29.0291 8.69476 29.7692 9.42644 29.7692 10.3253V14.6747ZM29.7692 5.97788C29.7692 6.87876 29.0291 7.6084 28.1153 7.6084C27.2015 7.6084 26.4615 6.87876 26.4615 5.97788V3.80316C26.4615 2.90431 27.2015 2.17264 28.1153 2.17264C29.0291 2.17264 29.7692 2.90431 29.7692 3.80316V5.97788Z" fill="url(#paint0_linear_68_330)"/>
    </Svg>
  );
}

function TrainIcon({ width = 31, height = 35 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 31 35" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_68_278" x1="15.5" y1="0" x2="15.5" y2="35" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path d="M13.95 0C24.2327 0 30.7721 7.25666 30.9938 18.0927L31 18.6667C31 20.5232 30.5101 22.3037 29.638 23.6164C28.766 24.9292 27.5833 25.6667 26.35 25.6667H1.55C1.13891 25.6667 0.744666 25.4208 0.453984 24.9832C0.163303 24.5457 0 23.9522 0 23.3333V2.33333C0 1.71449 0.163303 1.121 0.453984 0.683418C0.744666 0.245833 1.13891 0 1.55 0H13.95ZM7.75 4.66667H3.1V11.6667H7.75V4.66667ZM13.95 4.66667H10.85V11.6667H15.5V4.72733C14.9838 4.68664 14.4669 4.66641 13.95 4.66667ZM18.6015 5.26633L18.6 11.6667H26.412C24.8946 8.547 22.244 6.286 18.6015 5.26633ZM29.45 30.3333C29.8611 30.3333 30.2553 30.5792 30.546 31.0167C30.8367 31.4543 31 32.0478 31 32.6667C31 33.2855 30.8367 33.879 30.546 34.3166C30.2553 34.7542 29.8611 35 29.45 35H1.55C1.13891 35 0.744666 34.7542 0.453984 34.3166C0.163303 33.879 0 33.2855 0 32.6667C0 32.0478 0.163303 31.4543 0.453984 31.0167C0.744666 30.5792 1.13891 30.3333 1.55 30.3333H29.45Z" fill="url(#paint0_linear_68_278)"/>
    </Svg>
  );
}

function ProxyIcon({ width = 32, height = 30 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 32 30" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_68_336" x1="0" y1="0" x2="29.9376" y2="31.9335" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path d="M23.7939 2.69012L23.6783 2.69281C23.5251 2.69951 23.3813 2.60299 23.3342 2.45152C23.1447 1.83221 22.7549 1.29467 22.2414 0.91664C21.7441 0.550688 21.1258 0.332195 20.4551 0.332195C20.115 0.332195 19.7884 0.387156 19.4873 0.490374C19.1728 0.597613 18.8798 0.75445 18.623 0.95152C18.4873 1.05608 18.2883 1.04536 18.166 0.918008C17.8878 0.631142 17.5504 0.396567 17.1754 0.238368C16.8178 0.0868907 16.4213 0.00109923 16.002 0.00109923C15.1699 -0.0230298 14.4468 0.352295 13.846 0.908602C13.7277 1.03997 13.5234 1.06008 13.3809 0.950156C13.1242 0.753103 12.8311 0.59491 12.5166 0.489009C12.2155 0.38713 11.8889 0.33083 11.5488 0.33083C10.8795 0.33083 10.2611 0.547989 9.76247 0.915276C9.25035 1.29331 8.86055 1.8295 8.66968 2.45015C8.62667 2.59359 8.49226 2.69681 8.33499 2.69278L8.21133 2.69144C7.45995 2.69144 6.77176 2.96491 6.24621 3.41666C5.71258 3.87643 5.34161 4.51987 5.23408 5.24909C5.20989 5.41397 5.06741 5.53998 4.88193 5.54266C4.03514 5.54266 3.28242 5.87778 2.7407 6.41935C2.195 6.96224 1.85895 7.71291 1.85895 8.54269C1.85895 8.88049 1.91406 9.20356 2.01487 9.50249C2.11971 9.81483 2.27563 10.1044 2.47187 10.3604C2.50009 10.3966 2.52025 10.4395 2.53235 10.4864C2.57805 10.6701 2.46515 10.8564 2.281 10.9006C1.61967 11.0642 1.04169 11.4475 0.635792 11.9677C0.237945 12.4757 0 13.1165 0 13.8148C0 14.1768 0.0645185 14.5226 0.180115 14.8403C0.301087 15.1687 0.477169 15.4717 0.698948 15.7371C0.786318 15.8363 0.811854 15.9838 0.750026 16.1125C0.653248 16.3136 0.577976 16.5267 0.526898 16.7452C0.478511 16.957 0.452972 17.1822 0.452972 17.4168C0.452972 17.7935 0.521523 18.1527 0.646528 18.4811C0.775565 18.819 0.965088 19.1299 1.20032 19.3981C1.29844 19.4986 1.32667 19.6541 1.26081 19.7868C1.16134 19.9892 1.08069 20.2064 1.02827 20.4329C0.977193 20.6501 0.950312 20.8793 0.950312 21.1179C0.950312 21.7479 1.14387 22.3311 1.4826 22.8217C1.83881 23.331 2.33748 23.7198 2.91949 23.9343C3.03777 23.9772 3.12648 24.0844 3.14262 24.2171C3.21117 24.827 3.46521 25.3806 3.84293 25.8217C4.22467 26.2667 4.73545 26.5992 5.31746 26.7614C5.46128 26.7949 5.5715 26.9209 5.57957 27.075C5.62392 27.8659 5.97473 28.5764 6.51645 29.0871C7.05544 29.5952 7.78263 29.9062 8.58372 29.9062C8.86734 29.9062 9.14154 29.8673 9.39693 29.7962C9.66038 29.7225 9.9104 29.6126 10.1416 29.4745C10.2545 29.4021 10.4037 29.4008 10.522 29.4799C10.768 29.6461 11.0408 29.7788 11.3298 29.8686C11.6081 29.9544 11.9051 30 12.217 30C12.5718 30 12.9146 29.9383 13.2291 29.8257C13.5557 29.7091 13.8595 29.5362 14.1243 29.3204C14.2291 29.2359 14.3797 29.2171 14.506 29.2855C15.4348 29.8069 16.5357 29.8163 17.4685 29.3002C17.5935 29.2198 17.7589 29.2238 17.8772 29.3204C18.1419 29.5362 18.4444 29.7091 18.7724 29.8257C19.0869 29.9383 19.4283 30 19.7845 30C20.095 30 20.3934 29.9531 20.6716 29.8686C20.9606 29.7788 21.2335 29.6475 21.4795 29.4799C21.5883 29.4062 21.7335 29.3981 21.8518 29.4705C22.0803 29.6099 22.3303 29.7212 22.5978 29.7963C22.8599 29.87 23.1341 29.9088 23.4177 29.9088C24.2188 29.9088 24.946 29.5965 25.485 29.0898C26.0267 28.5791 26.3788 27.8686 26.4219 27.0777C26.4299 26.9343 26.5267 26.807 26.6732 26.7667C27.2579 26.6059 27.774 26.2721 28.1585 25.8244C28.5375 25.3833 28.7902 24.8284 28.8588 24.2198C28.8736 24.0951 28.9556 23.9825 29.0819 23.9369C29.6639 23.7238 30.1626 23.3337 30.5121 22.8337C30.8521 22.3498 31.0511 21.7587 31.0511 21.1192C31.0511 20.882 31.0242 20.6514 30.9731 20.4343C30.9207 20.2077 30.8414 19.9905 30.7406 19.7881C30.6814 19.6675 30.6962 19.5174 30.7916 19.4101C31.0322 19.1407 31.2258 18.8257 31.3548 18.4825C31.4798 18.1541 31.5484 17.7935 31.5484 17.4181C31.5484 17.1835 31.5228 16.9584 31.4745 16.7466C31.4247 16.5267 31.3481 16.3149 31.2513 16.1138C31.1949 15.9959 31.2083 15.8511 31.297 15.7452C31.5215 15.4784 31.7003 15.1728 31.8199 14.8417C31.9355 14.524 32 14.1782 32 13.8162C32 13.1178 31.7621 12.4784 31.3642 11.969C30.9569 11.4503 30.383 11.0669 29.723 10.9033C29.676 10.8926 29.6316 10.8725 29.5913 10.8417C29.4408 10.7277 29.4112 10.5119 29.5268 10.3618C29.7203 10.1084 29.8749 9.82425 29.9824 9.5119C30.0859 9.20627 30.1411 8.88322 30.1411 8.54541C30.1411 7.71563 29.805 6.96496 29.262 6.42474C28.7176 5.88052 27.9649 5.54538 27.1329 5.54538C26.9541 5.55745 26.7928 5.43144 26.7659 5.25181C26.6584 4.52258 26.2874 3.87781 25.7538 3.41937C25.2282 2.96763 24.5414 2.69416 23.7887 2.69282L23.7939 2.69012ZM19.1014 16.8231C18.9119 16.8231 18.7573 16.6689 18.7573 16.4799C18.7573 16.2909 18.9119 16.1367 19.1014 16.1367H21.3636C21.5531 16.1367 21.7077 16.2909 21.7077 16.4799C21.7077 16.6689 21.5531 16.8231 21.3636 16.8231H19.1014ZM10.6428 16.8231C10.4533 16.8231 10.2987 16.6689 10.2987 16.4799C10.2987 16.2909 10.4533 16.1367 10.6428 16.1367H12.905C13.0945 16.1367 13.2491 16.2909 13.2491 16.4799C13.2491 16.6689 13.0945 16.8231 12.905 16.8231H10.6428ZM16.3473 23.4867V25.6636C18.4105 25.551 20.2841 24.4384 21.6942 22.8285C23.0854 21.24 24.0223 19.1717 24.2508 17.0736C24.2844 16.7519 24.3005 16.449 24.3005 16.1473C24.3005 15.3189 24.1782 14.52 23.9524 13.768C23.7615 13.1312 23.4954 12.5267 23.1647 11.965C22.5572 12.5361 21.7359 12.8859 20.8353 12.8859C20.424 12.8859 20.0275 12.8122 19.6619 12.6782C19.424 12.591 19.1981 12.4771 18.9871 12.3417C18.7291 12.8122 18.3621 13.2144 17.9226 13.516C17.3755 13.8886 16.7142 14.1085 16.0045 14.1085C15.2948 14.1085 14.6321 13.8886 14.0851 13.516C13.6442 13.2144 13.2786 12.8122 13.0205 12.3417C12.8095 12.4784 12.5837 12.5924 12.3458 12.6795C11.9788 12.8149 11.5823 12.8873 11.1723 12.8873C10.2717 12.8873 9.45181 12.5374 8.84293 11.9664C8.51227 12.528 8.24746 13.1312 8.05525 13.768C7.82943 14.52 7.70712 15.3189 7.70712 16.1473C7.70712 16.449 7.72325 16.7519 7.75417 17.0548L7.75955 17.1018C7.98402 19.1728 8.92222 21.24 10.3121 22.8296C11.7207 24.4395 13.5958 25.5521 15.659 25.6647V23.4877C15.3969 23.4354 15.1429 23.3228 14.9157 23.1499C14.659 22.9555 14.0676 22.4596 13.7503 21.9676C13.6052 21.7411 13.5084 21.5064 13.5084 21.2826C13.5084 21.0051 13.6334 20.7638 13.9426 20.5963C14.1858 20.4636 14.5595 20.3831 15.1066 20.3831H16.9024C17.4508 20.3831 17.8258 20.4636 18.0691 20.5963C18.3769 20.7652 18.5005 21.0051 18.5005 21.2826C18.4978 21.5091 18.4037 21.7437 18.2586 21.9676C17.94 22.4596 17.35 22.9555 17.0932 23.1499C16.8661 23.3228 16.612 23.4354 16.3499 23.4877L16.3473 23.4867ZM16.6739 22.606C16.8997 22.4344 17.4158 22.0041 17.678 21.5979C17.7586 21.4746 17.811 21.3607 17.811 21.2816C17.8084 21.2521 17.7882 21.2239 17.7371 21.1958C17.5906 21.1167 17.3258 21.0684 16.8997 21.0684H15.1039C14.6778 21.0684 14.4117 21.1167 14.2665 21.1958C14.2155 21.2239 14.194 21.2534 14.194 21.2816C14.194 21.3633 14.245 21.4746 14.3257 21.5979C14.5878 22.0041 15.1039 22.4344 15.3298 22.606C15.5273 22.7561 15.7585 22.8325 16.0099 22.8339C16.2424 22.8312 16.4736 22.7548 16.6712 22.606H16.6739ZM8.25276 11.6168C7.93017 11.6396 7.50004 11.8473 7.02288 12.1999C6.25537 12.7655 5.40857 13.6945 4.6572 14.8581C3.91525 16.0149 3.42464 17.1624 3.22705 18.0954C3.05366 18.9211 3.10474 19.531 3.4233 19.7348C3.7217 19.9251 4.25399 19.7535 4.88303 19.3152C5.58063 18.8299 6.35351 18.0323 7.06053 17.0296C7.0323 16.7347 7.01886 16.4412 7.01886 16.1489C7.01886 15.2561 7.15059 14.3902 7.39658 13.5738C7.60357 12.8835 7.89256 12.228 8.2528 11.6181L8.25276 11.6168ZM7.19896 17.9894C6.56451 18.795 5.89513 19.4465 5.27685 19.8754C4.41258 20.476 3.61011 20.6663 3.05366 20.3097C2.47031 19.9358 2.32245 19.0644 2.55634 17.9532C2.77005 16.9451 3.29291 15.7172 4.08193 14.4865C4.879 13.2505 5.78629 12.2613 6.61564 11.65C7.1439 11.2599 7.65465 11.0173 8.10359 10.9557C8.02429 10.7894 7.95708 10.6152 7.906 10.4342C7.61836 10.7385 7.27021 10.9731 6.88984 11.1219C6.22315 11.3846 5.4543 11.3927 4.74325 11.0843C4.56986 11.0106 4.48921 10.8082 4.56448 10.6353C4.63841 10.4624 4.84137 10.3819 5.01477 10.457C5.55108 10.6902 6.13309 10.6822 6.6385 10.4838C7.14392 10.2868 7.57132 9.89535 7.80386 9.36183C7.87779 9.1889 8.08076 9.10847 8.25415 9.18354C8.38319 9.2385 8.46115 9.36451 8.46115 9.49722C8.46384 10.2439 8.76627 10.9195 9.25688 11.4088C9.74749 11.898 10.4249 12.201 11.1736 12.201C11.5043 12.201 11.8201 12.142 12.1105 12.0361C12.4143 11.9248 12.6912 11.7613 12.9318 11.5589C13.0756 11.4369 13.292 11.453 13.4156 11.5964C13.4439 11.6299 13.464 11.6648 13.4788 11.7037C13.6777 12.2117 14.0286 12.6474 14.4734 12.953C14.9076 13.2493 15.4372 13.4235 16.0058 13.4235C16.5743 13.4235 17.1026 13.2493 17.5367 12.953C17.9843 12.646 18.3365 12.209 18.5354 11.6969C18.604 11.5213 18.8029 11.4329 18.979 11.5012C19.0166 11.516 19.0502 11.5347 19.0784 11.5602C19.3164 11.764 19.5959 11.9262 19.8984 12.0374C20.19 12.1447 20.5059 12.2023 20.8352 12.2023C21.5839 12.2023 22.2614 11.8994 22.752 11.4101C23.2426 10.9208 23.5464 10.2452 23.5464 9.49854C23.5464 9.30953 23.7009 9.15537 23.8905 9.15537C24.0424 9.15537 24.1727 9.25457 24.2171 9.3913C24.451 9.91006 24.8744 10.2908 25.3704 10.4851C25.8758 10.6835 26.4578 10.6916 26.9954 10.4583C27.1688 10.3846 27.3718 10.4637 27.4457 10.6366C27.5197 10.8095 27.4404 11.012 27.267 11.0857C26.5559 11.394 25.7871 11.3846 25.1204 11.1232C24.74 10.9731 24.3905 10.7398 24.1042 10.4355C24.0531 10.6152 23.9859 10.7881 23.9066 10.9556C24.3556 11.0187 24.8664 11.2599 25.3959 11.6513C26.2253 12.2626 27.1339 13.2559 27.9229 14.4798C28.7119 15.7037 29.2388 16.9409 29.4525 17.9489C29.6878 19.0601 29.5413 19.9355 28.9566 20.3108C28.4001 20.6674 27.5976 20.477 26.7334 19.8751C26.1151 19.4449 25.4457 18.7961 24.8113 17.9904C24.4403 19.9207 23.5128 21.7989 22.213 23.2827C20.6068 25.1179 18.4279 26.3565 15.9924 26.3632C13.5837 26.3565 11.4049 25.1179 9.79863 23.2827C8.50021 21.7988 7.57273 19.9208 7.20175 17.9918L7.19896 17.9894ZM24.9469 17.0269C25.6539 18.0323 26.4268 18.8285 27.1244 19.3124C27.7534 19.7494 28.2871 19.9223 28.5855 19.732C28.904 19.5283 28.9564 18.913 28.7804 18.0859C28.5828 17.1556 28.0881 16.0014 27.3448 14.8473C26.6015 13.6931 25.7547 12.7641 24.9872 12.1998C24.5087 11.8473 24.0799 11.6381 23.7573 11.6167C24.1162 12.2266 24.4052 12.8835 24.6135 13.5738C24.8595 14.3902 24.9913 15.2561 24.9913 16.1489C24.9913 16.4411 24.9765 16.7347 24.9496 17.0283L24.9469 17.0269Z" fill="url(#paint0_linear_68_336)"/>
    </Svg>
  );
}

function MinaTentIcon({ width = 36, height = 25 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 25" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_68_337" x1="0" y1="0" x2="23.4253" y2="33.7324" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path d="M12.9045 12.8701L9.0606 2.03174V25H17.2065L12.9045 12.8701ZM13.6958 12.1299L18.2612 24.9999H36L31.6978 12.867L27.1324 0H9.39546L13.6958 12.1299ZM18.974 7.29486H24.5312L26.4201 12.6224H20.8628L18.974 7.29486ZM0 24.9995H8.14591L8.14412 2.03122L4.30024 12.8696L0 24.9995Z" fill="url(#paint0_linear_68_337)"/>
    </Svg>
  );
}

function HotelIcon({ width = 29, height = 25 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 29 25" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_68_338" x1="0" y1="0" x2="24.7271" y2="28.6835" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path d="M12.6873 19.4934H16.9553V25H12.6873V19.4934ZM27.9959 4.03017H24.1356V25H27.9959V6.02556C28.5517 6.01785 29 5.57363 29 5.02796C29 4.48229 28.5517 4.03789 27.9959 4.03017ZM1.00538 4.03017H1.00407C0.44831 4.03787 0 4.4821 0 5.02776C0 5.57343 0.448276 6.01764 1.00407 6.02536V24.9998H4.88517V4.02997L1.00538 4.03017ZM23.433 0.997608C23.4303 1.5484 22.9755 1.99389 22.4145 1.9952V24.9999H18.9921V18.4957C18.9921 18.2312 18.8859 17.977 18.6945 17.7896C18.5032 17.6021 18.2436 17.4969 17.9736 17.4981H11.6687C11.3987 17.4969 11.1379 17.6021 10.9478 17.7896C10.7564 17.977 10.649 18.2313 10.6503 18.4957V24.9999H7.23829V1.9952C6.68119 1.9875 6.23422 1.54328 6.23422 0.997608C6.23422 0.451941 6.68119 0.00773548 7.23829 1.16051e-05H22.4147C22.6847 -0.0012722 22.9443 0.104008 23.1356 0.291455C23.327 0.478902 23.433 0.733155 23.433 0.997608ZM12.3752 14.5144C12.3752 14.2499 12.2677 13.9957 12.0777 13.8095C11.8863 13.6221 11.6267 13.5168 11.3567 13.5168H10.3055C9.74447 13.5194 9.29096 13.9649 9.29096 14.5144C9.29096 15.0639 9.7445 15.5107 10.3055 15.512H11.3567C11.6268 15.512 11.8863 15.408 12.0777 15.2206C12.2677 15.0331 12.3752 14.7788 12.3752 14.5144ZM12.3752 11.1211C12.3752 10.8567 12.2677 10.6037 12.0777 10.4163C11.8863 10.2289 11.6267 10.1236 11.3567 10.1236H10.3055C9.74316 10.1236 9.287 10.5704 9.287 11.1212C9.287 11.672 9.74316 12.1188 10.3055 12.1188H11.3567C11.6268 12.1188 11.8863 12.0148 12.0777 11.8273C12.2677 11.6399 12.3752 11.3856 12.3752 11.1211ZM12.3752 7.72921C12.3752 7.46473 12.2677 7.21053 12.0777 7.02437C11.8863 6.83692 11.6267 6.73164 11.3567 6.73164H10.3055C9.74316 6.73164 9.287 7.17845 9.287 7.72924C9.287 8.28004 9.74316 8.72684 10.3055 8.72684H11.3567C11.6268 8.72684 11.8863 8.62156 12.0777 8.43539C12.2677 8.24795 12.3752 7.99367 12.3752 7.72921ZM12.3752 4.33597C12.3752 4.07148 12.2677 3.81728 12.0777 3.63112C11.8863 3.44367 11.6267 3.3384 11.3567 3.3384H10.3055C9.74447 3.34096 9.29096 3.78648 9.29096 4.33599C9.29096 4.88551 9.7445 5.33227 10.3055 5.33359H11.3567C11.6268 5.33359 11.8863 5.22831 12.0777 5.04215C12.2677 4.8547 12.3752 4.60042 12.3752 4.33597ZM16.0533 14.5147C16.0533 14.2502 15.9471 13.996 15.7557 13.8099C15.5644 13.6224 15.3048 13.5172 15.0348 13.5172H13.9849C13.4226 13.5197 12.969 13.9652 12.969 14.5147C12.969 15.0643 13.4226 15.511 13.9849 15.5123H15.0348C15.3049 15.5123 15.5644 15.4071 15.7557 15.2209C15.9458 15.0335 16.0533 14.7792 16.0533 14.5147ZM16.0533 11.1215C16.0533 10.857 15.9471 10.6041 15.7557 10.4166C15.5644 10.2292 15.3048 10.1239 15.0348 10.1239H13.9849C13.4212 10.1239 12.9664 10.5707 12.9664 11.1215C12.9664 11.6723 13.4212 12.1191 13.9849 12.1191H15.0348C15.3049 12.1191 15.5644 12.0151 15.7557 11.8277C15.9458 11.6402 16.0533 11.3859 16.0533 11.1215ZM16.0533 7.72954C16.0533 7.46506 15.9471 7.21086 15.7557 7.0247C15.5644 6.83725 15.3048 6.73197 15.0348 6.73197H13.9849C13.4212 6.73197 12.9664 7.17877 12.9664 7.72957C12.9664 8.28036 13.4212 8.72716 13.9849 8.72716H15.0348C15.3049 8.72716 15.5644 8.62189 15.7557 8.43572C15.9458 8.24827 16.0533 7.994 16.0533 7.72954ZM16.0533 4.3363C16.0533 4.07181 15.9471 3.81761 15.7557 3.63145C15.5644 3.444 15.3048 3.33872 15.0348 3.33872H13.9849C13.4226 3.34129 12.969 3.78681 12.969 4.33632C12.969 4.88583 13.4226 5.3326 13.9849 5.33392H15.0348C15.3049 5.33392 15.5644 5.22864 15.7557 5.04247C15.9458 4.85503 16.0533 4.60075 16.0533 4.3363ZM19.7327 14.5151C19.7327 14.2506 19.6252 13.9964 19.4338 13.8102C19.2438 13.6228 18.9843 13.5175 18.7142 13.5175H17.663C17.1006 13.52 16.6471 13.9656 16.6471 14.5151C16.6471 15.0646 17.1007 15.5114 17.663 15.5127H18.7142C18.9843 15.5127 19.2425 15.4074 19.4338 15.2212C19.6252 15.0338 19.7327 14.7795 19.7327 14.5151ZM19.7327 11.1218C19.7327 10.8573 19.6252 10.6044 19.4338 10.417C19.2438 10.2295 18.9843 10.1242 18.7142 10.1242H17.663C17.1006 10.1242 16.6445 10.571 16.6445 11.1218C16.6445 11.6726 17.1006 12.1194 17.663 12.1194H18.7142C18.9843 12.1194 19.2425 12.0154 19.4338 11.828C19.6252 11.6405 19.7327 11.3863 19.7327 11.1218ZM19.7327 7.72987C19.7327 7.46539 19.6252 7.21119 19.4338 7.02503C19.2438 6.83758 18.9843 6.7323 18.7142 6.7323H17.663C17.1006 6.7323 16.6445 7.1791 16.6445 7.7299C16.6445 8.28069 17.1006 8.72749 17.663 8.72749H18.7142C18.9843 8.72749 19.2425 8.62222 19.4338 8.43605C19.6252 8.2486 19.7327 7.99432 19.7327 7.72987ZM19.7327 4.33662C19.7327 4.07214 19.6252 3.81794 19.4338 3.63178C19.2438 3.44433 18.9843 3.33905 18.7142 3.33905H17.663C17.1006 3.34162 16.6471 3.78714 16.6471 4.33665C16.6471 4.88616 17.1007 5.33293 17.663 5.33425H18.7142C18.9843 5.33425 19.2425 5.22897 19.4338 5.0428C19.6252 4.85536 19.7327 4.60108 19.7327 4.33662Z" fill="url(#paint0_linear_68_338)"/>
    </Svg>
  );
}

// Digital ID SVG Icon Component
function DigitalIDIcon({ width = 28.02, height = 38 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 29 38" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_68_285" x1="6.50745" y1="0" x2="22.4973" y2="14.967" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint1_linear_68_285" x1="0" y1="16.1021" x2="21.2497" y2="43.2886" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint2_linear_68_285" x1="10.4237" y1="27.6223" x2="13.3324" y2="30.531" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint3_linear_68_285" x1="11.4909" y1="28.6897" x2="12.2644" y2="29.4636" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint4_linear_68_285" x1="10.4237" y1="31.2576" x2="13.3328" y2="34.1662" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint5_linear_68_285" x1="11.4909" y1="32.3254" x2="12.2652" y2="33.0993" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint6_linear_68_285" x1="14.0595" y1="27.6223" x2="16.9681" y2="30.531" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint7_linear_68_285" x1="15.1266" y1="28.6897" x2="15.9001" y2="29.4636" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint8_linear_68_285" x1="14.0595" y1="31.2576" x2="15.0289" y2="32.2274" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint9_linear_68_285" x1="15.0293" y1="32.227" x2="15.9992" y2="33.1964" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint10_linear_68_285" x1="15.9987" y1="33.1969" x2="16.9685" y2="34.1663" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint11_linear_68_285" x1="14.0595" y1="33.1969" x2="15.0293" y2="34.1667" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint12_linear_68_285" x1="15.9987" y1="31.2576" x2="16.9681" y2="32.227" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint13_linear_68_285" x1="8.96913" y1="26.1682" x2="10.7188" y2="27.9187" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint14_linear_68_285" x1="16.6721" y1="26.1682" x2="18.4218" y2="27.9183" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint15_linear_68_285" x1="8.96913" y1="33.8707" x2="10.7192" y2="35.6213" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="paint16_linear_68_285" x1="16.6721" y1="33.8703" x2="18.4227" y2="35.6204" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path d="M14.0073 16.0248C18.1429 16.0248 21.5071 11.6355 21.5071 7.50027C21.5071 3.36508 18.1429 0 14.0073 0C9.87168 0 6.50745 3.36508 6.50745 7.50027C6.50787 11.6359 9.8721 16.0248 14.0073 16.0248Z" fill="url(#paint0_linear_68_285)"/>
      <Path d="M19.6378 16.1021C18.1832 17.2104 16.3685 17.8704 14.4027 17.8704H13.6127C11.6469 17.8704 9.83134 17.2104 8.37722 16.1021C3.62727 16.8697 0 20.9868 0 25.9537C0 27.7211 2.63337 29.2707 6.59039 30.1442V35.3371C6.59039 36.8056 7.78485 38 9.25332 38H18.1389C19.6074 38 20.8018 36.8056 20.8018 35.3371V30.2739C25.1034 29.4307 28.0158 27.8123 28.0158 25.9537C28.0154 20.9868 24.3881 16.8697 19.6378 16.1021ZM19.5656 35.3367C19.5656 36.1233 18.9255 36.7638 18.1385 36.7638H9.2529C8.46588 36.7638 7.8258 36.1233 7.8258 35.3367V26.4515C7.8258 25.6645 8.46588 25.024 9.2529 25.024H18.1385C18.9255 25.024 19.5656 25.6645 19.5656 26.4515V35.3367Z" fill="url(#paint1_linear_68_285)"/>
      <Path d="M10.4237 30.531H13.3324V27.6223H10.4237V30.531ZM11.1508 28.3498H12.6049V29.8035H11.1508V28.3498Z" fill="url(#paint2_linear_68_285)"/>
      <Path d="M12.2648 28.6897H11.4909V29.4632H12.2648V28.6897Z" fill="url(#paint3_linear_68_285)"/>
      <Path d="M10.4237 34.1667H13.3324V31.2576H10.4237V34.1667ZM11.1508 31.9851H12.6049V33.4392H11.1508V31.9851Z" fill="url(#paint4_linear_68_285)"/>
      <Path d="M12.2648 32.3254H11.4909V33.0997H12.2648V32.3254Z" fill="url(#paint5_linear_68_285)"/>
      <Path d="M16.9681 27.6223H14.0595V30.531H16.9681V27.6223ZM16.2411 29.8035H14.7869V28.3498H16.2411V29.8035Z" fill="url(#paint6_linear_68_285)"/>
      <Path d="M15.9005 28.6897H15.1266V29.4632H15.9005V28.6897Z" fill="url(#paint7_linear_68_285)"/>
      <Path d="M15.0293 31.2576H14.0595V32.227H15.0293V31.2576Z" fill="url(#paint8_linear_68_285)"/>
      <Path d="M15.9987 32.227H15.0293V33.1969H15.9987V32.227Z" fill="url(#paint9_linear_68_285)"/>
      <Path d="M16.9681 33.1969H15.9987V34.1667H16.9681V33.1969Z" fill="url(#paint10_linear_68_285)"/>
      <Path d="M15.0293 33.1969H14.0595V34.1667H15.0293V33.1969Z" fill="url(#paint11_linear_68_285)"/>
      <Path d="M16.9681 31.2576H15.9987V32.227H16.9681V31.2576Z" fill="url(#paint12_linear_68_285)"/>
      <Path d="M9.69661 26.8948H10.7196V26.1682H8.96913V27.9179H9.69661V26.8948Z" fill="url(#paint13_linear_68_285)"/>
      <Path d="M16.6721 26.8948H17.6952V27.9179H18.4222V26.1682H16.6721V26.8948Z" fill="url(#paint14_linear_68_285)"/>
      <Path d="M9.69661 33.8707H8.96913V35.6208H10.7196V34.8934H9.69661V33.8707Z" fill="url(#paint15_linear_68_285)"/>
      <Path d="M17.6952 34.8934H16.6721V35.6208H18.4222V33.8703H17.6952V34.8934Z" fill="url(#paint16_linear_68_285)"/>
    </Svg>
  );
}

// Service Box Component
function ServiceBox({ icon, title, router, t }: { icon: string; title: string; router: any; t: any }) {
  
  const getServiceIcon = () => {
    const titleKey = Object.keys(t('services', { returnObjects: true })).find(
      key => t(`services.${key}`) === title
    ) || title;
    
    switch (titleKey) {
      case 'digitalID':
      case 'Digital ID':
        return <DigitalIDIcon width={22} height={30} />;
      case 'hajjPermit':
      case 'Hajj Permit':
        return <HajjPermitIcon width={24} height={32} />;
      case 'boardingPass':
      case 'Boarding Pass':
        return <BoardingPassIcon width={34} height={20} />;
      case 'trainETicket':
      case 'Train E-Ticket':
        return <TrainIcon width={24} height={28} />;
      case 'proxySacrifice':
      case 'Proxy sar':
        return <ProxyIcon width={24} height={24} />;
      case 'minaTent':
      case 'Mina Tent':
        return <MinaTentIcon width={28} height={20} />;
      case 'hotel':
      case 'Hotel':
        return <HotelIcon width={22} height={20} />;
      default:
        return <MaterialCommunityIcons name={icon as any} size={26} color="#8A0D4A" />;
    }
  };
  
  const handlePress = () => {
    if (title === t('services.fatwa') || title === 'Fatwa') {
      router.push('/fatascreen');
    } else if (title === t('services.digitalID') || title === 'Digital ID') {
      router.push('/digitalidscreen');
    } else if (title === t('services.hajjPermit') || title === 'Hajj Permit') {
      router.push('/hajjpermitscreen');
    } else if (title === t('services.boardingPass') || title === 'Boarding Pass') {
      router.push('/boardingscreen');
    } else if (title === t('services.trainETicket') || title === 'Train E-Ticket') {
      router.push('/trainticketscreen');
    } else if (title === t('services.proxySacrifice') || title === 'Proxy sar') {
      router.push('/proxysacrificescreen');
    } else if (title === t('services.minaTent') || title === 'Mina Tent') {
      router.push('/minatentscreen');
    } else if (title === t('services.hotel') || title === 'Hotel') {
      router.push('/hotelstayscreen');
    } else if (title === t('services.callSupport') || title === 'Call Support') {
      router.push('/callsupport');
    } else if (title === t('services.voting') || title === 'Voting') {
      router.push('/votingscreen');
    }
  };
  
  return (
    <TouchableOpacity style={styles.serviceBox} onPress={handlePress}>
      <View style={styles.iconCircleOuter}>
        <LinearGradient
          colors={['#B82073', '#1B131F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconCircleGradient}
        >
          <View style={styles.iconCircle}>
            {getServiceIcon()}
          </View>
        </LinearGradient>
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

// Day Card Component
function DayCard({ dayId, dayNum, title, subtitle, tag, imageSource, router }: any) {
  const openDetail = () => {
    router.push({ pathname: '/daydetailscreen', params: { dayId } });
  };

  return (
    <TouchableOpacity style={styles.dayCard} onPress={openDetail} activeOpacity={0.9}>
      <View style={styles.cardImageBox}>
        <Image source={imageSource} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.dayBadgeTop}>
          <Text style={styles.dayBadgeLabel}>{dayNum}</Text>
        </View>
        {tag ? (
          <View style={styles.locationBadge}>
            <Text style={styles.locationLabel}>{tag}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={1} ellipsizeMode="tail">{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

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
    fontWeight: '700',
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
  filterTabsRow: {
    marginTop: 16,
    marginBottom: 12,
    paddingVertical: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filterTabsContent: {
    paddingHorizontal: 8,
    paddingVertical: 0,
    columnGap: 4,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 100,
    backgroundColor: '#F5F5F5',
    gap: 6,
  },
  filterTabHotels: {
    width: 88,
  },
  filterTabPrayerTimes: {
    width: 112,
  },
  filterTabQibla: {
    width: 122,
  },
  filterTabHajjGuide: {
    width: 112,
  },
  filterTabActive: {
    height: 28,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderRadius: 100,
    overflow: 'hidden',
  },
  filterTabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    gap: 6,
  },
  filterTabText: {
    color: '#888',
    fontSize: 11,
    fontWeight: '500',
  },
  filterTabActiveText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  mainScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    paddingTop: 0,
    marginBottom: 8,
  },
  servicesContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  servicesGridScroll: {
    paddingRight: 16,
  },
  servicesGridWrapper: {
    flexDirection: 'row',
    gap: 12,
  },
  servicesPage: {
    width: 343, // Container width minus padding
  },
  servicesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  serviceBox: {
    width: 80,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircleOuter: {
    width: 54,
    height: 54,
    borderRadius: 16,
    marginBottom: 6,
    padding: 1.5,
    overflow: 'hidden',
  },
  iconCircleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 14.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 51,
    height: 51,
    borderRadius: 14.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: 11,
    color: '#4A4A4A',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
    fontWeight: '400',
    lineHeight: 14,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(184, 32, 115, 0.3)',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#B82073',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(184, 32, 115, 0.3)',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#B82073',
  },
  dotCircle: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#D5D5D5',
  },
  dotFilled: {
    backgroundColor: '#8A0D4A',
  },
  guideSection: {
    marginTop: 20,
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'Inter',
  },
  viewAllButton: {
    width: 81,
    height: 25,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  viewAllLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  guideCards: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 4,
  },
  dayCard: {
    width: 150,
    height: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'column',
  },
  cardImageBox: {
    position: 'relative',
    width: '100%',
    height: 110,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#DDD',
  },
  dayBadgeTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#8A0D4A',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  dayBadgeLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  locationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  locationLabel: {
    color: '#333',
    fontSize: 11,
    fontWeight: '600',
  },
  cardInfo: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'left',
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#666',
    textAlign: 'left',
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
  newMealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mealPreview: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  mealPreviewTitle: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 16,
    color: '#1B131F',
    marginBottom: 6,
  },
  mealPreviewTime: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#7A7A7A',
    marginBottom: 4,
  },
  mealPreviewItems: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 13,
    color: '#4C4C4C',
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
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: '#7A7A7A',
  },
  noticeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
  },
  /* New sections below Day by Day Guide */
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginTop: 16,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#1A1A1A',
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#9697A2',
  },
  /* Activity Tracker */
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityStats: {
    flex: 1,
    marginRight: 12,
  },
  activityStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(184,32,115,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#9697A2',
  },
  activityValue: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#1A1A1A',
  },
  activityRingContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityRingOuter: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    borderWidth: 6,
    borderColor: 'rgba(184,32,115,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityRingInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FDF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityRingValue: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#B82073',
  },
  activityRingLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#9697A2',
  },
  /* Crowd Level Monitor */
  crowdScrollContent: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  crowdCard: {
    width: 150,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F9F5FB',
    marginRight: 12,
  },
  crowdCardHigh: {
    backgroundColor: '#FFF3F4',
  },
  crowdCardMedium: {
    backgroundColor: '#FFF7E6',
  },
  crowdCardLow: {
    backgroundColor: '#F0FDF4',
  },
  crowdIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  crowdIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  crowdTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#1A1A1A',
  },
  crowdBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    justifyContent: 'space-between',
  },
  crowdBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(148,163,184,0.16)',
  },
  crowdBadgeHigh: {
    backgroundColor: 'rgba(220,38,38,0.12)',
  },
  crowdBadgeMedium: {
    backgroundColor: 'rgba(245,158,11,0.12)',
  },
  crowdBadgeLow: {
    backgroundColor: 'rgba(34,197,94,0.12)',
  },
  crowdBadgeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#4B5563',
  },
  crowdBadgeTextHigh: {
    color: '#B91C1C',
  },
  crowdBadgeTextMedium: {
    color: '#92400E',
  },
  crowdBadgeTextLow: {
    color: '#15803D',
  },
  crowdHint: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#9CA3AF',
  },
  /* Transport timeline */
  timelineContainer: {
    marginTop: 4,
    paddingTop: 4,
  },
  transportRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  transportTimeline: {},
  transportTimelineCol: {
    width: 28,
    alignItems: 'center',
  },
  transportNodeOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(184,32,115,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transportNodeInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B82073',
  },
  transportConnector: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(184,32,115,0.15)',
    marginTop: 2,
  },
  transportInfoCol: {
    flex: 1,
    paddingLeft: 8,
  },
  transportTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  transportTitle: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: '#1A1A1A',
  },
  transportTime: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#9697A2',
    marginBottom: 2,
  },
  transportStatus: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#4B5563',
  },
});


