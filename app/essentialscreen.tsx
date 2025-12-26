import BottomTabs from '@/components/bottom-tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  OpenSans_400Regular,
  OpenSans_600SemiBold,
  OpenSans_700Bold,
} from '@expo-google-fonts/open-sans';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterId = 'hajj' | 'guides' | 'duas';

type ContentCard = {
  id: number;
  category: FilterId;
  title: string;
  subtitle?: string;
  body: string;
  helpful?: number;
  tag?: string;
};

const CONTENT_CARDS: ContentCard[] = [
  {
    id: 1,
    category: 'hajj',
    title: 'Ihram Checklist',
    subtitle: 'Before crossing the Miqāt',
    body:
      '• Make intention for Hajj or ʿUmrah from your home or at the miqāt.\n' +
      '• Take a full ghusl, trim nails and remove unwanted hair.\n' +
      '• Wear two plain white cloths (for men) or modest loose clothing for women.\n' +
      '• Avoid perfume after making intention.\n' +
      '• Begin reciting the Talbiyah with a present heart.',
    helpful: 132,
    tag: 'Step 1',
  },
  {
    id: 2,
    category: 'hajj',
    title: 'Daily Prayer & Masjid Etiquette',
    subtitle: 'Inside Masjid al-Ḥarām & the Ḥaram area',
    body:
      '• Arrive early for prayers; keep your prayer mat and small water bottle with you.\n' +
      '• Keep walkways and doors clear and avoid blocking stairs.\n' +
      '• Place your shoes in a bag and keep them with you to avoid losing them.\n' +
      '• Maintain calm, avoid loud conversations and unnecessary phone use in the masjid.',
    helpful: 87,
    tag: 'Etiquette',
  },
  {
    id: 3,
    category: 'hajj',
    title: 'Health & Safety Essentials',
    subtitle: 'Stay strong during long days of Hajj',
    body:
      '• Drink water frequently (especially Zamzam); avoid too much sugar and caffeine.\n' +
      '• Wear comfortable walking shoes or sandals and break them in before travel.\n' +
      '• Use sun protection: umbrella, sunglasses, and light-coloured clothing.\n' +
      '• Keep a basic kit: pain relief, plasters, ORS, any regular medication, and copies of prescriptions.',
    helpful: 64,
    tag: 'Wellbeing',
  },
  {
    id: 4,
    category: 'hajj',
    title: 'What to Pack in Your Day Bag',
    subtitle: 'For Masjid visits & Manāsik days',
    body:
      '• Small prayer mat, pocket Qur’an or app, and dhikr counter.\n' +
      '• Foldable water bottle, dates or light snacks, wet wipes and tissues.\n' +
      '• Power bank and short charging cable.\n' +
      '• Copy of passport, Hajj/Umrah permit, hotel card and emergency contact numbers.',
    helpful: 49,
    tag: 'Packing',
  },
  {
    id: 5,
    category: 'guides',
    title: 'Understanding Your Hajj Package',
    subtitle: 'Know what is included before you travel',
    body:
      '• Confirm hotel names, check-in/out dates, and distance from the Ḥaram.\n' +
      '• Ask which services your mutawwif provides in Minā, ʿArafāt, and Muzdalifah.\n' +
      '• Save hotline numbers (Saudi emergency 911, your group leader, transport coordinator).\n' +
      '• Keep digital and printed copies of all bookings and permits.',
    helpful: 41,
    tag: 'Preparation',
  },
  {
    id: 6,
    category: 'guides',
    title: 'Using Your Digital ID & Wristband',
    subtitle: 'Stay identifiable and safe',
    body:
      '• Always wear your official wristband and keep your digital ID accessible in the app.\n' +
      '• Check that your name, nationality and group number are correct.\n' +
      '• If separated from your group, show your ID to security or volunteers; they will guide you back.\n' +
      '• Never give your passport or ID to unknown people—only authorised staff or your group leader.',
    helpful: 58,
    tag: 'Safety',
  },
  {
    id: 7,
    category: 'guides',
    title: 'Moving Between Sites',
    subtitle: 'Makkah • Minā • ʿArafāt • Muzdalifah',
    body:
      '• Confirm bus pickup points and departure times with your group leader the night before.\n' +
      '• Keep your small day bag ready with water, snacks and prayer essentials.\n' +
      '• Stay close to your group flag or sign; avoid walking alone in heavy crowds.\n' +
      '• If you miss the group, move to the nearest information desk and call your leader.',
  },
  {
    id: 8,
    category: 'duas',
    title: 'Dua Before Leaving Home',
    subtitle: 'When starting your journey',
    body:
      '“Bismi llāhi, tawakkaltu ʿalā llāh, lā ḥawla wa-lā quwwata illā bi llāh.”\n\n' +
      'Meaning: In the Name of Allah, I place my trust in Allah; there is no power and no might except with Allah.\n' +
      'Recite this as you step out of your room or house and trust that Allah will protect your journey.',
    helpful: 77,
    tag: 'Travel',
  },
  {
    id: 9,
    category: 'duas',
    title: 'Talbiyah (Labbaik)',
    subtitle: 'From entering Ihram until the start of Ṭawāf al-Ifāḍah',
    body:
      '“Labbayka llāhumma labbayk, labbayka lā sharīka laka labbayk, inna l-ḥamda wa-n-niʿmata\n' +
      'laka wa-l-mulk, lā sharīka lak.”\n\n' +
      'Meaning: Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Surely all praise,\n' +
      'grace and dominion belong to You. You have no partner.',
    helpful: 120,
    tag: 'Obligatory',
  },
  {
    id: 10,
    category: 'duas',
    title: 'Dua at ʿArafāt',
    subtitle: 'Most virtuous supplication on the Day of ʿArafah',
    body:
      '“Lā ilāha illā llāhu waḥdahu lā sharīka lah, lahu l-mulku wa lahu l-ḥamdu\n' +
      'wa huwa ʿalā kulli shay’in qadīr.”\n\n' +
      'Meaning: There is no deity worthy of worship except Allah, alone without partner. To Him belongs\n' +
      'the dominion and to Him belongs all praise, and He is over all things capable.',
    tag: 'Arafah',
  },
  {
    id: 11,
    category: 'duas',
    title: 'After Stoning the Jamarāt',
    subtitle: 'Between the pillars',
    body:
      'After stoning the first and second Jamarah, stand facing the Qiblah, raise your hands and make\n' +
      'personal duʿā for yourself, your family, and the Ummah. Ask for forgiveness, steadfastness and\n' +
      'acceptance of your Hajj. Speak to Allah from your heart.',
  },
];

export default function EssentialsScreen() {
  const { t, isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterId>('hajj');
  const [searchQuery, setSearchQuery] = useState('');

  const FILTER_TABS = [
    { id: 'hajj' as const, labelKey: 'essentials.hajjRites' },
    { id: 'guides' as const, labelKey: 'essentials.travelServices' },
    { id: 'duas' as const, labelKey: 'essentials.duas' },
  ];

  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': OpenSans_400Regular,
    'OpenSans-SemiBold': OpenSans_600SemiBold,
    'OpenSans-Bold': OpenSans_700Bold,
  });

  const filteredCards = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    return CONTENT_CARDS.filter((card) => {
      if (card.category !== activeFilter) return false;
      if (!normalized) return true;
      // Get translated content for search
      const getContentKey = (type: 'title' | 'subtitle' | 'body') => {
        const keyMap: { [key: number]: { [key: string]: string } } = {
          1: { title: 'essentials.ihramChecklist', subtitle: 'essentials.ihramChecklistSubtitle', body: 'essentials.ihramChecklistBody' },
          2: { title: 'essentials.dailyPrayer', subtitle: 'essentials.dailyPrayerSubtitle', body: 'essentials.dailyPrayerBody' },
          3: { title: 'essentials.healthSafety', subtitle: 'essentials.healthSafetySubtitle', body: 'essentials.healthSafetyBody' },
          4: { title: 'essentials.whatToPack', subtitle: 'essentials.whatToPackSubtitle', body: 'essentials.whatToPackBody' },
          5: { title: 'essentials.understandingPackage', subtitle: 'essentials.understandingPackageSubtitle', body: 'essentials.understandingPackageBody' },
          6: { title: 'essentials.usingDigitalID', subtitle: 'essentials.usingDigitalIDSubtitle', body: 'essentials.usingDigitalIDBody' },
          7: { title: 'essentials.movingBetweenSites', subtitle: 'essentials.movingBetweenSitesSubtitle', body: 'essentials.movingBetweenSitesBody' },
          8: { title: 'essentials.duaBeforeLeaving', subtitle: 'essentials.duaBeforeLeavingSubtitle', body: 'essentials.duaBeforeLeavingBody' },
          9: { title: 'essentials.talbiyah', subtitle: 'essentials.talbiyahSubtitle', body: 'essentials.talbiyahBody' },
          10: { title: 'essentials.duaAtArafat', subtitle: 'essentials.duaAtArafatSubtitle', body: 'essentials.duaAtArafatBody' },
          11: { title: 'essentials.afterStoning', subtitle: 'essentials.afterStoningSubtitle', body: 'essentials.afterStoningBody' },
        };
        return keyMap[card.id]?.[type] || '';
      };
      const titleKey = getContentKey('title');
      const subtitleKey = getContentKey('subtitle');
      const bodyKey = getContentKey('body');
      const searchTitle = titleKey ? t(titleKey) : card.title;
      const searchSubtitle = subtitleKey ? t(subtitleKey) : (card.subtitle || '');
      const searchBody = bodyKey ? t(bodyKey) : card.body;
      const text = `${searchTitle} ${searchSubtitle} ${searchBody}`.toLowerCase();
      return text.includes(normalized);
    });
  }, [activeFilter, searchQuery, t]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.filterTabsRow, isRTL && { flexDirection: 'row-reverse' }]}
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveFilter(tab.id)}
                  activeOpacity={0.8}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={['#B82073', '#1B131F']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.filterTabGradient}
                    >
                      <View style={styles.filterTabActiveInner}>
                        <Text style={styles.filterTabActiveText}>{t(tab.labelKey)}</Text>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={styles.filterTabInactive}>
                      <Text style={styles.filterTabInactiveText}>{t(tab.labelKey)}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Search Bar */}
          <View style={[styles.searchBox, isRTL && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="search" size={18} color="#7A7A7A" />
            <TextInput
              placeholder={t('essentials.searchPlaceholder')}
              placeholderTextColor="#9A9A9A"
              style={[styles.searchInput, isRTL && { textAlign: 'right' }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Content Cards */}
          <View style={styles.cardsContainer}>
            {filteredCards.map((card) => {
              const getContentKey = (type: 'title' | 'subtitle' | 'body' | 'tag') => {
                const keyMap: { [key: number]: { [key: string]: string } } = {
                  1: { title: 'essentials.ihramChecklist', subtitle: 'essentials.ihramChecklistSubtitle', body: 'essentials.ihramChecklistBody', tag: 'essentials.step1' },
                  2: { title: 'essentials.dailyPrayer', subtitle: 'essentials.dailyPrayerSubtitle', body: 'essentials.dailyPrayerBody', tag: 'essentials.etiquette' },
                  3: { title: 'essentials.healthSafety', subtitle: 'essentials.healthSafetySubtitle', body: 'essentials.healthSafetyBody', tag: 'essentials.wellbeing' },
                  4: { title: 'essentials.whatToPack', subtitle: 'essentials.whatToPackSubtitle', body: 'essentials.whatToPackBody', tag: 'essentials.packing' },
                  5: { title: 'essentials.understandingPackage', subtitle: 'essentials.understandingPackageSubtitle', body: 'essentials.understandingPackageBody', tag: 'essentials.preparation' },
                  6: { title: 'essentials.usingDigitalID', subtitle: 'essentials.usingDigitalIDSubtitle', body: 'essentials.usingDigitalIDBody', tag: 'essentials.safety' },
                  7: { title: 'essentials.movingBetweenSites', subtitle: 'essentials.movingBetweenSitesSubtitle', body: 'essentials.movingBetweenSitesBody', tag: '' },
                  8: { title: 'essentials.duaBeforeLeaving', subtitle: 'essentials.duaBeforeLeavingSubtitle', body: 'essentials.duaBeforeLeavingBody', tag: 'essentials.travel' },
                  9: { title: 'essentials.talbiyah', subtitle: 'essentials.talbiyahSubtitle', body: 'essentials.talbiyahBody', tag: 'essentials.obligatory' },
                  10: { title: 'essentials.duaAtArafat', subtitle: 'essentials.duaAtArafatSubtitle', body: 'essentials.duaAtArafatBody', tag: 'essentials.arafah' },
                  11: { title: 'essentials.afterStoning', subtitle: 'essentials.afterStoningSubtitle', body: 'essentials.afterStoningBody', tag: '' },
                };
                return keyMap[card.id]?.[type] || '';
              };
              
              const titleKey = getContentKey('title');
              const subtitleKey = getContentKey('subtitle');
              const bodyKey = getContentKey('body');
              const tagKey = getContentKey('tag');
              
              const displayTitle = titleKey ? t(titleKey) : card.title;
              const displaySubtitle = subtitleKey ? t(subtitleKey) : card.subtitle;
              const displayBody = bodyKey ? t(bodyKey) : card.body;
              const displayTag = tagKey ? t(tagKey) : card.tag;
              
              return (
                <View key={card.id} style={styles.contentCard}>
                  <Text style={styles.cardTitle}>{displayTitle}</Text>
                  {displaySubtitle && <Text style={styles.cardSubtitle}>{displaySubtitle}</Text>}
                  <Text style={styles.cardBody}>{displayBody}</Text>
                  {displayTag && (
                    <View style={styles.tagPill}>
                      <Text style={styles.tagPillText}>{displayTag}</Text>
                    </View>
                  )}
              </View>
              );
            })}
          </View>
        </ScrollView>

        <BottomTabs active="essentials" />
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  filterTabsRow: {
    gap: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  filterTabGradient: {
    borderRadius: 1000,
    padding: 1.5,
    marginRight: 8,
  },
  filterTabActiveInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 1000,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  filterTabActiveText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    color: '#952562',
  },
  filterTabInactive: {
    backgroundColor: '#E8E8E8',
    borderRadius: 1000,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  filterTabInactiveText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#45455F',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 18,
    height: 52,
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 15,
    color: '#212529',
    fontFamily: 'OpenSans-Regular',
  },
  cardsContainer: {
    gap: 12,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    color: '#1B131F',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  cardBody: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#45455F',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#F5E1EB',
    alignSelf: 'flex-start',
  },
  tagPillText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: '#B82073',
  },
});


