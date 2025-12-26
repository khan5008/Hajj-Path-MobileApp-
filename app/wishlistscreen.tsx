import BottomTabs from '@/components/bottom-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heebo_500Medium } from '@expo-google-fonts/heebo';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import {
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HERO_GRADIENT = ['#B82073', '#1B131F'] as const;

type QuickActionId = 'map' | 'wheelchair' | 'bus' | 'hotel' | 'medical';

type QuickAction = {
  id: QuickActionId;
  label: string;
  image: { uri: string };
  title: string;
  description: string;
};

const QUICK_ACTIONS: QuickAction[] = [ 
    {
      id: 'map',
      label: 'My Map',
      image: require('@/assets/images/map.png'),
      title: 'Save Locations on My Map',
      description:
        'Pin your hotel, Mina camp, meeting points and favourite masjid entrances so you can quickly navigate back even in a crowd.',
    },
    {
      id: 'wheelchair',
      label: 'Wheelchair',
      image: require('../assets/images/wheelchair.png'),
      title: 'Wheelchair Assistance',
      description:
        'Request wheelchair support inside the Haram or during long walks between sites. Add how many pilgrims and the time you need help.',
    },
    {
      id: 'bus',
      label: 'Shuttle Bus',
      image: require('@/assets/images/bus.png'),
      title: 'Book Shuttle Bus',
      description:
        'Reserve seats on official shuttle buses between Makkah, Mina, Arafat and Muzdalifah with your group and selected time window.',
    },
    {
      id: 'hotel',
      label: 'Hotel Needs',
      image: require('@/assets/images/hotel.png'),
      title: 'Hotel & Room Requests',
      description:
        'Share special requirements with your organiser such as early check-in, late checkout, extra bedding or room close to the lift.',
    },
    {
      id: 'medical',
      label: 'Medical Help',
      image: require('@/assets/images/medical.png'),
      title: 'Medical & Pharmacy',
      description:
        'Let your guide know if you need doctor support, prescription refills or nearby pharmacy recommendations during Hajj.',
    },
  ];
  

export default function WishlistScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [selectedAction, setSelectedAction] = useState<QuickActionId>('wheelchair');

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
    'Inter-Regular': Inter_400Regular,
    'Heebo-Medium': Heebo_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  const quickActionContent = useMemo(() => {
    const actionData = QUICK_ACTIONS.find((a) => a.id === selectedAction) ?? QUICK_ACTIONS[0];
    return <ServiceDetailCard action={actionData} />;
  }, [selectedAction]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.searchRow}>
            <View style={[styles.searchBox, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="search" size={18} color="#7A7A7A" />
              <TextInput
                placeholder={t('wishlist.searchPlaceholder')}
                placeholderTextColor="#9A9A9A"
                style={[styles.searchInput, isRTL && { textAlign: 'right' }]}
              />
              <TouchableOpacity 
                style={styles.requestIconButton}
                onPress={() => router.push('/userrequestform')}
              >
                <Ionicons name="create-outline" size={18} color="#952562" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsRow}
          >
            {QUICK_ACTIONS.map((action) => {
              const isSelected = selectedAction === action.id;
              return (
                <TouchableOpacity
                  key={action.id}
                  onPress={() => setSelectedAction(action.id)}
                  activeOpacity={0.85}
                  style={styles.quickActionTap}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={['#B82073', '#1B131F']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.quickActionGradient}
                    >
                      <View style={styles.quickActionInner}>
                        <View style={styles.quickActionImageWrap}>
                          <LinearGradient
                            colors={['#B82073', '#1B131F']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.quickActionCircleBorder}
                          >
                            <View style={styles.quickActionImageInner}>
                              <Image source={action.image} style={styles.quickActionImage} />
                            </View>
                          </LinearGradient>
                        </View>
                        <Text style={[styles.quickActionLabel, styles.quickActionLabelActive]} numberOfLines={2}>
                          {t(`wishlist.${action.id}`)}
                        </Text>
                        <View style={styles.halfCircle} />
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={styles.quickActionOutline}>
                      <View style={styles.quickActionInner}>
                        <View style={styles.quickActionImageWrap}>
                          <View style={styles.quickActionCircleBorderInactive}>
                            <View style={styles.quickActionImageInner}>
                              <Image source={action.image} style={styles.quickActionImage} />
                            </View>
                          </View>
                        </View>
                        <Text style={styles.quickActionLabel} numberOfLines={2}>
                          {t(`wishlist.${action.id}`)}
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {quickActionContent}

          {/* Suggested items list */}
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsTitle}>{t('wishlist.suggestions')}</Text>
            <View style={styles.suggestionsGrid}>
              <SuggestionCard
                title={t('wishlist.essentialDayBag')}
                body={t('wishlist.essentialDayBagBody')}
              />
              <SuggestionCard
                title={t('wishlist.stayConnected')}
                body={t('wishlist.stayConnectedBody')}
              />
              <SuggestionCard
                title={t('wishlist.prepareWalking')}
                body={t('wishlist.prepareWalkingBody')}
              />
              <SuggestionCard
                title={t('wishlist.notesGuide')}
                body={t('wishlist.notesGuideBody')}
              />
            </View>
          </View>
        </ScrollView>

        <BottomTabs active="wishlist" />
      </View>
    </SafeAreaView>
  );
}

function ServiceDetailCard({ action }: { action: QuickAction }) {
  const { t } = useLanguage();
  const getTitleKey = () => {
    const titleMap: { [key: string]: string } = {
      'Save Locations on My Map': 'wishlist.saveLocations',
      'Wheelchair Assistance': 'wishlist.wheelchairAssistance',
      'Book Shuttle Bus': 'wishlist.bookShuttle',
      'Hotel & Room Requests': 'wishlist.hotelRoomRequests',
      'Medical & Pharmacy': 'wishlist.medicalPharmacy',
    };
    return titleMap[action.title] || action.title;
  };
  const getDescriptionKey = () => {
    const descMap: { [key: string]: string } = {
      'map': 'wishlist.saveLocationsDesc',
      'wheelchair': 'wishlist.wheelchairAssistanceDesc',
      'bus': 'wishlist.bookShuttleDesc',
      'hotel': 'wishlist.hotelRoomRequestsDesc',
      'medical': 'wishlist.medicalPharmacyDesc',
    };
    return descMap[action.id] || '';
  };
  const titleKey = getTitleKey();
  const displayTitle = titleKey.startsWith('wishlist.') ? t(titleKey) : action.title;
  const descKey = getDescriptionKey();
  const displayDescription = descKey ? t(descKey) : action.description;
  
  return (
    <View style={styles.detailCard}>
      <View style={styles.detailHeader}>
        <Text style={styles.detailTitle} numberOfLines={2}>
          {displayTitle}
        </Text>
        <View style={styles.counterWrapper}>
          <TouchableOpacity style={styles.counterButton}>
            <Text style={styles.counterSymbol}>−</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>1</Text>
          <TouchableOpacity style={styles.counterButton}>
            <Text style={styles.counterSymbol}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.ratingRow}>
        <Ionicons name="star" size={16} color="#F2B705" />
        <Text style={styles.ratingText}>4.8  ( 12K {t('wishlist.reviews')} )</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{t('wishlist.selectDuration')}</Text>
        <LinearGradient
          colors={['#45455F', '#2C2431']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.datePill}
        >
          <Text style={styles.dateText}>1/8/2025 - 4/8/2025</Text>
        </LinearGradient>
      </View>

      <Text style={styles.detailBody}>
        {displayDescription}
      </Text>

      <Text style={styles.noteText}>
        <Text style={styles.noteLabel}>{t('wishlist.note')}</Text>
        {t('wishlist.noteBody')}
      </Text>

      <LinearGradient colors={HERO_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitButton}>
        <Text style={styles.submitLabel}>{t('wishlist.submitToAdmin')}</Text>
      </LinearGradient>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 18,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 18,
    height: 52,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#212529',
    fontFamily: 'OpenSans-Regular',
  },
  requestIconButton: {
    padding: 8,
    marginRight: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  quickActionsRow: {
    gap: 12,
    paddingVertical: 4,
  },
  quickActionTap: {
    width: 90,
    height: 90,
  },
  quickActionGradient: {
    flex: 1,
    borderRadius: 7.62,
    padding: 1,
    overflow: 'hidden',
  },
  quickActionOutline: {
    flex: 1,
    borderRadius: 7.62,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  quickActionInner: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
    position: 'relative',
  },
  quickActionImageWrap: {
    width: 46,
    height: 46,
    position: 'relative',
  },
  quickActionCircleBorder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    padding: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionImageInner: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  quickActionCircleBorderInactive: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: 10,
    fontFamily: 'OpenSans-Bold',
    color: '#212529',
    textAlign: 'center',
  },
  quickActionLabelActive: {
    color: '#1B131F',
  },
  halfCircle: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 15,
    height: 15,
    borderTopRightRadius: 7.62,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: 'rgba(184, 32, 115, 0.15)',
  },
  detailCard: {
    width: 343,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    color: '#1B131F',
    width: 117,
  },
  counterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 88,
    height: 40,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  counterButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  counterSymbol: {
    fontSize: 16,
    color: '#1B131F',
    fontWeight: '600',
  },
  counterValue: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#1B131F',
    minWidth: 16,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  ratingText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: '#212529',
  },
  section: {
    marginTop: 22,
    gap: 10,
  },
  sectionLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#1B131F',
  },
  datePill: {
    width: 163,
    height: 33,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#F4F4F4',
  },
  detailBody: {
    marginTop: 20,
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    lineHeight: 19,
    color: '#212529',
    marginBottom: 16,
  },
  readMore: {
    color: '#952562',
    fontFamily: 'OpenSans-Regular',
  },
  noteText: {
    marginTop: 18,
    fontFamily: 'OpenSans-Regular',
    fontSize: 11,
    color: '#212529',
  },
  noteLabel: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 11,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 4,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLabel: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  suggestionsSection: {
    marginTop: 8,
    gap: 12,
  },
  suggestionsTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#1B131F',
    marginBottom: 4,
  },
  suggestionsGrid: {
    gap: 10,
  },
});

type SuggestionProps = {
  title: string;
  body: string;
};

function SuggestionCard({ title, body }: SuggestionProps) {
  return (
    <View style={stylesSuggestion.card}>
      <Text style={stylesSuggestion.title}>{title}</Text>
      <Text style={stylesSuggestion.body}>{body}</Text>
    </View>
  );
}

const stylesSuggestion = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: '#1B131F',
    marginBottom: 6,
  },
  body: {
    fontSize: 13,
    fontFamily: 'OpenSans-Regular',
    color: '#4B5563',
    lineHeight: 20,
  },
});


