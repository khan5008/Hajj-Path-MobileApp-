import { useLanguage } from '@/contexts/LanguageContext';
import { PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
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
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function HeaderFramePattern({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 375 422" fill="none" style={{ position: 'absolute' }}>
      <Path
        d="M497.144 386.709L502.541 378.783L503.002 378.082L512.546 381.378V409.435L497.144 386.709ZM479.305 381.378L488.06 378.362H488.85L494.708 386.99L479.305 409.505V381.378ZM313.233 386.709L318.631 378.853L319.092 378.152L328.636 381.449V409.505L313.233 386.709ZM295.395 381.378L304.15 378.362H304.94L310.798 386.92L295.395 409.505V381.378ZM129.192 386.709L134.655 378.783L135.116 378.082L144.595 381.378V409.435L129.192 386.709ZM111.42 381.378L120.174 378.362H120.964L126.822 386.99L111.42 409.155V381.378ZM-54.784 386.709L-49.3864 378.783L-48.9257 378.082L-39.3813 381.378V409.435L-54.784 386.709ZM-72.622 381.378L-63.8675 378.362H-63.0777L-57.2194 386.99L-72.622 409.576V381.378ZM514.587 380.116V369.454L523.341 366.438H524.131L539.468 388.954L514.587 380.116ZM467.523 366.859L467.984 366.157L477.528 369.454V379.695L452.581 388.323L467.523 366.859ZM330.545 379.695V369.174L339.234 366.157H340.024L355.426 388.743L330.545 379.695ZM283.481 366.438L284.008 365.737L293.487 369.033V379.695L268.605 388.323L283.481 366.438ZM146.569 379.695V369.033L155.324 366.017H156.048L171.45 388.603L146.569 379.695ZM99.5056 366.438L99.9664 365.737L109.445 369.033V379.695L84.5638 388.252L99.5056 366.438ZM-37.4724 379.695V369.103L-28.718 366.017H-27.9281L-12.5913 388.603L-37.4724 379.695ZM-84.536 366.438L-84.0753 365.737L-74.5309 369.033V379.695L-99.4779 388.323L-84.536 366.438ZM571.458 399.686V381.098L587.19 358.091L588.045 356.758L604.633 381.098V399.756L588.045 405.437L571.458 399.686ZM387.153 399.686V381.098L402.885 358.091L403.806 356.758L420.394 381.098V399.686L403.74 405.437L387.153 399.686ZM203.177 399.686V381.098L218.843 358.091L219.765 356.758L236.352 381.098V399.686L219.765 405.437L203.177 399.686ZM18.8722 399.686V381.098L34.6039 358.091L35.4597 356.758L52.0471 381.098V399.756L35.4597 405.437L18.8722 399.686ZM-165.433 399.686V381.098L-149.701 358.091L-148.779 356.758L-132.192 381.098V399.686L-147.924 405.016L-165.433 399.686ZM541.838 390.076L526.04 365.666L552.369 356.478L568.957 362.229V380.817L558.688 395.828L541.838 390.076ZM421.776 380.747V362.159L437.969 356.548H438.363L465.153 365.877L448.566 390.146L431.979 395.898L421.776 380.747ZM358.915 389.585L342.327 365.246L368.657 356.057H369.052L385.639 361.809V380.396L375.371 395.477L358.915 389.585ZM238.853 380.186V361.598L255.112 355.987L281.967 365.316L265.446 389.515L248.793 395.267L238.853 380.186ZM174.61 389.515L158.022 365.105L184.352 355.987H184.681L201.268 361.739V380.326L191 395.407L174.61 389.515ZM54.5484 380.116V361.528L70.8067 355.917H71.1358L97.9917 365.246L81.4042 389.585L64.8168 395.337L54.5484 380.116ZM-9.69505 389.375L-26.2825 365.035L0.0467682 355.847H0.3759L17.0292 361.598V380.186L6.82657 395.196L-9.69505 389.375ZM-129.493 380.046V361.458L-113.301 355.847H-112.906L-86.05 365.176L-102.703 389.515L-119.291 395.196L-129.493 380.046ZM518.997 354.935L524.394 347.009L524.855 346.307L549.736 354.935L524.855 363.562L518.997 354.935ZM442.379 354.935L466.47 346.588H467.26L473.118 355.215L467.26 363.843L442.379 354.935ZM334.955 354.935L340.353 347.079L340.879 346.377L365.497 354.865L340.55 363.422L334.955 354.935ZM258.337 354.935L282.494 346.588H283.218L289.142 355.215L283.218 363.843L258.337 354.935ZM150.914 354.935L156.377 347.009L156.838 346.307L181.719 354.935L156.838 363.562L150.914 354.935ZM74.2953 354.935L98.4525 346.588H99.2423L105.101 355.215L99.2423 363.843L74.2953 354.935ZM-33.0623 354.935L-27.6648 347.009L-27.204 346.307L-2.32286 354.935L-27.204 363.562L-33.0623 354.935ZM-109.68 354.935L-85.5892 346.588H-84.7993L-78.9411 355.145L-84.7993 363.773L-109.68 354.935ZM589.296 354.935L604.699 332.419V349.604L620.101 354.935L604.699 360.266V377.521L589.296 354.935ZM571.458 360.266L556.055 354.935L571.458 349.604V332.419L586.861 354.935L571.458 377.521V360.266ZM404.991 354.865L420.394 332.279V349.534L435.796 354.865L420.394 360.195V377.45L404.991 354.865ZM387.219 360.195L372.079 354.865L387.482 349.534V332.279L402.819 354.865L387.416 377.38L387.219 360.195ZM220.949 354.794L236.352 332.209V349.464L251.755 354.794L236.352 360.125V377.31L220.949 354.794ZM203.177 360.125L187.775 354.724L203.177 349.393V332.209L218.58 354.794L203.177 377.31V360.125ZM36.9736 354.654L52.3762 332.138V349.323L67.713 354.724L52.3104 359.985V377.24L36.9736 354.654ZM19.1355 359.985L3.73288 354.654L19.1355 349.323V332.138L34.5381 354.654L19.1355 377.24V359.985ZM-147.068 354.584L-131.665 332.068V349.253L-116.263 354.584L-131.665 359.915V377.17L-147.068 354.584ZM-164.84 359.915L-180.243 354.584L-164.84 349.253V331.998L-149.504 354.584L-164.906 377.17L-164.84 359.915Z"
        fill="white"
        fillOpacity="0.1"
      />
    </Svg>
  );
}

export default function MinaTentScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
  });

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const noticeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!fontsLoaded || !showNoticeModal) return;
    noticeAnim.setValue(0);
    Animated.timing(noticeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showNoticeModal, fontsLoaded, noticeAnim]);

  if (!fontsLoaded) {
    return null;
  }

  const tentNumber = t('minaTent.tentNumberValue');
  const operator = t('minaTent.operatorValue');
  const checkIn = t('minaTent.checkInValue');
  const checkOut = t('minaTent.checkOutValue');
  const distance = t('minaTent.distanceValue');
  const capacity = t('minaTent.capacityValue');

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#B82073" />

      {/* Header with Pink to Black Gradient */}
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
              <View style={[styles.headerRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity 
                  onPress={() => router.back()} 
                  style={[styles.backButton, isRTL && { marginRight: 0, marginLeft: 12 }]}
                >
                  <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                  <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>{t('minaTent.yourMinaTent')}</Text>
                </View>
                <TouchableOpacity
                  style={styles.headerBellButton}
                  onPress={() => setShowNoticeModal(true)}
                >
                  <Ionicons name="notifications" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Tent Information Card */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]}>{t('minaTent.tentDetails')}</Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }]}>{t('minaTent.tentNumber')}</Text>
            <Text style={[styles.infoValue, isRTL && { textAlign: 'right' }]}>{tentNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }]}>{t('minaTent.groupOperator')}</Text>
            <Text style={[styles.infoValue, isRTL && { textAlign: 'right' }]}>{operator}</Text>
          </View>

          <View style={[styles.infoRowSplit, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.infoSplitItem, isRTL && { paddingRight: 0, paddingLeft: 12 }]}>
              <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }]}>{t('minaTent.checkIn')}</Text>
              <Text style={[styles.infoValue, isRTL && { textAlign: 'right' }]}>{checkIn}</Text>
            </View>
            <View style={styles.infoSplitItem}>
              <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }]}>{t('minaTent.checkOut')}</Text>
              <Text style={[styles.infoValue, isRTL && { textAlign: 'right' }]}>{checkOut}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }]}>{t('minaTent.distanceFromJamarat')}</Text>
            <Text style={[styles.infoValue, isRTL && { textAlign: 'right' }]}>{distance}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }]}>{t('minaTent.tentCapacity')}</Text>
            <Text style={[styles.infoValue, isRTL && { textAlign: 'right' }]}>{capacity}</Text>
          </View>
        </View>

        {/* Facilities Card */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]}>{t('minaTent.facilities')}</Text>
          <View style={styles.facilitiesGrid}>
            {[
              t('minaTent.airConditioned'),
              t('minaTent.mattressPillow'),
              t('minaTent.mealsProvided'),
              t('minaTent.drinkingWater'),
              t('minaTent.cleanWashrooms'),
              t('minaTent.chargingPoints'),
              t('minaTent.wifiLimited'),
            ].map((item) => (
              <View key={item} style={[styles.facilityItem, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={styles.facilityBullet} />
                <Text style={[styles.facilityLabel, isRTL && { textAlign: 'right' }]}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Daily Schedule Card with Timeline */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]}>{t('minaTent.dailySchedule')}</Text>
          <View style={styles.timelineContainer}>
            {[
              { day: t('minaTent.scheduleDay1'), text: t('minaTent.scheduleText1') },
              { day: t('minaTent.scheduleDay2'), text: t('minaTent.scheduleText2') },
              { day: t('minaTent.scheduleDay3'), text: t('minaTent.scheduleText3') },
              { day: t('minaTent.scheduleDay4'), text: t('minaTent.scheduleText4') },
            ].map((schedule, index, arr) => (
              <View key={index} style={[styles.scheduleRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={styles.scheduleTimelineCol}>
                  <View style={styles.scheduleNodeOuter}>
                    <View style={styles.scheduleNodeInner} />
                  </View>
                  {index < arr.length - 1 && <View style={styles.scheduleConnector} />}
                </View>
                <View style={[styles.scheduleInfoCol, isRTL && { paddingRight: 8, paddingLeft: 0 }]}>
                  <Text style={[styles.scheduleDay, isRTL && { textAlign: 'right' }]}>{schedule.day}</Text>
                  <Text style={[styles.scheduleText, isRTL && { textAlign: 'right' }]}>{schedule.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Support & Assistance Card */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]}>{t('minaTent.supportAssistance')}</Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }]}>{t('minaTent.groupLeader')}</Text>
            <Text style={[styles.infoValue, isRTL && { textAlign: 'right' }]}>{t('minaTent.groupLeaderValue')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }]}>{t('minaTent.campSupervisor')}</Text>
            <Text style={[styles.infoValue, isRTL && { textAlign: 'right' }]}>{t('minaTent.campSupervisorValue')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, isRTL && { textAlign: 'right' }]}>{t('minaTent.emergencyHotline')}</Text>
            <Text style={[styles.infoValue, isRTL && { textAlign: 'right' }]}>{t('minaTent.emergencyHotlineValue')}</Text>
          </View>
        </View>

        {/* Extra padding for sticky button */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sticky Open Map Location Button */}
      <View style={styles.stickyButtonContainer}>
        <TouchableOpacity style={styles.stickyButton}>
          <LinearGradient
            colors={['#B82073', '#1B131F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.stickyButtonGradient}
          >
            <Ionicons name="navigate-outline" size={18} color="#FFFFFF" />
            <Text style={styles.stickyButtonText}>{t('minaTent.openMapLocation')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>


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
              <Text style={[styles.noticeTitle, isRTL && { textAlign: 'right' }]}>{t('minaTent.tentReminders')}</Text>
              <Text style={[styles.noticeBody, isRTL && { textAlign: 'right' }]}>
                {t('minaTent.tentRemindersBody')}
              </Text>
              <TouchableOpacity
                style={styles.noticeButton}
                onPress={() => setShowNoticeModal(false)}
              >
                <Text style={styles.noticeButtonText}>{t('common.gotIt')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  headerGradient: {
    width: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerFrameBase: {
    position: 'absolute',
    top: 0,
    left: -(SCREEN_WIDTH * 0.25),
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_WIDTH * (422 / 375),
    zIndex: 0,
    opacity: 0.8,
  },
  headerPatternWrapper: {
    width: '100%',
    height: '100%',
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    minHeight: 50,
  },
  backButton: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  headerBellButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoRowSplit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoSplitItem: {
    flex: 1,
    paddingRight: 12,
  },
  infoLabel: {
    fontSize: 11,
    color: '#9697A2',
    fontFamily: 'PlusJakartaSans-Regular',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 13,
    color: '#212529',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  facilitiesGrid: {
    marginTop: 4,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  facilityBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B82073',
    marginRight: 8,
  },
  facilityLabel: {
    fontSize: 13,
    color: '#212529',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  mapPreview: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 4,
  },
  mapImage: {
    width: '100%',
    height: 150,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mapContent: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  mapTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 4,
  },
  mapSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.95)',
    fontFamily: 'PlusJakartaSans-Regular',
    marginBottom: 10,
  },
  mapButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(184,32,115,0.95)',
  },
  mapButtonText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  timelineContainer: {
    marginTop: 4,
    paddingTop: 4,
  },
  scheduleRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  scheduleTimelineCol: {
    width: 28,
    alignItems: 'center',
  },
  scheduleNodeOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(184,32,115,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleNodeInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B82073',
  },
  scheduleConnector: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(184,32,115,0.15)',
    marginTop: 2,
    minHeight: 20,
  },
  scheduleInfoCol: {
    flex: 1,
    paddingLeft: 8,
  },
  scheduleDay: {
    fontSize: 13,
    color: '#1A1A1A',
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'PlusJakartaSans-Regular',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 80,
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
  },
  stickyButton: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  stickyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  stickyButtonText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  noticeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: 24,
  },
  noticeSheet: {
    maxWidth: 260,
  },
  noticePointer: {
    alignSelf: 'flex-end',
    width: 14,
    height: 14,
    marginRight: 20,
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
    fontSize: 16,
    color: '#1B131F',
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  noticeBody: {
    fontSize: 13,
    color: '#4C4C4C',
    lineHeight: 20,
    marginBottom: 14,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  noticeButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#B82073',
  },
  noticeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
});


