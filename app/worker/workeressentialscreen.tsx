import WorkerBottomTabs from '@/components/worker-bottom-tabs';
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

type FilterId = 'group' | 'safety' | 'protocols';

type ContentCard = {
  id: number;
  category: FilterId;
  titleKey: string;
  subtitleKey?: string;
  bodyKey: string;
  helpful?: number;
  tagKey?: string;
};

const CONTENT_CARDS: ContentCard[] = [
  {
    id: 1,
    category: 'group',
    titleKey: 'card1.title',
    subtitleKey: 'card1.subtitle',
    bodyKey: 'card1.body',
    helpful: 98,
    tagKey: 'dailyTask',
  },
  {
    id: 2,
    category: 'group',
    titleKey: 'card2.title',
    subtitleKey: 'card2.subtitle',
    bodyKey: 'card2.body',
    helpful: 87,
    tagKey: 'workflow',
  },
  {
    id: 3,
    category: 'group',
    titleKey: 'card3.title',
    subtitleKey: 'card3.subtitle',
    bodyKey: 'card3.body',
    helpful: 76,
    tagKey: 'transport',
  },
  {
    id: 4,
    category: 'safety',
    titleKey: 'card4.title',
    subtitleKey: 'card4.subtitle',
    bodyKey: 'card4.body',
    helpful: 92,
    tagKey: 'critical',
  },
  {
    id: 5,
    category: 'safety',
    titleKey: 'card5.title',
    subtitleKey: 'card5.subtitle',
    bodyKey: 'card5.body',
    helpful: 84,
    tagKey: 'safety',
  },
  {
    id: 6,
    category: 'safety',
    titleKey: 'card6.title',
    subtitleKey: 'card6.subtitle',
    bodyKey: 'card6.body',
    helpful: 71,
    tagKey: 'protocol',
  },
  {
    id: 7,
    category: 'protocols',
    titleKey: 'card7.title',
    subtitleKey: 'card7.subtitle',
    bodyKey: 'card7.body',
    helpful: 68,
    tagKey: 'meals',
  },
  {
    id: 8,
    category: 'protocols',
    titleKey: 'card8.title',
    subtitleKey: 'card8.subtitle',
    bodyKey: 'card8.body',
    helpful: 59,
    tagKey: 'communication',
  },
  {
    id: 9,
    category: 'protocols',
    titleKey: 'card9.title',
    subtitleKey: 'card9.subtitle',
    bodyKey: 'card9.body',
    helpful: 55,
    tagKey: 'reporting',
  },
];

export default function WorkerEssentialsScreen() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterId>('group');
  const [searchQuery, setSearchQuery] = useState('');

  const FILTER_TABS = [
    { id: 'group' as FilterId, label: t('workerEssentials.groupManagement') },
    { id: 'safety' as FilterId, label: t('workerEssentials.safetyHealth') },
    { id: 'protocols' as FilterId, label: t('workerEssentials.protocols') },
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
      const title = t(`workerEssentials.${card.titleKey}`);
      const subtitle = card.subtitleKey ? t(`workerEssentials.${card.subtitleKey}`) : '';
      const body = t(`workerEssentials.${card.bodyKey}`);
      const text = `${title} ${subtitle} ${body}`.toLowerCase();
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
        {/* Header */}
        <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name={isRTL ? "chevron-forward" : "chevron-back"} size={24} color="#1B131F" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>{t('workerEssentials.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

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
                      style={[styles.filterTabGradient, isRTL && { marginRight: 0, marginLeft: 8 }]}
                    >
                      <View style={styles.filterTabActiveInner}>
                        <Text style={[styles.filterTabActiveText, isRTL && { textAlign: 'right' }]}>{tab.label}</Text>
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.filterTabInactive, isRTL && { marginRight: 0, marginLeft: 8 }]}>
                      <Text style={[styles.filterTabInactiveText, isRTL && { textAlign: 'right' }]}>{tab.label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Search Bar */}
          <View style={[styles.searchBox, isRTL && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="search" size={18} color="#7A7A7A" style={isRTL ? { marginRight: 0, marginLeft: 8 } : { marginRight: 8 }} />
            <TextInput
              placeholder={t('workerEssentials.searchPlaceholder')}
              placeholderTextColor="#9A9A9A"
              style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Content Cards */}
          <View style={styles.cardsContainer}>
            {filteredCards.map((card) => (
              <View key={card.id} style={styles.contentCard}>
                <Text style={[styles.cardTitle, isRTL && { textAlign: 'right' }]}>{t(`workerEssentials.${card.titleKey}`)}</Text>
                {card.subtitleKey && <Text style={[styles.cardSubtitle, isRTL && { textAlign: 'right' }]}>{t(`workerEssentials.${card.subtitleKey}`)}</Text>}
                <Text style={[styles.cardBody, isRTL && { textAlign: 'right' }]}>{t(`workerEssentials.${card.bodyKey}`)}</Text>
                <View style={[styles.cardFooterRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  {card.tagKey && (
                    <View style={styles.tagPill}>
                      <Text style={[styles.tagPillText, isRTL && { textAlign: 'right' }]}>{t(`workerEssentials.${card.tagKey}`)}</Text>
                    </View>
                  )}
                  {card.helpful !== undefined && (
                    <View style={[styles.helpfulRow, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Ionicons name="thumbs-up" size={16} color="#F2B705" style={isRTL ? { marginLeft: 6, marginRight: 0 } : { marginRight: 6 }} />
                      <Text style={[styles.helpfulText, isRTL && { textAlign: 'right' }]}>{t('workerEssentials.helpful')} ({card.helpful})</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <WorkerBottomTabs active="home" />
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
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  helpfulRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpfulText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    color: '#45455F',
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#F5E1EB',
  },
  tagPillText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 12,
    color: '#B82073',
  },
});


