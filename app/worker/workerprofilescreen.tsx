import WorkerBottomTabs from '@/components/worker-bottom-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import {
    OpenSans_400Regular,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans';
import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Line, Path, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';

function LogoutIcon() {
  return (
    <Svg width={14} height={19} viewBox="0 0 14 19" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_worker_logout" x1="0" y1="0" x2="18.1472" y2="13.3716" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.4071 0.905362H3.06852C2.476 0.905362 1.93685 1.14668 1.54602 1.53357C1.1552 1.92125 0.911919 2.45606 0.911919 3.04379V5.97013C0.911919 6.22001 0.707878 6.42241 0.45596 6.42241C0.204042 6.42241 0 6.22001 0 5.97013V3.04379C0 2.20695 0.344516 1.44483 0.90095 0.893683C1.45658 0.342535 2.22411 0 3.06854 0H10.9315C11.7759 0 12.5434 0.341738 13.0991 0.893683C13.6547 1.44483 14 2.20617 14 3.04379V15.9562C14 16.7931 13.6555 17.5552 13.0991 18.1063C12.5434 18.6575 11.7759 19 10.9315 19H3.06854C2.22411 19 1.45658 18.6583 0.90095 18.1063C0.34532 17.5552 0 16.7938 0 15.9562V13.0299C0 12.78 0.204042 12.5776 0.45596 12.5776C0.707878 12.5776 0.911919 12.78 0.911919 13.0299V15.9562C0.911919 16.5439 1.1552 17.0788 1.54602 17.4664C1.93685 17.8541 2.476 18.0946 3.06852 18.0946H10.4071V0.903727V0.905362ZM8.50158 9.14927C8.60439 9.23257 8.67031 9.35869 8.67031 9.50036C8.67031 9.63815 8.60832 9.76115 8.51021 9.84445C7.2671 11.0737 5.85522 12.2959 4.56278 13.4892C4.37914 13.6589 4.09111 13.6488 3.92004 13.4659C3.74895 13.2837 3.75916 12.998 3.94358 12.8283L7.05685 9.95338H0.456633C0.204715 9.95338 0.000673092 9.75099 0.000673092 9.5011C0.000673092 9.25121 0.204715 9.04882 0.456633 9.04882H7.05685L3.94358 6.1739C3.75994 6.00419 3.74974 5.71849 3.92004 5.53634C4.09112 5.35418 4.37915 5.34406 4.56278 5.51298L8.50097 9.14998L8.50158 9.14927Z"
        fill="url(#paint0_linear_worker_logout)"
      />
    </Svg>
  );
}

function GradientLine() {
  return (
    <Svg width={181} height={1} viewBox="0 0 181 1" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_worker_line" x1="0" y1="1" x2="0.0110494" y2="2.99994" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Line x1="0.5" y1="0.5" x2="180.5" y2="0.5" stroke="url(#paint0_linear_worker_line)" strokeLinecap="round" />
    </Svg>
  );
}

function AssignedPilgrimIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_worker_pilgrim" x1="0" y1="0" x2="13" y2="13" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C10.09 13 13 10.09 13 6.5C13 2.91 10.09 0 6.5 0ZM6.5 3C7.88 3 9 4.12 9 5.5C9 6.88 7.88 8 6.5 8C5.12 8 4 6.88 4 5.5C4 4.12 5.12 3 6.5 3ZM6.5 9.5C8.16 9.5 10.5 10.34 10.5 11V12.5C9.39 13.16 7.99 13.5 6.5 13.5C5.01 13.5 3.61 13.16 2.5 12.5V11C2.5 10.34 4.84 9.5 6.5 9.5Z"
        fill="url(#paint0_linear_worker_pilgrim)"
      />
    </Svg>
  );
}

function ContactAdminIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Defs>
        <SvgLinearGradient id="paint0_linear_worker_admin" x1="0" y1="0" x2="11.1734" y2="11.9715" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#B82073" />
          <Stop offset="1" stopColor="#1B131F" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M11.6834 8.28875L8.98154 7.29612C8.43731 7.09772 7.82317 7.2134 7.42016 7.61018L7.10418 7.90811C6.96367 8.04058 6.73542 8.07354 6.55995 7.97402C5.77035 7.54362 4.3138 6.60075 3.40155 5.02906C3.29599 4.84681 3.33164 4.61546 3.5071 4.48298L3.87586 4.20187C4.40226 3.80508 4.57773 3.12652 4.2967 2.56429L3.174 0.248157C3.10408 0.0827191 2.92862 0 2.75316 0C2.24458 0.0168019 0.577717 0.198393 0.103255 2.01818C-0.0372554 2.54745 -0.0372555 3.12648 0.121075 3.72236C0.559743 5.40966 2.5248 10.9687 9.28027 11.2H9.38583C10.0699 11.2 10.7368 10.9518 11.2282 10.5053C11.7368 10.0419 12 9.42994 12 8.75132V8.70156C11.9815 8.50381 11.8588 8.35466 11.6834 8.28875Z"
        fill="url(#paint0_linear_worker_admin)"
      />
    </Svg>
  );
}

function GradientText({ text }: { text: string }) {
  return (
    <MaskedView maskElement={<Text style={styles.gradientMaskText}>{text}</Text>}>
      <LinearGradient colors={['#B82073', '#1B131F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text style={styles.gradientHiddenText}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

export default function WorkerProfileScreen() {
  const router = useRouter();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Medium': Inter_500Medium,
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, isRTL && { marginRight: 0, marginLeft: 12 }]}>
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color="#1B131F" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>{t('workerProfile.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require('@/assets/images/profilepic.png')}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.editIconContainer}>
                <Ionicons name="pencil" size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={[styles.profileInfo, isRTL && { alignItems: 'flex-end' }]}>
              <Text style={[styles.profileName, isRTL && { textAlign: 'right' }]}>{t('workerProfile.profileCard.name')}</Text>
              <Text style={[styles.profileEmail, isRTL && { textAlign: 'right' }]}>{t('workerProfile.profileCard.email')}</Text>
            </View>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={() => router.push('/login')}
            >
              <LogoutIcon />
              <GradientText text={t('workerProfile.logout')} />
            </TouchableOpacity>
          </View>

          {/* Group Overview Card */}
          <View style={[styles.card, styles.overviewCard]}>
            <Text style={styles.cardTitle}>{t('workerProfile.groupOverview.title')}</Text>
            <View style={styles.gradientLineContainer}>
              <GradientLine />
            </View>
            <View style={styles.progressContent}>
              <View style={styles.progressLeft}>
                <Text style={styles.progressText}>37/47 {t('workerProfile.groupOverview.pilgrimCheckIn')}</Text>
                <Text style={styles.progressText}>12 {t('workerProfile.groupOverview.requestResponses')}</Text>
                <TouchableOpacity style={styles.viewGroupButton}>
                  <LinearGradient
                    colors={['#B82073', '#1B131F']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.viewGroupButtonGradient}
                  >
                    <Text style={styles.viewGroupText}>{t('workerProfile.groupOverview.viewGroupSummary')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={styles.progressRight}>
                <View style={styles.circularProgressContainer}>
                  <Svg width={69} height={69} style={styles.circularProgressSvg}>
                    <Circle
                      cx={34.5}
                      cy={34.5}
                      r={30.5}
                      stroke="#E8E8E8"
                      strokeWidth={8}
                      fill="none"
                    />
                    <Circle
                      cx={34.5}
                      cy={34.5}
                      r={30.5}
                      stroke="url(#progressGradient)"
                      strokeWidth={8}
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 30.5 * 0.87} ${2 * Math.PI * 30.5}`}
                      strokeDashoffset={-2 * Math.PI * 30.5 * 0.25}
                      transform="rotate(-90 34.5 34.5)"
                    />
                    <Defs>
                      <SvgLinearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor="#B82073" />
                        <Stop offset="1" stopColor="#1B131F" />
                      </SvgLinearGradient>
                    </Defs>
                  </Svg>
                  <View style={styles.progressPercentContainer}>
                    <Text style={styles.progressPercent}>87%</Text>
                  </View>
                </View>
                <Text style={styles.journeyStatus}>{t('workerProfile.groupOverview.taskInProcess')}</Text>
              </View>
            </View>
          </View>

          {/* Account Card */}
          <View style={[styles.card, styles.accountCard]}>
            <Text style={styles.cardTitle}>{t('workerProfile.account.title')}</Text>
            <View style={styles.gradientLineContainer}>
              <GradientLine />
            </View>
            <TouchableOpacity 
              style={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]}
              onPress={() => router.push('/assignedpilgrimscreen')}
            >
              <View style={styles.iconWrapper}>
                <AssignedPilgrimIcon />
              </View>
              <Text style={styles.listItemText}>{t('workerProfile.account.assignedPilgrim')}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9A9A9A" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]}
              onPress={() => router.push('/contactadminscreen')}
            >
              <View style={styles.iconWrapper}>
                <ContactAdminIcon />
              </View>
              <Text style={styles.listItemText}>{t('workerProfile.account.contactAdmin')}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9A9A9A" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]}
              onPress={() => router.push('/activitylogscreen')}
            >
              <Ionicons name="bar-chart-outline" size={20} color="#45455F" />
              <Text style={styles.listItemText}>{t('workerProfile.account.activityLog')}</Text>
              <Ionicons name="chevron-forward" size={20} color="#9A9A9A" />
            </TouchableOpacity>
          </View>

          {/* Support Card */}
          <View style={[styles.card, styles.supportCard]}>
            <Text style={styles.cardTitle}>{t('workerProfile.support.title')}</Text>
            <View style={styles.gradientLineContainer}>
              <GradientLine />
            </View>
            <TouchableOpacity 
              style={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]}
              onPress={() => setShowLanguageModal(true)}
            >
              <Ionicons name="language-outline" size={20} color="#45455F" />
              <Text style={[styles.listItemText, isRTL && { textAlign: 'right' }]}>{t('profile.language')}</Text>
              <View style={[styles.languageDropdown, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.languageText, isRTL && { textAlign: 'right' }]}>{language === 'ar' ? t('profile.arabic') : t('profile.english')}</Text>
                <Ionicons name="chevron-down" size={16} color="#9A9A9A" />
              </View>
            </TouchableOpacity>
            <View style={[styles.listItem, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="moon-outline" size={20} color="#45455F" />
              <Text style={[styles.listItemText, isRTL && { textAlign: 'right' }]}>{t('profile.darkMode')}</Text>
              <TouchableOpacity onPress={() => setDarkMode(!darkMode)}>
                {darkMode ? (
                  <View style={styles.toggleOn}>
                    <View style={styles.toggleCircleOn} />
                  </View>
                ) : (
                  <View style={styles.toggleOff}>
                    <View style={styles.toggleCircle} />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>

        {/* Language Selection Modal */}
        <Modal
          visible={showLanguageModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowLanguageModal(false)}
          >
            <View style={[styles.modalContent, isRTL && { direction: 'rtl' }]} onStartShouldSetResponder={() => true}>
              <Text style={[styles.modalTitle, isRTL && { textAlign: 'right' }]}>{t('profile.selectLanguage')}</Text>
              {[
                { key: 'en', label: t('profile.english') },
                { key: 'ar', label: t('profile.arabic') }
              ].map((lang) => (
                <TouchableOpacity
                  key={lang.key}
                  style={[
                    styles.languageOption,
                    language === lang.key && styles.languageOptionActive,
                    isRTL && { flexDirection: 'row-reverse' },
                  ]}
                  onPress={async () => {
                    try {
                      await setLanguage(lang.key as 'en' | 'ar', false); // false = don't reload app
                      setShowLanguageModal(false);
                      // Language updated in place, no navigation
                    } catch (error) {
                      console.error('Error changing language:', error);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      language === lang.key && styles.languageOptionTextActive,
                      isRTL && { textAlign: 'right' },
                    ]}
                  >
                    {lang.label}
                  </Text>
                  {language === lang.key && (
                    <Ionicons name="checkmark" size={20} color="#952562" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <WorkerBottomTabs active="profile" />
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
    paddingHorizontal: 21,
    paddingTop: 8,
    paddingBottom: 24,
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    width: 333,
    minHeight: 68,
    borderRadius: 14.08,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#E8E8E8',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#952562',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1B131F',
    marginBottom: 2,
  },
  profileEmail: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 10,
    color: '#212529',
  },
  editButton: {
    padding: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14.78,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#1B131F',
    marginBottom: 4,
  },
  gradientLineContainer: {
    marginBottom: 4,
  },
  overviewCard: {
    width: 333,
    minHeight: 113,
  },
  progressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  progressLeft: {
    flex: 1,
    marginRight: 8,
  },
  progressText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#212529',
    marginBottom: 6,
  },
  viewGroupButton: {
    borderRadius: 1000,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  viewGroupButtonGradient: {
    width: 151,
    height: 25,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  viewGroupText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  progressRight: {
    alignItems: 'center',
    marginLeft: 8,
    justifyContent: 'flex-start',
  },
  circularProgressContainer: {
    width: 69,
    height: 69,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  circularProgressSvg: {
    position: 'absolute',
  },
  progressPercentContainer: {
    width: 69,
    height: 69,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#1B131F',
  },
  journeyStatus: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#7A7A7A',
    marginTop: 2,
  },
  accountCard: {
    width: 333,
    minHeight: 143,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 10,
    minHeight: 40,
  },
  iconWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemText: {
    flex: 1,
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#212529',
  },
  languageDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  languageText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#45455F',
  },
  toggleOff: {
    width: 32,
    height: 19,
    borderRadius: 9.5,
    backgroundColor: '#E8E8E8',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  toggleCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#FFFFFF',
  },
  toggleOn: {
    width: 32,
    height: 19,
    borderRadius: 9.5,
    backgroundColor: '#952562',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  toggleCircleOn: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#FFFFFF',
  },
  supportCard: {
    width: 333,
    minHeight: 119,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 8,
  },
  gradientMaskText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#000',
  },
  gradientHiddenText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    opacity: 0,
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
    maxWidth: 350,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    marginBottom: 12,
  },
  languageOptionActive: {
    backgroundColor: '#F5E1EB',
    borderWidth: 2,
    borderColor: '#952562',
  },
  languageOptionText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#1B131F',
  },
  languageOptionTextActive: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#952562',
  },
});



